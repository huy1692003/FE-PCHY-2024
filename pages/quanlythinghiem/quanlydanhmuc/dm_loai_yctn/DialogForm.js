import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Notification } from '../../../../utils/notification';
import DM_LOAIYCTN from '.';
import { Dialog } from 'primereact/dialog';
import DM_LOAI_YCTNService from '../../../../services/quanlythinghiem/DM_LOAI_YCTNService';
import { DM_LOAI_YCTN } from '../../../../models/DM_LOAI_YCTN';
import { apiClient } from '../../../../constants/api';
import axios from 'axios';
import { headerStyleColumn, propSortAndFilter } from '../../../../constants/propGlobal';
import { DM_TRUONG_YCTN_Service } from '../../../../services/quanlythinghiem/DM_TRUONG_YCTN_Service';


const DialogForm = ({ show, setShow, isAdd, formData, ListYCTN, loadData, toast, setListYCTN }) => {
    const [form, setForm] = useState(formData);
    const [fields, setFields] = useState([]);
    const [selectedFields, setSelectedFields] = useState([]);
    const [listSelectedOld, setListSelectedOld] = useState([])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const get_DM_TRUONG_YCTN = async () => {
        let res = await DM_TRUONG_YCTN_Service.getAll_DM_TRUONG_YCTN();
        setFields(res)
    }

    const get_PHAN_MIEN_YCTN_BY_LOAI_YCTN = async (id_loai_yctn) => {
        console.log(id_loai_yctn)
        let res = await DM_LOAI_YCTNService.get_PHAN_MIEN_YCTN_BY_LOAI_YCTN(id_loai_yctn);
        setListSelectedOld(res)
        console.log(res)
        const matchedFields = res.map(record => {
            return fields.find(field => field.id === record.ma_truong_yctn+"");
        }).filter(Boolean); // Loại bỏ giá trị null (nếu không khớp)
        setSelectedFields(matchedFields);
    }

    useEffect(() => {
        // Đặt lại dữ liệu form khi formData thay đổi
        setForm(formData)
        
        // Chỉ tải dữ liệu khi dialog được hiển thị
        if (show) {
            // Lấy danh sách các trường
            get_DM_TRUONG_YCTN()

            // Nếu đang chỉnh sửa bản ghi hiện có
            if (!isAdd && formData.id) {
                // Đặt lại các trường đã chọn trước khi tải
                setSelectedFields([])
                // Lấy các trường đã chọn cho bản ghi này
                get_PHAN_MIEN_YCTN_BY_LOAI_YCTN(formData.id)
            } else {
                // Xóa các trường đã chọn cho bản ghi mới
                setSelectedFields([])
            }
        }
    }, [formData, show, isAdd])


    const validateForm = () => {
        // Kiểm tra mã loại và tên loại không được rỗng
        if (!form.ma_loai_yctn && (!form.ten_loai_yc || !form.key_word)) {
            Notification.error(toast, "Mã loại yêu cầu, tên loại yêu cầu và từ khóa không được trống");
            return false;
        }
    

        // Kiểm tra mã loại không được trùng trong danh sách
        const isDuplicate = ListYCTN.some(item =>
            item.ma_loai_yctn === form.ma_loai_yctn
        );
        if (isAdd && isDuplicate) {
            Notification.error(toast, "Mã loại yêu cầu đã tồn tại");
            return false;
        }
        return true;
    };


    const insert_PHAN_MIEN_YCTN = async (id_loai_yctn, id_field) => {
        await DM_LOAI_YCTNService.insert_PHAN_MIEN_YCTN({
            id: 0,
            ma_truong_yctn: id_field,
            ma_loai_yctn: id_loai_yctn,
            ngay_tao: new Date()
        })
    }
    
    const delete_PHAN_MIEN_YCTN = async (id) => {
        let list_delete=listSelectedOld.filter(item =>
            !selectedFields.some(newItem => newItem.id === item.ma_truong_yctn)
        );
        await Promise.all(list_delete.map(item =>
            DM_LOAI_YCTNService.delete_PHAN_MIEN_YCTN(item.id)
        ));
    }

    const handleSubmit = async () => {
        if (validateForm()) {
            if (isAdd) {
                try {
                    await DM_LOAI_YCTNService.insert_DM_LOAI_YCTN({ ...form, ngay_tao: new Date() });
                    let res = await DM_LOAI_YCTNService.get_All_DM_LOAI_YCTN();
                    let id_loai_yctn = res.find(item => item.ma_loai_yctn === form.ma_loai_yctn).id;
                    await Promise.all(selectedFields.map(item =>
                        insert_PHAN_MIEN_YCTN(id_loai_yctn, item.id)
                    ));
                    Notification.success(toast, "Thêm mới loại yêu cầu thí nghiệm thành công");
                    setShow(false)
                    setForm(DM_LOAI_YCTN)
                    setSelectedFields([])
                } catch (error) {
                    Notification.error(toast, "Thêm mới loại yêu cầu thí nghiệm thất bại");
                }
            }
            else {
                try {
                    await DM_LOAI_YCTNService.update_DM_LOAI_YCTN({ ...form, ngay_sua: new Date() });
                    await delete_PHAN_MIEN_YCTN()
                    await Promise.all(selectedFields.map(item =>
                        insert_PHAN_MIEN_YCTN(form.id, item.id)
                    ));
                    Notification.success(toast, "Cập nhật loại yêu cầu thí nghiệm thành công");
                } catch (error) {
                    Notification.error(toast, "Cập nhật loại yêu cầu thí nghiệm thất bại");
                }
            }


        };
        loadData();
        setShow(false)
    }
  
    const renderHeader = () => {
        return (
            <div className="flex align-items-center justify-content-between">
                <span>{isAdd ? "Thêm mới loại yêu cầu thí nghiệm" : "Cập nhật loại yêu cầu thí nghiệm"}</span>
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
                            setForm(DM_LOAI_YCTN)
                            setShow(false)
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
            style={{ width: '80vw', overflowY: "visible" }}

        >
            <div className="grid p-fluid">
                <div className="col-12 md:col-6">
                    <label htmlFor="ma_loai_yctn" className="block mb-2">Mã loại yêu cầu <span className="text-red-500">*</span></label>
                    <InputText
                        id="ma_loai_yctn"
                        name="ma_loai_yctn"
                        value={form.ma_loai_yctn}
                        onChange={handleChange}
                        disabled={!isAdd}
                    />
                </div>

                <div className="col-12 md:col-6">
                    <label htmlFor="ten_loai_yc" className="block mb-2">Tên loại yêu cầu <span className="text-red-500">*</span></label>
                    <InputText
                        id="ten_loai_yc"
                        name="ten_loai_yc"
                        value={form.ten_loai_yc}
                        onChange={handleChange}
                    />
                </div>

                <div className="col-12">
                    <label htmlFor="key_word" className="block mb-2">Mã hiển thị (Dùng để tạo mã tự động cho YCTN) <span className="text-red-500">*</span></label>
                    <InputText
                        id="key_word"
                        name="key_word"
                        value={form.key_word}
                        onChange={handleChange}
                    />
                </div>

                <div className="col-12">
                    <label className="block mb-2">Danh sách trường</label>
                    <DataTable
                        value={fields}
                        selection={selectedFields}
                        onSelectionChange={e => setSelectedFields(e.value)}
                        dataKey="id"
                        scrollable
                        scrollHeight="400px"
                        showGridlines
                    >
                        <Column headerStyle={headerStyleColumn} field="vi_tri" header="STT" style={{ width: '4rem' }}></Column>
                        <Column headerStyle={headerStyleColumn} {...propSortAndFilter} field="ten_truong" header="Tên trường"></Column>
                        <Column headerStyle={headerStyleColumn} {...propSortAndFilter} field="ma_code" header="Mã code"></Column>
                        <Column selectionMode="multiple" headerStyle={headerStyleColumn} header="Phân miền" style={{width:"8rem"}}></Column>
                    </DataTable>
                </div>
            </div>
        </Dialog>
    );
};


export default DialogForm;