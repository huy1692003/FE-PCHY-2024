import { memo, useEffect, useRef, useState, useLayoutEffect, useContext } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { DM_TRUONG_YCTN_Service } from "../../../services/quanlythinghiem/DM_TRUONG_YCTN_Service";
import DM_LOAI_YCTNService from "../../../services/quanlythinghiem/DM_LOAI_YCTNService";
import { Dropdown } from "primereact/dropdown";
import InputFile from "../InputFile";
import { Button } from "primereact/button";
import QLTN_YCTN from "../../../models/QLTN_YCTN";
import UploadFileService from "../../../services/UploadFileService";
import QLTN_YCTNService from "../../../services/quanlythinghiem/QLTN_YCTNService";
import { Notification } from "../../notification";
import { useRouter } from "next/router";
import { DM_LOAI_TAISANService } from "../../../services/quanlythinghiem/DM_LOAI_TAISANService";
import { DM_KHACHHANG_Service } from "../../../services/quanlythinghiem/DM_KHACHHANG_Service";
import moment from "moment";
import { set } from "date-fns";
import { MyContext } from "../../../context/dataContext";
import { urlServer } from "../../../constants/api";
import { Tooltip } from "primereact/tooltip";


export const FormField = ({ label, className, style, placeholder, value, onChange, id, isCalendar = false, isNumber = false, row = 5, isFileUpload = false, isDropdown = false, isTextArea = false, options = [], prefix, isDisabled = false, styleField, props, mode, currency, locale, childrenIPNumber = "VNĐ", optionsValue, optionsLabel }) => (
    <div className={className} style={style}>
        <label className='font-medium text-sm my-3 block' htmlFor={id}>{label}</label>
        {isCalendar ? (
            <Calendar id={id} name={id} value={value} onChange={(e) => onChange(id, e.value)} showIcon className="w-full" disabled={isDisabled} />
        ) : isNumber ? (
            <div className="p-inputgroup">
                <InputNumber id={id} name={id} value={value} onChange={(e) => onChange(id, e.value)} className="w-full" readOnly={isDisabled} />
                {childrenIPNumber && <span className="p-inputgroup-addon" style={{ backgroundColor: "#6366F1", color: "white" }}>{childrenIPNumber}</span>}
            </div>
        ) : isDropdown ? (
            <Dropdown  {...props} id={id} name={id} value={value} options={options} showClear onChange={(e) => onChange(id, e.value)} className="w-full" disabled={isDisabled} filter optionValue={optionsValue} optionLabel={optionsLabel} placeholder="-- Mời chọn --" />
        ) : isTextArea ? (
            <InputTextarea id={id} name={id} value={value} onChange={(e) => onChange(id, e.target.value)} rows={row} className="w-full" readOnly={isDisabled} autoResize />
        ) : (
            <InputText style={styleField} id={id} name={id} value={value} onChange={(e) => onChange(id, e.target.value)} className="w-full" readOnly={isDisabled} />
        )}
    </div>
);

