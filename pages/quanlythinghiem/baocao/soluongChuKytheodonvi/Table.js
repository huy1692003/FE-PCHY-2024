import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const TableThongKe = ({ data }) => {
    // Tính tổng số liệu
    const totals = data.reduce((acc, curr) => {
        acc.total_trans += curr.total_trans;
        acc.total_trans_success += curr.total_trans_success;
        acc.total_trans_fail += curr.total_trans_fail;
        return acc;
    }, { total_trans: 0, total_trans_success: 0, total_trans_fail: 0 });

    // Thêm hàng tổng số
    const footerGroup = [
        {
            ten_dv: 'Tổng số',
            total_trans: totals.total_trans,
            total_trans_success: totals.total_trans_success,
            total_trans_fail: totals.total_trans_fail
        }
    ];

    return (
        <DataTable title='Chi tiết' showGridlines value={[...data, ...footerGroup]} stripedRows responsiveLayout="scroll">
            <Column field="ten_dv" header="Tên Đơn Vị" ></Column>
            <Column field="total_trans" header="Tổng số lần ký" ></Column>
            <Column field="total_trans_success" header="Ký Thành Công" ></Column>
            <Column field="total_trans_fail" header="Ký Thất Bại" ></Column>
        </DataTable>
    );
};

export default TableThongKe;
