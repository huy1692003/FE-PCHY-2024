import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import React, { useState } from "react";
import { useRouter } from 'next/router';

import {
  headerStyleColumn,
  propSortAndFilter,
} from "../../../../constants/propGlobal";
import moment from "moment";
import { Badge } from "primereact/badge";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import QLTN_YCTNService from "../../../../services/quanlythinghiem/QLTN_YCTNService";
import { Notification } from "../../../../utils/notification";

const TableYCTN = ({ toast,loadYCTN, dataYCTN, totalRecords }) => {
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(5);

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button size='small' className="w-1rem h-2rem p-3 mr-1" style={{ backgroundColor: "#1146A6" }} icon="pi pi-user-edit" onClick={() => router.push({
          pathname: '/quanlythinghiem/yeucauthinghiem/danhsach/updateYCTN',
          query: { code: rowData.ma_yctn ?? "" },
        })} tooltip='Chỉnh sửa' />
        <Button size='small' className="w-1rem h-2rem p-3 mr-1" style={{ backgroundColor: "#1146A6" }} icon="pi pi-eye" tooltip='Xem chi tiết' />
        <Button size='small' className="w-1rem h-2rem p-3 mr-1" style={{ backgroundColor: "#1146A6" }} onClick={() => { handleDeleteYCTN(rowData.ma_yctn) }} icon="pi pi-trash" tooltip='Xóa ' />
      </div>
    );
  };

  const handleDeleteYCTN = (ma_YCTN) => {
    confirmDialog({
      message: 'Bạn có chắc chắn muốn xóa yêu cầu thí nghiệm này?',
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        await QLTN_YCTNService.delete(ma_YCTN);
        Notification.success(toast,'Xóa thành công '+ ma_YCTN);
        loadYCTN()
      },
      reject: () => {
        console.log('Hành động xóa đã bị hủy');
      }
    });
  }

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
    <>
      <ConfirmDialog />
      <DataTable
        showGridlines
        value={dataYCTN}
        paginator
        first={page * rows}
        rows={rows}
        totalRecords={totalRecords}
        onPageChange={(event) => {
          setPage(event.page);
          setRows(event.rows);
          loadYCTN(event.page + 1, event.rows);
        }}
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
          body={(rowData) => (
            <div className="flex flex-column align-items-center gap-2">
              <Badge
                value={rowData.ten_buoc_current}
                className="bg-green-500 text-white text-sm  font-semibold p-2 "
                style={{ height: 'auto', whiteSpace: 'normal' }}
              />
              {rowData.ten_buoc_next && (
                <Badge
                  value={`Bước tiếp theo: ${rowData.ten_buoc_next}`}
                  className="bg-blue-500 text-white font-semibold text-sm  p-2"
                  style={{ height: 'auto', whiteSpace: 'normal' }}
                />
              )}
            </div>
          )}
        ></Column>


        <Column
          headerStyle={headerStyleColumn}
          header={headerTemplate("Thao tác")}
          body={actionBodyTemplate}
          bodyClassName={"text-center"}
        ></Column>
      </DataTable>
    </>
  );
};

export default TableYCTN;
