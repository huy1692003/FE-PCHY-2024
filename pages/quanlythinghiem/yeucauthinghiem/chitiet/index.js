import React, { useState, useEffect, useCallback, useRef } from "react";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import Head from "next/head";
import FillThongTinYCTN from "../../../../utils/Components/FilterYCTN/FillThongTinYCTN";
import useThongTinYCTN from "../../../../hooks/useThongTinYCTN";
import UploadFileService from "../../../../services/UploadFileService"; // Import API upload
import QLTN_YCTNService from "../../../../services/quanlythinghiem/QLTN_YCTNService";
import FieldKhaoSatPA from "../../../../utils/Components/ListFieldYCTN/FieldKhaoSatPA";
import ThongTinYCTN from "../../../../utils/Components/ListFieldYCTN/ThongTinYCTN";

const ChiTiet_YCTN = () => {
  const { ma_yctn, thongTinYCTN } = useThongTinYCTN();

  const [formData, setFormData] = useState({
    file_pa_thi_cong: null,
    nguoi_th_ks_lap_pa_thi_cong: null,
    ngay_ks_lap_pa_thi_cong: null,
  });
  const toast = useRef(null);


  //console.log("before formData", formData);


  useEffect(() => {
    thongTinYCTN &&
      setFormData({
        ...thongTinYCTN,
        file_pa_thi_cong: thongTinYCTN?.file_pa_thi_cong || null,
        nguoi_th_ks_lap_pa_thi_cong:
          thongTinYCTN?.nguoi_th_ks_lap_pa_thi_cong || null,
        ngay_ks_lap_pa_thi_cong: thongTinYCTN?.ngay_ks_lap_pa_thi_cong || null,
      });
  }, [thongTinYCTN]);

  const handleSave = async () => {
    try {
      let filePath = formData.file_pa_thi_cong;
      if (filePath && filePath instanceof File) {
        const fileData = new FormData();
        fileData.append("file", filePath);
        const response = await UploadFileService.file(fileData);
        filePath = response.filePath;

        setFormData((prevState) => ({
          ...prevState,
          file_pa_thi_cong: filePath,
        }));
      }

      await QLTN_YCTNService.khao_sat_phuong_an_YCTN({
        ma_yctn,
        file_pa_thi_cong: filePath,
        nguoi_th_ks_lap_pa_thi_cong: formData.nguoi_th_ks_lap_pa_thi_cong,
        ngay_ks_lap_pa_thi_cong: formData.ngay_ks_lap_pa_thi_cong,
      });

      toast.current.show({ severity: "success", summary: "Lưu thành công" });
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
    }
  };

  const handleChange = useCallback((field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  }, []);

  //console.log(">>>> FILE PATH:", formData.file_pa_thi_cong);

  return (
    <div className="border-round-3xl bg-white p-3">
      <Toast ref={toast} />
      <Head>
        <title>Khảo sát lập phương án thi công</title>
      </Head>
      <Panel
        header={
          <h3 className="text-xl font-bold">Khảo sát lập phương án thi công</h3>
        }
        className="mt-3"
      >
        <FillThongTinYCTN
          Element={
            thongTinYCTN ? (
              <ThongTinYCTN
                loai_yctn={thongTinYCTN.loai_yctn_model}
                formData={thongTinYCTN}
              >
                <br className="mt-2"></br>
                <Panel header={<p className="text-2xl font-bold">Lập phương án thi công</p>}>
                  

                  <Panel header="Tiêu đề" toggleable>
                    <FieldKhaoSatPA
                      formData={formData}
                      setFormData={setFormData}
                      handleChange={handleChange}
                    />
                  </Panel>

                </Panel>
              </ThongTinYCTN>
            ) : (
              <></>
            )
          }
        />
      </Panel>
    </div>
  );
};

export default ChiTiet_YCTN;


