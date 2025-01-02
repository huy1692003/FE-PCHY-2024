import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

const Table = ({ data ,calculateTotals}) => {
  // Nhóm header của bảng
  const headerGroup = (
    <ColumnGroup >
      {/* Dòng nhóm header */}
      <Row>
        <Column header="STT" rowSpan={2} style={{ textAlign: "center" }}/>
        <Column header="ĐƠN VỊ" rowSpan={2} style={{ textAlign: "center" }}/>
        <Column
          header="THEO LOẠI YÊU CẦU THÍ NGHIỆM"
          colSpan={3}
          style={{ textAlign: "center" }}
        />
        <Column
          header="THEO TRẠNG THÁI HIỆN TẠI"
          colSpan={6}
          style={{ textAlign: "center" }}
          />
        <Column header="TỔNG SỐ" rowSpan={2} style={{ textAlign: "center" }}/>
      </Row>
      {/* Dòng con header */}
      <Row >
        <Column header="HỢP ĐỒNG" style={{ textAlign: "center" }}/>
        <Column header="SỰ CỐ" style={{ textAlign: "center" }}/>
        <Column header="KẾ HOẠCH THÍ NGHIỆM" style={{ textAlign: "center" }}/>
        <Column header="TẠO MỚI" style={{ textAlign: "center" }}/>
        <Column header="GIAO NHIỆM VỤ" style={{ textAlign: "center" }}/>
        <Column header="NHẬP KHỐI LƯỢNG" style={{ textAlign: "center" }}/>
        <Column header="KHẢO SÁT" style={{ textAlign: "center" }}/>
        <Column header="THÍ NGHIỆM" style={{ textAlign: "center" }}/>
        <Column header="BÀN GIAO" style={{ textAlign: "center" }}/>
      </Row>
    </ColumnGroup>
  );

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
        value={data} // Thêm bản ghi tổng số vào cuối bảng
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
            return options.rowIndex + 1;
          }}
        />
        <Column field="ten_don_vi" />
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
