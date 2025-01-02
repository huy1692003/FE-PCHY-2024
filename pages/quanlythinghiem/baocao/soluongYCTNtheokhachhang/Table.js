import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

const Table = ({ data, calculateTotals }) => {
  // Nhóm header của bảng
  const headerGroup = (
    <ColumnGroup>
      {/* Dòng nhóm header */}
      <Row>
        <Column header="STT" rowSpan={2} />
        <Column header="KHÁCH HÀNG" rowSpan={2} />
        <Column header="THEO LOẠI YÊU CẦU THÍ NGHIỆM" colSpan={3} />
        <Column
          header="THEO TRẠNG THÁI HIỆN TẠI"
          colSpan={6}
          style={{ textAlign: "center" }}
        />
        <Column header="TỔNG SỐ" rowSpan={2} style={{ textAlign: "center" }} />
      </Row>
      {/* Dòng con header */}
      <Row>
        <Column header="HỢP ĐỒNG" />
        <Column header="SỰ CỐ" />
        <Column header="KẾ HOẠCH THÍ NGHIỆM" />
        <Column header="TẠO MỚI" />
        <Column header="GIAO NHIỆM VỤ" />
        <Column header="NHẬP KHỐI LƯỢNG" />
        <Column header="KHẢO SÁT" />
        <Column header="THÍ NGHIỆM" />
        <Column header="BÀN GIAO" />
      </Row>
    </ColumnGroup>
  );

  const totals = calculateTotals();
  // Thêm một bản ghi tổng số vào cuối bảng
  const totalRow = {
    ten_kh: "Tổng số",
    hopdong: totals.hopdong,
    xulysuco: totals.xulysuco,
    kehoachthinghiem: totals.kehoachthinghiem,
    taomoi: totals.taomoi,
    giaonhiemvu: totals.giaonhiemvu,
    nhapkhoiluong: totals.nhapkhoiluong,
    khaosat: totals.khaosat,
    thinghiem: totals.thinghiem,
    bangiao: totals.bangiao,
    tongso: totals.tongso,
  };
  // Di chuyển bản ghi tổng số lên đầu
  const dataWithTotalAtTop = [totalRow, ...data];
  return (
    <>
      <style>
        {`
      .p-column-title{
        display: block;
        width:100%;
        text-align:center;
      }
    `}
      </style>
      <DataTable
        value={dataWithTotalAtTop} // Thêm bản ghi tổng số vào cuối bảng
        showGridlines
        headerColumnGroup={headerGroup} // Sử dụng nhóm header
        emptyMessage="Không tìm thấy dữ liệu"
        selectionMode="single"
      >
        {/* Cột dữ liệu */}
        <Column
          field="stt"
          body={(data, options) => {
            // Nếu là bản ghi tổng số, không hiển thị STT
            return data.ten_kh === "Tổng số" ? null : options.rowIndex;
          }}
        />
        <Column field="ten_kh" />
        <Column field="hopdong" />
        <Column field="xulysuco" />
        <Column field="kehoachthinghiem" />
        <Column field="taomoi" />
        <Column field="giaonhiemvu" />
        <Column field="nhapkhoiluong" />
        <Column field="khaosat" />
        <Column field="thinghiem" />
        <Column field="bangiao" />
        <Column field="tongso" />
      </DataTable>
    </>
  );
};

export default Table;
