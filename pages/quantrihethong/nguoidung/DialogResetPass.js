// Start of Selection
import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { HT_NGUOIDUNG_Service } from '../../../services/quantrihethong/HT_NGUOIDUNGService';

export const DialogResetPass = ({ idNguoiDung, visible, onClose, toast }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleReset = async () => {
        if (newPassword.length < 8) {
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Mật khẩu mới phải có ít nhất 8 ký tự.', life: 3000 });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Mật khẩu mới và nhập lại mật khẩu không khớp.', life: 3000 });
            return;
        }

        setLoading(true);
        try {
            // Replace with the actual service method to reset the password
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
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
                        <div className="flex align-items-center">
                            <InputText
                                id="currentPassword"
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Nhập mật khẩu hiện tại"
                                className="w-full"
                            />
                            <Button
                                icon={showCurrentPassword ? 'pi pi-eye-slash' : 'pi pi-eye'}
                                className="p-button-text"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="newPassword">Mật khẩu mới</label>
                        <div className="flex align-items-center">
                            <InputText
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nhập mật khẩu mới"
                                className="w-full"
                            />
                            <Button
                                icon={showNewPassword ? 'pi pi-eye-slash' : 'pi pi-eye'}
                                className="p-button-text"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="confirmPassword">Nhập lại mật khẩu mới</label>
                        <div className="flex align-items-center">
                            <InputText
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu mới"
                                className="w-full"
                            />
                            <Button
                                icon={showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'}
                                className="p-button-text"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                        </div>
                    </div>
                </div>
                <div className="p-dialog-footer flex justify-content-end">
                    <Button label="Hủy" icon="pi pi-times" className="p-button-text" onClick={onClose} />
                    <Button label="Đặt lại" icon="pi pi-check" onClick={handleReset} loading={loading} />
                </div>
            </Dialog>
        </>
    );
};