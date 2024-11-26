import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useState, useEffect } from 'react';
import { Notification } from '../../../../utils/notification';
import { Dialog } from 'primereact/dialog';
import { DM_TRUONG_YCTN_Service } from '../../../../services/quanlythinghiem/DM_TRUONG_YCTN_Service';
import { DM_TRUONG_YCTN } from '../../../../models/DM_TRUONG_YCTN';


const DialogForm = ({ show, setShowDialog, isAdd, formData,setFormData, loadData, toast }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const renderHeader = () => {
        return (
            <div className="flex align-items-center justify-content-between">
                <span>{isAdd ? "Thêm mới trường yêu cầu" : "Cập nhật trường yêu cầu"}</span>
                <div className="flex gap-2">
                    <Button
                        label="Lưu"
                        severity="success"
                        style={{
                            backgroundColor: "#1445a7",
                        }}
                        onClick={handleSubmit}
                    />
                    <Button
                        label="Đóng"
                        outlined
                        severity="secondary"
                        onClick={() => setShowDialog(false)}
                    />
                </div>
            </div>
        );
    };

    const handleSubmit = async () => {
        if (isAdd) {
            try {
                await DM_TRUONG_YCTN_Service.create_DM_TRUONG_YCTN(formData);
                Notification.success(toast, "Thêm mới loại thiết bị thành công");
                loadData();
                setShowDialog(false);
            } catch (error) {
                Notification.error(toast, "Thêm mới loại thiết bị thất bại");
            }
        } else {
            try {
                await DM_TRUONG_YCTN_Service.update_DM_TRUONG_YCTN(formData);
                Notification.success(toast, "Cập nhật loại thiết bị thành công");
                loadData();
                setShowDialog(false);
            } catch (error) {
                Notification.error(toast, "Cập nhật loại thiết bị thất bại");
            }
            
        }
        setFormData(DM_TRUONG_YCTN)
    }
    return (
        <Dialog
            header={renderHeader}
            visible={show}
            closable={false}
            style={{ width: '50vw', height: 'auto', overflowY: "visible" }}
            contentStyle={{ paddingTop: "10px" }}
        >
            <div className="grid p-fluid">
                <div className="flex flex-column gap-2 w-full">
                    <div>
                        <label htmlFor="" className="block mb-2">Tên trường<span className="text-red-500">*</span></label>
                        <InputText
                            id="ten_truong"
                            name="ten_truong"
                            value={formData.ten_truong}
                            className="w-full"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="" className="block mb-2">Mã<span className="text-red-500">*</span></label>
                        <InputText
                            id="ma_code"
                            name="ma_code"
                            value={formData.ma_code}
                            className="w-full"  
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="" className="block mb-2">Vị trí<span className="text-red-500">*</span></label>
                        <InputText
                            id="vi_tri"
                            name="vi_tri"
                            value={formData.vi_tri}
                            className="w-full"
                            onChange={handleChange}
                            keyfilter="int"  
                            placeholder="Nhập số"
                        />
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default DialogForm;