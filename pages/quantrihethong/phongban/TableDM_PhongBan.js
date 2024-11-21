import React, { useState } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { ConfirmDialog } from "primereact/confirmdialog";
import { propSortAndFilter } from "../../../constants/propGlobal";

import { Panel } from "primereact/panel";
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
    donvi,
    loadData,
    toast,
}) => {
    const rowsPerPageOptions = [5, 10, 25];
    const [isHide, setIsHide] = useState(false);
    const [id, setId] = useState();
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [isMultiDelete, setIsMultiDelete] = useState(false);

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        ten: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        trang_thai: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });

    const confirm = async () => {
        setIsHide(false);
        try {
            if (isMultiDelete) {
                await Promise.all(selectedRecords.map(record => deleteDM_PHONGBAN(record.id)));
                toast.current.show({
                    severity: "success",
                    summary: "Thông báo",
                    detail: "Xóa các bản ghi thành công",
                    life: 3000,
                });
            } else {
                await deleteDM_PHONGBAN(id);
                toast.current.show({
                    severity: "success",
                    summary: "Thông báo",
                    detail: "Xóa bản ghi thành công",
                    life: 3000,
                });
            }
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
                        setIsMultiDelete(false);
                    }}
                />
            </div>
        );
    };

    const headerTemplate = (options) => {
        const className = `${options.className} flex flex-wrap justify-content-between align-items-center gap-2`
        return (
            <div className={className} >
                <span className='text-xl font-bold'>Danh sách</span>
                <div className="flex flex-column sm:flex-row gap-3">
                    {selectedRecords.length > 0 &&
                        <Button
                            label="Xóa nhiều"
                           severity="danger"
                            onClick={() => {
                                setIsHide(true);
                                setIsMultiDelete(true);
                            }}
                            disabled={!selectedRecords.length}
                        />
                    }
                    <Button
                        label="Thêm mới"
                        style={{ backgroundColor: '#1445a7' }}
                        onClick={() => {
                            setVisible(true);
                            setIsUpdate(false);
                        }}
                    />
                </div>
            </div>
        )
    }



    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters["global"].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

   

    

    return (
        <>
            <Panel headerTemplate={headerTemplate}>
                <div className="flex justify-content-end mb-3">
                    <span className="p-input-icon-left w-full md:w-auto">
                        <i className="pi pi-search" />
                        <InputText
                            value={globalFilterValue}
                            onChange={onGlobalFilterChange}
                            placeholder="Tìm kiếm"
                            className="w-full md:w-auto"
                        />
                    </span>
                </div>
                <DataTable
                    value={data.data}
                    showGridlines
                    stripedRows

                    filters={filters}
                    onFilter={(e) => setFilters(e.filters)}
                    rowkey="id"
                    rows={pageSize}
                    rowsPerPageOptions={[5, 10]}
                    className="datatable-responsive"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    selection={selectedRecords}
                    onSelectionChange={(e) => setSelectedRecords(e.value)}
                    responsiveLayout="scroll"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3em', backgroundColor: '#1445a7', color: '#fff' }}></Column>
                    <Column
                        {...propSortAndFilter}
                        headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                        field="ten"
                        header="Tên phòng ban"
                        className="min-w-10rem"
                    ></Column>
                    <Column
                        {...propSortAndFilter}
                        headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                        field="ma_dviqly"
                        header="Mã ĐVQL"
                        className="min-w-8rem"
                    ></Column>
                    <Column
                        headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                        field="dm_donvi_id"
                        header="Tên đơn vị"
                        body={(rowData) => {
                            let nameDv = donvi?.find(item => item.id === rowData.dm_donvi_id)?.ten
                            return <span>{nameDv}</span>
                        }}
                        className="min-w-10rem"
                    ></Column>
                    <Column
                        headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                        field="trang_thai"
                        header="Trạng thái"
                        body={(rowData) => {
                            return rowData.trang_thai === 1
                                ? "Có hiệu lực"
                                : "Hết hiệu lực";
                        }}
                        className="min-w-8rem"
                    ></Column>
                    <Column
                        headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                        body={buttonOption}
                        header="Thao tác"
                        className="min-w-8rem"
                    ></Column>
                </DataTable>

                <div className="flex flex-column md:flex-row justify-content-between align-items-center gap-3 mt-4">
                    <div className="flex align-items-center">
                        <Button
                            outlined
                            text
                            icon={PrimeIcons.ANGLE_DOUBLE_LEFT}
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            severity="secondary"
                        />
                        <p className="mx-4 mb-0">
                            Trang {page} trong tổng số {pageCount} trang
                        </p>
                        <Button
                            outlined
                            text
                            severity="secondary"
                            icon={PrimeIcons.ANGLE_DOUBLE_RIGHT}
                            onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
                            disabled={page === pageCount}
                        />
                    </div>
                    <Dropdown
                        value={pageSize}
                        options={rowsPerPageOptions}
                        onChange={(e) => {
                            setPageSize(e.value);
                            setPage(1);
                        }}
                        placeholder="Select rows per page"
                        className="w-full md:w-auto"
                    />
                </div>

            </Panel>

            <Toast ref={toast} />
            <ConfirmDialog
                visible={isHide}
                onHide={() => setIsHide(false)}
                header="Xác nhận"
                message={isMultiDelete ? "Bạn có chắc chắn xóa các bản ghi này không?" : "Bạn có chắc chắn xóa bản ghi này không?"}
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
