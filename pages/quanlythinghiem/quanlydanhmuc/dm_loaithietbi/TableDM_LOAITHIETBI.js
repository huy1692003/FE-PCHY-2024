import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Panel } from "primereact/panel";
import {
  headerStyleColumn,
  propSortAndFilter,
} from "../../../../constants/propGlobal";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { DM_LOAITHIETBI } from "../../../../models/DM_LOAITB";
import { InputText } from "primereact/inputtext";
import { DM_LOAI_THIET_BI_Service } from "../../../../services/quanlythinghiem/DM_LOAITHIETBIService";

const TableDM_LoaiThietBi = ({
  data,
  loadData,
  setFormData,
  setShowDialog,
  setIsAdd,
}) => {
  const [visible, setVisible] = useState(false);
  const [visibleMultiple, setVisibleMultiple] = useState(false);
  const toast = useRef(null);
  const [selected, setSelected] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");

  const handleDelete = async () => {
    try {
      await DM_LOAI_THIET_BI_Service.delete_DM_LOAITHIETBI(itemToDelete.id);
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Xóa thành công",
        life: 3000,
      });
      loadData();
      setVisible(false);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không thể xóa loại thiết bị",
        life: 3000,
      });
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selected.map((item) => DM_LOAI_THIET_BI_Service.delete_DM_LOAITHIETBI(item.id)));
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: `Xóa thành công ${selected.length} mục đã chọn`,
        life: 3000,
      });
      setSelected([]);
      loadData();
      setVisibleMultiple(false);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không thể xóa các mục đã chọn",
        life: 3000,
      });
    }
  };

  const headerList = (options) => {
    const className = `${options.className} flex flex-wrap justify-content-between align-items-center`;

    return (
      <div className={className}>
        <span className="font-bold text-xl">Danh sách</span>

        <div className="flex flex-wrap gap-2">
          {selected.length > 0 && (
            <Button
              label="Xóa nhiều"
              severity="danger"
              onClick={() => setVisibleMultiple(true)}
            />
          )}
          <Button
            label="Thêm mới"
            style={{ backgroundColor: "#1445a7" }}
            onClick={() => {
              setFormData(DM_LOAITHIETBI);
              setShowDialog(true);
              setIsAdd(true);
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      
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

      <ConfirmDialog
        visible={visibleMultiple}
        onHide={() => setVisibleMultiple(false)}
        message={`Bạn có chắc chắn muốn xóa ${selected.length} mục đã chọn?`}
        header="Xác nhận xóa nhiều"
        icon="pi pi-exclamation-triangle"
        acceptClassName="p-button-danger"
        accept={handleDeleteSelected}
        reject={() => setVisibleMultiple(false)}
      />

      <Panel headerTemplate={headerList}>
        <div className="flex flex-column md:flex-row justify-content-end align-items-center mb-2">
          <InputText
            className="w-full md:w-3 mb-2 md:mb-0"
            type="search"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="Tìm kiếm"
          />
        </div>
        
        <DataTable
          value={data}
          paginator
          showGridlines
          rows={5}
          rowsPerPageOptions={[5, 10, 15, 20, 25]}
          selectionMode="checkbox"
          selection={selected}
          onSelectionChange={(e) => setSelected(e.value)}
          globalFilter={globalFilter}
        >
          <Column
            selectionMode="multiple"
            headerStyle={headerStyleColumn}
            style={{ width: "3rem" }}
          />

          <Column
            field="ma_loai_tb"
            header="Mã loại"
            headerStyle={headerStyleColumn}
          />
          <Column
            field="ten_loai_tb"
            header="Tên loại"
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
                    setFormData(rowData);
                  }}
                  style={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Button
                  icon="pi pi-trash"
                  tooltip="Xóa"
                  onClick={() => {
                    setItemToDelete(rowData);
                    setVisible(true);
                  }}
                  style={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
              </div>
            )}
          />
        </DataTable>
      </Panel>
    </>
  );
};

export default TableDM_LoaiThietBi;
