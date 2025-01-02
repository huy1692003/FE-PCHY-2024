import Head from "next/head";
import { Panel } from "primereact/panel";
import FillThongTinYCTN from "../../../../utils/Components/FilterYCTN/FillThongTinYCTN";
import useThongTinYCTN from "../../../../hooks/useThongTinYCTN";
import ThongTinYCTN from "../../../../utils/Components/ListFieldYCTN/ThongTinYCTN";
import FieldBanGiaKQ from "./FieldBanGiaKQ";
import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import QLTN_YCTN from "../../../../models/QLTN_YCTN";
import QLTN_YCTNService from "../../../../services/quanlythinghiem/QLTN_YCTNService";
import { Notification } from "../../../../utils/notification";
import { convertTimezoneToVN } from "../../../../utils/FunctionFormart";

const BanGiaoKetQua = () => {
  const { ma_yctn, thongTinYCTN } = useThongTinYCTN();
  const [formData, setFormData] = useState(QLTN_YCTN);
  const [isBanGiao, setIsBanGiao] = useState(false);//kiểm tra đã bàn giao chưa
  const toast = useRef(null);

  useEffect(() => {
    setFormData({
      ...thongTinYCTN,
      don_vi_nhan_ban_giao: thongTinYCTN?.don_vi_nhan_ban_giao ?? thongTinYCTN?.don_vi_thuc_hien
    })
  }, [thongTinYCTN])


  const onSubmit = async () => {
    const updatedFormData = {
      don_vi_nhan_ban_giao: formData.don_vi_nhan_ban_giao || "Giá trị mặc định", // Gán giá trị mặc định nếu don_vi_thuc_hien là null
      ma_yctn: ma_yctn, // Gắn giá trị ma_yctn
      nguoi_ban_giao: formData.nguoi_ban_giao, // Gắn giá trị nguoi_ban_giao
      ngay_ban_giao: convertTimezoneToVN(formData.ngay_ban_giao), // Gắn giá trị ngay_ban_giao
      ghi_chu_ban_giao: formData.ghi_chu_ban_giao, // Gắn giá trị ghi_chu_ban_giao
    };
    try {
      await QLTN_YCTNService.ban_giao_ket_qua_YCTN(updatedFormData);
      Notification.success(toast, "Bàn giao thành công");
    } catch (error) {
      console.log(error);
      Notification.error(toast, "Bàn giao thất bại");
    }
  };

  //kiểm tra đã bàn giao chưa
  useEffect(() => {
    console.log("thongTinYCTN", thongTinYCTN);
    if (thongTinYCTN?.ngay_ban_giao && thongTinYCTN?.nguoi_ban_giao) {
      console.log("Ngày bàn giao và người bàn giao đã được nhập.");
      setIsBanGiao(true);
    } else {
      setIsBanGiao(false);
      // setFormData({
      //   ...formData,
      //   ngay_ban_giao: "ewfr",
      //   nguoi_ban_giao: thongTinYCTN?.nguoi_ban_giao,
      //   ghi_chu_ban_giao: thongTinYCTN?.ghi_chu_ban_giao
      // });
    }
  }, [thongTinYCTN]);

  return (
    <div className="border-round-3xl bg-white p-3">
      <Toast ref={toast} />
      <Head>
        <title>Bàn giao kết quả</title>
      </Head>
      <Panel className="mt-3" header={<h3 className="text-xl font-bold">Bàn giao kết quả</h3>}>
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
              {!(thongTinYCTN && thongTinYCTN.nguoi_ban_giao) && <Button label="Lưu" onClick={onSubmit} />}
            </div>
          </Panel>
        )}
      </Panel>
    </div>
  );
};

export default BanGiaoKetQua;
