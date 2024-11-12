import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { FileUpload } from 'primereact/fileupload';
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { HT_NGUOIDUNG_Service } from "../../../services/HT_NGUOIDUNGService";

const mockData = {
    DVIQLYS: [
        { label: "ĐIỆN LỰC TP HƯNG YÊN", value: "PA23HY" },
        { label: "ĐIỆN LỰC KHOÁI CHÂU", value: "PA23KC" },
        { label: "ĐIỆN LỰC KIM ĐỘNG", value: "PA23KD" },
        { label: "ĐIỆN LỰC MỸ HÀO", value: "PA23MV" },
        { label: "ĐIỆN LỰC PHÙ TIÊN", value: "PA23PT" },
        { label: "ĐIỆN LỰC VĂN GIANG", value: "PA23VG" },
        { label: "ĐIỆN LỰC VĂN LÂM", value: "PA23VL" },
        { label: "CÔNG TY ĐIỆN LỰC HƯNG YÊN", value: "PA23" },
        { label: "TỔNG CÔNG TY ĐIỆN LỰC MIỀN BẮC", value: "PA" },
        { label: "ĐIỆN LỰC ÂN THI", value: "PA23AT" },
        { label: "ĐIỆN LỰC YÊN MỸ", value: "PA23YM" },
        { label: "TẬP ĐOÀN (EVN)", value: "P" }
    ],
    PBS: [
        { label: "Đội sản xuất kinh doanh tổng hợp số 2", value: "3044f00b-2307-40e6-8a59-38ef552815fd" },
        { label: "Phòng kinh doanh", value: "8cb2db41-21d2-4ce7-85b6-b7e2a4f6d69e" },
        { label: "Đội kiểm tra giám sát mua bán điện", value: "9ec4d9d1-20a7-4508-948c-9644450e13d4" },
        { label: "Điện lực Khoái Châu", value: "5bd79ac6-d2fb-4dff-8f5a-1442492c06f5" },
        { label: "Phòng Kinh doanh Tài vụ", value: "c4283d86-8eba-4a66-9711-971b2d751c66" },
        { label: "Phòng Kinh doanh điện năng", value: "242fb100-8e70-45a0-9e10-7ac6bc4b0f92" },
        { label: "Phòng Kinh doanh viễn thông", value: "ee6d169c-328a-49a0-9dc5-51ecc87491c5" },
        { label: "Phòng kinh doanh", value: "f64160fb-a0d3-459c-8678-5dceba55722a" },
        { label: "Ban giám đốc", value: "b2c4b69f-69a0-476c-a098-164522a819c3" },
        { label: "Tổ treo tháo công tơ", value: "e8021322-af9a-4457-afc1-857251837493" },
        { label: "Phòng Kế hoạch- Kỹ thuật -An toàn", value: "6e79c7e9-abc0-46a1-bf94-074138c239f2" },
        { label: "Phòng Tài chính Kế toán", value: "6f1cc051-0d75-4128-8938-6956e5fa10d3" }
    ],
    ChucVus: [
        { label: "Đội trưởng (cấp tổ)", value: "6cc01845-5bc4-4177-ae97-99aaeb6db723" },
        { label: "Công nhân bậc 5", value: "74a1922c-9aad-4124-b9de-ea0419f5d260" },
        { label: "Phó Giám đốc Điện lực", value: "77305c53-df63-4b58-afb4-f244076a2a45" },
        { label: "Trưởng Phòng", value: "78c1263f-72fa-4ceb-b11e-23e95569f6f2" },
        { label: "Phó phòng", value: "7976acdd-31f4-4706-bb94-4429c42d4d00" },
        { label: "Đội phó", value: "7c3a3824-bdb6-42d5-bf81-52f133667f7d" },
        { label: "Công nhân lái xe", value: "7de93341-e79f-4c52-9b65-4ecaa3f2fff8" },
        { label: "Công nhân lái xe", value: "8326882c-176e-434b-ada4-5f5f06aca558" },
        { label: "Công nhân bậc 7", value: "854fa703-5e3e-4b9b-bfdc-b20cac203b53" },
        { label: "Công nhân bậc 2", value: "86306a32-006e-4f97-813f-0a07f307e3ab" },
        { label: "Phó Giám đốc", value: "8ffa1364-36cd-4d56-9381-92c4334c7aa7" },
        { label: "Công nhân kinh doanh", value: "937ed386-b818-4681-908f-9f1240224e82" }
    ],
    trangThaiOptions: [
        { label: 'Còn hiệu lực', value: 1 },
        { label: 'Hết hiệu lực', value: 0 }
    ],

    gioiTinhOptions: [
        { label: 'Nam', value: 1 },
        { label: 'Nữ', value: 0 }
    ]
};

