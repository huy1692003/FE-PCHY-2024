import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Panel } from "primereact/panel";
import { Dialog } from "primereact/dialog";
import { FormField } from "../ListFieldYCTN/FieldAddYCTN";
import { Button } from "primereact/button";
import InputFile from "../InputFile";
import { MultiSelect } from "primereact/multiselect";
import { QL_TN_CHI_TIET_THI_NGHIEM } from "../../../models/QLTN_CHI_TIET_THI_NGHIEM";
import { DM_LOAI_BIENBAN_Service } from "../../../services/quanlythinghiem/DM_LOAI_BIENBAN_Service";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { HT_NGUOIDUNG_Service } from "../../../services/quantrihethong/HT_NGUOIDUNGService";
import { Dropdown } from "primereact/dropdown";
import { Notification } from "../../notification";
import QLTN_CHI_TIET_THI_NGHIEM_Service from "../../../services/quanlythinghiem/QLTN_CHI_TIET_THI_NGHIEM_Service";
import UploadFileService from "../../../services/UploadFileService";
import QLTN_NGUOI_KY_Service from "../../../services/quanlythinghiem/QLTN_NGUOI_KY_Service";
import { Toast } from "primereact/toast";
import { th } from "date-fns/locale";
const initNguoiKy = [
    {
        cap: 1,
        ten_cap: "Ký nháy",
        nguoi_ky: []
    },
    {
        cap: 2,
        ten_cap: "Trưởng phòng kỹ thuật ký",
        nguoi_ky: null
    },
    {
        cap: 3,
        ten_cap: "Giám đốc ký",
        nguoi_ky: null
    }
]
const CreateThiNghiemTB = ({ thongtinYCTN, stateDialog, thongtinThietBi, donVi, refeshData, toastCurrent }) => {

    // Chi tiết thí nghiệm
    const [formData, setFormData] = useState(
        {
            ...QL_TN_CHI_TIET_THI_NGHIEM,
            ma_yctn: thongtinYCTN.ma_yctn,
            ma_tbtn: thongtinThietBi.ma_tbtn,
            nguoi_tao: JSON.parse(sessionStorage.getItem("user")).ten_dang_nhap,
            lanthu: thongtinThietBi.listTN.length ? thongtinThietBi.listTN.length + 1 : 1
        })
    const [loaiBienBan, setLoaiBienBan] = useState([])
    const [users, setUsers] = useState([])
    const toast = useRef(null)
    const [dsNguoiKy, setDsNguoiKy] = useState(initNguoiKy)

    const soluong_conlai = useMemo(() => {
        return thongtinThietBi.so_luong - thongtinThietBi.listTN.reduce((sum, item) => sum + item.so_luong, 0);
    }, [thongtinThietBi]);

    useEffect(() => {
        getDM();
    }, []);

    useEffect(() => {
        if (stateDialog.visible) {
            setFormData({
                ...QL_TN_CHI_TIET_THI_NGHIEM,
                ma_yctn: thongtinYCTN.ma_yctn,
                ma_tbtn: thongtinThietBi.ma_tbtn,
                nguoi_tao: JSON.parse(sessionStorage.getItem("user")).ten_dang_nhap,
                lanthu: thongtinThietBi.listTN.length ? thongtinThietBi.listTN.length + 1 : 1
            })
            setDsNguoiKy([
                {
                    cap: 1,
                    ten_cap: "Ký nháy",
                    nguoi_ky: []
                },
                {
                    cap: 2,
                    ten_cap: "Trưởng phòng kỹ thuật ký",
                    nguoi_ky: null
                },
                {
                    cap: 3,
                    ten_cap: "Giám đốc ký",
                    nguoi_ky: null
                }
            ])
        }
    }, [stateDialog.visible])

    const getDM = async () => {
        const res = await DM_LOAI_BIENBAN_Service.getAllDM_LOAI_BIENBAN();
        setLoaiBienBan(res);
        const res2 = await HT_NGUOIDUNG_Service.getAll();
        setUsers(res2.data);
    }

    const handleAddKyNhay = () => {
        setDsNguoiKy(prev => {
            const newData = [...prev];
            newData[0].nguoi_ky.push(null);
            return newData;
        });
    }

    const handleDeleteKyNhay = (index) => {
        setDsNguoiKy(prev => {
            const newData = [...prev];
            newData[0].nguoi_ky = newData[0].nguoi_ky.filter((_, i) => i !== index);
            return newData;
        });
    }

    const handleChangeNguoiKy = (capKy, index, value) => {
        setDsNguoiKy(prev => {
            const newData = [...prev];
            const nguoiKyIndex = newData.findIndex(item => item.cap === capKy);

            if (capKy === 1) {
                // Cập nhật người ký nháy (mảng)
                newData[nguoiKyIndex].nguoi_ky[index] = value;
            } else {
                // Cập nhật người ký cấp 2,3 (single value)
                newData[nguoiKyIndex].nguoi_ky = value;
            }
            return newData;
        });
    }

    function showToast(severity, summary, detail) {
        toast.current.show({
            severity,
            summary,
            detail,
            life: 5000, // Thời gian hiển thị (ms)
        });
    }

    function validateInforCTTN() {
        if (!formData.ma_loai_bb || !formData.ngay_tt_tn || !formData.file_upload || !formData.so_luong) {


            showToast(
                "error",
                "Chưa nhập đầy đủ thông tin",
                "Cần chọn đầy đủ các trường dữ liệu như số lượng, ngày thí nghiệm, file biên bản, loại biên bản"
            );
            return false;
        }
        if (formData.so_luong > soluong_conlai) {
            showToast("error", "Số lượng thí nghiệm không hợp lệ", `Số lượng thí nghiệm không được vượt quá (${soluong_conlai})`)
            return false;
        }
        return true;
    }

    function validateDSNGUOIKY() {
        let listNguoiKy = mapNguoiKy(dsNguoiKy, "1"); // Khởi tạo danh sách người ký
        let kinhays = listNguoiKy.filter(s => s.nhom_nguoi_ky === 1);
        let kythuat = listNguoiKy.filter(s => s.nhom_nguoi_ky === 2);
        let giamdoc = listNguoiKy.filter(s => s.nhom_nguoi_ky === 3);

        if (kinhays.length < 1 || kythuat.length < 1 || giamdoc.length < 1) {
            showToast(
                "error",
                "Chưa chọn đủ người ký",
                "Cần chọn ít nhất 1 người ký nháy, 1 trưởng phòng kỹ thuật và 1 giám đốc ký"
            );
            return false;
        }

        return true;
    }
    // Lưu chi tiết thí nghiệm nên database
    const handleSaveCT_TN = async () => {
        try {

            if (validateInforCTTN() && validateDSNGUOIKY()) {

                if (formData.file_upload && formData.file_upload.constructor.name === "FormData") {
                    let resUpload = await UploadFileService.file(formData.file_upload, "fileBBTN")
                    formData.file_upload = resUpload.filePath
                }
                let created = await QLTN_CHI_TIET_THI_NGHIEM_Service.insert_QLTN_CHI_TIET_THI_NGHIEM({ ...formData, ma_loai_bb: formData.ma_loai_bb + "" })

                if (created) {
                    let nguoi_ky = mapNguoiKy(dsNguoiKy, created.ma_chi_tiet_tn)
                    await Promise.all(nguoi_ky.map(s => QLTN_NGUOI_KY_Service.insert_NGUOI_KY_SO(s)))
                }

                Notification.success(toastCurrent, "Thực hiện thí nghiệm thành công");
                refeshData()
            }
            else {
                return
            }


        } catch (error) {
            console.log(error);
        }
    }


    // Tạo mảng người ký gồm id và cấp
    function mapNguoiKy(dsNguoiKy, ma_chi_tiet_tn) {
        return dsNguoiKy.flatMap(item => {
            const dsResult = Array.isArray(item.nguoi_ky) ? item.nguoi_ky : [item.nguoi_ky];
            return dsResult.map(id => ({ id_nguoi_ky: id, nhom_nguoi_ky: item.cap, ma_chi_tiet_tn, trang_thai_ky: 0 }));
        });
    }



    const renderFooter = () => {
        return (
            <div className="flex justify-content-end gap-2">
                <Button label="Đóng" icon="pi pi-times" severity="danger" onClick={() => stateDialog.setVisible(false)} />
                <Button label="Thí nghiệm và Tạo luồng ký số" icon="pi pi-check" onClick={() => handleSaveCT_TN()} />
            </div>
        );
    };
    return (
        <>
            <Toast ref={toast} />
            <Dialog
                header="Thực hiện thí nghiệm thiết bị"
                visible={stateDialog.visible}
                onHide={() => stateDialog.setVisible(false)}
                style={{ width: '90vw' }}
                footer={renderFooter()}
                maximizable
            >
                <div className="flex flex-column gap-4">
                    <Panel header="Thông tin của thiết bị thí nghiệm">
                        <div className="grid">
                            <div className="col-6">
                                <FormField
                                    label="Mã TBTN (STT sẽ được hệ thống quy định)"
                                    id="ma_thiet_bi"
                                    isDisabled={true}
                                    value={thongtinThietBi.ma_tbtn}
                                />
                            </div>
                            <div className="col-6">
                                <FormField
                                    label="Tên thiết bị thí nghiệm"
                                    id="ten_thiet_bi"
                                    isDisabled={true}
                                    value={thongtinThietBi.ten_thiet_bi}
                                />
                            </div>
                            <div className="col-6">
                                <FormField
                                    label="Loại thiết bị"
                                    id="loai_thiet_bi"
                                    isDisabled={true}
                                    value={thongtinThietBi.ten_loai_tb}
                                />
                            </div>
                            <div className="col-6">
                                <FormField
                                    label="Số lượng"
                                    id="so_luong"
                                    isDisabled={true}
                                    value={thongtinThietBi.so_luong}
                                />
                            </div>
                            {thongtinYCTN && thongtinYCTN.id_khach_hang && <div className="col-6">
                                <FormField
                                    label="Khách hàng"
                                    id="id_khach_hang"
                                    isDisabled={true}
                                    value={thongtinYCTN.id_khach_hang}
                                />
                            </div>}
                            <div className="col-6">
                                <FormField
                                    label="Mã yêu cầu thí nghiệm"
                                    id="ma_yctn"
                                    isDisabled={true}
                                    value={thongtinYCTN.ma_yctn}
                                />
                            </div>
                            <div className="col-6">
                                <FormField
                                    label="Tên yêu cầu thí nghiệm"
                                    id="ten_yctn"
                                    isDisabled={true}
                                    value={thongtinYCTN.ten_yctn}
                                />
                            </div>
                            <div className="w-full">
                                <label className='font-medium text-sm my-3 block'>Đơn vị thực hiện</label>
                                <MultiSelect
                                    value={thongtinYCTN?.don_vi_thuc_hien || []}
                                    options={donVi}
                                    readOnly={true}
                                    optionLabel="ten"
                                    optionValue="id"
                                    placeholder="Chọn đơn vị thực hiện"
                                    filter
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </Panel>

                    <Panel header="Thông tin thí nghiệm ">
                        <div className="grid">
                            <div className="col-6">
                                <FormField
                                    label={<span>Số lượng thí nghiệm <span className="text-red-600">(Còn lại {soluong_conlai}) </span></span>}
                                    id="so_luong"
                                    value={formData.so_luong}
                                    onChange={(id, e) => setFormData(prev => ({ ...prev, [id]: e }))}
                                    isNumber
                                    childrenIPNumber={""}
                                />
                            </div>
                            <div className="col-6">
                                <FormField
                                    label="Ngày thực tế thí nghiệm"
                                    id="ngay_tt_tn"
                                    value={formData.ngay_tt_tn}
                                    onChange={(id, value) => setFormData(prev => ({ ...prev, [id]: value }))}
                                    isCalendar={true}
                                />
                            </div>
                            <div className="col-6">
                                <FormField
                                    label="Loại biên bản"
                                    id="ma_loai_bb"
                                    value={formData.ma_loai_bb}
                                    optionsValue={"id"}
                                    optionsLabel={"ten_loai_bb"}
                                    options={loaiBienBan}
                                    isDropdown={true}
                                    onChange={(id, value) => setFormData(prev => ({ ...prev, [id]: value }))}
                                />
                            </div>
                            <div className="col-6">
                                <label className='font-bold text-sm my-3 block' htmlFor="file_upload">
                                    <span className="flex justify-content-between">
                                        <span>Upload biên bản</span>
                                    </span>
                                </label>
                                <InputFile nameField="file_upload" setFormData={setFormData} showPreview={true} />
                            </div>
                        </div>
                        <small className="text-gray-600 mt-4 text-lg block">
                            Tải xuống File mẫu từ hệ thống để thuận tiện hơn cho việc Import.<br />
                            <span className="text-red-400 text-base">Chú ý:</span><br />
                            <span className="text-red-400 text-base">1. Cần đảm bảo các nguyên tắc định dạng dữ liệu theo ghi chú trong file mẫu này để hệ thống đọc được cả định dạng của dữ liệu trong file upload một cách chính xác.</span><br />
                            <span className="text-red-400 text-base">2. Trường hợp không tuân thủ các nguyên tắc định dạng file có thể dẫn đến việc Biên bản xuất ra từ hệ thống sẽ bị sai format so với file upload.</span>
                        </small>
                    </Panel>

                    <Panel className="mt-4" header="Thông tin ký số">
                        <div className="flex flex-column gap-4">
                            {/* Ký nháy */}
                            <div>
                                <div className="flex justify-content-between align-items-center">
                                    <span className="font-semibold text-sm">{dsNguoiKy[0].ten_cap} <span className="font-bold text-red-500">*</span></span>
                                    <Button label="+ Thêm mới người kí nháy" className="p-button-sm p-button-info" onClick={handleAddKyNhay} />
                                </div>
                                <DataTable showGridlines className="mt-4" value={dsNguoiKy[0].nguoi_ky}>
                                    <Column header="STT" body={(_, { rowIndex }) => rowIndex + 1} style={{ width: '70px' }} />
                                    <Column
                                        header="Người ký"
                                        headerStyle={{ display: "flex", justifyContent: "center" }}
                                        body={(rowData, { rowIndex }) => (
                                            <Dropdown
                                                virtualScroll
                                                itemSize={38}
                                                placeholder="-- Mời chọn --"
                                                filter
                                                value={rowData}
                                                options={users}
                                                optionLabel={(option) => `${option.hO_TEN} - [ ${option.teN_DANG_NHAP} ]`}
                                                optionValue="id"
                                                onChange={(e) => handleChangeNguoiKy(1, rowIndex, e.value)}
                                                className="w-full"
                                            />
                                        )}
                                    />
                                    <Column
                                        header="Thao tác"
                                        body={(_, { rowIndex }) => (
                                            <Button
                                                icon="pi pi-trash"
                                                className="p-button-text p-button-danger"
                                                onClick={() => handleDeleteKyNhay(rowIndex)}
                                                tooltip="Xóa"
                                            />
                                        )}
                                        style={{ width: '100px' }}
                                    />
                                </DataTable>
                            </div>

                            {/* Ký kỹ thuật và giám đốc */}
                            <div className="flex flex-wrap justify-content-between mt-4 w-full gap-4">
                                {dsNguoiKy.slice(1).map((nguoiKy) => (
                                    <div
                                        key={nguoiKy.cap}
                                        className="flex-auto md:w-5 w-full" // md:w-6 (50% trên màn hình lớn), w-full (100% trên màn hình nhỏ)
                                    >
                                        <label
                                            className="mb-2 block font-semibold text-sm"
                                            htmlFor=""
                                        >
                                            {nguoiKy.ten_cap} <span className="text-red-500">*</span>
                                        </label>
                                        <Dropdown
                                            placeholder="-- Mời chọn --"
                                            filter
                                            virtualScroll
                                            itemSize={38}
                                            value={nguoiKy.nguoi_ky}
                                            options={users}
                                            optionLabel={(option) =>
                                                `${option.hO_TEN} - [ ${option.teN_DANG_NHAP} ]`
                                            }
                                            optionValue="id"
                                            itemTemplate={(option) => (
                                                <div title={option.hO_TEN + ' - ' + option.teN_DANG_NHAP}>
                                                    {`${option.hO_TEN} - [ ${option.teN_DANG_NHAP} ]`}
                                                </div>
                                            )}
                                            className="w-full"
                                            onChange={(e) =>
                                                handleChangeNguoiKy(nguoiKy.cap, null, e.value)
                                            }
                                        />
                                    </div>
                                ))}
                            </div>

                        </div>
                    </Panel>
                </div>
            </Dialog>
        </>
    );
}

export default memo(CreateThiNghiemTB);