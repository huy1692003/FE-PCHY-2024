import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Notification } from '../../../../utils/notification';
import { Dialog } from 'primereact/dialog';
import { DM_LOAITHIETBI } from '../../../../models/DM_LOAITB';
import { headerStyleColumn, propSortAndFilter } from '../../../../constants/propGlobal';
import { DM_LOAI_THIET_BI_Service } from '../../../../services/quanlythinghiem/DM_LOAITHIETBIService';

const DialogForm = ({ show, setShowDialog, isAdd, formData, loadData, toast  }) => {
    const [form, setForm] = useState(formData);  

    useEffect(() => {
        setForm(formData);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSubmit = async () => {
        if (isAdd) {
            try {
                await DM_LOAI_THIET_BI_Service.create_DM_LOAITHIETBI(form);
                Notification.success(toast, "Thêm mới loại thiết bị thành công");
                loadData();
                setShowDialog(false);
            } catch (error) {
                Notification.error(toast, "Thêm mới loại thiết bị thất bại");
            }
        } else {
            try {
                await DM_LOAI_THIET_BI_Service.update_DM_LOAITHIETBI(form);
                Notification.success(toast, "Cập nhật loại thiết bị thành công");
                loadData();
                setShowDialog(false);
            } catch (error) {
                Notification.error(toast, "Cập nhật loại thiết bị thất bại");
            }
            
        }
        setForm(DM_LOAITHIETBI)
    }
    
    const renderHeader = () => {
        return (
            <div className="flex align-items-center justify-content-between">
                <span>{isAdd ? "Thêm mới tên loại thiết bị" : "Cập nhật loại thiết bị"}</span>
                <div className="flex gap-2">
                    <Button
                        label="Lưu"
                        onClick={() => handleSubmit()}
                        severity="success"
                        style={{
                            backgroundColor: "#1445a7",
                        }}
                    />
                    <Button
                        label="Đóng"
                        outlined
                        severity="secondary"
                        onClick={() => {
                            setForm(DM_LOAITHIETBI)
                            setShowDialog(false)
                        }}
                    />
                </div>
            </div>
        );
    };

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
                        <label htmlFor="" className="block mb-2">Tên loại thiết bị<span className="text-red-500">*</span></label>
                        <InputText
                            id="ten_loai_tb"
                            name="ten_loai_tb"
                            value={form.ten_loai_tb}
                            onChange={handleChange}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label htmlFor="ma_loai_tb" className="block mb-2">Mã loại thiết bị<span className="text-red-500">*</span></label>
                        <InputText
                            id="ma_loai_tb"
                            name="ma_loai_tb"
                            value={form.ma_loai_tb}
                            onChange={handleChange}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label htmlFor="ghi_chu" className="block mb-2">Ghi chú<span className="text-red-500">*</span></label>
                        <InputText
                            id="ghi_chu"
                            name="ghi_chu"
                            value={form.ghi_chu}
                            onChange={handleChange}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default DialogForm;