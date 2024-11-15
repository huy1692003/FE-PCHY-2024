import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { FileUpload } from 'primereact/fileupload';
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { HT_NGUOIDUNG_Service } from "../../../services/HT_NGUOIDUNGService";

const mockData = {
    trangThaiOptions: [
        { name: 'Còn hiệu lực', id: 1 },
        { name: 'Hết hiệu lực', id: 0 }
    ],

    gioiTinhOptions: [
        { name: 'Nam', id: 1 },
        { name: 'Nữ', id: 0 }
    ]
};

const FormField = ({ label, value, options, onChange, id, isDropdown = false, typeInput = "text" }) => (
    <div className="field-item" style={{ flex: '1 1 calc(50% - 1rem)' }}>
        <label className='font-bold text-sm my-3 inline-block' htmlFor={id}>{label}</label>
        {isDropdown ? (
            <Dropdown filter placeholder="Chọn giá trị " id={id} name={id} value={value} optionValue="id" optionLabel="name" options={options} onChange={onChange} />
        ) : (
            <InputText type={typeInput} placeholder="Nhập thông tin" id={id} name={id} value={value} onChange={onChange} />
        )}
    </div>
);

export const DialogForm = ({ isAdd, formData, setFormData, visible, setVisible, toast, loadData, DM_DONVI, DM_CHUCVU, DM_PHONGBAN, search }) => {
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    console.log(formData)
    // Hàm kiểm tra các trường trống
    const validateEmptyFields = () => {
        const requiredFields = ["ten_dang_nhap", "ho_ten", "email", "so_dien_thoai", "dm_donvi_id", "dm_phongban_id", "dm_chucvu_id"];
        for (const field of requiredFields) {
            if (!formData[field]) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Thông báo!',
                    detail: `Trường ${field} không được để trống.`,
                    life: 3000
                });
                return false;
            }
            if (isAdd && !formData["mat_khau"]) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Thông báo!',
                    detail: `Trường mật khẩu không được để trống.`,
                    life: 3000
                });
                return false;
            }
        }
        return true;
    };


    const handleSubmit = async () => {
        if (validateEmptyFields()) {
            setLoading(true);
            console.log(formData)
            try {
                const res = isAdd
                    ? await HT_NGUOIDUNG_Service.create({ ...formData, trang_thai: 1 })
                    : await HT_NGUOIDUNG_Service.update(formData);

                toast.current.show({ severity: 'success', summary: 'Thông báo!', detail: `${(isAdd ? "Thêm" : "Sửa")} thành công người dùng.`, life: 3000 });

                loadData(search);

            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Thông báo!', detail: `${(isAdd ? "Thêm" : "Sửa")} thất bại.`, life: 3000 });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Dialog position={"top"} header={<h4>{(isAdd ? "Thêm mới" : "Sửa thông tin") + " người dùng"}</h4>} visible={visible} className='w-8' onHide={() => setVisible(false)}>
            <div className="p-fluid border-solid p-4 border-100 border-round-2xl">
                <div className="form-wrapper" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>

                    {/* Tên đăng nhập và mật khẩu */}
                    <FormField label="Tên đăng nhập" value={formData.ten_dang_nhap} onChange={handleInputChange} id="ten_dang_nhap" />
                    {isAdd && <FormField label="Mật khẩu" value={formData.mat_khau} onChange={handleInputChange} id="mat_khau" />}

                    {/* Họ tên và email */}
                    <FormField label="Họ tên" value={formData.ho_ten} onChange={handleInputChange} id="ho_ten" />
                    <FormField label="Email" value={formData.email} onChange={handleInputChange} id="email" typeInput="email" />
                    <FormField label="Số điện thoại" value={formData.so_dien_thoai} onChange={handleInputChange} id="so_dien_thoai" typeInput="tel" />

                    {/* Đơn vị và phòng ban */}
                    <FormField label="Đơn vị trực thuộc" value={formData.dm_donvi_id} options={DM_DONVI} onChange={handleInputChange} id="dm_donvi_id" isDropdown />
                    <FormField label="Phòng ban" value={formData.dm_phongban_id} options={DM_PHONGBAN} onChange={handleInputChange} id="dm_phongban_id" isDropdown />

                    {/* Chức vụ và trạng thái */}
                    <FormField label="Chức vụ" value={formData.dm_chucvu_id} options={DM_CHUCVU} onChange={handleInputChange} id="dm_chucvu_id" isDropdown />
                    {!isAdd && <FormField label="Trạng thái" value={formData.trang_thai} options={mockData.trangThaiOptions} onChange={handleInputChange} id="trang_thai" isDropdown />}

                    {/* Giới tính và số CMND */}
                    <FormField label="Giới tính" value={formData.gioi_tinh} options={mockData.gioiTinhOptions} onChange={handleInputChange} id="gioi_tinh" isDropdown />
                    <FormField label="Số CMND" value={formData.so_cmnd} onChange={handleInputChange} id="so_cmnd" />

                    {/* Smart và ảnh chữ ký */}
                    <FormField label="Smart" value={formData.smart} options={[
                        { name: '1-VNPT SmartCA', id: 1 },
                        { name: '2-Viettel SmartCA', id: 2 },
                        { name: '3-VNPT Token', id: 3 },
                        { name: '4-Viettel Token', id: 4 },
                        { name: '5-EVN CA', id: 5 }
                    ]} onChange={handleInputChange} id="smart" isDropdown />

                    <div className="field-item" style={{ flex: '1 1 calc(50% - 1rem)' }}>
                        <label className='font-bold text-sm my-3 inline-block' htmlFor="fileUpload">Ảnh chữ ký nháy</label>
                        <FileUpload mode="basic" id="fileUpload" name="fileUpload" accept="image/*" chooseLabel="Chọn ảnh chữ ký" className="p-inputtext-sm" />
                    </div>

                </div>
            </div>

            <div className='flex justify-content-end gap-2 mt-4'>
                <Button label="Đóng" icon="pi pi-times" onClick={() => setVisible(false)} className='p-button-outlined' />
                <Button label={isAdd ? "Thêm mới" : "Lưu"} icon="pi pi-check" loading={loading} onClick={handleSubmit} />
            </div>


        </Dialog>
    );
};
