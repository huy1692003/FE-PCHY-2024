import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import React, { useState } from "react";
import {
  headerStyleColumn,
  propSortAndFilter,
} from "../../../../constants/propGlobal";
import moment from "moment";

const TableYCTN = ({ dataYCTN, totalRecords, onPageChange  }) => {
  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => {}}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => {}}
        />
      </div>
    );
  };

  const indexBodyTemplate = (rowData, options) => {
    return options.rowIndex + 1;
  };

  const headerTemplate = (header) => {
    return (
      <span
        className="text-sm md:text-base lg:text-base whitespace-nowrap overflow-hidden text-overflow-ellipsis text-center"
        style={{ minWidth: "120px", display: "block" }}
      >
        {header}
      </span>
    );
  };

  return (
    <DataTable
      showGridlines
      value={dataYCTN}
      paginator
      rows={10}
      rowsPerPageOptions={[5, 10, 25, 50]}
      tableStyle={{ minWidth: "50rem" }}
      selectionMode="checkbox"
      dataKey="id"
    >
      <Column
        headerStyle={headerStyleColumn}
        header="STT"
        body={indexBodyTemplate}
        style={{ width: "2rem" }}
        bodyStyle={{ textAlign: "center" }}
      ></Column>
      <Column
        headerStyle={headerStyleColumn}
        {...propSortAndFilter}
        body={(rowData) => {
          return (
            <>
              <p>Mã yêu cầu: {rowData.ma_yctn}</p>
              <p>Tên yêu cầu: {rowData.ten_yctn}</p>
            </>
          );
        }}
        field="thongTinYCTN"
        header={headerTemplate("Thông tin Yêu cầu thí nghiệm")}
      ></Column>
      <Column
        headerStyle={headerStyleColumn}
        {...propSortAndFilter}
        body={
          (rowData) => {
            return (
                <>
                    <p>Loại hình thí nghiệm: {rowData.ten_loai_yctn}</p>
                </>
            )
          }
        }
        field="thongTinChung"
        header={headerTemplate("Thông tin chung")}
      ></Column>
      <Column
        headerStyle={headerStyleColumn}
        {...propSortAndFilter}
        field="donViThucHien"
        header={headerTemplate("Đơn vị thực hiện")}
        body={(rowData) => {
          return (
            <ul>
              {rowData.don_vi_thuc_hien.map((donVi, index) => (
                 <li key={`${donVi}-${index}`}>{donVi}</li>
              ))}
            </ul>
          );
        }}
      ></Column>
      <Column
        headerStyle={headerStyleColumn}
        {...propSortAndFilter}
        field="thongTinKhoiTao"
        body={(rowData) => {
          return (
            <>
              <div>
                Đơn vị khởi tạo:{" "}
                <ul>
                  {rowData.don_vi_thuc_hien.map((donVi, index) => (
                    <li key={`${donVi}-${index}`}>{donVi}</li>
                  ))}
                </ul>
              </div>
              <div>
                Ngày tạo:{" "}
                <strong>{moment(rowData.ngayTao).format("DD/MM/YYYY")}</strong>
              </div>
              <div>
                Người tạo: <strong>{rowData.nguoi_tao}</strong>
              </div>
            </>
          );
        }}
        header={headerTemplate("Thông tin khởi tạo")}
      ></Column>
      <Column
        headerStyle={headerStyleColumn}
        {...propSortAndFilter}
        field="trangThai"
        header={headerTemplate("Trạng thái")}
        body={(rowData) => {
            return (
                <div className="flex flex-column align-items-center gap-2">
                    <div className="px-3 py-2 text-white border-round-md bg-green-500 text-sm">
                        {rowData.ten_buoc_current}
                    </div>
        
                    {rowData.ten_buoc_next && (
                        <div className="px-3 py-2 text-white border-round-md bg-blue-500 text-sm">
                            Bước tiếp theo: {rowData.ten_buoc_next}
                        </div>
                    )}
                </div>
            );
        }}
      ></Column>
      <Column
        headerStyle={headerStyleColumn}
        header={headerTemplate("Thao tác")}
        body={actionBodyTemplate}
        style={{ width: "10rem" }}
      ></Column>
    </DataTable>
  );
};

export default TableYCTN;
