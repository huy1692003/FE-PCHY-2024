import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import TableNhapKhoiLuong from "./TableNhapKhoiLuong";
import { QLTN_THIET_BI_YCTN } from "../../../../models/QLTN_THIET_BI_YCTN";
import DialogForm from "./DialogForm";
import DialogForm_ImportFIle from "./DialogForm_ImportFIle";
import { useRouter } from "next/router";
import FillThongTinYCTN from "../../../../utils/Components/FilterYCTN/FillThongTinYCTN";
import ThongTinYCTN from "../../../../utils/Components/ListFieldYCTN/ThongTinYCTN";
import { QLTN_THIET_BI_YCTN_Service } from "../../../../services/quanlythinghiem/QLTN_THIET_BI_YCTN_Service";
import useThongTinYCTN from "../../../../hooks/useThongTinYCTN";
import LichSuNhapKhoiLuong from "./LichSuNhapKhoiLuong";

const NhapKhoiLuongThucHien = () => {
  const router = useRouter();
    const { ma_yctn, thongTinYCTN } = useThongTinYCTN();

  const [arrThietbi, setArrThietbi] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showDialogImportFile, setShowDialogImportFile] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const [formData, setFormData] = useState(QLTN_THIET_BI_YCTN);
  const toast = useRef(null);

  const user = JSON.parse(sessionStorage.getItem("user"))?.ten_dang_nhap || "";

  const [isCurrent, setIsCurrent] = useState(thongTinYCTN?.crr_step);

  useEffect(() => {
    setIsCurrent(thongTinYCTN?.crr_step);
  }, [thongTinYCTN]);

  const headerList = (options) => {
    const className = `${options.className} flex flex-wrap justify-content-between align-items-center`;

    return (
      <>
        <div className={className + " mt-4"}>
          <span className="font-bold text-xl">Danh sách thiết bị</span>

          <div className="flex flex-wrap gap-2">
            <Button
              label="Thêm mới"
              style={{ backgroundColor: "#1445a7" }}
              onClick={() => {
                //   setFormData(DM_LOAI_YCTN);
                setShowDialog(true);
                setIsAdd(true);
              }}
            />
            <Button
              label="Import file"
              style={{ backgroundColor: "#1445a7" }}
              onClick={() => {
                setShowDialogImportFile(true);
              }}
            />
          </div>
        </div>
      </>
    );
  };

  const ThemMoiThietBi_YCTN = async () => {
    const mayctn = thongTinYCTN?.ma_yctn;

    const thietBiData = arrThietbi.map((item) => ({
      //   id: item.id?.toString() || "",
      ma_tbtn: `${mayctn}-${item.id}`,
      ma_yctn: mayctn,
      ten_thiet_bi: item.ten_thiet_bi || "",
      ma_loai_tb: item.ma_loai_tb || "",
      so_luong: item.so_luong || 0,
      trang_thai: 0, // thiết bị mới thêm
      //   ngay_tao: new Date().toISOString(),
      nguoi_tao: user,
      ten_loai_thiet_bi: item.ten_loai_thiet_bi || "",
    }));
    console.log("dsthietBiData trc lưu", thietBiData);
    try {
      const res =
        await QLTN_THIET_BI_YCTN_Service.create_Multiple_QLTN_THIET_BI_YCTN(
          thietBiData
        );
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Thêm mới thiết bị thành công",
        life: 3000,
      });
      setIsCurrent(3);
      setArrThietbi([]);
    } catch (error) {
      
    }
  };

  return (
    <div className="border-round-3xl bg-white p-3">
      <Panel header= {<h3 className="text-xl font-bold">Nhập khối lượng thực hiện</h3>}className="mt-3">
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
        {thongTinYCTN  && (
          <Panel headerTemplate={headerList}>
            <TableNhapKhoiLuong
              arrThietbi={arrThietbi}
              setArrThietbi={setArrThietbi}
              setShowDialog={setShowDialog}
              setIsAdd={setIsAdd}
              setFormData={setFormData}
            />
            {/* start_button lưu, hủy */}
            {arrThietbi.length > 0 && (
              <div className="flex justify-content-end gap-2 mt-3">
                <Button
                  label="Hủy"
                  severity="secondary"
                  outlined
                  onClick={() => {
                    setArrThietbi([]);
                  }}
                />
                <Button
                  label="Lưu"
                  style={{ backgroundColor: "#1445a7" }}
                  onClick={() => {
                    ThemMoiThietBi_YCTN();
                  }}
                />

                <Button
                  label="Lưu và chuyển bước"
                  style={{ backgroundColor: "#1445a7" }}
                  onClick={() => {
                    ThemMoiThietBi_YCTN();
                    router.push(`/quanlythinghiem/yeucauthinghiem/khaosatphuongan?code=${thongTinYCTN?.ma_yctn}`);
                  }}
                />
              </div>
            )}
            {/* end_button lưu, hủy */}
          </Panel>
        )}

        {thongTinYCTN && isCurrent >= 3 && (
          <Panel header="Lịch sử nhập khối lượng">
            <LichSuNhapKhoiLuong
              nextStep={isCurrent}
              thongTinYCTN={thongTinYCTN}
            />
          </Panel>
        )}
      </Panel>

      <DialogForm
        show={showDialog}
        setShowDialog={setShowDialog}
        formData={formData}
        isAdd={isAdd}
        toast={toast}
        setFormData={setFormData}
        setArrThietbi={setArrThietbi}
        arrThietbi={arrThietbi}
      />
      <DialogForm_ImportFIle
        show={showDialogImportFile}
        setShowDialogImportFile={setShowDialogImportFile}
        setArrThietbi={setArrThietbi}
        arrThietbi={arrThietbi}
      />
      <Toast ref={toast} />
    </div>
  );
};

export default NhapKhoiLuongThucHien;
