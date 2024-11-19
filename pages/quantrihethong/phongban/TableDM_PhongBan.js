import React, { useState } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { ConfirmDialog } from "primereact/confirmdialog";

// import { IconField } from "primereact/iconfield";
// import { InputIcon } from "primereact/inputicon";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { deleteDM_PHONGBAN } from "../../../services/quantrihethong/DM_PHONGBANService";
import { FilterMatchMode, PrimeIcons } from "primereact/api";
import { InputText } from "primereact/inputtext";
const TableDM_PhongBan = ({
    setVisible,
    setIsUpdate,
    setPHONGBAN,
    data,
    pageCount,
    setPage,
    setPageSize,
    page,
    pageSize,
    loadData,
    toast,
}) => {
    const rowsPerPageOptions = [5, 10, 25];
    const [isHide, setIsHide] = useState(false);
    const [id, setId] = useState();
    const [globalFilterValue, setGlobalFilterValue] = useState("");

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        ten: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        trang_thai: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });

    const confirm = async () => {
        setIsHide(false);
        try {
            await deleteDM_PHONGBAN(id);
            toast.current.show({
                severity: "success",
                summary: "Thông báo",
                detail: "Xóa bản ghi thành công",
                life: 3000,
            });
            loadData();
        } catch (err) {
            console.log(err);
            toast.current.show({
                severity: "error",
                summary: "Thông báo",
                detail: "Xóa bản ghi không thành công",
                life: 3000,
            });
        }
    };

    const cancel = () => {
        setIsHide(false);
    };



    const buttonOption = (rowData) => {
        return (
            <div className="flex">
                <Button
                    style={{ marginRight: "10px", backgroundColor: "#1445a7" }}
                    icon="pi pi-pencil"
                    tooltip="Sửa"
                    tooltipOptions={{ position: "top" }}
                    onClick={() => {
                        setVisible(true);
                        setIsUpdate(true);
                        setPHONGBAN(rowData);
                        console.log(rowData);
                    }}
                />
                <Button
                    icon="pi pi-trash"
                    tooltip="Xóa"
                    tooltipOptions={{ position: "top" }}
                    style={{
                        backgroundColor: "#1445a7",
                    }}
                    onClick={() => {
                        setIsHide(true);
                        setId(rowData.id);
                    }}
                />
            </div>
        );
    };

    const header = (
        <div
            className="card-header flex  w-full p-4"
            style={{ alignItems: "center", justifyContent: "space-between" }}
        >
            <h3 className="m-0">Danh sách</h3>
            <Button
                label="Thêm mới"
                icon="pi pi-plus"
                raised
                style={{
                    backgroundColor: "#1445a7",
                }}
                onClick={() => {
                    setVisible(true);
                    setIsUpdate(false);
                }}
            />
        </div>
    );

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
        <>
            <Card header={header}>
                <Divider style={{ marginTop: "0", marginBottom: "10px" }} />
                <DataTable
                    value={data.data}
                    // globalFilter={['ten', 'trang_thai']}
                    showGridlines
                    stripedRows
                    header={renderHeader()}
                    filters={filters}
                    onFilter={(e) => setFilters(e.filters)}
                    rowkey="id"
                    rows={pageSize}
                    rowsPerPageOptions={[5, 10]}
                    className="datatable-responsive"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                >
                    <Column
                        field="STT"
                        header="STT"
                        headerClassName="text-lg bg-blue-600 text-white font-semibold justify-center"
                        body={(rowData, { rowIndex }) => {
                            return rowIndex + 1;
                        }}
                    ></Column>
                    {/* <Column
                        headerClassName="table__header text-lg bg-blue-600 text-white font-semibold justify-center"
                        field="ma"
                        header="MÃ PHÒNG BAN"
                    ></Column> */}
                    <Column
                        headerClassName="table__header text-lg bg-blue-600 text-white font-semibold justify-center"
                        field="ten"
                        header="TÊN PHÒNG BAN"
                    ></Column>
                    <Column
                        headerClassName="table__header text-lg bg-blue-600 text-white font-semibold justify-center"
                        field="ten_dviqly"
                        header="TÊN ĐƠN VỊ QUẢN LÝ"
                        body={(rowData) => {
                            return (
                                <span style={{ textTransform: "capitalize" }}>
                                    {rowData.ten_dviqly.toLowerCase()}
                                </span>
                            );
                        }}
                    ></Column>
                    <Column
                        headerClassName="table__header text-lg bg-blue-600 text-white font-semibold justify-center"
                        field="trang_thai"
                        header="TRẠNG THÁI"
                        body={(rowData) => {
                            return rowData.trang_thai === 1
                                ? "Có hiệu lực"
                                : "Hết hiệu lực";
                        }}
                    ></Column>
                    <Column
                        headerClassName="table__header text-lg bg-blue-600 text-white font-semibold justify-center"
                        body={buttonOption}
                        header="THAO TÁC "
                    ></Column>
                </DataTable>
                <div
                    style={{ marginTop: "20px", justifyContent: "center" }}
                    className="flex justify-between items-center mt-4"
                >
                    <div
                        className="flex items-center"
                        style={{ alignItems: "center" }}
                    >
                        <Button
                            outlined
                            text
                            icon={PrimeIcons.ANGLE_DOUBLE_LEFT}
                            onClick={() =>
                                setPage((prev) => Math.max(prev - 1, 1))
                            }
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
                            onClick={() =>
                                setPage((prev) => Math.min(prev + 1, pageCount))
                            }
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
            </Card>

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

export default TableDM_PhongBan;
