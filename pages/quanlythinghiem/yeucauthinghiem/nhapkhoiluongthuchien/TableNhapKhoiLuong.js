import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import {
  headerStyleColumn,
  propSortAndFilter,
} from "../../../../constants/propGlobal";
import { Button } from "primereact/button";

const TableNhapKhoiLuong = ({
    arrThietbi,
  globalFilter,
  setShowDialog,
  setIsAdd,
  setFormData,
  setArrThietbi
}) => {
  return (
    <>
      <DataTable
        value={arrThietbi}
        globalFilter={globalFilter}
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
          header="Tên loại thiết bị"
          // {...propSortAndFilter}
          headerStyle={headerStyleColumn}
        />
        <Column
          field="ten_thiet_bi"
          header="Tên thiết bị"
          {...propSortAndFilter}
          headerStyle={headerStyleColumn}
        />
        <Column
          field="so_luong"
          header="Số lượng"
          headerStyle={headerStyleColumn}
        />
        <Column
          header="Thao tác"
          headerStyle={headerStyleColumn}
          style={{ width: "7rem" }}
          bodyStyle={{ display: "flex", justifyContent: "center" }}
          body={(rowData) => (
            <div className="flex gap-2">
              <Button
                icon="pi pi-pencil"
                tooltip="Sửa"
                onClick={() => {
                  console.log("rowData",rowData)
                  setShowDialog(true)
                  setIsAdd(false)
                  setFormData(rowData);
                }}
                style={{ backgroundColor: "#1445a7", color: "#fff" }}
              />
              <Button
                icon="pi pi-trash"
                tooltip="Xóa"
                onClick={() => {
                    setArrThietbi(prev => prev.filter(item => item !== rowData));
                }}
                style={{ backgroundColor: "#1445a7", color: "#fff" }}
              />
            </div>
          )}
        />
      </DataTable>
    </>
  );
};

export default TableNhapKhoiLuong;
