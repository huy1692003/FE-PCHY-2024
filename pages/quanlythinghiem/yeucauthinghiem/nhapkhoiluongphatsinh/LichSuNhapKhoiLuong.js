import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import {
  headerStyleColumn,
  propSortAndFilter,
} from "../../../../constants/propGlobal";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
const LichSuNhapKhoiLuong = ({  arrThietbiBD}) => {
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
                header="Loại thiết bị"
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
    </div>
  );
};

export default LichSuNhapKhoiLuong;
