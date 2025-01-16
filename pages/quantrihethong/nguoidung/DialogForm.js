import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { FileUpload } from 'primereact/fileupload';
import { Dropdown } from "primereact/dropdown";
import { Password } from "primereact/password";
import { useRef, useState, useEffect } from "react";
import { HT_NGUOIDUNG_Service } from "../../../services/quantrihethong/HT_NGUOIDUNGService";
import UploadFileService from "../../../services/UploadFileService";
import { urlServer } from "../../../constants/api";
import { validatePassword } from "../../../utils/Function";

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
    <div className="field col-12 md:col-6">
        <label className='font-bold text-sm my-3 block' htmlFor={id}>{label}</label>
        {isDropdown ? (
            <Dropdown filter placeholder="Chọn giá trị " id={id} name={id} value={value} optionValue="id" optionLabel="name" options={options} onChange={onChange} className="w-full" />
        ) : (
            <InputText type={typeInput} placeholder="Nhập thông tin" id={id} name={id} value={value} onChange={onChange} className="w-full" />
        )}
    </div>
);

export const DialogForm = ({ isAdd, formData, setFormData, visible, setVisible, toast, loadData, DM_DONVI, DM_CHUCVU, DM_PHONGBAN, search }) => {
    const [loading, setLoading] = useState(false);
    const [filePath, setFilePath] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [dsPhongBan, setDsPhongBan] = useState([]);
    const fileUploadRef = useRef(null);


    useEffect(() => {
        if (formData.anhchukynhay) {
            setPreviewImage(urlServer + formData.anhchukynhay)
        }
    }, [formData.anhchukynhay])

    useEffect(() => {
        console.log("test:" + formData.dm_donvi_id)
        console.log(DM_PHONGBAN)
        console.log(DM_PHONGBAN.filter(s => s.dm_donvi_id === formData.dm_donvi_id))
        setDsPhongBan(DM_PHONGBAN.filter(s => s.dm_donvi_id === formData.dm_donvi_id))
    }, [formData.dm_donvi_id])


    const handleUploadImage = async (event) => {
        const file = event.files[0];
        const formData = new FormData();
        formData.append("file", file);
        setFilePath(formData);
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
        fileUploadRef.current.clear();
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

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
            if (isAdd) {
                const password = formData["mat_khau"];
                return validatePassword(password, toast);
            }
        }
        return true;
    };


    const handleSubmit = async () => {
        if (validateEmptyFields()) {
            setLoading(true);
            try {
                let anhchuky = formData.anhchukynhay;
                if (filePath) {
                    const res = await UploadFileService.image(filePath);
                    anhchuky = res.filePath;
                }
                const res = isAdd
                    ? await HT_NGUOIDUNG_Service.create({ ...formData, trang_thai: 1, anhchukynhay: anhchuky })
                    : await HT_NGUOIDUNG_Service.update({ ...formData, anhchukynhay: anhchuky });

                toast.current.show({ severity: 'success', summary: 'Thông báo!', detail: `${(isAdd ? "Thêm" : "Sửa")} thành công người dùng.`, life: 3000 });

                loadData(search);

            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Thông báo!', detail: `${(isAdd ? "Thêm" : "Sửa")} thất bại .`, life: 3000 });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Dialog position={"top"} header={<h4>{(isAdd ? "Thêm mới" : "Sửa thông tin") + " người dùng"}</h4>} visible={visible} className='w-11 md:w-8' onHide={() => setVisible(false)}>
            <div className="p-fluid border-solid p-4 border-100 border-round-2xl">
                <div className="grid">
                    <FormField label="Đơn vị quản lý" value={formData.dm_donvi_id} options={DM_DONVI} onChange={handleInputChange} id="dm_donvi_id" isDropdown />
                    <FormField label="Phòng ban" value={formData.dm_phongban_id} options={dsPhongBan} onChange={handleInputChange} id="dm_phongban_id" isDropdown />
                    <FormField label="Tên đăng nhập" value={formData.ten_dang_nhap} onChange={handleInputChange} id="ten_dang_nhap" />
                   
                    {isAdd && <div className="field col-12 md:col-6">
                        <label className='font-bold text-sm my-3 block' htmlFor="mat_khau">Mật khẩu</label>
                        <Password  inputid="mat_khau" name="mat_khau" value={formData.mat_khau} onChange={handleInputChange} placeholder="Nhập mật khẩu" toggleMask className="w-full mb-2" inputClassName="w-full p-3" />
                    </div>}
                    <FormField label="Họ tên" value={formData.ho_ten} onChange={handleInputChange} id="ho_ten" />
                    <FormField label="Chức vụ" value={formData.dm_chucvu_id} options={DM_CHUCVU} onChange={handleInputChange} id="dm_chucvu_id" isDropdown />
                    {!isAdd && <FormField label="Trạng thái" value={formData.trang_thai} options={mockData.trangThaiOptions} onChange={handleInputChange} id="trang_thai" isDropdown />}
                    <FormField label="Email" value={formData.email} onChange={handleInputChange} id="email" typeInput="email" />
                    <FormField label="Số điện thoại" value={formData.so_dien_thoai} onChange={handleInputChange} id="so_dien_thoai" typeInput="tel" />
                    <FormField label="Giới tính" value={formData.gioi_tinh} options={mockData.gioiTinhOptions} onChange={handleInputChange} id="gioi_tinh" isDropdown />
                    <FormField label="Số CMND" value={formData.so_cmnd} onChange={handleInputChange} id="so_cmnd" />
                    <FormField label="Smart" value={formData.hrms_type} options={[
                        { name: '1-VNPT SmartCA', id: 1 },
                        { name: '2-Viettel SmartCA', id: 2 },
                        { name: '3-VNPT Token', id: 3 },
                        { name: '4-Viettel Token', id: 4 },
                        { name: '5-EVN CA', id: 5 }
                    ]} onChange={handleInputChange} id="hrms_type" isDropdown />
                    <FormField label="Token Chữ Ký / Serial Number" value={formData.value_token} onChange={handleInputChange} id="value_token" />
                </div>

                {(previewImage) && (
                    <div className="mt-3">
                        <h5 className="text-sm font-bold">Ảnh chữ ký đã tải lên:</h5>
                        <img src={previewImage} alt="Ảnh chữ ký nháy" style={{ width: "200px", height: "100px" }} />
                    </div>
                )}
                <div className="block my-3" >
                    <FileUpload
                        ref={fileUploadRef}
                        mode="basic"
                        id="fileUpload"
                        name="fileUpload"
                        accept="image/*"
                        chooseLabel="Chọn ảnh chữ ký mới"
                        className="p-inputtext-sm"
                        onSelect={handleUploadImage}
                    />
                </div>
            </div>

            <div className='flex justify-content-end gap-2 mt-4'>
                <Button label="Đóng" icon="pi pi-times" onClick={() => setVisible(false)} className='p-button-outlined' />
                <Button label={isAdd ? "Thêm mới" : "Lưu"} icon="pi pi-check" loading={loading} onClick={handleSubmit} />
            </div>

        </Dialog>
    );
};
