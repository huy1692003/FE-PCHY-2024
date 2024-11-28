import { memo, useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { FileUpload } from "primereact/fileupload";
import { DM_TRUONG_YCTN_Service } from "../../../services/quanlythinghiem/DM_TRUONG_YCTN_Service";
import DM_LOAI_YCTNService from "../../../services/quanlythinghiem/DM_LOAI_YCTNService";
import DM_YCTN from "../../../models/DM_YCTN";
import { Dropdown } from "primereact/dropdown";
import InputFile from "../InputFile";

const FormField = ({ label, className, style, placeholder, value, onChange, id, isCalendar = false, isNumber = false, isFileUpload = false, isDropdown = false, options = [], prefix, isDisabled = false, styleField, props, mode, currency, locale, childrenIPNumber, optionsValue, optionsLabel }) => (
    <div className={className} style={style}>
        <label className='font-medium text-sm my-3 block' htmlFor={id}>{label}</label>
        {isCalendar ? (
            <Calendar id={id} name={id} value={value} onChange={(e) => onChange(id, e.value)} showIcon className="w-full" disabled={isDisabled} />

        ) : isDropdown ? (
            <Dropdown  {...props} id={id} name={id} value={value} options={options} showClear onChange={(e) => onChange(id, e.value)} className="w-full" disabled={isDisabled} filter optionsValue={optionsValue} optionsLabel={optionsLabel} placeholder="--Mời chọn--" />
        ) : (
            <InputText style={styleField} id={id} name={id} value={value} onChange={(e) => onChange(id, e.target.value)} className="w-full" disabled={isDisabled} />
        )}
    </div>
);



const FieldAddYCTN = ({ loai_yctn, formData, setFormData }) => {


    const [fieldbyLoaiYCTN, setFieldbyLoaiYCTN] = useState([]);
    const [fields, setFields] = useState([]);
    const [fieldCurrent, setFieldCurrent] = useState([]);
    const [ElementField, setElementField] = useState([]);
    const [phan_tram_chiet_giam, setPhan_tram_chiet_giam] = useState(0);
    const [gtdt_chiet_giam, setGtdt_chiet_giam] = useState(0);
    const [gtdt_sau_chiet_giam, setGtdt_sau_chiet_giam] = useState(0);
    const [phan_tram_thue, setPhan_tram_thue] = useState(0);
    const [gtdt_thue, setGtdt_thue] = useState(0);
    const [gtdt_sau_thue, setGtdt_sau_thue] = useState(0);



    // Lấy danh sách trường dữ liệu và các trường tương ứng với loai_yctn  
    useEffect(() => {
        getAllFields();
        getFieldByLoaiYCTN();
    }, [loai_yctn]);

    useEffect(() => {
        let res = findMatchingFields(fields, fieldbyLoaiYCTN);
        setFieldCurrent(res);

    }, [fieldbyLoaiYCTN, fields]);

    useEffect(() => {
        renderElementField();
    }, [fieldCurrent]);


    // Tính toán giá trị thuế và giá trị triết giảm



    const getAllFields = async () => {
        let res = await DM_TRUONG_YCTN_Service.getAll_DM_TRUONG_YCTN();
        setFields(res);
    }

    const getFieldByLoaiYCTN = async () => {
        let res = await DM_LOAI_YCTNService.get_PHAN_MIEN_YCTN_BY_LOAI_YCTN(loai_yctn.id)
        setFieldbyLoaiYCTN(res);
    }

    const handleInputChange = (fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };
    const fieldInput = [
        {
            stt: 1,
            key: "ma_yctn",
            element: <FormField label={<>Mã yêu cầu <span className="text-sm">(STT sẽ được hệ thống quy định)</span> <span className="text-lg text-red-500">*</span></>} id="ma_yctn" value={formData?.ma_yctn} onChange={handleInputChange} isDisabled={true} />
        },
        {
            stt: 2,
            key: "ten_yctn",
            element: <FormField label="Tên YCTN" id="ten_yctn" value={formData?.ten_yctn} onChange={handleInputChange} />
        },
        {
            stt: 3,
            key: "noi_dung",
            element: <FormField label="Nội dung" id="noi_dung" value={formData?.noi_dung} onChange={handleInputChange} styleField={{ height: '100px' }} />
        },
        {
            stt: 4,
            key: "id_khach_hang",
            element: <FormField isDropdown label="Khách hàng / Đơn vị điện lực" id="id_khach_hang" value={formData?.id_khach_hang} onChange={handleInputChange} />
        },
        {
            stt: 5,
            key: "loai_tai_san",
            element: <FormField label="Loại tài sản" id="loai_tai_san" value={formData.phan_tram_chiet_giam} onChange={handleInputChange} is />
        },
        {
            stt: 6,
            key: "ngay_tao",
            element: <FormField label="Ngày tạo" id="ngay_tao" value={formData?.ngay_tao} onChange={handleInputChange} isCalendar />
        },
        {
            stt: 7,
            key: "ngay_ky_hop_dong",
            element: <FormField label="Ngày ký hợp đồng" id="ngay_ky_hop_dong" value={formData?.ngay_ky_hop_dong} onChange={handleInputChange} isCalendar />
        },
        {
            stt: 8,
            key: "ngay_xay_ra_su_co",
            element: <FormField label="Ngày xảy ra sự cố" id="ngay_xay_ra_su_co" value={formData?.ngay_xay_ra_su_co} onChange={handleInputChange} isCalendar />
        },
        {
            stt: 9,
            key: "gtdt_truoc_thue",
            element: <FormField label="Giá trị trước thuế" id="gtdt_truoc_thue" value={formData?.gtdt_truoc_thue} onChange={handleInputChange} isNumber childrenIPNumber={"(VNĐ)"} />
        },
        {
            stt: 10,
            key: "phan_tram_chiet_giam",
            element:
                <div className="w-full">
                    <div className="flex w-full justify-content-between">
                        <FormField style={{ width: "20%" }} label="Phần trăm chiết giảm" id="phan_tram_chiet_giam" value={phan_tram_chiet_giam} onChange={setPhan_tram_chiet_giam} isNumber childrenIPNumber="(%)" />
                        <FormField style={{ width: "38%" }} label="Giá trị chiết giảm" id="gtdt_chiet_giam" value={gtdt_chiet_giam} onChange={setGtdt_chiet_giam} isNumber childrenIPNumber={"(VNĐ)"} />
                        <FormField style={{ width: "39%" }} label="Giá trị sau chiết giảm" isDisabled id="gtdt_sau_chiet_giam" value={gtdt_sau_chiet_giam} onChange={setGtdt_sau_chiet_giam} isNumber childrenIPNumber={"(VNĐ)"} />
                    </div>
                    <div className="flex w-full justify-content-between">
                        <FormField style={{ width: "20%" }} label="Phần trăm thuế" id="phan_tram_thue" value={phan_tram_thue} onChange={setPhan_tram_thue} isNumber suffix="%" childrenIPNumber={"(%)"} />
                        <FormField style={{ width: "38%" }} label="Thuế" id="gtdt_thue" value={gtdt_thue} onChange={setGtdt_thue} isNumber childrenIPNumber={"(VNĐ)"} />
                        <FormField style={{ width: "39%" }} label="Giá trị sau thuế" isDisabled id="gtdt_sau_thue" value={gtdt_sau_thue} onChange={setGtdt_sau_thue} isNumber childrenIPNumber={"(VNĐ)"} />
                    </div>
                </div>
        },
    ];





    const findMatchingFields = (fields, fieldByYCTN) => {
        // Lấy danh sách ma_truong_yctn từ fieldByYCTN      
        return fieldByYCTN.map(item => fields.find(field => field.id === item.ma_truong_yctn + ""));
    }


    const renderElementField = () => {
        let res = fieldInput.map(f => {
            let res = fieldCurrent.find(i => i?.ma_code === f.key)
            if (res) {
                return f.element
            }
            return null
        })
        setElementField(res);


    }
    return (

        <div className="">
            {ElementField.length > 0 && ElementField.map(e => e)}

            <div className="flex w-full justify-content-between">
                <div className="p-inputgroup" style={{ width: "20%" }}>
                    <InputNumber id="phan_tram_thue" name="phan_tram_thue" value={phan_tram_thue} onChange={(e) => setPhan_tram_thue(e.value)} className="w-full" />
                    <span className="p-inputgroup-addon" style={{ backgroundColor: "#6366F1", color: "white" }}>%</span>
                </div>
                <div className="p-inputgroup" style={{ width: "38%" }}>
                    <InputNumber id="gtdt_thue" name="gtdt_thue" value={phan_tram_thue} onChange={(e) => setGtdt_thue(e.value)} className="w-full" />
                    <span className="p-inputgroup-addon" style={{ backgroundColor: "#6366F1", color: "white" }}>VNĐ</span>
                </div>
                <div className="p-inputgroup" style={{ width: "39%" }}>
                    <InputNumber id="gtdt_sau_thue" name="gtdt_sau_thue" value={gtdt_sau_thue} onChange={(e) => setGtdt_sau_thue(e.value)} className="w-full" />
                    <span className="p-inputgroup-addon" style={{ backgroundColor: "#6366F1", color: "white" }}>VNĐ</span>
                </div>
            </div>
            <div className="flex w-full justify-content-between">
                <div className="p-inputgroup" style={{ width: "20%" }}>
                    <InputNumber id="phan_tram_chiet_giam" name="phan_tram_chiet_giam" value={phan_tram_chiet_giam} onChange={(e) => setPhan_tram_chiet_giam(e.value)} className="w-full" />
                    <span className="p-inputgroup-addon" style={{ backgroundColor: "#6366F1", color: "white" }}>%</span>
                </div>
                <div className="p-inputgroup" style={{ width: "38%" }}>
                    <InputNumber id="gtdt_chiet_giam" name="gtdt_chiet_giam" value={gtdt_chiet_giam} onChange={(e) => setGtdt_chiet_giam(e.value)} className="w-full" />
                    <span className="p-inputgroup-addon" style={{ backgroundColor: "#6366F1", color: "white" }}>VNĐ</span>
                </div>
                <div className="p-inputgroup" style={{ width: "39%" }}>
                    <InputNumber id="gtdt_sau_chiet_giam" name="gtdt_sau_chiet_giam" value={gtdt_sau_chiet_giam} onChange={(e) => setGtdt_sau_chiet_giam(e.value)} className="w-full" />
                    <span className="p-inputgroup-addon" style={{ backgroundColor: "#6366F1", color: "white" }}>VNĐ</span>
                </div>
            </div>

            <label className='font-bold text-sm my-3 block' htmlFor="file_upload">Upload file</label>
            <InputFile nameField="file_upload" setFormData={setFormData} />
        </div>

    );
};

export default memo(FieldAddYCTN);