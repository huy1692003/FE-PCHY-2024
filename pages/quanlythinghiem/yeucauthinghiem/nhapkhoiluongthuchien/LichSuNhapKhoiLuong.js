import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import {
  headerStyleColumn,
  propSortAndFilter,
} from "../../../../constants/propGlobal";
import { useRouter } from "next/router";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import { QLTN_THIET_BI_YCTN_Service } from "../../../../services/quanlythinghiem/QLTN_THIET_BI_YCTN_Service";
const LichSuNhapKhoiLuong = ({ nextStep,thongTinYCTN }) => {
  const [arrThietbiBD, setArrThietbiBD] = useState([]);
  const router = useRouter();
  
  const loadData = async () => {
    try {
      const items =
        await QLTN_THIET_BI_YCTN_Service.getAll_QLTN_THIET_BI_YCTN_byMA_YCTN({
          ma_yctn: thongTinYCTN?.ma_yctn,
        });
        console.log("test")
        console.log(items)
      // console.log("TBBD",items);
      setArrThietbiBD(items);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };
  useEffect(() => {
    loadData();
  }, [thongTinYCTN,nextStep]);
  return (
    <div>
      {Array.from(new Set(arrThietbiBD.map((device) => device.trang_thai))).sort((a, b) => a - b).map(
        (trangThai, index) => (
          <Panel
            header={`Thiết bị ${
              trangThai === 0 ? "ban đầu" : `nhập phát sinh lần ${trangThai}`
            }`}
          >
            <DataTable
              key={index}
              value={arrThietbiBD.filter((d) => d.trang_thai === trangThai)}
              emptyMessage="Không tìm thấy dữ liệu"
              showGridlines={true}
            >
              <Column
                field="stt"
                header="STT"
                headerStyle={headerStyleColumn}
                body={(data, options) => options.rowIndex + 1}
                style={{ width: "4rem" }}
              />

              <Column
                field="ten_loai_thiet_bi"
                header={`Thiết bị ${
                  trangThai === 0
                    ? "ban đầu"
                    : `nhập phát sinh lần ${trangThai}`
                }`}
                // {...propSortAndFilter}
                headerStyle={headerStyleColumn}
              />
              <Column
                field="ten_thiet_bi"
                header="Tên thiết bị"
                headerStyle={headerStyleColumn}
              />
              <Column
                field="ma_tbtn"
                header="Mã thiết bị"
                headerStyle={headerStyleColumn}
              />
              <Column
                field="ma_loai_tb"
                header="Mã loại thiết bị"
                headerStyle={headerStyleColumn}
              />
              <Column
                field="so_luong"
                header="Số lượng"
                headerStyle={headerStyleColumn}
              />
            </DataTable>
          </Panel>
        )
      )}
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
            label="Nhập khối lượng phát sinh"
            style={{ backgroundColor: "#1445a7" }}
            onClick={() => {
              router.push(`/quanlythinghiem/yeucauthinghiem/nhapkhoiluongphatsinh?code=${thongTinYCTN?.ma_yctn}`);
            }}
          />
          
          <Button
            label="Bước tiếp theo: Khảo sát phương án thi công"
            style={{ backgroundColor: "#1445a7" }}
            onClick={() => {
              router.push(`/quanlythinghiem/yeucauthinghiem/khaosatphuongan?code=${thongTinYCTN?.ma_yctn}`);
            }}
          />
        </div>
    </div>
  );
};

export default LichSuNhapKhoiLuong;
