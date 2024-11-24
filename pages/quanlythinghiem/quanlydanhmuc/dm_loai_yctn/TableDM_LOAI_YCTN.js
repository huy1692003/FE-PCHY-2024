import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import SearchGlobal from "../../../../components/SearchGlobal";
import { useEffect, useState } from "react";
import DM_LOAI_YCTNService from "../../../../services/quanlythinghiem/DM_LOAI_YCTNService";
import { headerStyleColumn, propSortAndFilter } from "../../../../constants/propGlobal";
import { Button } from "primereact/button";

const TableDM_LOAI_YCTN = ({ ListYCTN, setFormData, loadData, toast, setShowDialog, setIsAdd }) => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [data, setData] = useState(ListYCTN);

    useEffect(() => {
        setData(ListYCTN)
    }, [ListYCTN])
    return (
        <>
            <SearchGlobal setGlobalFilter={setGlobalFilter} />
            <DataTable
                value={data}
                globalFilter={globalFilter}
                emptyMessage="Không tìm thấy dữ liệu"
                showGridlines={true}
            >
                <Column
                    header="STT"
                    headerStyle={headerStyleColumn}
                    body={(data, options) => options.rowIndex + 1}
                    style={{ width: '4rem' }}
                />
                <Column
                    field="ten_loai_yc"
                    header="Loại yêu cầu thí nghiệm"
                    {...propSortAndFilter}
                    headerStyle={headerStyleColumn}
                />
                <Column
                    header="Thao tác"
                    headerStyle={headerStyleColumn}
                    style={{ width: '7rem' }}
                    bodyStyle={{ display: 'flex', justifyContent: 'center' }}
                    body={(rowData) => (
                        <div className="flex gap-2">
                            <Button
                                icon="pi pi-pencil"
                                tooltip="Sửa"
                                onClick={() => {
                                    console.log(rowData)
                                    setShowDialog(true)
                                    setIsAdd(false)
                                    setFormData(rowData);
                                }}
                                style={{ backgroundColor: "#1445a7", color: "#fff" }}
                            />
                            
                        </div>
                    )}
                />
            </DataTable>
        </>
    )
}
export default TableDM_LOAI_YCTN;