const FormField = ({ label, value, options, onChange, id, isDropdown = false }) => (
    <div className="field-item" style={{ flex: '1 1 calc(50% - 1rem)' }}>
        <label className='font-bold text-sm my-3 inline-block' htmlFor={id}>{label}</label>
        {isDropdown ? (
            <Dropdown id={id} name={id} value={value} options={options} onChange={onChange} />
        ) : (
            <InputText id={id} name={id} value={value} onChange={onChange} />
        )}
    </div>
);

export const DialogForm = ({ isAdd, formData, setFormData, visible, setVisible, toast, loadData }) => {
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        if (formData.teN_DANG_NHAP && formData.hO_TEN) {
            setLoading(true);
            try {
                const res = isAdd
                    ? await HT_NGUOIDUNG_Service.create(formData)
                    : await HT_NGUOIDUNG_Service.update(formData);

                if (res) {
                    toast.current.show({ severity: 'success', summary: 'Thông báo!', detail: `${(isAdd ? "Thêm" : "Sửa")} thành công người dùng.`, life: 3000 });
                    loadData();
                }
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Thông báo!', detail: `${(isAdd ? "Thêm" : "Sửa")} thất bại.`, life: 3000 });
            } finally {
                setLoading(false);
            }
        } else {
            toast.current.show({ severity: 'error', summary: 'Thông báo!', detail: `${(isAdd ? "Thêm" : "Sửa")} thất bại.`, life: 3000 });
        }
    };

    return (
        <Dialog position={"top"} header={<h4>{(isAdd ? "Thêm mới" : "Sửa thông tin") + " người dùng"}</h4>} visible={visible} className='w-8' onHide={() => setVisible(false)}>
            <div className="p-fluid border-solid p-4 border-100 border-round-2xl">
                <div className="form-wrapper" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>

                    {/* Tên đăng nhập và mật khẩu */}
                    <FormField label="Tên đăng nhập" value={formData.teN_DANG_NHAP} onChange={handleInputChange} id="teN_DANG_NHAP" />
                    {isAdd && <FormField label="Mật khẩu" value={formData.maT_KHAU} onChange={handleInputChange} id="maT_KHAU" />}

                    {/* Họ tên và email */}
                    <FormField label="Họ tên" value={formData.hO_TEN} onChange={handleInputChange} id="hO_TEN" />
                    <FormField label="Email" value={formData.email} onChange={handleInputChange} id="email" />

                    {/* Đơn vị và phòng ban */}
                    <FormField label="Đơn vị trực thuộc" value={formData.dM_DONVI_ID} options={mockData.DVIQLYS} onChange={handleInputChange} id="dM_DONVI_ID" isDropdown />
                    <FormField label="Phòng ban" value={formData.dM_PHONGBAN_ID} options={mockData.PBS} onChange={handleInputChange} id="dM_PHONGBAN_ID" isDropdown />

                    {/* Chức vụ và trạng thái */}
                    <FormField label="Chức vụ" value={formData.dM_CHUCVU_ID} options={mockData.ChucVus} onChange={handleInputChange} id="dM_CHUCVU_ID" isDropdown />
                    <FormField label="Trạng thái" value={formData.tranG_THAI} options={mockData.trangThaiOptions} onChange={handleInputChange} id="tranG_THAI" isDropdown />

                    {/* Giới tính và số CMND */}
                    <FormField label="Giới tính" value={formData.gioI_TINH} options={mockData.gioiTinhOptions} onChange={handleInputChange} id="gioI_TINH" isDropdown />
                    <FormField label="Số CMND" value={formData.sO_CMND} onChange={handleInputChange} id="sO_CMND" />

                    {/* Smart và ảnh chữ ký */}
                    <FormField label="Smart" value={formData.smart} options={[
                        { label: '1-VNPT SmartCA', value: 1 },
                        { label: '2-Viettel SmartCA', value: 2 },
                        { label: '3-VNPT Token', value: 3 },
                        { label: '4-Viettel Token', value: 4 },
                        { label: '5-EVN CA', value: 5 }
                    ]} onChange={handleInputChange} id="smart" isDropdown />

                    <div className="field-item" style={{ flex: '1 1 calc(50% - 1rem)' }}>
                        <label className='font-bold text-sm my-3 inline-block' htmlFor="fileUpload">Ảnh chữ ký nháy</label>
                        <FileUpload mode="basic" id="fileUpload" name="fileUpload" accept="image/*" chooseLabel="Chọn ảnh chữ ký" className="p-inputtext-sm" />
                    </div>

                </div>
            </div>

            <div className='flex justify-content-end gap-2 mt-4'>
                <Button label="Hủy" icon="pi pi-times" onClick={() => setVisible(false)} className='p-button-outlined' />
                <Button label={isAdd ? "Thêm mới" : "Lưu"} icon="pi pi-check" loading={loading} onClick={handleSubmit} />
            </div>
        </Dialog>
    );
};
