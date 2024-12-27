import React, { memo } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';
import { Timeline } from 'primereact/timeline';
import { urlServer } from '../../../constants/api';
import { formatDateTime } from '../../../utils/FunctionFormart';

const ViewKySo = ({ Show, setShow, Detail }) => {
    const { file_upload, list_NguoiKy, ma_loaitb, ten_thietbi, soluong, ma_yctn, ten_yctn, nguoi_tao, ngaytao } = Detail;

    const renderSignerStatus = (signer) => (
        <div key={signer.id} className="font-normal text-base">
            {signer.ho_ten} - {signer.ten_dang_nhap}
            <span className={signer.trang_thai_ky === 1 ? "text-green-500" : "text-orange-500"}>
                {signer.trang_thai_ky === 1 ? " (Đã ký)" : " (Chưa ký)"}
            </span>
        </div>
    );

    const getSignersByGroup = (groupId) => list_NguoiKy.filter(s => s.nhom_nguoi_ky === groupId);

    const getSigningDate = (groupId) => {
        const signer = list_NguoiKy.find(s => s.nhom_nguoi_ky === groupId && s.thoi_gian_ky);
        return signer?.thoi_gian_ky && formatDateTime(signer.thoi_gian_ky);
    };

    const timelineItems = [
        {
            title: "Khởi tạo",
            description: `${nguoi_tao} khởi tạo văn bản`,
            date: formatDateTime(ngaytao),
            isCompleted: true,
            groupId: null
        },
        {
            title: "Ký nháy",
            groupId: 1
        },
        {
            title: "Ký trưởng phòng kỹ thuật",
            groupId: 2
        },
        {
            title: "Ký giám đốc",
            groupId: 3
        }
    ].map(item => ({
        ...item,
        status: item.groupId ? (
            <div>
                <span className='font-medium text-lg'>{item.title}</span><br />
                {getSignersByGroup(item.groupId).map(renderSignerStatus)}
            </div>
        ) : (
            <div>
                <span className='font-medium text-lg'>{item.title}</span><br />
                <span className="font-normal text-base">{item.description}</span>
            </div>
        ),
        date: item.date || getSigningDate(item.groupId),
        isCompleted: item.isCompleted || (item.groupId && getSignersByGroup(item.groupId).every(s => s.trang_thai_ky === 1))
    }));

    const dialogHeader = (
        <div className='flex justify-content-between'>
            <span>Chi tiết văn bản ký số</span>
            <Button label="Đóng" icon="pi pi-times" onClick={() => setShow(false)} />
        </div>
    );

    const documentInfo = [
        { label: 'Mã loại thiết bị:', value: ma_loaitb },
        { label: 'Tên thiết bị:', value: ten_thietbi },
        { label: 'Số lượng:', value: soluong },
        { label: 'Mã yêu cầu thí nghiệm:', value: ma_yctn },
        { label: 'Tên yêu cầu thí nghiệm:', value: ten_yctn },
        { label: 'Tạo bởi:', value: `${nguoi_tao} vào lúc ${formatDateTime(ngaytao)}` }
    ];

    return (
        <Dialog
            visible={Show}
            closable={false}
            style={{ width: '90%', minHeight: '88vh' }}
            header={dialogHeader}
            onHide={() => setShow(false)}
        >
            {file_upload && (
                <embed src={urlServer + file_upload} type="application/pdf" width="63%" height="100%" style={{ float: "left", minHeight: "100vh" }} />
            )}

            <div style={{ width: "36%", float: "right" }}>
                {documentInfo.map((info, index) => (
                    <InputText 
                        key={index}
                        readOnly 
                        value={`${info.label} ${info.value}`} 
                        className='w-full mb-2' 
                    />
                ))}
             
                <Panel header="Tiến trình ký số văn bản">
                    <div className='w-full'>
                        <Timeline
                            value={timelineItems}
                            align="left"
                            marker={(item) => (
                                <i className={`pi ${item.isCompleted ? "pi-check-circle" : "pi-circle"}`}
                                    style={{
                                        fontSize: '1.5rem',
                                        color: item.isCompleted ? 'blue' : 'orange',
                                    }}
                                />
                            )}
                            content={(item) => (
                                <div style={{ color: item.isCompleted ? 'green' : 'orange', marginBottom: 30 }}>
                                    <h6 className='text-base text-gray-700'>{item.status}</h6>
                                </div>
                            )}
                            opposite={(item) => (
                                <div className='text-gray-600 text-base p-0'>
                                    {item.date}
                                </div>
                            )}
                        />
                    </div>
                </Panel>
            </div>
        </Dialog>
    );
};

export default memo(ViewKySo);
