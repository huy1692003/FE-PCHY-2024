import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import React, { useEffect, useState } from "react";
import {
  headerStyleColumn,
  propSortAndFilter,
} from "../../../../constants/propGlobal";
import useDebounce from "../../../../hooks/useDebounce";
import { ConfirmDialog } from "primereact/confirmdialog";
import { DM_LOAI_BIENBAN_Service } from "../../../../services/quanlythinghiem/DM_LOAI_BIENBAN_Service";

const TableDM_LOAI_BB = ({
  data,
  totalRecords,
  loading,
  loadData,
  toast,
  setFormData,
  setShowDialog,
  setIsAdd,
}) => {
  const [searchData, setSearchData] = useState("");
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10);
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const delayTyping = useDebounce(searchData, 600);

  useEffect(() => {
    loadData(delayTyping, page + 1, rows);
  }, [delayTyping, loadData, rows, page]);

  const onPageChange = (event) => {
    setPage(event.page);
    setRows(event.rows);
    loadData(delayTyping, event.page + 1, event.rows);
  };

  const handleDelete = async () => {
    try {
      await DM_LOAI_BIENBAN_Service.deleteDM_LOAI_BIENBAN(selectedId);
      toast.current.show({
        severity: "success",
        summary: "Xóa thành công",
      });
      loadData(delayTyping, page + 1, rows);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Có lỗi xảy ra",
        detail: "Không thể xóa dữ liệu",
      });
    }
  };

  return (
    <>
      <ConfirmDialog
        visible={visible}
        onHide={() => setVisible(false)}
        message="Bạn có chắc chắn muốn xóa mục này?"
        header="Xác nhận xóa"
        icon="pi pi-exclamation-triangle"
        acceptClassName="p-button-danger"
        accept={handleDelete}
        reject={() => setVisible(false)}
      />
      <div className="flex flex-column md:flex-row justify-content-end align-items-center mb-2">
        <InputText
          className="w-full md:w-3 mb-2 md:mb-0"
          type="search"
          value={searchData}
          onInput={(e) => setSearchData(e.target.value)}
          placeholder="Tìm kiếm tên loại biên bản..."
        />
      </div>

      <DataTable
        value={data}
        emptyMessage="Không tìm thấy dữ liệu"
        showGridlines={true}
        loading={loading}
      >
        <Column
          header="STT"
          headerStyle={headerStyleColumn}
          body={(_, options) => page * rows + options.rowIndex + 1}
          style={{ width: "4rem" }}
        />
        <Column
          field="ten_loai_bb"
          header="Tên loại biên bản"
          {...propSortAndFilter}
          headerStyle={headerStyleColumn}
        />
        <Column
          field="ngay_tao"
          header="Ngày tạo"
          {...propSortAndFilter}
          headerStyle={headerStyleColumn}
          body={(rowData) => {
            const date = new Date(rowData.ngay_tao);
            return date.toLocaleDateString('vi-VN');
          }}
        />
        <Column
          field="nguoi_tao"
          header="Người tạo"
          {...propSortAndFilter}
          headerStyle={headerStyleColumn}
        />
        <Column
          field="ghi_chu"
          header="Ghi chú"
          {...propSortAndFilter}
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
                  setShowDialog(true);
                  setIsAdd(false)
                  setFormData(rowData);
                }}
                style={{ backgroundColor: "#1445a7", color: "#fff" }}
              />
              <Button
                icon="pi pi-trash"
                tooltip="Xóa"
                onClick={() => {
                  setVisible(true);
                  setSelectedId(rowData.id);
                }}
                style={{backgroundColor: "#1445a7", color: "#fff" }}
              />
            </div>
          )}
        />
      </DataTable>

      <Paginator
        first={page * rows}
        rows={rows}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        rowsPerPageOptions={[2, 4, 10, 20]}
      />
    </>
  );
};

export default TableDM_LOAI_BB;
