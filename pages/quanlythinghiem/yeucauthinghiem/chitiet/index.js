import React, { useState, useEffect, useCallback, useRef } from "react";
import { Toast } from "primereact/toast";
import FillThongTinYCTN from "../../../../utils/Components/FilterYCTN/FillThongTinYCTN";
import useThongTinYCTN from "../../../../hooks/useThongTinYCTN";
import FieldKhaoSatPA from "../../../../utils/Components/ListFieldYCTN/FieldKhaoSatPA";
import ThongTinYCTN from "../../../../utils/Components/ListFieldYCTN/ThongTinYCTN";
import FieldGiaoNV from "../../../../utils/Components/ListFieldYCTN/FieldGiaoNV";
import DanhSachThietBi from "../../../../utils/Components/ThiNghiem/DanhSachThietBi";
import FieldBanGiaKQ from "../../thuchienthinghiem/bangiaoketqua/FieldBanGiaKQ";
import { CustomPanel } from "../../../../utils/Components/CustomPanel";

const ChiTiet_YCTN = () => {
  const { ma_yctn, thongTinYCTN } = useThongTinYCTN(); 
  
  const [formData, setFormData] = useState({});

  const toast = useRef(null);

  // console.log("before formData", formData);

  useEffect(() => {
    if (thongTinYCTN) {
      setFormData(thongTinYCTN);
    }
  }, [thongTinYCTN]); 

  const handleChange = useCallback((field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  }, []);

  console.log(">>>> FORM:", formData);

  return (
    <div className="border-round-3xl bg-white p-3">
      <Toast ref={toast} />

      <FillThongTinYCTN
        Element={
          thongTinYCTN ? (
            <ThongTinYCTN
              loai_yctn={thongTinYCTN.loai_yctn_model}
              formData={thongTinYCTN}
            >
              <br className="mt-2"></br>

              <CustomPanel
                stepPanel={2}
                header="Giao nhiệm vụ"
                fields={[
                  "file_dinh_kem_giao_nv",
                  "don_vi_thuc_hien",
                  "nguoi_giao_nhiem_vu",
                  "ngay_giao_nv",
                ]}
                toggleable
                formData={formData}
              >
                <FieldGiaoNV
                  formData={formData}
                  setFormData={setFormData}
                />
              </CustomPanel>

              <CustomPanel 
                stepPanel={4}

                  header="Khảo sát lập phương án thi công" 
                  toggleable
                  fields={[
                    "file_pa_thi_cong",
                    "nguoi_th_ks_lap_pa_thi_cong",
                    "ngay_ks_lap_pa_thi_cong"
                  ]}
                  formData={formData}
              >
                <FieldKhaoSatPA
                  formData={formData}
                  setFormData={setFormData}
                />
              </CustomPanel>

              <CustomPanel 
                stepPanel={5}
                formData={formData}
                header="Thực hiện thí nghiệm " toggleable
                currentStep={formData.crr_step}
                >
                <DanhSachThietBi
                  thongtinYCTN={formData}
                  ma_yctn={ma_yctn}
                />
              </CustomPanel>

              <CustomPanel 
                stepPanel={6}

                  header="Bàn Giao Kết Quả" 
                  toggleable
                  fields={[
                    "nguoi_ban_giao",
                    "ngay_ban_giao",
                    "ghi_chu_ban_giao"
                  ]}
                  formData={formData}
              >
                <FieldBanGiaKQ
                  formData={formData}
                  setFormData={setFormData}
                />
              </CustomPanel>
            </ThongTinYCTN>
          ) : (
            <></> 
          )
        }
      />
    </div>
  );
};

export default ChiTiet_YCTN;