const FieldAddYCTN = ({ loai_yctn, isAdd = true, toast, formDataInit = QLTN_YCTN, isUpdateHD = false, refeshData }) => {


    const [formData, setFormData] = useState(formDataInit);
    const [fieldbyLoaiYCTN, setFieldbyLoaiYCTN] = useState([]);
    const [fields, setFields] = useState([]);
    const [fieldCurrent, setFieldCurrent] = useState([]);
    const [dm_LTS, setDM_LTS] = useState([]);
    const [dm_KH, setDM_KH] = useState([]);
    const router = useRouter();
    const user = JSON.parse(sessionStorage.getItem("user"))?.ten_dang_nhap || "";
    const [fieldsNull, setFieldsNull] = useState([]);
    const [yctn_LOG, setYCTN_LOG] = useState()
    const { data } = useContext(MyContext)
    // Lấy danh sách trường dữ liệu và các trường tương ứng với loai_yctn  
    useEffect(() => {

        getAllFields();
        setFormData(
            {
                ...formDataInit

                , ma_yctn: isUpdateHD || isAdd === false ? formDataInit.ma_yctn : loai_yctn?.key_word,
                ma_loai_yctn: loai_yctn?.ma_loai_yctn
            });
        getFieldByLoaiYCTN();
        getAllDM_LTS();
        getAllDM_KH();

    }, [loai_yctn, formDataInit]);

    useEffect(() => {
        setFormData(
            {
                ...formDataInit

                , ma_yctn: isUpdateHD || isAdd === false ? formDataInit.ma_yctn : loai_yctn?.key_word,
                ma_loai_yctn: loai_yctn?.ma_loai_yctn
            });
        setYCTN_LOG({ ...formDataInit, yctn_LOG: null })
    }, [formDataInit])



    useEffect(() => {
        let res = findMatchingFields(fields, fieldbyLoaiYCTN);
        setFieldCurrent(res);
    }, [fieldbyLoaiYCTN, fields]);

    const getAllFields = async () => {
        let res = await DM_TRUONG_YCTN_Service.getAll_DM_TRUONG_YCTN();
        setFields(res);
    }

    const getAllDM_LTS = async () => {
        try {
            let res = await DM_LOAI_TAISANService.get_DM_LOAI_TAISAN();
            setDM_LTS(res?.data);
        } catch (err) {
            setDM_LTS([]);
        }
    };

    const getAllDM_KH = async () => {
        try {
            let res = await DM_KHACHHANG_Service.get_ALL_DM_KHACHHANG();
            setDM_KH(res);
        } catch (err) {
            setDM_KH([]);
        }
    };

    const getFieldByLoaiYCTN = async () => {
        let res = await DM_LOAI_YCTNService.get_PHAN_MIEN_YCTN_BY_LOAI_YCTN(loai_yctn.id)
        setFieldbyLoaiYCTN(res);
    }

    const handleInputChange = (fieldName, value) => {
        setFormData((prev) => {
            const newData = {
                ...prev,
                [fieldName]: value,
            };

            // Tính toán các giá trị phụ thuộc
            if (fieldName === "gtdt_truoc_thue" || fieldName === "gtdt_chiet_giam") {
                if (newData.gtdt_truoc_thue && newData.gtdt_chiet_giam) {
                    newData.phan_tram_chiet_giam =
                        (newData.gtdt_chiet_giam * 100) / newData.gtdt_truoc_thue;
                }
            }


            if (fieldName === 'gtdt_truoc_thue' || fieldName === 'phan_tram_chiet_giam') {
                if (newData.gtdt_truoc_thue && newData.phan_tram_chiet_giam) {
                    newData.gtdt_chiet_giam = newData.phan_tram_chiet_giam * newData.gtdt_truoc_thue / 100;
                }
            }

            // Tính gtdt_sau_chiet_giam
            if (newData.gtdt_truoc_thue && newData.gtdt_chiet_giam) {
                newData.gtdt_sau_chiet_giam = newData.gtdt_truoc_thue - newData.gtdt_chiet_giam;
            } else {
                newData.gtdt_sau_chiet_giam = newData.gtdt_truoc_thue;
            }

            // Tính gtdt_sau_chiet_giam
            if (newData.gtdt_truoc_thue && newData.gtdt_chiet_giam) {
                newData.gtdt_sau_chiet_giam =
                    newData.gtdt_truoc_thue - newData.gtdt_chiet_giam;
            } else {
                newData.gtdt_sau_chiet_giam = newData.gtdt_truoc_thue;
            }

            // Tính lại gtdt_thue dựa trên % thuế hiện tại khi gtdt_sau_chiet_giam thay đổi
            if (newData.gtdt_sau_chiet_giam && newData.phan_tram_thue) {
                newData.gtdt_thue =
                    (newData.phan_tram_thue * newData.gtdt_sau_chiet_giam) / 100;
            }

            // Tính phan_tram_thue khi gtdt_thue thay đổi
            if (fieldName === "gtdt_thue") {
                if (newData.gtdt_sau_chiet_giam && newData.gtdt_thue) {
                    newData.phan_tram_thue =
                        (newData.gtdt_thue * 100) / newData.gtdt_sau_chiet_giam;
                }
            }

            // Tính gtdt_thue khi phan_tram_thue thay đổi
            if (fieldName === "phan_tram_thue") {
                if (newData.gtdt_sau_chiet_giam && newData.phan_tram_thue) {
                    newData.gtdt_thue =
                        (newData.phan_tram_thue * newData.gtdt_sau_chiet_giam) / 100;
                }
            }

            // Tính gtdt_sau_thue
            if (newData.gtdt_sau_chiet_giam && newData.gtdt_thue) {
                newData.gtdt_sau_thue = newData.gtdt_sau_chiet_giam + newData.gtdt_thue;
            } else {
                newData.gtdt_sau_thue = newData.gtdt_sau_chiet_giam;
            }

            return newData;
        });
    };


    // Render label kèm thông báo bắt buộc nhập
    const RenderLabel = ({ label, nameField }) => {
        return (
            <div className="flex items-center">
                <span className="mr-2">{label}</span>
                <span className="text-lg text-red-500">*</span>
                {fieldsNull.includes(nameField) && (
                    <span className="text-red-500 text-sm font-normal ml-1">Không được trống</span>
                )}
            </div>
        );
    };



    const fieldInput = [
        {
            stt: 1,
            key: "ma_yctn",
            element: (isUpdateHD || !isAdd) ? (
                <></>
            ) : (
                <FormField
                    label={
                        <>
                            Mã yêu cầu <span className="text-sm">(STT sẽ được hệ thống quy định)</span>{" "}
                            <span className="text-lg text-red-500">*</span>
                        </>
                    }
                    id="ma_yctn"
                    value={formData?.ma_yctn}
                    isDisabled={true}
                />
            ),
        },
        {
            stt: 2,
            key: "ten_yctn",
            element: (
                <FormField
                    label={<RenderLabel label="Tên YCTN" nameField="ten_yctn" />}
                    id="ten_yctn"
                    value={formData?.ten_yctn || ""}
                    onChange={handleInputChange}
                    isDisabled={isUpdateHD}
                />
            ),
        },
        {
            stt: 3,
            key: "noi_dung",
            element: (
                <FormField
                    label={<RenderLabel label="Nội dung" nameField="noi_dung" />}
                    id="noi_dung"
                    value={formData?.noi_dung || ""}
                    isTextArea
                    onChange={handleInputChange}
                    isDisabled={isUpdateHD}
                />
            ),
        },
        {
            stt: 4,
            key: "loai_tai_san",
            element:
                loai_yctn.ma_loai_yctn === "ke_hoach_thi_nghiem" ? (
                    <FormField
                        label={<RenderLabel label="Loại tài sản" nameField="loai_tai_san" />}
                        id="loai_tai_san"
                        value={Number.parseInt(formData.loai_tai_san)}
                        isDropdown
                        options={dm_LTS}
                        optionsLabel="ten_lts"
                        optionsValue="id"
                        onChange={handleInputChange}
                        isDisabled={isUpdateHD}
                    />
                ) : (
                    <></>
                ),
        },
        {
            stt: 5,
            key: "id_khach_hang",
            element: (
                <div className="flex gap-4">
                    <div style={{ width: "49%" }}>
                        <FormField
                            label={<RenderLabel label="Khách hàng / Đơn vị điện lực" nameField="id_khach_hang" />}
                            id="id_khach_hang"
                            value={formData.id_khach_hang ? Number.parseInt(formData?.id_khach_hang) : null}
                            isDropdown
                            options={dm_KH}
                            optionsLabel="ten_kh"
                            optionsValue="id"
                            onChange={handleInputChange}
                            isDisabled={isUpdateHD}
                        />
                    </div>
                    <div style={{ width: "49%" }}>
                        <FormField
                            label={<RenderLabel label="Loại tài sản" nameField="loai_tai_san" />}
                            id="loai_tai_san"
                            value={formData.loai_tai_san ? Number.parseInt(formData.loai_tai_san) : null}
                            isDropdown
                            options={dm_LTS}
                            optionsLabel="ten_lts"
                            optionsValue="id"
                            onChange={handleInputChange}
                            isDisabled={isUpdateHD}
                        />
                    </div>
                </div>
            ),
        },
        {
            stt: 6,
            key: "ngay_tao",
            element: (
                <FormField
                    label={<RenderLabel label="Ngày tạo" nameField="ngay_tao" />}
                    id="ngay_tao"
                    value={moment(formData?.ngay_tao).toDate()}
                    onChange={handleInputChange}
                    isDisabled={isUpdateHD}
                    isCalendar
                />
            ),
        },
        {
            stt: 7,
            key: "ngay_ky_hop_dong",
            element: (
                <FormField
                    label={<RenderLabel label="Ngày ký hợp đồng" nameField="ngay_ky_hop_dong" />}
                    id="ngay_ky_hop_dong"
                    value={moment(formData?.ngay_ky_hop_dong).toDate()}
                    onChange={handleInputChange}
                    isDisabled={isUpdateHD}
                    isCalendar
                />
            ),
        },
        {
            stt: 8,
            key: "ngay_xay_ra_su_co",
            element: (
                <FormField
                    label={<RenderLabel label="Ngày xảy ra sự cố" nameField="ngay_xay_ra_su_co" />}
                    id="ngay_xay_ra_su_co"
                    value={moment(formData?.ngay_xay_ra_su_co).toDate()}
                    onChange={handleInputChange}
                    isDisabled={isUpdateHD}
                    isCalendar
                />
            ),
        },
        {
            stt: 9,
            key: "gtdt_truoc_thue",
            element: (
                <FormField
                    label={<RenderLabel label="Giá trị trước thuế" nameField="gtdt_truoc_thue" />}
                    id="gtdt_truoc_thue"
                    value={formData?.gtdt_truoc_thue}
                    onChange={handleInputChange}
                    isNumber
                    childrenIPNumber={"VNĐ"}
                />
            ),
        },
        {
            stt: 10,
            key: "phan_tram_chiet_giam",
            element: (
                <div className="flex gap-4">
                    <div style={{ width: "20%" }}>
                        <FormField
                            label={<RenderLabel label="Phần trăm chiết giảm" nameField="phan_tram_chiet_giam" />}
                            id="phan_tram_chiet_giam"
                            value={formData.phan_tram_chiet_giam}
                            onChange={handleInputChange}
                            isNumber
                        />
                    </div>
                    <div style={{ width: "38%" }}>
                        <FormField
                            label={<RenderLabel label="Giá trị chiết giảm" nameField="gtdt_chiet_giam" />}
                            id="gtdt_chiet_giam"
                            value={formData.gtdt_chiet_giam}
                            onChange={handleInputChange}
                            isNumber
                        />
                    </div>
                    <div style={{ width: "39%" }}>
                        <FormField
                            label={<RenderLabel label="Giá trị sau chiết giảm" nameField="gtdt_sau_chiet_giam" />}
                            id="gtdt_sau_chiet_giam"
                            value={formData.gtdt_sau_chiet_giam}
                            onChange={handleInputChange}
                            isNumber
                        />
                    </div>
                </div>
            ),
        },
        {
            stt: 11,
            key: "phan_tram_thue",
            element: (
                <div className="flex gap-4">
                    <div style={{ width: "20%" }}>
                        <FormField
                            label={<RenderLabel label="Phần trăm thuế" nameField="phan_tram_thue" />}
                            id="phan_tram_thue"
                            value={formData.phan_tram_thue}
                            onChange={handleInputChange}
                            isNumber
                        />
                    </div>
                    <div style={{ width: "38%" }}>
                        <FormField
                            label={<RenderLabel label="Giá trị thuế" nameField="gtdt_thue" />}
                            id="gtdt_thue"
                            value={formData.gtdt_thue}
                            onChange={handleInputChange}
                            isNumber
                        />
                    </div>
                    <div style={{ width: "39%" }}>
                        <FormField
                            label={<RenderLabel label="Giá trị sau thuế" nameField="gtdt_sau_thue" />}
                            id="gtdt_sau_thue"
                            value={formData.gtdt_sau_thue}
                            onChange={handleInputChange}
                            isNumber
                        />
                    </div>
                </div>
            ),
        },
        {
            stt: 16,
            key: "file_upload",
            element: isUpdateHD ? (
                <></>
            ) : (
                <>
                    <label className="font-bold text-sm my-3 block" htmlFor="file_upload">
                        <RenderLabel label="File Upload" nameField={"file_upload"} />
                    </label>
                    <InputFile nameField="file_upload" setFormData={setFormData} />
                </>
            ),
        },
    ];


    const findMatchingFields = (fields, fieldByYCTN) => {
        // Lấy danh sách ma_truong_yctn từ fieldByYCTN      
        return fieldByYCTN.map(item => fields.find(field => field.id === item.ma_truong_yctn + ""));
    }



    console.log(fieldCurrent)
    function validateFormData(fieldCurrent) {
        setFieldsNull([])
        let isValid = true
        fieldCurrent.filter(s => s.ma_code !== "crr_step" && s.ma_code !== "next_step" && s.ma_code !== "ma_khach_hang").forEach(field => {
            if (!formData[field.ma_code] && formData[field.ma_code] !== 0) {
                setFieldsNull(prev => [...prev, field.ma_code])
                isValid = false
            }
        })
        if (!isValid) {
            Notification.error(toast, `Vui lòng nhập đầy đủ các trường bắt buộc`)
        }
        return isValid
    }


    const handleSubmit = async () => {
        if (!validateFormData(fieldCurrent)) return


        if (formData.file_upload && formData.file_upload instanceof FormData) {

            let resUpload = await UploadFileService.file(formData.file_upload)
            formData.file_upload = resUpload.filePath
        }

        if (isAdd) {
            try {

                let res = await QLTN_YCTNService.create_QLTN_YCTN(formData)

                setFormData((prev) => ({ ...prev, ma_yctn: res, next_step: 2 }))
                Notification.success(toast, "Tạo mới YCTN thành công")
            } catch (err) {

                Notification.error(toast, "Tạo mới YCTN thất bại")
            }
        }
        else {
            try {
                let res = await QLTN_YCTNService.update({...formData,qltn_yctn_log:formData.qltn_yctn_log})
                res && refeshData()
                Notification.success(toast, "Cập nhật thành công")
            } catch (error) {
                console.log(error)
                Notification.error(toast)
            }
        }

    }


    const handleUpdate = async () => {
        try {

            let res = await QLTN_YCTNService.update({ ...formData, nguoi_sua: user, qltn_yctn_log: isUpdateHD ? [...formData.qltn_yctn_log || [], yctn_LOG] : formData.yctn_LOG })
            res && refeshData()
            Notification.success(toast, "Cập nhật thành công")
        } catch (error) {
            console.log(error)
            Notification.error(toast)
        }
    }

    return (
        <div className="">
            <div>
                {fieldInput.map(field => {
                    if (fieldCurrent.find(i => i?.ma_code === field.key)) {
                        return <div key={field.stt}>
                            {field.element}
                        </div>
                    }

                })}
                {!isAdd && <p className="flex justify-content-end mt-2">
                    <Tooltip target=".file-link" position="left" content="Nhấn để mở File đã tải lên" />
                    <a

                        href={`${urlServer}${formData.file_upload}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline file-link"
                    >
                        {yctn_LOG && yctn_LOG.file_upload?.split("/").pop()}
                    </a>
                </p>}
            </div>
            <br />
            <br />
            <br />
            <div style={{ borderTop: "1px solid #ccc" }} className='flex justify-content-end gap-2 mt-10 pt-5'>

                <Button label="Quay lại" icon="pi pi-arrow-left" className='p-button-danger' onClick={() => router.back()} />
                {loai_yctn && isAdd && !isUpdateHD  && !formData.next_step === 2&& <Button label={"Tạo mới " + loai_yctn?.ten_loai_yc} icon="pi pi-check" onClick={handleSubmit} />}
                {loai_yctn && isAdd === false && <Button label={"Cập nhật " + loai_yctn?.ten_loai_yc} icon="pi pi-check" onClick={handleSubmit} />}
                {loai_yctn && isUpdateHD && <Button label={"Cập nhật hợp đồng " + loai_yctn?.ten_loai_yc} icon="pi pi-check" onClick={handleUpdate} />}
                {loai_yctn && formData.next_step === 2 && <Button onClick={() => { router.push("/quanlythinghiem/yeucauthinghiem/giaonhiemvu?code=" + formData.ma_yctn) }} label={"Bước tiếp theo   " + data.listBuocYCTN?.find(s => s.buoc === 2)?.ten_buoc_yctn} icon="pi pi-check" />}
            </div>
        </div>
    );
};

export default memo(FieldAddYCTN);
