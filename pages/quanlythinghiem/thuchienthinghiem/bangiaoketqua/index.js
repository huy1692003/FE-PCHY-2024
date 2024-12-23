import Head from "next/head";
import { Panel } from "primereact/panel";
import FillThongTinYCTN from "../../../../utils/Components/FilterYCTN/FillThongTinYCTN";
import useThongTinYCTN from "../../../../hooks/useThongTinYCTN";
import ThongTinYCTN from "../../../../utils/Components/ListFieldYCTN/ThongTinYCTN";
import FieldBanGiaKQ from "./FieldBanGiaKQ";
import { Button } from "primereact/button";
import { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import QLTN_YCTN from "../../../../models/QLTN_YCTN";
import QLTN_YCTNService from "../../../../services/quanlythinghiem/QLTN_YCTNService";
import { Notification } from "../../../../utils/notification";

const BanGiaoKetQua = () => {
  const { ma_yctn, thongTinYCTN } = useThongTinYCTN();
  const [formData, setFormData] = useState(QLTN_YCTN);
  const toast = useRef(null);
  const onSubmit = async () => {
    const updatedFormData = {
      don_vi_nhan_ban_giao: formData.don_vi_thuc_hien || "Giá trị mặc định", // Gán giá trị mặc định nếu don_vi_thuc_hien là null
      ma_yctn: ma_yctn, // Gắn giá trị ma_yctn
      nguoi_ban_giao: formData.nguoi_ban_giao, // Gắn giá trị nguoi_ban_giao
      ngay_ban_giao: formData.ngay_ban_giao, // Gắn giá trị ngay_ban_giao
      ghi_chu_ban_giao: formData.ghi_chu_ban_giao, // Gắn giá trị ghi_chu_ban_giao
    };
    console.log("formData", updatedFormData); // In ra formData đã cập nhật
    try {
      await QLTN_YCTNService.ban_giao_ket_qua_YCTN(updatedFormData);
      Notification.success(toast, "Bàn giao thành công");
    } catch (error) {
      Notification.error(toast, "Bàn giao thất bại");
    }
  };
  return (
    <>
      <Toast ref={toast} />
      <Head>
        <title>Bàn giao kết quả</title>
      </Head>
      <Panel header={<h3 className="text-xl font-bold">Bàn giao kết quả</h3>}>
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
              <h3 className="text-base font-bold">
                Thông tin bàn giao kết quả
              </h3>
            }
          >
            <FieldBanGiaKQ
              thongTinYCTN={thongTinYCTN}
              formData={formData}
              setFormData={setFormData}
            />

            <div className="flex justify-content-end mt-6">
              <Button label="Lưu" onClick={onSubmit} />
            </div>
          </Panel>
        )}
      </Panel>
    </>
  );
};

export default BanGiaoKetQua;
