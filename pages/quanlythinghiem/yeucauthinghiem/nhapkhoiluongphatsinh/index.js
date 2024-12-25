import { Panel } from "primereact/panel";
import LichSuNhapKhoiLuong from "./LichSuNhapKhoiLuong";
import useThongTinYCTN from "../../../../hooks/useThongTinYCTN";
import TableNhapKhoiLuong from "./TableNhapKhoiLuong";
import { useEffect, useRef, useState } from "react";
import { QLTN_THIET_BI_YCTN } from "../../../../models/QLTN_THIET_BI_YCTN";
import { Button } from "primereact/button";
import ThongTinYCTN from "../../../../utils/Components/ListFieldYCTN/ThongTinYCTN";
import { QLTN_THIET_BI_YCTN_Service } from "../../../../services/quanlythinghiem/QLTN_THIET_BI_YCTN_Service";
import DialogForm from "./DialogForm";
import DialogForm_ImportFIle from "./DialogForm_ImportFIle";
import { Toast } from "primereact/toast";
import FillThongTinYCTN from "../../../../utils/Components/FilterYCTN/FillThongTinYCTN";
import { useRouter } from "next/router";

const NhapKhoiLuongPhatSinh = () => {
  const { ma_yctn, thongTinYCTN } = useThongTinYCTN();
  const router = useRouter();
  const isCurrent = 2;
  const [arrThietbi, setArrThietbi] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showDialogImportFile, setShowDialogImportFile] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const [formData, setFormData] = useState(QLTN_THIET_BI_YCTN);
  const toast = useRef(null);
  const user = JSON.parse(sessionStorage.getItem("user"))?.ten_dang_nhap || "";
  const [arrThietbiBD, setArrThietbiBD] = useState([]);

  const loadData = async () => {
    try {
      const items =
        await QLTN_THIET_BI_YCTN_Service.getAll_QLTN_THIET_BI_YCTN_byMA_YCTN({
          ma_yctn: thongTinYCTN?.ma_yctn,
        });
      
      console.log("test");
      console.log(items);
      // console.log("TBBD",items);
      setArrThietbiBD(items);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    loadData();
    console.log("thongTinYCTN", thongTinYCTN);
  }, [thongTinYCTN]);

  const LoatArrThietBi = async () => {
    setArrThietbi(arrThietbi);
  };

  const ThemMoiThietBi_YCTN = async () => {
    const mayctn = thongTinYCTN?.ma_yctn;    
    const thietBiData = arrThietbi.map((item, index) => {
      const maxMaTBTN = arrThietbiBD.reduce((max, current) => {
        const currentNumber = parseInt(current.ma_tbtn.split("-").pop());
        return Math.max(max, currentNumber);
      }, 0);
      const nextMaTBTN = `${mayctn}-${maxMaTBTN + 1 + index}`;
      const maxTrangThai = arrThietbiBD.reduce((max, current) => {
        return Math.max(max, current.trang_thai);
      }, 0);
      return {
        ma_tbtn: nextMaTBTN,
        ma_yctn: mayctn,
        ten_thiet_bi: item.ten_thiet_bi || "",
        ma_loai_tb: item.ma_loai_tb || "",
        so_luong: item.so_luong || 0,
        trang_thai: maxTrangThai + 1, // thiết bị mới thêm
        nguoi_tao: user,
        ten_loai_thiet_bi: item.ten_loai_thiet_bi || "",
      };
    });
    console.log("dsthietBiData trc lưu", thietBiData);
    try {
      if (thietBiData.length === 0) {
        toast.current.show({
          severity: "error",
          summary: "Lỗi",
          detail: "Không có thiết bị để thêm",
          life: 3000,
        });
        return;
      }
      const res = await QLTN_THIET_BI_YCTN_Service.Nhap_Khoi_Luong_Phat_Sinh(
        thietBiData
      );
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Thêm mới thiết bị thành công",
        life: 3000,
      });
      loadData();
      setArrThietbi([]);
    } catch (error) {
      console.error("Error creating thiet bi:", error);
    }
  };

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
  return (
    <div className="border-round-3xl bg-white p-4">
      <Panel header="Nhập khối lượng phát sinh" className="mt-3 text-xl">
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
          <Panel header="Lịch sử nhập khối lượng">
            <LichSuNhapKhoiLuong
              arrThietbiBD={arrThietbiBD}
            />
          </Panel>
        )}

        {/* Danh sach thiet bi */}
        {thongTinYCTN?.crr_step >= 3 && (
          <Panel headerTemplate={headerList}>
            <TableNhapKhoiLuong
              arrThietbi={arrThietbi}
              setArrThietbi={setArrThietbi}
              setShowDialog={setShowDialog}
              setIsAdd={setIsAdd}
              setFormData={setFormData}
            />
            {/* start_button lưu, hủy */}

            <div className="flex justify-content-end gap-2 mt-3">
              <Button
                label="Hủy"
                severity="secondary"
                outlined
                onClick={() => {
                  router.push(`/quanlythinghiem/yeucauthinghiem/danhsach`);
                }}
              />
              <Button
                label="Lưu"
                style={{ backgroundColor: "#1445a7" }}
                onClick={() => {
                  ThemMoiThietBi_YCTN();
                  //   setIsCurrent(3);
                }}
              />
            </div>
          </Panel>
        )}

        {thongTinYCTN?.crr_step < 3 && (
          <div className="flex justify-content-end gap-2 mt-3">
            <Button
              label="Nhập khối lượng thực hiện"
              style={{ backgroundColor: "#1445a7" }}
              onClick={() => {
                router.push(
                  `/quanlythinghiem/yeucauthinghiem/nhapkhoiluongthuchien?code=${thongTinYCTN?.ma_yctn}`
                );
              }}
            />
          </div>
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
        LoatArrThietBi={LoatArrThietBi}
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
export default NhapKhoiLuongPhatSinh;
