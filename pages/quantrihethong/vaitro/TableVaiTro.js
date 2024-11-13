import { FilterMatchMode, PrimeIcons } from "primereact/api";
import React, { useState } from "react";
import { delete_HT_NHOMQUYEN } from "../../../services/HT_NHOMQUYENService";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { HT_NHOMQUYEN } from "../../../models/HT_NHOMQUYEN";
import moment from 'moment';

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

  const cancel = () => {
    setIsHide(false);
  };

  const headerList = (options) => {
    const className = `${options.className} justify-content-space-between`;

    return (
      <div className={className}>
        <span className="font-bold text-2xl">Danh sách</span>
        <Button
          label="Thêm mới"
          style={{ backgroundColor: "#1445a7" }}
          onClick={() => {
            setVaiTro(HT_NHOMQUYEN)
            setVisible(true);
            setIsUpdate(false);
          }}
        ></Button>
      </div>
    );
  };

  const clearFilter = () => {
    initFilters();
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue("");
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <InputText
          style={{ width: "250px" }}
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Nhập thông tin để tìm kiếm"
        />
      </div>
    );
  };

  return (
    <div>
      <Panel headerTemplate={headerList} className="mt-4">
        <DataTable
          value={data.data}
          showHeaders={renderHeader()}
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          rows={pageSize}
          rowkey="id"
          rowsPerPageOptions={[5, 10]}
          className="datatable-responsive mt-5"
          showGridlines
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        >
          <Column
            field="STT"
            header="STT"
            headerStyle={{
              backgroundColor: "#1445a7",
              color: "#fff",
            }}
            body={(rowData, { rowIndex }) => {
              return rowIndex + 1;
            }}
          ></Column>

          <Column
            field="nhom_id"
            header="ID Nhóm"
            headerStyle={{
              backgroundColor: "#1445a7",
              color: "#fff",
            }}
          ></Column>

          <Column
            field="ten_nhom"
            header="Tên vai trò"
            headerStyle={{
              backgroundColor: "#1445a7",
              color: "#fff",
            }}
          ></Column>

          <Column
            field="ngay_tao"
            header="Ngày tạo"
            headerStyle={{
              backgroundColor: "#1445a7",
              color: "#fff",
            }

            }
            body={(rowData) => moment(rowData).format('DD/MM/YYYY')} // Định dạng ngày ở đây
          ></Column>

          <Column
            field="nguoi_tao"
            header="Người tạo"
            headerStyle={{
              backgroundColor: "#1445a7",
              color: "#fff",
            }}
          ></Column>

          <Column
            field="ten"
            header="Đơn vị quản lý"
            headerStyle={{
              backgroundColor: "#1445a7",
              color: "#fff",
            }}
          ></Column>

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
          ></Column>
        </DataTable>
        <div
          style={{ marginTop: "20px", justifyContent: "center" }}
          className="flex justify-between items-center mt-4"
        >
          <div className="flex items-center" style={{ alignItems: "center" }}>
            <Button
              outlined
              text
              icon={PrimeIcons.ANGLE_DOUBLE_LEFT}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              severity="secondary"
            ></Button>
            <p className="mr-4 ml-4 mb-0">
              Trang {page} trong tổng số {pageCount} trang
            </p>
            <Button
              outlined
              text
              severity="secondary"
              icon={PrimeIcons.ANGLE_DOUBLE_RIGHT}
              onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
              disabled={page === pageCount}
            ></Button>
          </div>
          <Dropdown
            className="w-1/4 ml-4"
            value={pageSize}
            options={rowsPerPageOptions}
            onChange={(e) => {
              setPageSize(e.value);
              setPage(1);
            }}
            placeholder="Select rows per page"
          />
        </div>
      </Panel>

      <Toast ref={toast} />
      <ConfirmDialog
        visible={isHide}
        onHide={() => setIsHide(false)}
        header="Xác nhận"
        message="Bạn có chắc chắn xóa bản ghi này không?"
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
              onClick={confirmDelete}
              autoFocus
            />
          </div>
        }
      ></ConfirmDialog>
    </div>
  );
};

export default TableVaiTro;
