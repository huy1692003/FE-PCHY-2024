import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import React, { memo, useState } from 'react';
import { headerStyleColumn, propSortAndFilter } from '../../../constants/propGlobal';
import { urlServer } from '../../../constants/api';
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';
import { Steps } from 'primereact/steps'; // Import Steps từ PrimeReact
import ViewKyso from './viewKyso';
import { formatDateTime } from '../../../utils/FunctionFormart';
import { ro } from 'date-fns/locale';


const TableDocument = ({ data ,loading}) => {
    const { total, items } = data
    console.log(items)
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);

    // Định nghĩa render cho cột "Thao tác"
    const actionBodyTemplate = (rowData) => {
        return (
            <span className='flex gap-2'>
                <Button
                    tooltip='Xem chi tiết'
                    icon="pi pi-eye"
                    className="p-button-rounded text-lg"
                    style={{ width: 35, height: 35, backgroundColor: "rgb(20, 69, 167)" }}
                    onClick={() => handleViewOrKySo(rowData)}
                />
                <Button
                    tooltip='Tải xuống'
                    icon="pi pi-arrow-circle-down"
                    className="text-lg"
                    style={{ width: 35, height: 35, backgroundColor: "rgb(20, 69, 167)" }}
                    onClick={() => handleDownload(rowData.file_upload)}
                />
            </span>
        );
    };

    // Hàm xử lý "Xem" PDF
    const handleViewOrKySo = (data) => {
        setSelectedDocument(data);
        setDialogVisible(true);
    };

    // Hàm xử lý "Tải xuống" PDF
    const handleDownload = (fileUrl) => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileUrl.split('/').pop(); // Lấy tên file từ URL
        link.click();
    };

    return (
        <div className='w-full'>
            <DataTable showGridlines value={items} loading={loading} responsiveLayout="scroll" >
                {/* Cột STT */}
                <Column headerStyle={headerStyleColumn} field="stt" header="STT" body={(rowData, { rowIndex }) => rowIndex + 1} />

                {/* Cột Thông tin chung */}
                <Column
                    style={{ maxWidth: 350 }}
                    {...propSortAndFilter}
                    headerStyle={headerStyleColumn}
                    field="ThongTinChung.TEN_YCTN"
                    header="Thông tin chung"
                    body={(rowData) =>
                        <div className='px-1 ' >
                            <p className='mb-1 text-gray-700 text-base'><b className='font-semibold'>Mã YCTN: </b> <span className='font-normal'>{rowData.ma_yctn}</span></p>
                            <p className='mb-1 text-gray-700 text-base text-justify'><b className='font-semibold'>Tên YCTN: </b> <span className='font-normal'>{rowData.ten_yctn}</span></p>
                            <p className='mb-1 text-gray-700 text-base'><b className='font-semibold'>Loại hình TN: </b> <span className='font-normal'>{rowData.loai_yctn}</span></p>
                            {/* `${rowData.MA_YCTN} - ${rowData.ThongTinChung.TEN_YCTN} - ${rowData.ThongTinChung.LOAI_TN}` */}
                        </div>
                    }
                />

                {/* Cột Thông tin thiết bị */}
                <Column
                    {...propSortAndFilter}
                    style={{ maxWidth: 250 }}
                    headerStyle={headerStyleColumn}
                    field="ThongTinThietBi.TEN_TB"
                    header="Thông tin thiết bị"
                    
                    body={(rowData) =>
                        <div className='px-1 ' >
                            <p className='mb-1 text-gray-700 text-base '><b className='font-semibold'>Mã loại thiết bị: </b> <span className='font-normal'>{rowData.ma_loaitb}</span></p>
                            <p className='mb-1 text-gray-700 text-base'><b className='font-semibold'>Tên thiết bị: </b> <span className='font-normal'>{rowData.ten_thietbi}</span></p>
                            <p className='mb-1 text-gray-700 text-base'><b className='font-semibold'>Số lượng : </b> <span className='font-normal'>{rowData.soluong}</span></p>
                            <p className='mb-1 text-gray-700 text-base'><b className='font-semibold'>Lần thứ: </b> <span className='font-normal'>{rowData.lanthu}</span></p>
                            {/* `${rowData.MA_YCTN} - ${rowData.ThongTinChung.TEN_YCTN} - ${rowData.ThongTinChung.LOAI_TN}` */}
                        </div>
                    }
                />

                {/* Cột Đơn vị thực hiện */}
                <Column
                    headerStyle={headerStyleColumn}
                    field="don_vi_thuc_hien"
                    header="Đơn vị thực hiện"
                    body={(row)=>{
                       return row.don_vi_thuc_hien?.map(s=><span className='block'>{s}</span>)
                    }}
                />

                {/* Cột Loại văn bản */}
                <Column
                    {...propSortAndFilter}
                    headerStyle={headerStyleColumn}
                    field="ten_loai_bb"
                    header="Loại văn bản"
                />

                {/* Cột Trạng thái */}
                <Column
                    {...propSortAndFilter}
                    headerStyle={headerStyleColumn}
                    header="Trạng thái"
                    body={(rowData) =>
                        <div>
                            <p className='my-0'>1. Tạo bởi: {rowData.nguoi_tao} ({formatDateTime(rowData.ngaytao)}) </p>
                            <p className='my-0'>2. Ký nháy: 
                                {rowData.list_NguoiKy.filter(s => s.nhom_nguoi_ky === 1)?.map((s, index) => {
                                    return <>
                                        <span className={s.trang_thai_ky === 0 ? "text-red-500" : "" + " m-0"}> {s.ten_dang_nhap} <span >({s.trang_thai_ky === 0 ? "Chưa ký " : formatDateTime(s.thoi_gian_ky)})</span></span><br />
                                    </>
                                })
                                }
                            </p>
                            <p className='my-0'>3. Ký trưởng phòng kỹ thuật: {rowData.list_NguoiKy.filter(s => s.nhom_nguoi_ky === 2)?.map((s, index) => {
                                return <>
                                    <span className={s.trang_thai_ky === 0 ? "text-red-500" : "" + " m-0"}> {s.ten_dang_nhap} <span >({s.trang_thai_ky === 0 ? "Chưa ký " : formatDateTime(s.thoi_gian_ky)})</span></span><br />
                                </>
                            })
                            }</p>
                            <p className='my-0'>4. Ký giám đốc:{rowData.list_NguoiKy.filter(s => s.nhom_nguoi_ky === 3)?.map((s, index) => {
                                return <>
                                    <span className={s.trang_thai_ky === 0 ? "text-red-500" : "" + " m-0"}> {s.ten_dang_nhap} <span >({s.trang_thai_ky === 0 ? "Chưa ký " : formatDateTime(s.thoi_gian_ky)})</span></span><br />
                                </>
                            })
                            } </p>


                        </div>
                    } // Hiển thị mỗi trạng thái trên 1 hàng mới
                />

                {/* Cột Thao tác */}
                <Column headerStyle={headerStyleColumn} body={actionBodyTemplate} header="Thao tác" />
            </DataTable>

            {/* Dialog hiển thị PDF */}

            {selectedDocument && <ViewKyso setShow={setDialogVisible} Detail={selectedDocument} Show={dialogVisible} />}
        </div >
    );
};

export default memo(TableDocument);
