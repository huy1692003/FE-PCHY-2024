import Head from "next/head";
import { useRouter } from "next/router";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";
import { Dropdown } from "primereact/dropdown";
import { memo, useMemo, useState, useEffect, useRef, useLayoutEffect } from "react";
import { subDays, startOfToday, endOfToday } from "date-fns";
import { Button } from "primereact/button";
import TableDocument from "./tableDocument";
import { DM_LOAI_BIENBAN_Service } from "../../../services/quanlythinghiem/DM_LOAI_BIENBAN_Service";
import { get_All_DM_DONVI } from "../../../services/quantrihethong/DM_DONVIService";
import { Notification } from "../../../utils/notification";
import { Toast } from "primereact/toast";
import QLTN_KYSO_Service from "../../../services/quanlythinghiem/QLTN_KYSO_Service";
import { useMediaQuery } from 'react-responsive';

// List các trạng thái
const statusList = [
    { keyword: 0, title: "Tất cả văn bản" },
    { keyword: 1, title: "Văn bản chờ ký" },
    { keyword: 2, title: "Văn bản đã ký" },
    { keyword: -1, title: "Văn bản từ chối ký" },
];

const processKySoList = [
    { level: 1, title: "Ký nháy" },
    { level: 2, title: "Ký trưởng phòng kỹ thuật" },
    { level: 3, title: "Ký giám đốc" },
];

const rangeOptions = [
    { label: "Hôm Nay", value: "today" },
    { label: "7 Ngày Trước", value: "7" },
    { label: "30 Ngày Trước", value: "30" },
    { label: "Tháng Này", value: "month" },
    { label: "Tháng Trước", value: "lastMonth" },
    { label: "Năm Nay", value: "year" },
    { label: "Custom Range", value: "custom" },
];

const initSearch = {
    keyword: null,
    ngayBatDau: null,
    ngayKetThuc: null,
    status_Document: null,
    tienTrinhKySo: null,
    userId: null,
    donViThucHien: null,
    idLoaiBienBan: null
};

