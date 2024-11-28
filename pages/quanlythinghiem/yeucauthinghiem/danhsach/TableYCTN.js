import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import React, { useState } from 'react';
import { headerStyleColumn, propSortAndFilter } from '../../../../constants/propGlobal';

const TableYCTN = ({dataYCTN}) => {
    
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button 
                    icon="pi pi-pencil" 
                    rounded 
                    outlined 
                    className="mr-2"
                    onClick={() => {}}
                />
                <Button 
                    icon="pi pi-trash" 
                    rounded 
                    outlined 
                    severity="danger" 
                    onClick={() => {}}
                />
            </div>
        );
    };

    const indexBodyTemplate = (rowData, options) => {
        return options.rowIndex + 1;
    };

    const headerTemplate = (header) => {
        return (
            <span className="text-sm md:text-base lg:text-base whitespace-nowrap overflow-hidden text-overflow-ellipsis text-center" 
                  style={{minWidth: '120px', display: 'block'}}>
                {header}
            </span>
        );
    };

    return (
        <DataTable
            showGridlines
            value={dataYCTN}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableStyle={{ minWidth: '50rem' }}
            selectionMode="checkbox"
            dataKey="id"
        >
           
            <Column headerStyle={headerStyleColumn} header="STT" body={indexBodyTemplate} style={{ width: '2rem' }} bodyStyle={{textAlign: 'center'}}></Column>
            <Column headerStyle={headerStyleColumn} {...propSortAndFilter} field="thongTinYCTN" header={headerTemplate("Thông tin Yêu cầu thí nghiệm")}></Column>
            <Column headerStyle={headerStyleColumn} {...propSortAndFilter} field="thongTinChung" header={headerTemplate("Thông tin chung")}></Column>
            <Column headerStyle={headerStyleColumn} {...propSortAndFilter} field="donViThucHien" header={headerTemplate("Đơn vị thực hiện")}></Column>
            <Column headerStyle={headerStyleColumn} {...propSortAndFilter} field="thongTinKhoiTao" header={headerTemplate("Thông tin khởi tạo")}></Column>
            <Column headerStyle={headerStyleColumn} {...propSortAndFilter} field="trangThai" header={headerTemplate("Trạng thái")}></Column>
            <Column headerStyle={headerStyleColumn} header={headerTemplate("Thao tác")} body={actionBodyTemplate} style={{ width: '10rem' }}></Column>
        </DataTable>
    );
};

export default TableYCTN;
