import { useEffect, useState, useRef } from "react";
import { Panel } from "primereact/panel";
import { Chart } from "primereact/chart";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { subDays, startOfToday, endOfToday } from "date-fns";
import { Dropdown } from "primereact/dropdown";
import { BAO_CAO_Service } from "../../../../services/quanlythinghiem/BAO_CAO_Service";
import Table from "./Table";
import ChartJS from "chart.js/auto";
import ExcelJS from "exceljs";
import { getMenuCurrent } from "../../../../utils/Function";

const rangeOptions = [
  { label: "Hôm Nay", value: "today" },
  { label: "7 Ngày Trước", value: "7" },
  { label: "30 Ngày Trước", value: "30" },
  { label: "Tháng Này", value: "month" },
  { label: "Tháng Trước", value: "lastMonth" },
  { label: "Năm Nay", value: "year" },
  { label: "Custom Range", value: "custom" },
];

const BaoCao_YCTN_TheoKhachHang = () => {
  const toast = useRef(null);
  const [data, setData] = useState([]);
  const [dates, setDates] = useState(null);
  const [rangeOption, setRangeOption] = useState("year");
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [tongso, setTongso] = useState([]);

  // Tính tổng cho mỗi cột
  const calculateTotals = () => {
    const totals = {
      hopdong: 0,
      xulysuco: 0,
      kehoachthinghiem: 0,
      taomoi: 0,
      giaonhiemvu: 0,
      nhapkhoiluong: 0,
      khaosat: 0,
      thinghiem: 0,
      bangiao: 0,
      tongso: 0,
    };

    data.forEach((item) => {
      totals.hopdong += parseInt(item.hopdong, 10) || 0;
      totals.xulysuco += parseInt(item.xulysuco, 10) || 0;
      totals.kehoachthinghiem += parseInt(item.kehoachthinghiem, 10) || 0;
      totals.taomoi += parseInt(item.taomoi, 10) || 0;
      totals.giaonhiemvu += parseInt(item.giaonhiemvu, 10) || 0;
      totals.nhapkhoiluong += parseInt(item.nhapkhoiluong, 10) || 0;
      totals.khaosat += parseInt(item.khaosat, 10) || 0;
      totals.thinghiem += parseInt(item.thinghiem, 10) || 0;
      totals.bangiao += parseInt(item.bangiao, 10) || 0;
      totals.tongso += parseInt(item.tongso, 10) || 0;
    });

    return totals;
  };
  // chuyển định dạng ngày tháng->01/12/2024
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày và đảm bảo có 2 chữ số
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Lấy tháng (tháng trong JavaScript bắt đầu từ 0)
    const year = date.getFullYear(); // Lấy năm

    return `${day}/${month}/${year}`; // Trả về ngày theo định dạng DD/MM/YYYY
  };

  //start_Cấu hình plugin hiển thị chữ ở giữa
  const DoughnutCenterTextPlugin = {
    id: "TongsoCenterText",
    beforeDraw: (chart) => {
      const { width } = chart;
      const { height } = chart.chartArea;
      const ctx = chart.ctx;

      ctx.restore();

      // Chữ "Tổng"
      const fontSizeText = (height / 200).toFixed(2); // Kích thước font chữ "Tổng"
      ctx.font = `${fontSizeText}em sans-serif`;
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#000"; // Màu chữ
      const text = "Tổng";
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = (chart.chartArea.top + chart.chartArea.bottom) / 2 - 20; // Đẩy chữ "Tổng" lên trên
      ctx.fillText(text, textX, textY);

      // Số "160"
      const fontSizeNumber = (height / 100).toFixed(2); // Kích thước font chữ "160"
      ctx.font = `${fontSizeNumber}em sans-serif`;
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#000"; // Màu chữ
      const number = chart.options.plugins.TongsoCenterText.number || 0;
      const numberX = Math.round((width - ctx.measureText(number).width) / 2);
      const numberY = textY + 40; // Đẩy số xuống dưới chữ "Tổng"
      ctx.fillText(number, numberX, numberY);

      ctx.save();
    },
  };
  ChartJS.register(DoughnutCenterTextPlugin);
  //end_Cấu hình plugin hiển thị chữ ở giữa

  useEffect(() => {
    const today = startOfToday();
    const start = new Date(today.getFullYear(), 0, 1);
    const end = new Date(today.getFullYear(), 11, 31);
    setDates([start, end]);

    const load = async () => {
      const result = await BAO_CAO_Service.get_SL_QLTN_theoKhachHang({
        startDate: start,
        endDate: end,
      });
      setData(result);
      console.log("data", result);
    };
    load();
  }, []);

  useEffect(() => {
    let totals = calculateTotals();
    console.log("totals", totals);

    setTongso(totals);

    const data = {
      labels: [
        "Tạo mới: " + totals.taomoi,
        "Giao nhiệm vụ: " + totals.giaonhiemvu,
        "Nhập khối lượng thực hiện: " + totals.nhapkhoiluong,
        "Lập phương án thi công: " + totals.khaosat,
        "Thực hiện thí nghiệm: " + totals.thinghiem,
        "Bàn giao: " + totals.bangiao,
      ],
      datasets: [
        {
          data: [
            totals.taomoi,
            totals.giaonhiemvu,
            totals.nhapkhoiluong,
            totals.khaosat,
            totals.thinghiem,
            totals.bangiao,
          ],
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom", // Change this to 'left', 'top', 'bottom', 'right'
        },
        TongsoCenterText: {
          number: totals.tongso, // Truyền giá trị tổng vào plugin
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [data]);

  const onCalendarChange = (e) => {
    const [start, end] = e.value || [null, null];
    setDates(e.value);
  };

  const onRangeChange = (e) => {
    const selectedRange = e.value;
    const today = startOfToday();
    let start = today;
    let end = endOfToday();

    switch (selectedRange) {
      case "today":
        start = end = today;
        break;
      case "7":
        start = subDays(today, 7);
        break;
      case "30":
        start = subDays(today, 30);
        break;
      case "month":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "lastMonth":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "year":
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;
      default:
        start = end = today;
        break;
    }

    setRangeOption(selectedRange);
    setDates([start, end]);
  };

  const Search = async () => {
    try {
      const result = await BAO_CAO_Service.get_SL_QLTN_theoKhachHang({
        startDate: dates[0],
        endDate: dates[1],
      });
      setData(result);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: error.message,
      });
    }
  };

  const handleExport = () => {
    // Hiển thị hộp thoại confirm
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xuất báo cáo?");

    if (isConfirmed) {
      // Xử lý xuất báo cáo ở đây
      console.log("Đang xuất báo cáo...");
      DownloadExcel();
    } else {
      // Người dùng từ chối
      console.log("Hủy bỏ xuất báo cáo.");
    }
  };
  const headerList = (options) => {
    const className = `${options.className} flex flex-wrap justify-content-between align-items-center`;

    return (
      <div className={className}>
        <span className="font-bold text-xl">
          {getMenuCurrent()}
        </span>
        <div className="flex flex-wrap gap-2">
          <Button
            label="Xuất báo cáo"
            style={{ backgroundColor: "#2E8B57" }}
            onClick={handleExport}
          />
        </div>
      </div>
    );
  };

  const DownloadExcel = async () => {
    try {
      // Đường dẫn tới file mẫu trong thư mục public
      const filePath = "/TempleExportSLTNTDV.xlsx";

      // Tải file mẫu
      const response = await fetch(filePath);
      const arrayBuffer = await response.arrayBuffer();

      // Đọc file mẫu bằng ExcelJS
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);

      // Lấy sheet đầu tiên (hoặc tên sheet cụ thể nếu biết)
      const worksheet = workbook.getWorksheet(1);

      // Ghi thêm dữ liệu mới
      worksheet.getCell(`A${1}`).value =
        "BÁO CÁO SỐ LƯỢNG THÍ NGHIỆM THEO KHÁCH HÀNG";
      worksheet.getCell(`A${2}`).value = `Chi tiết sử dụng Từ ngày ${formatDate(dates[0])} đến ngày ${formatDate(dates[1])}`;
      let rowIndex = 6; // Bắt đầu từ dòng 6
      data.forEach((item, index) => {
        worksheet.getCell(`A${rowIndex}`).value = index + 1;
        worksheet.getCell(`B${rowIndex}`).value = item.ten_kh;

        worksheet.getCell(`D${rowIndex}`).value = item.tongso;
        worksheet.getCell(`E${rowIndex}`).value = item.hopdong;
        worksheet.getCell(`F${rowIndex}`).value = item.xulysuco;
        worksheet.getCell(`G${rowIndex}`).value = item.kehoachthinghiem;
        worksheet.getCell(`H${rowIndex}`).value = item.taomoi;
        worksheet.getCell(`I${rowIndex}`).value = item.giaonhiemvu;
        worksheet.getCell(`J${rowIndex}`).value = item.nhapkhoiluong;
        worksheet.getCell(`K${rowIndex}`).value = item.khaosat;
        worksheet.getCell(`L${rowIndex}`).value = item.thinghiem;
        worksheet.getCell(`M${rowIndex}`).value = item.bangiao;

        rowIndex++; // Di chuyển đến dòng tiếp theo
      });
      rowIndex++;
      worksheet.getCell(`B${rowIndex}`).value = "Tổng số";
      worksheet.getCell(`D${rowIndex}`).value = tongso.tongso;
      worksheet.getCell(`E${rowIndex}`).value = tongso.hopdong;
      worksheet.getCell(`F${rowIndex}`).value = tongso.xulysuco;
      worksheet.getCell(`G${rowIndex}`).value = tongso.kehoachthinghiem;
      worksheet.getCell(`H${rowIndex}`).value = tongso.taomoi;
      worksheet.getCell(`I${rowIndex}`).value = tongso.giaonhiemvu;
      worksheet.getCell(`J${rowIndex}`).value = tongso.nhapkhoiluong;
      worksheet.getCell(`K${rowIndex}`).value = tongso.khaosat;
      worksheet.getCell(`L${rowIndex}`).value = tongso.thinghiem;
      worksheet.getCell(`M${rowIndex}`).value = tongso.bangiao;

      // Tạo tên file không trùng nhau
      const timestamp = Date.now(); // Lấy thời gian hiện tại
      const filename = `ExportSLTNTKH_${timestamp}.xlsx`; // Tên file với timestamp
      // Tạo Blob để tải file Excel mới
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      // Tạo và kích hoạt đường dẫn tải file
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename; // Tên file tải về
      link.click();
    } catch (error) {
      console.error("Lỗi khi ghi dữ liệu vào file Excel:", error);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="border-round-3xl bg-white p-4">
        <Panel headerTemplate={headerList}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "10px", // khoảng cách giữa các thành phần
              paddingRight: "10px",
              paddingBottom: "10px",
            }}
          >
            <Dropdown
              value={rangeOption}
              className="w-[150px]"
              style={{ maxWidth: 160 }}
              options={rangeOptions}
              onChange={onRangeChange}
              optionLabel="label"
            />
            <Calendar
              value={dates}
              selectionMode="range"
              showButtonBar
              onChange={onCalendarChange}
              dateIcon="pi pi-calendar"
              showIcon={true}
            />
            <Button
              label="Tìm kiếm"
              style={{ backgroundColor: "#1445a7" }}
              onClick={Search}
            />
          </div>
          <div
            className="panel-content"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            {/* Biểu đồ */}
            <div style={{ width: "30%", padding: "10px" }}>
              <div className="chart">
                <Chart
                  type="doughnut"
                  data={chartData}
                  options={chartOptions}
                  pt={{
                    canvas: {
                      role: "img",
                      "aria-label": "Pie chart showing totals",
                    },
                  }}
                />
              </div>
            </div>

            {/* Bảng */}
            <div style={{ width: "65%", padding: "10px" }}>
              <Table data={data} calculateTotals={calculateTotals} />
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
};

export default BaoCao_YCTN_TheoKhachHang;