const Kyso = () => {
    const router = useRouter();
    const { status } = router.query;
    const currentStatus = parseInt(status) || 0;
    const [dates, setDates] = useState(null);
    const [listDocument, setListDocument] = useState({ total: 1, items: [] });
    const [danhmuc, setDanhmuc] = useState({ donvi: [], loaibienban: [] });
    const [rangeOption, setRangeOption] = useState("month");
    const [paginate, setPaginate] = useState({ page: 1, pageSize: 10 });
    const [paramSearch, setParamSearch] = useState(initSearch);
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [showFilter, setShowFilter] = useState(false);  // Điều khiển hiển thị các trường tìm kiếm
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const [loadingExport, setLoadingExport] = useState(false);
    const idUserCurrent = JSON.parse(sessionStorage.getItem('user'))?.id;
    const currentStatusTitle = useMemo(() => {
        return statusList.find((item) => item.keyword === currentStatus)?.title || "Không xác định";
    }, [currentStatus]);

    useLayoutEffect(() => {
        let today = startOfToday();
        let start = new Date(today.getFullYear(), today.getMonth(), 1);
        let end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        setDates([start, end]);

        const getDanhMuc = async () => {
            try {
                let dmDonVis = await get_All_DM_DONVI();
                setDanhmuc((prev) => ({ ...prev, donvi: dmDonVis }));
                let dmLoaiBienBans = await DM_LOAI_BIENBAN_Service.getAllDM_LOAI_BIENBAN();
                setDanhmuc((prev) => ({ ...prev, loaibienban: dmLoaiBienBans }));
            }
            catch (error) {
                console.log(error);
                setDanhmuc((prev) => ({ ...prev, donvi: [], loaibienban: [] }));
            }
        };

        getDanhMuc();
        search_Document(paginate, {
            ...paramSearch,
            status_Document: currentStatus === 0 ? null : currentStatus,
            userId: currentStatus === 1 ? idUserCurrent : null,
        });
    }, [currentStatus]);

    useLayoutEffect(() => {
        handleSearch();
    }, [paginate])


    const search_Document = async (paginate, paramSearch) => {
        setLoading(true);
        try {
            let res = await QLTN_KYSO_Service.SEARCH_VANBAN(paginate, paramSearch);
            if (res) {
                setListDocument((prev) => ({ ...prev, total: res.total, items: res.data }));
            }
        } catch (error) {
            Notification.error(toast, "Không tìm thấy biên bản nào phù hợp!");
        } finally {
            setLoading(false);
        }
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
        setParamSearch((prev) => ({ ...prev, ngaybatdau: start, ngayketthuc: end }));
    };

    const onCalendarChange = (e) => {
        const [start, end] = e.value || [null, null];
        setDates(e.value);
        setParamSearch((prev) => ({ ...prev, ngaybatdau: start, ngayketthuc: end }));
    };

    const onDropdownChange = (key, value) => {
        setParamSearch((prev) => ({ ...prev, [key]: value ?? null }));
    };

    const onKeywordChange = (e) => {
        setParamSearch((prev) => ({ ...prev, keyword: e.target.value ?? null }));
    };

    const handleSearch = async () => {
        search_Document(paginate, {
            ...paramSearch,
            status_Document: currentStatus === 0 ? null : currentStatus,
            userId: currentStatus === 1 ? idUserCurrent : null,
        });
    };


    const headerList = (options, currentStatusTitle) => {
        const className = `${options.className} flex flex-wrap justify-content-between align-items-center`;
        return (
            <div className={className + " mt-3"}>
                <span className="text-xl font-bold">{currentStatusTitle}</span>
                <Button
                    loading={loadingExport}
                    onClick={async () => {
                        setLoadingExport(true);
                        try {
                            // Gọi API để xuất file Excel
                            let res = await QLTN_KYSO_Service.exportExcel(paginate, paramSearch);
                            if (res) {
                                const blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                                const link = document.createElement("a");
                                link.href = URL.createObjectURL(blob);
                                link.download = `DanhSachVanBan_${new Date().toISOString()}.xlsx`;
                                // Tải file
                                link.click();
                                // Giải phóng bộ nhớ sau khi tải xong
                                URL.revokeObjectURL(link.href);
                            }


                        } catch (error) {
                            console.error("Có lỗi xảy ra khi xuất file Excel:", error);
                        } finally {
                            setLoadingExport(false);
                        }

                    }}
                    
                    label="Xuất file Excel"
                    icon="pi pi-file-excel"
                    className="bg-green-700 border-none font-medium flex align-items-center"
                />
            </div>
        );
    };

    return (
        <>
            <Head>
                <title>{currentStatusTitle}</title>
            </Head>
            <Toast ref={toast} />
            <Panel headerTemplate={(options) => headerList(options, currentStatusTitle)}>
                <div className={`box-filter ${isMobile ? 'flex-column' : 'flex justify-content-between gap-2'} mb-5`}>
                    {!isMobile && (
                        <>
                            <InputText
                                showClear
                                className="min-w-[200px] w-10rem"
                                placeholder="Từ khóa ..."
                                onChange={onKeywordChange}
                            />
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
                            <Dropdown
                                value={paramSearch.donvithuchien}
                                options={danhmuc.donvi}
                                style={{ maxWidth: 190 }}
                                onChange={(e) => onDropdownChange("donvithuchien", e.value)}
                                filter
                                optionLabel="ten"
                                optionValue="id"
                                placeholder="Đơn vị thực hiện"
                                showClear
                            />
                            <Dropdown
                                value={paramSearch.idloaibienban && +paramSearch.idloaibienban}
                                options={danhmuc.loaibienban}
                                onChange={(e) => onDropdownChange("idloaibienban", e.value)}
                                filter
                                style={{ maxWidth: 160 }}
                                optionLabel="ten_loai_bb"
                                optionValue="id"
                                placeholder="Loại văn bản"
                                showClear
                            />
                            <Dropdown
                                value={paramSearch.tienTrinhKySo}
                                options={processKySoList}
                                onChange={(e) => onDropdownChange("tienTrinhKySo", e.value)}
                                optionLabel="title"
                                style={{ maxWidth: 150 }}
                                optionValue="level"
                                placeholder="Trạng thái"
                                showClear
                            />
                            <Button className="text-white" type="primary" onClick={handleSearch}>
                                Tìm kiếm
                            </Button>
                        </>
                    )}
                    {isMobile && !showFilter && (
                        <Button className="text-white" type="primary" onClick={() => setShowFilter(true)}>
                            Tìm kiếm
                        </Button>
                    )}
                    {isMobile && showFilter && (
                        <div className="box-filter-mobile grid gap-2">
                            <InputText
                                showClear
                                className="w-full"
                                placeholder="Từ khóa ..."
                                onChange={onKeywordChange}
                            />
                            <Dropdown
                                value={rangeOption}
                                className="w-full"
                                options={rangeOptions}
                                onChange={onRangeChange}
                                optionLabel="label"
                            />
                            <Calendar
                                value={dates}
                                selectionMode="range"
                                showButtonBar
                                className="w-full"

                                onChange={onCalendarChange}
                                dateIcon="pi pi-calendar"
                                showIcon={true}
                            />
                            <Dropdown
                                value={paramSearch.donvithuchien}
                                options={danhmuc.donvi}
                                style={{ width: "100%" }}
                                onChange={(e) => onDropdownChange("donvithuchien", e.value)}
                                filter
                                optionLabel="ten"
                                optionValue="id"
                                placeholder="Đơn vị thực hiện"
                                showClear
                            />
                            <Dropdown
                                value={paramSearch.idloaibienban && +paramSearch.idloaibienban}
                                options={danhmuc.loaibienban}
                                onChange={(e) => onDropdownChange("idloaibienban", e.value)}
                                filter
                                style={{ width: "49%" }}
                                optionLabel="ten_loai_bb"
                                optionValue="id"
                                placeholder="Loại văn bản"
                                showClear
                            />
                            <Dropdown
                                style={{ width: "48%" }}
                                value={paramSearch.tienTrinhKySo}
                                options={processKySoList}
                                onChange={(e) => onDropdownChange("tienTrinhKySo", e.value)}
                                optionLabel="title"
                                optionValue="level"
                                placeholder="Trạng thái"
                                showClear
                            />
                            <div className="flex justify-content-around w-full mt-2">
                                <Button className="text-white" type="primary" onClick={handleSearch}>
                                    Tìm kiếm
                                </Button>
                                <Button className="text-white" type="text" onClick={() => setShowFilter(false)}>
                                    Đóng
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <TableDocument
                    isMobile={isMobile}
                    loading={loading}
                    data={listDocument}
                    paginate={paginate}
                    setPaginate={setPaginate}
                />
            </Panel>
        </>
    );
};

export default memo(Kyso);
