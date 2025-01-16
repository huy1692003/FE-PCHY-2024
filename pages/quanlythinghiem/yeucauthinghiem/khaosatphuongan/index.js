import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import Head from "next/head";
import FillThongTinYCTN from "../../../../utils/Components/FilterYCTN/FillThongTinYCTN";
import useThongTinYCTN from "../../../../hooks/useThongTinYCTN";
import UploadFileService from "../../../../services/UploadFileService"; // Import API upload
import QLTN_YCTNService from "../../../../services/quanlythinghiem/QLTN_YCTNService";
import FieldKhaoSatPA from "../../../../utils/Components/ListFieldYCTN/FieldKhaoSatPA";
import ThongTinYCTN from "../../../../utils/Components/ListFieldYCTN/ThongTinYCTN";
import { MyContext } from "../../../../context/dataContext";
import { getMenuCurrent } from "../../../../utils/Function";

const KhaoSatPhuongAn = () => {
  const { ma_yctn, thongTinYCTN } = useThongTinYCTN();
  const [isSaved, setIsSaved] = useState(false);
  //console.log(thongTinYCTN);
  const router = useRouter();
  const user = JSON.parse(sessionStorage.getItem("user"))?.ten_dang_nhap || "";
  const { data } = useContext(MyContext)
  const [formData, setFormData] = useState({
    file_pa_thi_cong: null,
    nguoi_th_ks_lap_pa_thi_cong: null,
    ngay_ks_lap_pa_thi_cong: null,
  });
  // const [crrStep, setCrrStep] = useState(thongTinYCTN?.crr_step || 3);

  const toast = useRef(null);


  //console.log("before formData", formData);


  useEffect(() => {
    thongTinYCTN &&
      setFormData({
        ...thongTinYCTN,
        file_pa_thi_cong: thongTinYCTN?.file_pa_thi_cong || null,
        nguoi_th_ks_lap_pa_thi_cong:
          thongTinYCTN?.nguoi_th_ks_lap_pa_thi_cong || user,
        ngay_ks_lap_pa_thi_cong: thongTinYCTN?.ngay_ks_lap_pa_thi_cong || null,
      });
  }, [thongTinYCTN]);

  const handleSave = async () => {
    try {
      setIsSaved(false);
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
      // setFormData((prevState) => ({
      //   ...prevState,
      //   crr_step: 4,
      // }));

      setIsSaved(true);
      // setCrrStep(4);

    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
    }
  };

  useEffect(() => {
    if (isSaved) {
      setFormData((prev) => ({
        ...prev,
        crr_step: 4,
      }));
    }
  }, [isSaved]);

  

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
        <title>{getMenuCurrent()}</title>
      </Head>
      <Panel
        header={
          <h3 className="text-xl font-bold">{getMenuCurrent()}</h3>
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
                <Panel header={<p className="text-base font-bold">{getMenuCurrent()}</p>}>
                  <FieldKhaoSatPA
                    formData={formData}
                    setFormData={setFormData}
                    handleChange={handleChange}
                  />
                </Panel>
                <div className="flex justify-content-end mt-6">
                  <Button
                    label={formData?.crr_step < 4 ? "Lưu" : "Cập nhật"}
                    icon="pi pi-save"
                    onClick={handleSave}
                  />
                  {formData && (
                    <div>
                      {formData?.crr_step === 4 && (
                        <Button
                          label={"Bước tiếp theo   " + data.listBuocYCTN?.find(s => s.buoc === 5)?.ten_buoc_yctn}
                          icon="pi pi-arrow-right"
                          className="ml-2"
                          onClick={() => {
                            router.push(
                              `/quanlythinghiem/thuchienthinghiem/thinghiem/list?code=${ma_yctn}`
                            );
                          }}
                        />
                      )}


                    </div>
                  )}
                </div>
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

export default KhaoSatPhuongAn;

