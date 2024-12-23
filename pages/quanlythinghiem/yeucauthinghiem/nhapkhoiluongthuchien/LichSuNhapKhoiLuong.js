import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import {
  headerStyleColumn,
  propSortAndFilter,
} from "../../../../constants/propGlobal";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import { QLTN_THIET_BI_YCTN_Service } from "../../../../services/quanlythinghiem/QLTN_THIET_BI_YCTN_Service";
const LichSuNhapKhoiLuong = ({ nextStep,MA_YCTN }) => {
  const [arrThietbiBD, setArrThietbiBD] = useState([]);

  const loadData = async () => {
    try {
      const items =
        await QLTN_THIET_BI_YCTN_Service.getAll_QLTN_THIET_BI_YCTN_byMA_YCTN({
          ma_yctn: MA_YCTN,
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
    // console.log("MA_YCTN",MA_YCTN)
  }, [MA_YCTN,nextStep]);
  const headerList = (options) => {
    const className = `${options.className} flex flex-wrap justify-content-between align-items-center`;

    return (
      <>
        <div className={className + " mt-4"}>
          <span className="font-bold text-base">
            Danh sách thiết bị ban đầu
          </span>
          <div className="flex flex-wrap gap-2"></div>
        </div>
      </>
    );
  };
  return (
    <div>
      <Panel headerTemplate={headerList}>
        <DataTable
          value={arrThietbiBD}
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
            header="Loại thiết bị"
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
      <div className="flex justify-content-end gap-2 mt-3">
          <Button
              label="Hủy"
              severity="secondary"
              outlined
            
            />
          <Button
            label="Nhập khối lượng phát sinh"
            style={{ backgroundColor: "#1445a7" }}
           
          />
          
          <Button
            label="Bước tiếp theo:"
            style={{ backgroundColor: "#1445a7" }}
           
          />
        </div>
    </div>
  );
};

export default LichSuNhapKhoiLuong;
