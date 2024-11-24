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

const fieldList = [
    { id: 1, ten_truong: "Name", vi_tri: 1, ma_code: "Name" },
    { id: 2, ten_truong: "Code", vi_tri: 2, ma_code: "Code" },
    { id: 3, ten_truong: "Tổng giá trị", vi_tri: 3, ma_code: "TongGiaTri" },
    { id: 4, ten_truong: "Nội dung", vi_tri: 4, ma_code: "NoiDung" },
    { id: 5, ten_truong: "Id khách hàng", vi_tri: 5, ma_code: "IdKhachHang" },
    { id: 6, ten_truong: "Loại tài sản", vi_tri: 6, ma_code: "LoaiTaiSan" },
    { id: 7, ten_truong: "Ngày tạo", vi_tri: 7, ma_code: "CreatedDate" },
    { id: 8, ten_truong: "Ngày xảy ra sự cố", vi_tri: 8, ma_code: "NgayXayRaSuCo" },
    { id: 9, ten_truong: "Ngày ký hợp đồng", vi_tri: 9, ma_code: "NgayKyHopDong" },
    { id: 10, ten_truong: "Giá trị dự toán trước thuế", vi_tri: 10, ma_code: "GiaTriDuToan_TruocThue" },
    { id: 11, ten_truong: "Giá trị dự toán thuế", vi_tri: 11, ma_code: "GiaTriDuToan_Thue" },
    { id: 12, ten_truong: "Phần trăm thuế", vi_tri: 12, ma_code: "PhanTram_Thue" },
    { id: 13, ten_truong: "Giá trị dự toán sau thuế", vi_tri: 13, ma_code: "GiaTriDuToan_SauThue" },
    { id: 14, ten_truong: "Giá trị chiết giảm", vi_tri: 14, ma_code: "GiaTriDuToan_ChietGiam" },
    { id: 15, ten_truong: "Phần trăm chiết giảm", vi_tri: 15, ma_code: "PhanTram_ChietGiam" },
    { id: 16, ten_truong: "Giá trị dự toán sau chiết giảm", vi_tri: 16, ma_code: "GiaTriDuToan_SauChietGiam" },
    { id: 17, ten_truong: "FileUpload", vi_tri: 17, ma_code: "FileUpload" },
    { id: 18, ten_truong: "test", vi_tri: 18, ma_code: "test" }
];

const DialogForm = ({ show, setShow, isAdd, formData, ListYCTN, loadData, toast, setListYCTN }) => {
    const [form, setForm] = useState(formData);
    const [fields, setFields] = useState(fieldList);
    const [selectedFields, setSelectedFields] = useState([]);
    const [listSelectedOld, setListSelectedOld] = useState([])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const get_PHAN_MIEN_YCTN_BY_LOAI_YCTN = async (id_loai_yctn) => {
        console.log(id_loai_yctn)
        let res = await DM_LOAI_YCTNService.get_PHAN_MIEN_YCTN_BY_LOAI_YCTN(id_loai_yctn);
        setListSelectedOld(res)
        const matchedFields = res.map(record => {
            return fieldList.find(field => field.id === record.ma_truong_yctn);
        }).filter(Boolean); // Loại bỏ giá trị null (nếu không khớp)
        setSelectedFields(matchedFields);
    }

    useEffect(() => {
        setForm(formData)
        if (!isAdd && formData.id) {
            // console.log(formData.id)
            setSelectedFields([])            
            get_PHAN_MIEN_YCTN_BY_LOAI_YCTN(formData.id)
            // console.log(listSelectedOld)
        }
        else {
            setSelectedFields([])
        }
    }, [formData])


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
                        disabled={!isAdd}
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
                        <Column {...headerStyleColumn} field="vi_tri" header="STT" style={{ width: '4rem' }}></Column>
                        <Column {...propSortAndFilter} field="ten_truong" header="Tên trường"></Column>
                        <Column {...headerStyleColumn} field="ma_code" header="Mã code"></Column>
                        <Column {...headerStyleColumn} selectionMode="multiple"  header="Phân miền" headerStyle={{width:"8rem"}}></Column>
                    </DataTable>
                </div>
            </div>
        </Dialog>
    );
};


export default DialogForm;