import React, { memo, useEffect , useState} from "react";
import { urlServer } from "../../../constants/api";
import InputFile from "../InputFile";
import { FormField } from "./ThongTinYCTN";
import { HT_NGUOIDUNG_Service } from "../../../services/quantrihethong/HT_NGUOIDUNGService.js"




const FieldKhaoSatPA = ({
  formData,
  setFormData,
  handleChange,
}) => {

    const [dm_KH, setDM_KH] = useState([]);
    const [showFiles, setShowFiles] = useState(false);
    const [listFileUpload, setListFileUpload] = useState([]);



    useEffect(() => {
      if (formData.file_pa_thi_cong && formData.crr_step === 4) {
        let file = urlServer + formData.file_pa_thi_cong;
        let fileName = formData.file_pa_thi_cong.split("/").pop();
        setListFileUpload([{ file, name: fileName }]);
      }
    }, [formData.file_pa_thi_cong, formData.crr_step]);


    //console.log('listFileUpload', listFileUpload);

    const isFormDisabled =  
    formData.file_pa_thi_cong &&
    formData.nguoi_th_ks_lap_pa_thi_cong &&
    formData.ngay_ks_lap_pa_thi_cong;


    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await HT_NGUOIDUNG_Service.getAll()
          setDM_KH(res.data || []);
        } catch (err) {
          console.error("Lỗi khi tải dữ liệu người dùng:", err);
        }
      };
      fetchData();
    }, []);


    console.log('dm_KH',dm_KH);

  return (
    <div>
      <InputFile
        isDisabled={isFormDisabled}
        nameField="file_upload"
        setFormData={setFormData}
        onChange={(formData) => {
          if (formData) {
            const file = formData.get("file");
            file
              ? handleChange("file_pa_thi_cong", file)
              : console.log("Không có file.");
          } else {
            console.log("formData không hợp lệ.");
          }
        }}
      />

      {formData.file_pa_thi_cong && formData.crr_step === 4 && (
        <span
          className="flex justify-content-end mr-2 text-indigo-600 text-sm font-medium-100 ml-2 cursor-pointer"
          onClick={() => setShowFiles(!showFiles)}
        >
          Danh sách file Upload
        </span>
      )}

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

      <FormField
        label="Người khảo sát"
        id="nguoi_th_ks_lap_pa_thi_cong"
        isDropdown
        isDisabled={isFormDisabled}
        options={dm_KH}
        optionsValue="id"
        optionsLabel="hO_TEN"
        value={formData.nguoi_th_ks_lap_pa_thi_cong}
        onChange={(e) => handleChange("nguoi_th_ks_lap_pa_thi_cong", e.value)}
      />

      <FormField
        label="Ngày khảo sát"
        isDisabled={isFormDisabled}
        id="ngay_ks_lap_pa_thi_cong"
        isCalendar
        value={formData.ngay_ks_lap_pa_thi_cong}
        onChange={(e) => handleChange("ngay_ks_lap_pa_thi_cong", e.value)}
      />
    </div>
  );
};

export default memo(FieldKhaoSatPA);
