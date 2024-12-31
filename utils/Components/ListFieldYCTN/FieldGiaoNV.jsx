import { memo, useEffect, useState } from "react";
import { FormField } from "./FieldAddYCTN";
import InputFile from "../InputFile";
import { get_All_DM_DONVI } from "../../../services/quantrihethong/DM_DONVIService";
import { MultiSelect } from "primereact/multiselect";
import { urlServer } from "../../../constants/api";
import { convertToDate, formatDateForField, formatDateTime } from "../../FunctionFormart";

const FieldGiaoNV = ({ formData, setFormData }) => {
    const [donVi, setDonVi] = useState([]);
    const [listFileUpload, setListFileUpload] = useState([]);
    const [showFiles, setShowFiles] = useState(false);

    useEffect(() => {
        getDonVi();
    }, []);

    const getDonVi = async () => {
        const res = await get_All_DM_DONVI();
        setDonVi(res);
    }


    useEffect(() => {
        if (formData.file_dinh_kem_giao_nv && formData.crr_step===2) {
            let file = urlServer + formData.file_dinh_kem_giao_nv;
            let fileName = formData.file_dinh_kem_giao_nv.split('/').pop(); // Lấy phần tử cuối cùng sau dấu /
            setListFileUpload([{file, name: fileName}]);
        }
    }, [formData.file_dinh_kem_giao_nv, formData.crr_step]);


    //console.log('da chuyen doi', formatDateTime(formData?.ngay_giao_nv));
    console.log('days: ', convertToDate(formData?.ngay_giao_nv));
    
    return (
        <div>
            <div className="flex gap-4">
                <div style={{ width: "49%" }}>
                    <label className='font-bold text-sm my-3 block' htmlFor="file_dinh_kem_giao_nv">
                        <span className="flex justify-content-between">
                            <span>File quyết định</span>
                        </span>
                    </label>
                    <InputFile nameField="file_dinh_kem_giao_nv" setFormData={setFormData} />

                    {formData.file_dinh_kem_giao_nv && formData.crr_step===2 &&
                        <span 
                            className="flex justify-content-end mr-2 text-indigo-600 text-sm font-medium-100 ml-2 cursor-pointer"
                            onClick={() => setShowFiles(!showFiles)}
                        >
                            Danh sách file Upload
                        </span>
                    }
                </div>

                <div style={{ width: "49%" }}>
                    <FormField
                        label="Người giao nhiệm vụ"
                        id="nguoi_giao_nhiem_vu"
                        value={formData?.nguoi_giao_nhiem_vu || ""}
                        onChange={(id, value) => setFormData(prev => ({ ...prev, [id]: value }))}
                    />
                </div>
            </div>
            {/* Hiển thị danh sách các file đã upload */}
            <div className={`mt-2 transition-all duration-300 ${showFiles ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                {listFileUpload.length > 0 && listFileUpload.map((file, index) => (
                    <div 
                        key={index} 
                        title={file.name} 
                        className="flex align-items-center gap-2 mb-1 border-1 border-indigo-600 border-round p-2 overflow-hidden pr-5 transform transition-transform duration-300 hover:scale-[1.02]" 
                        style={{width: "49%"}}
                    >
                        <i className="pi pi-file text-indigo-600" />
                        <a 
                            href={file.file}
                            target="_blank"
                            rel="noopener noreferrer" 
                            className="text-indigo-600 hover:text-indigo-800"
                        >
                        {file.name}
                        </a>
                    </div>
                ))}
            </div>
            <div className="flex gap-4">
                <div style={{ width: "49%" }}>
                    <FormField
                        label="Ngày giao nhiệm vụ"
                        id="ngay_giao_nv"
                        value={convertToDate(formData?.ngay_giao_nv)}
                        onChange={(id, value) => setFormData(prev => ({ ...prev, [id]: value }))}
                        isCalendar
                    />
                </div>
                <div style={{ width: "49%" }}>
                    <label className='font-medium text-sm my-3 block'>Đơn vị thực hiện</label>
                    <MultiSelect
                        value={formData?.don_vi_thuc_hien || []}
                        onChange={(e) => setFormData(prev => ({ ...prev, don_vi_thuc_hien: e.value }))}
                        options={donVi}
                        optionLabel="ten"
                        optionValue="id"
                        placeholder="Chọn đơn vị thực hiện"
                        filter
                        className="w-full"
                    />
                </div>

            </div>

        </div>
    );
};

export default memo(FieldGiaoNV);