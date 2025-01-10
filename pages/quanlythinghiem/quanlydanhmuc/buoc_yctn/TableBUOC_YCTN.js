import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { headerStyleColumn, propSortAndFilter } from "../../../../constants/propGlobal";
import { useState } from "react";

const TableBUOC_YCTN = ({
  data,
  setShowDialog,
  setIsAdd,
  setFormData,
  selected,
  setSelected,
  setVisible,
  setItemToDelete,
}) => {
  // Thêm state để quản lý giá trị tìm kiếm
  const [globalFilter, setGlobalFilter] = useState("");
  // Thêm header của bảng
  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Tìm kiếm..."
          />
        </span>
      </div>
    );
  };
  return (
    <DataTable
      value={data}
      paginator
      rows={10}
      rowsPerPageOptions={[5, 10, 25, 50]}
      totalRecords={data.length}
      showGridlines
     
      globalFilter={globalFilter} // Thêm prop này// Tìm kiếm
      header={renderHeader()} // Thêm prop này
      selection={selected}
      onSelectionChange={(e) => setSelected(e.value)}
      selectionMode="multiple"
    >
      <Column
        selectionMode="multiple"
        headerStyle={headerStyleColumn}
        style={{ width: "3rem" }}
      />
      <Column
        headerStyle={headerStyleColumn}
        field="ten_buoc_yctn"
        header="Tên"
        {...propSortAndFilter}
      ></Column>
     
      <Column
        headerStyle={headerStyleColumn}
        field="buoc"
        header="Bước"
        {...propSortAndFilter}
      ></Column>
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
                setShowDialog(true);
                setIsAdd(false);
                setFormData(rowData);
              }}
              style={{ backgroundColor: "#1445a7", color: "#fff" }}
            />
            <Button
              icon="pi pi-trash"
              tooltip="Xóa"
              onClick={() => {
                setVisible(true);
                setItemToDelete(rowData);
              }}
              style={{ backgroundColor: "#1445a7", color: "#fff" }}
            />
          </div>
        )}
      />
    </DataTable>
  );
};

export default TableBUOC_YCTN;
