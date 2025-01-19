import { useEffect, useState, useRef, memo } from "react";
import { Panel } from "primereact/panel";
import { Chart } from "primereact/chart";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { subDays, startOfToday, endOfToday } from "date-fns";
import { Dropdown } from "primereact/dropdown";
import { BAO_CAO_Service } from "../../services/quanlythinghiem/BAO_CAO_Service";
import TableThongKe from "../../pages/quanlythinghiem/baocao/soluongChuKytheodonvi/Table";
import { getMenuCurrent } from "../Function";

const rangeOptions = [
    { label: "Hôm Nay", value: "today" },
    { label: "7 Ngày Trước", value: "7" },
    { label: "30 Ngày Trước", value: "30" },
    { label: "Tháng Này", value: "month" },
    { label: "Tháng Trước", value: "lastMonth" },
    { label: "Năm Nay", value: "year" },
    { label: "Custom Range", value: "custom" },
];

const ThongKe_SL_ChuKy = () => {
    const toast = useRef(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [chartData, setChartData] = useState();
    const [dates, setDates] = useState(null);
    const [rangeOption, setRangeOption] = useState("year");


    useEffect(() => {
        const today = startOfToday();
        const start = new Date(today.getFullYear(), 0, 1);
        const end = new Date(today.getFullYear(), 11, 31);
        setDates([start, end]);

        const load = async () => {
            const result = await BAO_CAO_Service.thongKeChuKySo({
                startDate: start,
                endDate: end,
            });
            setData(result);
        };
        load();
    }, []);

    useEffect(() => {
        const _chartData = {
            labels: data.map(item => item.ten_dv), // Tên đơn vị
            datasets: [
                {
                    label: 'Thành công',
                    backgroundColor: '#42A5F5',
                    data: data.map(item => item.total_trans_success),
                },
                {
                    label: 'Thất bại',
                    backgroundColor: '#FF6384',
                    data: data.map(item => item.total_trans_fail),
                },
            ],
        };
        setChartData(_chartData)
    }, [data])

    console.log("render")
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
    };
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
        setLoading(true)
        try {
            const result = await BAO_CAO_Service.thongKeChuKySo({
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
        } finally { setLoading(false) }

    };


    const headerList = (options) => {
        const className = `${options.className} flex flex-wrap justify-content-between align-items-center`;

        return (
            <div className={className}>
                <span className="font-bold text-xl">
                    Thống kê chữ ký số
                </span>

            </div>
        );
    };



    return (
        <>
            <Toast ref={toast} />
            <div className="border-round-3xl bg-white ">
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
                            loading={loading}
                            label="Tìm kiếm"
                            style={{ backgroundColor: "#1445a7" }}
                            onClick={Search}
                        />
                    </div>
                    <div
                        className="panel-content"
                        style={{}}
                    >
                        {/* Biểu đồ */}
                        <div className="mb-5" style={{ width: "100%", padding: "10px" }}>
                            <label className="text-xl font-semibold">Biểu đồ so sánh trực quan</label>
                            <div className="chart">
                                <Chart type="bar" data={chartData} options={chartOptions} style={{ height: '420px' }} />
                            </div>
                        </div>

                        {/* Bảng */}
                        <div style={{ width: "100%", padding: "10px" }}>
                            <TableThongKe data={data} />
                        </div>
                    </div>
                </Panel>
            </div>
        </>
    );
};

export default memo(ThongKe_SL_ChuKy);
