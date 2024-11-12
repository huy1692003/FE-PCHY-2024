import React, { useRef, useState, useEffect } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { getDM_DONVIById } from "../../../services/DM_DONVIService";
import { DM_DONVI } from "../../../models/DM_DONVI";
import { ConfirmDialog } from "primereact/confirmdialog"; // For <ConfirmDialog /> component
import { confirmDialog } from "primereact/confirmdialog"; // For confirmDialog method
import { Toast } from "primereact/toast";

const TableDM_DonVi = ({
  visible,
  setVisible,
  setIsUpdate,
  setDONVI,
}) => {
  const [DONVIS, setDONVIS] = useState([DM_DONVI]);
  const [isHide, setIsHide] = useState(false);

  let fakeDataTable = [];

  const loadData = async () => {
    for (let i = 1; i <= 20; i++) {
      fakeDataTable.push({
        id: i,
        ma: i,
        sap_xep: i,
        ten: "Tên đơn vị " + i,
        trang_thai: "Có hiệu lực",
        ten_dviqly: "Đơn vị quản lý" + i,
      });
    }
    setDONVIS(fakeDataTable);
  };
  useEffect(() => {
    loadData();
  }, []);

  const confirm = () => {
    // Xử lý xác nhận
    setIsHide(false);
    console.log(isHide);
    toast.current.show({
      severity: "success",
      summary: "Thông báo",
      detail: "Xóa bản ghi thành công",
      life: 3000,
    });
  };

  const cancel = () => {
    setIsHide(false);
    console.log("Đã hủy!");
    console.log(isHide);
  };
  const buttonOption = (rowData) => {
    return (
      <>
        <Button
          style={{ marginRight: "10px" }}
          severity="warning"
          label="Sửa"
          onClick={() => {
            setVisible(true);
            setIsUpdate(true);
            setPHONGBAN(rowData);
          }}
        />
        <Button
          label="Xóa"
          severity="danger"
          onClick={() => {
            setIsHide(true);
          }}
        />
      </>
    );
  };
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10);

  // Hàm xử lý khi người dùng chuyển trang
  const onPageChange = (event) => {
    setPage(event.page);
    setRows(event.rows);
    console.log("Trang hiện tại:", event.page + 1);
    //call api get dm_phongban by pageindex, pagesize
  };
  const toast = useRef(null);

  return (
    <>
      {" "}
      <DataTable
        value={DONVIS}
        showGridlines
        stripedRows
        dataKey="id"
        onPage={onPageChange}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10]}
        className="datatable-responsive"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
      >
        <Column
          sortable
          field="STT"
          header="Số thứ tự"
          body={(rowData, { rowIndex }) => {
            return rowIndex + 1;
          }}
        ></Column>
        <Column sortable field="ma" header="Mã đơn vị"></Column>
        <Column field="ten" header="Tên đơn vị"></Column>
        <Column field="ten_dviqly" header="Tên đơn vị quản lý"></Column>
        <Column field="trang_thai" header="Trạng thái"></Column>
        <Column body={buttonOption} header="Thao tác "></Column>
      </DataTable>
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
              onClick={confirm}
              autoFocus
            />
          </div>
        }
      >
        <div className="card flex flex-wrap gap-2 justify-content-center"></div>
      </ConfirmDialog>
    </>
  );
};

export default TableDM_DonVi;
