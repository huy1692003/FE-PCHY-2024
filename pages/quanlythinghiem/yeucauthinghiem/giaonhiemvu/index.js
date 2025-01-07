import { memo, useContext, useEffect, useRef, useState } from "react";
import { Panel } from "primereact/panel";
import Head from "next/head";
import FillThongTinYCTN from "../../../../utils/Components/FilterYCTN/FillThongTinYCTN";
import QLTN_YCTNService from "../../../../services/quanlythinghiem/QLTN_YCTNService";
import { useRouter } from "next/router";
import ThongTinYCTN from "../../../../utils/Components/ListFieldYCTN/ThongTinYCTN";
import useThongTinYCTN from "../../../../hooks/useThongTinYCTN";
import FieldGiaoNV from "../../../../utils/Components/ListFieldYCTN/FieldGiaoNV";
import QLTN_YCTN from "../../../../models/QLTN_YCTN";
import { Button } from "primereact/button";
import UploadFileService from "../../../../services/UploadFileService";
import { Toast } from "primereact/toast";
import { Notification } from "../../../../utils/notification";
import { MyContext } from "../../../../context/dataContext";
const GiaoNhiemVu = () => {
  const { ma_yctn, thongTinYCTN } = useThongTinYCTN();
  const [formData, setFormData] = useState(QLTN_YCTN);
  const user = JSON.parse(sessionStorage.getItem("user"))?.ten_dang_nhap || "";
  const toast = useRef(null);
  const router = useRouter();

  const { data } = useContext(MyContext);
  useEffect(() => {
    if (thongTinYCTN) {
      setFormData({
        ...thongTinYCTN,
        nguoi_giao_nhiem_vu: formData?.nguoi_giao_nhiem_vu || user,
        ngay_giao_nv: new Date(),
      });
    }
  }, [thongTinYCTN]);

  console.log("giao nhiem vu:", formData);

  const onSubmit = async () => {
    try {
      if (formData.file_dinh_kem_giao_nv) {
        let resUpload = await UploadFileService.file(
          formData.file_dinh_kem_giao_nv,
          "fileGiaoNV"
        );
        formData.file_dinh_kem_giao_nv = resUpload.filePath;
      }
      console.log(formData);
      await QLTN_YCTNService.giao_nhiem_vu_YCTN(formData);
      Notification.success(toast, "Giao nhiệm vụ thành công");

      // router.back();
    } catch (err) {
      console.log(err);
      Notification.error(toast, "Giao nhiệm vụ thất bại");
    }
  };
  console.log(thongTinYCTN);
  return (
    <div className="border-round-3xl bg-white p-3">
      <Head>
        <title>Giao nhiệm vụ thí nghiệm</title>
      </Head>
      <Toast ref={toast} />
      <Panel
        header={<h3 className="text-xl font-bold">Giao nhiệm vụ thí nghiệm</h3>}
        className="mt-3"
      >
        <FillThongTinYCTN
          Element={
            thongTinYCTN ? (
              <ThongTinYCTN
                loai_yctn={thongTinYCTN.loai_yctn_model}
                formData={thongTinYCTN}
              />
            ) : (
              <></>
            )
          }
        />
        {thongTinYCTN && (
          <Panel
            header={
              <h3 className="text-base font-bold">Thông tin giao nhiệm vụ</h3>
            }
          >
            <FieldGiaoNV formData={formData} setFormData={setFormData} />
          </Panel>
        )}

        <div className="flex justify-content-end mt-6">
          {thongTinYCTN && (
            <div>
              {thongTinYCTN?.crr_step === 2 ? (
                <Button
                  onClick={() => {
                    router.push(
                      "/quanlythinghiem/yeucauthinghiem/nhapkhoiluongthuchien?code=" +
                        formData?.ma_yctn
                    );
                  }}
                  label={
                    "Bước tiếp theo   " +
                    data.listBuocYCTN?.find((s) => s.buoc === 3)?.ten_buoc_yctn
                  }
                  icon="pi pi-arrow-right"
                />
              ) : (
                <Button label="Lưu" icon="pi pi-save" onClick={onSubmit} />
              )}
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
};

export default memo(GiaoNhiemVu);
