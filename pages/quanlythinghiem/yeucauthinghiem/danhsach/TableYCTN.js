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
import { setMenuCurrent } from "../../../../utils/Function";

const urlRedirect = [
  { i: 2, url: "/quanlythinghiem/yeucauthinghiem/giaonhiemvu" },
  { i: 3, url: "/quanlythinghiem/yeucauthinghiem/nhapkhoiluongthuchien" },
  { i: 4, url: "/quanlythinghiem/yeucauthinghiem/khaosatphuongan" },
  { i: 5, url: "/quanlythinghiem/thuchienthinghiem/thinghiem/list" },
  { i: 6, url: "/quanlythinghiem/thuchienthinghiem/bangiaoketqua" },
]

const TableYCTN = ({ toast, loadYCTN, dataYCTN, totalRecords }) => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(5);

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="grid gap-1 justify-content-center">

        <Button
          icon="pi pi-eye"
          tooltip="Xem chi tiết"
          style={{ backgroundColor: "#1146A6" }}
          className="w-1rem h-2rem p-3 mr-1"
          onClick={() => {
            router.push({
              pathname: "/quanlythinghiem/yeucauthinghiem/chitiet",
              query: { code: rowData.ma_yctn },
            });
          }}
        />
        {
          rowData.cur_step === 1 && <>
            <Button size='small' className="w-1rem h-2rem p-3 mr-1" style={{ backgroundColor: "#1146A6" }} icon="pi pi-user-edit" onClick={() => router.push({
              pathname: '/quanlythinghiem/yeucauthinghiem/danhsach/updateYCTN',
              query: { code: rowData.ma_yctn ?? "" },
            })} tooltip='Chỉnh sửa' />
            <Button size='small' className="w-1rem h-2rem p-3 mr-1" style={{ backgroundColor: "#1146A6" }} onClick={() => { handleDeleteYCTN(rowData.ma_yctn) }} icon="pi pi-trash" tooltip='Xóa ' />
          </>
        }
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
        Notification.success(toast, 'Xóa thành công ' + ma_YCTN);
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





  //console.log('dataYCTN', dataYCTN);




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
          style={{ minWidth: 300 }}
          headerStyle={headerStyleColumn}

          body={(rowData) => {
            console.log(rowData)
            return (
              <>
                <p>Mã yêu cầu: {rowData.ma_yctn}</p>
                <p>Tên yêu cầu: {rowData.ten_yctn}</p>
              </>
            );
          }}
          // Phương thức lọc (tìm kiếm chứa chuỗi)
          filter={true}  // Bật tính năng lọc
          filterPlaceholder="Tìm kiếm..."  // Text hiển thị trong hộp tìm kiếm
          filterField="ma_yctn"
          showFilterMenuOptions={false}  // Ẩn các tùy chọn trong menu bộ lọc
          filterMatchMode="contains"  // Kiểu lọc: chứa chuỗi
          sortField="ma_yctn"
          sortable
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
          sortField="ten_loai_yctn"
          header={headerTemplate("Thông tin chung")}
        ></Column>
        <Column
          headerStyle={headerStyleColumn}
          {...propSortAndFilter}
          field="donViThucHien"
          header={headerTemplate("Đơn vị thực hiện")}
          body={(rowData) => {
            return (
              <div className="text-center"> {
                rowData.don_vi_thuc_hien?.length > 0 ?
                  <ul className="pl-0">
                    {rowData.don_vi_thuc_hien.map((donVi, index) => (
                      <p className="my-0 mx-0" key={`${donVi}-${index}`}>{donVi}</p>
                    ))}
                  </ul> : "Chưa cập nhật"}
              </div>
            );
          }}
        ></Column>
        <Column
          headerStyle={headerStyleColumn}
          {...propSortAndFilter}
          headerClassName="max-w-4"
          style={{ maxWidth: 150 }}
          field="thongTinKhoiTao"
          body={(rowData) => {
            return (
              <div >
                <div>
                  Ngày tạo:{" "}
                  <strong>{moment(rowData.ngay_tao).format("DD/MM/YYYY")}</strong>
                </div>
                <div>
                  Người tạo: <strong>{rowData.nguoi_tao}</strong>
                </div>
              </div>
            );
          }}
          header={"Thông tin khởi tạo"}
        ></Column>
        <Column
          headerStyle={headerStyleColumn}
          {...propSortAndFilter}
          field="trangThai"
          header={headerTemplate("Trạng thái")}
          body={(rowData) => {

            console.log(rowData)
            return <div className="flex flex-column align-items-center gap-2">
              <Badge
                onClick={() => {
                  if (rowData.cur_step === 5) {
                    const url = urlRedirect.find(s => s.i === rowData.cur_step)?.url;
                    router.push({ pathname: url, query: { code: rowData.ma_yctn ?? "" } });
                    setMenuCurrent(rowData.ten_buoc_current)
                  }
                }}

                value={(rowData.cur_step === 5 ? "Đang " : "Đã hoàn thành: ") + rowData.ten_buoc_current}
                className="bg-green-500 text-white text-sm  font-semibold p-2 min-w-full "
                style={{ height: 'auto', whiteSpace: 'normal' }}
              />
              {rowData.ten_buoc_next && (
                <Badge
                  onClick={() => {
                    let url = urlRedirect.find(s => s.i === rowData.nex_step)?.url
                    router.push({ pathname: url, query: { code: rowData.ma_yctn ?? "" } })
                    setMenuCurrent(rowData.ten_buoc_next)
                  }
                  }
                  value={`Bước tiếp theo: ${rowData.ten_buoc_next}`}
                  className="bg-blue-500 text-white font-semibold text-sm min-w-full p-2"
                  style={{ height: 'auto', whiteSpace: 'normal' }}
                />
              )}
            </div>

          }}
        ></Column>


        <Column
          headerStyle={headerStyleColumn}
          header={"Thao tác"}
          body={actionBodyTemplate}
          style={{ maxWidth: 100 }}
          bodyClassName={"text-center"}
        ></Column>
      </DataTable>
    </>
  );
};

export default TableYCTN;
