import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Paginator } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import useDebounce from "../../../../hooks/useDebounce";
import { headerStyleColumn, propSortAndFilter } from "../../../../constants/propGlobal";
import { DM_LOAI_TAISANService } from "../../../../services/quanlythinghiem/DM_LOAI_TAISANService";
import { ConfirmDialog } from "primereact/confirmdialog";

const TableDM_LOAI_TAI_SAN = ({
  data,
  totalRecords,
  loading,
  loadData,
  toast,
  setFormData,
  setShowDialog,
  setIsAdd
}) => {
  const [searchData, setSearchData] = useState("");
  const [page, setPage] = useState(0); 
  const [rows, setRows] = useState(10);
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);


  const delayTyping = useDebounce(searchData, 600);

  // Gọi lại API mỗi khi searchData thay đổi
  useEffect(() => {
    loadData(1, rows, delayTyping);
  }, [delayTyping, loadData, rows]);

  const handleDelete = async () => {
    try {
      const result = await DM_LOAI_TAISANService.deleteDM_LOAI_TAISAN(selectedId);
      toast.current.show({
        severity: "success",
        summary: "Xóa thành công",
      });
      loadData(page + 1, rows, delayTyping);
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
          onInput={(e) => {
            setSearchData(e.target.value);
          }}
          placeholder="Tìm kiếm"
        />
      </div>

      <DataTable
        value={data}
        loading={loading}
        emptyMessage="Không tìm thấy dữ liệu"
        showGridlines={true}
      >
        <Column
          header="STT"
          headerStyle={headerStyleColumn}
          body={(_, options) => (page * rows) + options.rowIndex + 1}
          style={{ width: "4rem" }}
        />
        <Column
          field="ten_lts"
          header="Loại tài sản"
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
                  setIsAdd(false);
                  console.log(rowData);
                  setFormData(rowData);
                }}
                style={{ backgroundColor: "#1445a7", color: "#fff" }}
              />
              <Button
                icon="pi pi-trash"
                tooltip="Xóa"
                onClick={() =>{
                  setVisible(true);
                  setSelectedId(rowData.id);
                } }
                style={{ backgroundColor: "#e74c3c", color: "#fff" }}
              />
            </div>
          )}
        />
      </DataTable>

      <Paginator
        first={page * rows}
        rows={rows} 
        totalRecords={totalRecords} 
        onPageChange={(
          (event)=> {
            setPage(event.page);
            setRows(event.rows);
            loadData(event.page + 1, event.rows, delayTyping);
          }
        )}
        rowsPerPageOptions={[2, 4, 10, 20]} 
      />
    </>
  );
};

export default TableDM_LOAI_TAI_SAN;
