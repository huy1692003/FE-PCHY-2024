import React, { memo, use, useEffect, useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';
import { Timeline } from 'primereact/timeline';
import { urlServer } from '../../../constants/api';
import { formatDateTime } from '../../../utils/FunctionFormart';
import { InputTextarea } from 'primereact/inputtextarea';
import { Notification } from '../../../utils/notification';
import QLTN_KYSO_Service from '../../../services/quanlythinghiem/QLTN_KYSO_Service';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import LoadingOverlay from '../../../utils/Components/LoadingOverlay';
const ViewKySo = ({ Show, setShow, Detail, refeshData, toastParent, isMobile }) => {
    const [rejectDialogVisible, setRejectDialogVisible] = useState(false);  // Thay thế confirmVisible bằng rejectDialogVisible
    const [rejectionReason, setRejectionReason] = useState('');
    const user = JSON.parse(sessionStorage.getItem('user'));
    const { file_upload, chi_tiet_tn, list_NguoiKy, ma_loaitb, ten_thietbi, soluong, ma_yctn, ten_yctn, nguoi_tao, ngaytao } = Detail;
    const toast = useRef(null);
    const [loading, setLoading] = useState(false)
    //Bản ghi cần ký số 
    const record_kyso = list_NguoiKy.find(s => s.nhom_nguoi_ky === chi_tiet_tn.nhomky_hientai && s.id_nguoi_ky === user?.id && s.trang_thai_ky === 0) || null;

    useEffect(() => {
        setRejectDialogVisible(false);  // Đóng dialog từ chối khi Show thay đổi
        setRejectionReason('');  // Reset lý do từ chối
    }, [Show]);

    const renderSignerStatus = (signer) => (
        <div key={signer.id} className="font-normal text-base md:flex justify-content-between  my-1" style={{ minWidth: isMobile ? '120px' : '240px', maxWidth: isMobile ? '120px' : 'auto' }}>

            {signer.ho_ten} - {signer.ten_dang_nhap}
            <span style={{ minWidth: 80 }} className={
                signer.trang_thai_ky === 1 ? "text-blue-700 font-semibold" :
                    signer.trang_thai_ky === -1 ? "text-red-500" :
                        "text-orange-500"
            }>
                {signer.trang_thai_ky === 1 ? " ( Đã ký )" :
                    signer.trang_thai_ky === -1 ?
                        <span> ( Từ chối ký )
                            <Button label="Xem lý do" icon="pi pi-info-circle" className="block mt-3" onClick={() => Notification.info(toast, signer.ly_do_tu_choi, "Lý do từ chối ký văn bản", 13000)} /></span> :
                        " ( Chưa ký )"
                }
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
            description: <span style={{ minWidth: isMobile ? '120px' : '240px', maxWidth: isMobile ? '120px' : '' }} className='inline-block '>{nguoi_tao} khởi tạo văn bản</span>,
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

    const handleReject = () => {
        setRejectDialogVisible(true);  // Mở dialog từ chối
    };

    const handleCancelReject = () => {
        setRejectionReason('');  // Reset lý do từ chối
        setRejectDialogVisible(false);  // Đóng dialog từ chối
    };



    // status = 1 đồng ý kí , -1 từ chối kí
    const handleSubmit = async (status = 1) => {
        if (status === -1 && rejectionReason.trim() === '') {
            Notification.error(toast, 'Vui lòng nhập lý do từ chối.');
            return; // Thoát sớm nếu lý do từ chối không hợp lệ
        }
        const data = {
            id: record_kyso?.id,
            maCTTN: record_kyso?.ma_chi_tiet_tn,
            idNguoiKy: user?.id,
            nhomNguoiKy: record_kyso?.nhom_nguoi_ky,
            trangThai: status,
            lyDoTuChoi: status === -1 ? rejectionReason : null,
        };
        const executeUpdate = async () => {
            setLoading(true)
            try {
                if (!user?.so_cmnd || !user?.value_token) { Notification.error(toast, "Bạn chưa thêm thông tin về tài khoản ký số !", "Cần bổ sung thông tin", 5000); return }
                let res = await QLTN_KYSO_Service.update_TrangThai_Ky({
                    ...data,
                    requestSign: {
                        "userSign": {
                            "userID": user?.so_cmnd,
                            "serial_number": user?.value_token
                        },
                        "pathFileIn_Out": file_upload,
                        "descSign": "Ký số cho biên bản " + ma_yctn,
                        "fullNameUser": user?.ho_ten,
                        "idUserApp": user?.id,
                        "signType": record_kyso?.nhom_nguoi_ky > 1 ? 1 : 0,
                        "pathImageSign": user?.anhchukynhay,
                    }
                });
                if (res) {
                    setShow(false);
                    refeshData();
                    setRejectionReason(''); // Reset lý do từ chối
                    setRejectDialogVisible(false); // Đóng dialog từ chối
                    Notification.success(
                        toastParent,
                        status === 1
                            ? `Ký số thành công ${ma_yctn}`
                            : `Bạn vừa từ chối ký số thành công ${ma_yctn}`
                    );
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : error;
                Notification.error(toast,
                    errorMessage,  // Truyền thông điệp lỗi (chuỗi)
                    status === 1 ? `Ký số thất bại ${ma_yctn}` 
                                  : `Từ chối ký số thất bại ${ma_yctn}`,
                    7000
                );
            } finally {
                setLoading(false)
            }
        };

        if (status === 1) {
            confirmDialog({
                message: 'Xác nhận ký số cho văn bản?',
                header: 'Thông báo',
                icon: 'pi pi-question-circle',
                accept: executeUpdate,
                reject: () => { return },
            });
        } else {
            await executeUpdate();
        }
    };



    return (
        <Dialog
            visible={Show}
            closable={false}
            style={{ width: '94vw', minHeight: '88vh' }}
            header={dialogHeader}
            onHide={() => setShow(false)}
        >
            <Toast ref={toast} />
            <div className="flex flex-column md:flex-row gap-2">
                {file_upload && (
                    <div

                        style={{ height: isMobile ? '300px' : "90vh", width: "98%", minWidth: 300 }}
                    >
                        <iframe
                            src={
                                file_upload.endsWith('.pdf')
                                    ? urlServer + file_upload
                                    : file_upload.endsWith('.docx' || '.doc')
                                        ? `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent('https://thinghiem.pchungyen.vn/Documents/c205001e-67b9-478b-ad64-f0db800d26a4_NguoiKyChinh.pdf')}`
                                        : urlServer + file_upload // Xử lý với file khác nếu cần
                            }
                            type={file_upload.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream'}
                            width="100%"
                            height="100%"
                            title="File Preview"
                            style={{ border: 'none' }}
                        />


                    </div>
                )}

                <div className="w-full md:w-4 flex flex-col gap-2">
                    <div className="w-full p-2">
                        <Panel header="Thông tin YCTN">
                            {documentInfo.map((info, index) => (
                                <InputText
                                    key={index}
                                    readOnly
                                    value={`${info.label} ${info.value}`}
                                    className="w-full mb-2"
                                />
                            ))}
                        </Panel>

                        <Panel className="mt-1" header="Tiến trình ký số văn bản">
                            <div className="w-full">
                                <Timeline
                                    value={timelineItems}
                                    align="left"
                                    marker={(item) => (
                                        <i
                                            className={`pi ${item.isCompleted ? "pi-check-circle" : "pi-circle"}`}
                                            style={{
                                                fontSize: '1.5rem',
                                                color: item.isCompleted ? 'blue' : 'orange',
                                            }}
                                        />
                                    )}
                                    content={(item) => (
                                        <div
                                            style={{
                                                color: item.isCompleted ? 'green' : 'orange',
                                                marginBottom: 30,
                                            }}
                                        >
                                            <h6 className="text-base text-gray-700">{item.status}</h6>
                                        </div>
                                    )}
                                    opposite={(item) => (
                                        <div className="text-gray-600 text-base p-0">
                                            {item.date}
                                        </div>
                                    )}
                                />
                            </div>
                        </Panel>

                        {record_kyso && chi_tiet_tn.trang_thai_ky === 1 && (
                            <div className="flex flex-column sm:flex-row gap-2">
                                <Button
                                    label="Đồng ý ký"
                                    icon="pi pi-check"
                                    severity="info"
                                    className="w-full mt-3"
                                    onClick={() => handleSubmit(1)}
                                />
                                <Button
                                    label="Từ chối ký"
                                    icon="pi pi-times"
                                    severity="danger"
                                    className="w-full mt-3"
                                    onClick={handleReject}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Dialog từ chối ký */}
            <Dialog
                visible={rejectDialogVisible}
                style={{ width: '90vw', maxWidth: '500px' }}
                header={
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-info-circle text-primary text-3xl"></i>
                        <span>Xác nhận từ chối ký</span>
                    </div>
                }
                onHide={handleCancelReject}
            >
                <div className="w-full">
                    <InputTextarea
                        className="w-full inline-block"
                        rows={4}
                        id="rejectionReason"
                        placeholder="Lý do từ chối ký"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap justify-content-end gap-2 mt-3">
                    <Button
                        label="Xác nhận"
                        icon="pi pi-check"
                        severity="info"
                        onClick={() => handleSubmit(-1)}
                        className="flex-grow-1 sm:flex-grow-0"
                    />
                    <Button
                        label="Hủy"
                        icon="pi pi-times"
                        severity="secondary"
                        onClick={handleCancelReject}
                        className="flex-grow-1 sm:flex-grow-0"
                    />
                </div>
            </Dialog>
            <ConfirmDialog />
            <LoadingOverlay isLoading={loading} title={<span className='text-xl'>Đã gửi yêu cầu ký số đến app VNPT SMARTCA . <br /> <span className='text-red-500'>* Lưu ý : Yêu cầu này chỉ tồn tại trong 5 phút</span></span>} />
        </Dialog>

    );
};

export default memo(ViewKySo);
