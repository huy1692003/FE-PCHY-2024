import { FilterMatchMode, PrimeIcons } from "primereact/api";
import React, { useState } from "react";
import { delete_HT_NHOMQUYEN } from "../../../services/quantrihethong/HT_NHOMQUYENService";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { HT_NHOMQUYEN } from "../../../models/HT_NHOMQUYEN";

import { propSortAndFilter } from "../../../constants/propGlobal";
import { getMenuCurrent } from "../../../utils/Function";

const TableVaiTro = ({
  setVisible,
  setIsUpdate,
  setVaiTro,
  data,
  setMenuDialogVisible,
  pageCount,
  setPage,
  setPageSize,
  page,
  pageSize,
  loadData,
  loadDataMenu,
  toast,
  setSelectedVaiTro,
}) => {
  const rowsPerPageOptions = [5, 10, 15];
  const [isHide, setIsHide] = useState(false);
  const [id, setId] = useState();
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ten_nhom: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    ten_dviqly: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  const confirmDelete = async () => {
    setIsHide(false);
    try {
      await delete_HT_NHOMQUYEN(id);
      toast.current.show({
        severity: "success",
        summary: "Thông báo",
        detail: "Xóa vai trò thành công",
        life: 3000,
      });
      loadData();
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Xóa vai trò không thành công",
        life: 3000,
      });
    }
  };

  const confirmDeleteSelected = async () => {
    setIsHide(false);
    try {
      await Promise.all(selectedRows.map(row => delete_HT_NHOMQUYEN(row.id)));
      toast.current.show({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Đã xóa các vai trò đã chọn',
        life: 3000
      });
      setSelectedRows([]);
      loadData();
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể xóa các vai trò đã chọn',
        life: 3000
      });
    }
  };

  const cancel = () => {
    setIsHide(false);
  };

  const headerTemplate = (options) => {
    const className = `${options.className} flex flex-wrap justify-content-between align-items-center gap-2`
    return (
      <div className={className} >
        <span className='text-xl font-bold'>{getMenuCurrent()}</span>
        <div className="flex align-items-center gap-2">
          {selectedRows.length > 0 && (
            <Button
              label="Xóa nhiều"
              severity="danger"
              onClick={() => {
                setIsHide(true);
              }}
            />
          )}
          <Button
            label="Thêm mới"
            style={{ backgroundColor: "#1445a7" }}
            onClick={() => {
              setVaiTro(HT_NHOMQUYEN)
              setVisible(true);
              setIsUpdate(false);
            }}
          />
        </div>
      </div>
    )
  }

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  return (
    <div >
      <Panel headerTemplate={headerTemplate} className="mt-4">
        <div className="flex flex-column md:flex-row justify-content-end align-items-center mb-1">
          <span className="p-input-icon-left w-full md:w-3">
            <i className="pi pi-search" />
            <InputText
              className="w-full"
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Tìm kiếm"
            />
          </span>
        </div>
        <div className="flex flex-column">
          <DataTable
            value={data.data}
            selection={selectedRows}
            onSelectionChange={e => setSelectedRows(e.value)}
            filters={filters}
            onFilter={(e) => setFilters(e.filters)}
            rows={pageSize}
            rowkey="id"
            rowsPerPageOptions={[5, 10]}
            className="datatable-responsive mt-3"
            showGridlines
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            responsiveLayout="scroll"
          >
            <Column 
              selectionMode="multiple" 
              headerStyle={{
                backgroundColor: "#1445a7",
                color: "#fff",
                width: '3rem'
              }}
            />
            

            <Column
              {...propSortAndFilter}
              field="ten_nhom"
              header="Tên vai trò"
              headerStyle={{
                backgroundColor: "#1445a7",
                color: "#fff",
                minWidth: '150px'
              }}
            />

            <Column
              {...propSortAndFilter}
              field="ten"
              header="Đơn vị quản lý"
              headerStyle={{
                backgroundColor: "#1445a7",
                color: "#fff",
                minWidth: '150px'
              }}

            />

            <Column
              header="Thao tác"
              headerStyle={{
                backgroundColor: "#1445a7",
                color: "#fff",
                width: "6rem",
              }}
              body={(rowData) => (
                <div className="flex justify-content-between gap-3">
                  <Button
                    icon="pi pi-pencil"
                    tooltip="Sửa"
                    tooltipOptions={{ position: "top" }}
                    style={{ backgroundColor: "#1445a7" }}
                    onClick={() => {
                      setVaiTro(rowData);
                      setVisible(true);
                      setIsUpdate(true);
                      console.log(rowData);
                    }}
                  />
                  <Button
                    icon="pi pi-trash"
                    tooltip="Xóa"
                    tooltipOptions={{ position: "top" }}
                    style={{ backgroundColor: "#1445a7" }}
                    onClick={() => {
                      setIsHide(true);
                      setId(rowData.id);
                    }}
                  />

                  <Button
                    icon="pi pi-file-edit"
                    tooltip="Gán menu"
                    tooltipOptions={{ position: "top" }}
                    style={{ backgroundColor: "#1445a7" }}
                    onClick={() => {
                      setMenuDialogVisible(true);
                      setSelectedVaiTro(rowData);
                    }}
                  />
                </div>
              )}
            />
          </DataTable>

          <div className="flex flex-wrap align-items-center justify-content-between gap-3 mt-4">
            <div className="flex align-items-center">
              <Button
                outlined
                text
                icon={PrimeIcons.ANGLE_DOUBLE_LEFT}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                severity="secondary"
              />
              <p className="mx-4 mb-0">
                Trang {page} trong tổng số {pageCount} trang
              </p>
              <Button
                outlined
                text
                severity="secondary"
                icon={PrimeIcons.ANGLE_DOUBLE_RIGHT}
                onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
                disabled={page === pageCount}
              />
            </div>
            <Dropdown
              className="w-full md:w-auto"
              value={pageSize}
              options={rowsPerPageOptions}
              onChange={(e) => {
                setPageSize(e.value);
                setPage(1);
              }}
              placeholder="Select rows per page"
            />
          </div>
        </div>
      </Panel>

      <Toast ref={toast} />
      <ConfirmDialog
        visible={isHide}
        onHide={() => setIsHide(false)}
        header="Xác nhận"
        message={selectedRows.length > 0 ? "Bạn có chắc chắn xóa các bản ghi đã chọn không?" : "Bạn có chắc chắn xóa bản ghi này không?"}
        icon="pi pi-info-circle"
        footer={
          <div>
            <Button
              severity="secondary"
              outlined
              label="Hủy"
              icon="pi pi-times"
              onClick={cancel}
            />
            <Button
              severity="danger"
              label="Đồng ý"
              icon="pi pi-check"
              onClick={selectedRows.length > 0 ? confirmDeleteSelected : confirmDelete}
              autoFocus
            />
          </div>
        }
      />
    </div>
  );
};

export default TableVaiTro;
