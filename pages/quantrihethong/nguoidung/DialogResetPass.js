import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { HT_NGUOIDUNG_Service } from '../../../services/quantrihethong/HT_NGUOIDUNGService';
import { validatePassword } from '../../../utils/Function';
import { Password } from 'primereact/password';

export const DialogResetPass = ({ idNguoiDung, visible, onClose, toast }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        if (!validatePassword(newPassword, toast)) {
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Mật khẩu mới và nhập lại mật khẩu không khớp.', life: 3000 });
            return;
        }

        setLoading(true);
        try {
            await HT_NGUOIDUNG_Service.resetPassword({ ID: idNguoiDung, currentPassword, newPassword });

            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đổi mật khẩu thành công', life: 5000 });
            onClose();
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.', life: 3000 });
        }
        setLoading(false);
    };

    return (
        <>
            <Dialog header="Đặt lại mật khẩu" visible={visible} style={{ width: '400px' }} onHide={onClose}>
                <div className="flex flex-column gap-4">
                    <div className="flex flex-column gap-2">
                        <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
                        <Password
                            inputid="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Nhập mật khẩu hiện tại"
                            toggleMask
                            feedback={false}
                            className="w-full"
                            inputClassName="w-full p-3"
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="newPassword">Mật khẩu mới</label>
                        <Password 
                            inputid="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Nhập mật khẩu mới"
                            toggleMask
                            className="w-full"
                            inputClassName="w-full p-3"
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="confirmPassword">Nhập lại mật khẩu mới</label>
                        <Password
                            inputid="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Nhập lại mật khẩu mới"
                            toggleMask
                            feedback={false}
                            className="w-full"
                            inputClassName="w-full p-3"
                        />
                    </div>
                </div>

                <div className="flex justify-content-end gap-2 mt-4">
                    <Button label="Hủy" icon="pi pi-times" className="p-button-text" onClick={onClose} />
                    <Button label="Đặt lại" icon="pi pi-check" onClick={handleReset} loading={loading} />
                </div>
            </Dialog>
        </>
    );
};