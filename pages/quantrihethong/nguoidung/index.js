import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { SplitButton } from 'primereact/splitbutton';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { Panel } from 'primereact/panel'
import { InputNumber } from 'primereact/inputnumber';
import { DialogForm } from './DialogForm';
import { Paginator } from 'primereact/paginator';
import { HT_NGUOIDUNG } from '../../../models/HT_NGUOIDUNG';
import { DialogPhanQuyen } from './DiaLogPhanQuyen';
import { HT_NGUOIDUNG_Service } from '../../../services/HT_NGUOIDUNGService';
import { apiClient } from '../../../constants/api';
import { get_All_DM_DONVI } from '../../../services/DM_DONVIService';
import { getAll_DM_CHUCVU } from '../../../services/DM_CHUCVU';
import { searchDM_PHONGBAN } from '../../../services/DM_PHONGBANService';
import { DialogResetPass } from './DialogResetPass';



const initSearch = {
    "hO_TEN": "",
    "teN_DANG_NHAP": "",
    "tranG_THAI": -1,
    "dM_DONVI_ID": "",
    "dM_PHONGBAN_ID": "",
    "dM_CHUCVU_ID": "",
    "pageIndex": 1,
    "pageSize": 10
}

const NguoiDung = () => {
    const [NguoiDung, setNguoiDung] = useState([]);
    const [DM_DONVI, setDM_DONVI] = useState([]);
    const [DM_CHUCVU, setDM_CHUCVU] = useState([]);
    const [DM_PHONGBAN, setDM_PHONGBAN] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);  // Tổng số bản ghi
    const [pageSize, setPageSize] = useState(initSearch.pageSize);   // Số bản ghi trên mỗi trang
    const [pageIndex, setPageIndex] = useState(initSearch.pageIndex);
    const [searchTerm, setSearchTerm] = useState(initSearch)
    const [filter, setFilter] = useState('')
    const [DataFilter, setDataFilter] = useState([]);
    const [isAdd, setIsAdd] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);
    const [visiblePhanQuyen, setvisiblePhanQuyen] = useState(false);
    const [formData, setFormData] = useState(HT_NGUOIDUNG);
    const [selectedNguoiDung, setSelectedNguoiDung] = useState([]);
    const [isDeleteMultiple, setIsDeleteMultiple] = useState(false);
    const [changePass, setChangePass] = useState({ visible: false, idUser: null });
    const [editPhanQuyen, setEditPhanQuyen] = useState({
        isEdit: false,
        user: null
    });

    const toast = useRef(null);

    // Lấy dữ liệu người dùng khi thay đổi trang hoặc số bản ghi trên mỗi trang
    useEffect(() => {
        loadData({ ...searchTerm, pageIndex, pageSize })
    }, [pageIndex, pageSize]);

    // Lấy dữ liệu người dùng khi thay đổi trang hoặc số bản ghi trên mỗi trang
    const loadData = async (searchTerm) => {
        let res = await HT_NGUOIDUNG_Service.search(searchTerm);
        console.log(res.data)
        if (res) {
            setNguoiDung(res.data);  // Dữ liệu của người dùng từ API
            setDataFilter(res.data);  // Dữ liệu của người dùng từ API
            setTotalRecords(res.totalRecords);  // Tổng số bản ghi từ API
        }

    };

    // Lấy dữ liệu đơn vị khi load trang
    useEffect(() => {
        loadDM_DONVI()
        loadDM_CHUCVU()
        loadDM_PHONGBAN()
    }, [])


    // Lấy dữ liệu đơn vị 
    const loadDM_DONVI = async () => {
        let res = await get_All_DM_DONVI()
        console.log(res)
        if (res) {
            setDM_DONVI([{ id: "", name: '-- Tất cả --' }, ...res.map(item => ({
                id: item.id,
                name: item.ten
            }))])
        }
    }

    // Lấy dữ liệu chức vụ
    const loadDM_CHUCVU = async () => {
        let res = await getAll_DM_CHUCVU()
        if (res) {
            setDM_CHUCVU([{ id: "", name: '-- Tất cả --' }, ...res.map(item => ({
                id: item.id,
                name: item.ten
            }))])
        }
    }

    const loadDM_PHONGBAN = async () => {
        let res = await searchDM_PHONGBAN({})
        console.log(res)
        if (res) {
            setDM_PHONGBAN(res.data.map(item => ({
                id: item.id,
                name: item.ten
            })))
        }
    }



    // Sự kiện khi thay đổi trang hoặc số bản ghi trên mỗi trang
    const onPageChange = (event) => {

        setPageIndex(event.page + 1);  // Cập nhật pageIndex từ sự kiện
        setPageSize(event.rows);    // Cập nhật pageSize từ sự kiện

    };


    // Sự kiện khi sửa người dùng
    const onEdit = async (kh) => {
        setIsAdd(false);
        let resUser = await HT_NGUOIDUNG_Service.getById(kh.id)
        setFormData(resUser);
        setVisibleForm(true);
    };

    // Sự kiện khi xóa người dùng
    const onDelete = (kh) => {
        confirmDialog({
            message: 'Bạn có chắc chắn muốn xóa người dùng này không?',
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {

                    let res = await HT_NGUOIDUNG_Service.delete(kh.id)
                    toast.current.show({ severity: 'success', summary: 'Xóa thành công', detail: `Người dùng ID= ${kh.id}`, life: 3000 });
                    loadData(searchTerm)
                }
                catch {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa người dùng thất bại! Hãy thử lại.', life: 3000 });
                }
            }
        });
    };

    // Sự kiện khi chọn nhiều người dùng phân quyền người dùng
    const items = useRef([
        {
            label: 'Phân quyền',
            icon: 'pi pi-users',
            command: () => {
                setEditPhanQuyen({ isEdit: false, user: null })
                setIsDeleteMultiple(false)
                setvisiblePhanQuyen(true)
            }
        },
        {
            label: 'Xóa nhiều',
            icon: 'pi pi-user-minus',
            command: () => {
                setEditPhanQuyen({ isEdit: false, user: null })
                setIsDeleteMultiple(true)
                setvisiblePhanQuyen(true)
            }
        }
    ])

    // Tìm kiếm tĩnh không gọi api (local)
    const onFilterChangeTable = (e) => {
        const value = e.target.value;
        setFilter(value);

        if (value) {
            // Lọc trên dữ liệu tĩnh
            const filteredData = NguoiDung.filter((item) =>
                item.hO_TEN.toLowerCase().includes(value.toLowerCase()) ||
                item.teN_DANG_NHAP.toLowerCase().includes(value.toLowerCase()) ||
                item.email.toLowerCase().includes(value.toLowerCase())
            );
            setDataFilter(filteredData);
        } else {
            setDataFilter(NguoiDung); // Trả về dữ liệu ban đầu nếu không có từ khóa
        }
    };

    // Template header
    const headerTemplate = (options) => {
        const className = `${options.className} justify-content-space-between`
        return (
            <div className={className} >
                <span className='font-bold text-xl'>Danh sách người dùng</span>
                <span>
                    {selectedNguoiDung.length > 0 && <SplitButton model={items.current} label="Bổ sung" icon="pi pi-plus" severity={"success"} rounded />}
                    <InputText
                        className="mx-2"
                        type="search"
                        value={filter || ''}
                        onChange={(e) => onFilterChangeTable(e)}
                        placeholder="Nhập từ khóa"
                    />
                    <Button icon="pi pi-plus-circle" style={{ backgroundColor: "#1146A6" }} className='background-blue text-sm' label='Thêm mới' onClick={() => {
                        setIsAdd(true);
                        setFormData(HT_NGUOIDUNG);
                        setVisibleForm(true);
                    }} />
                </span>
            </div>
        )
    }

    const onLockOrUnlock = async (user) => {
        let res = await HT_NGUOIDUNG_Service.lockOrUnlock(user.id, user.tranG_THAI === 0 ? 1 : 0)
        if (res) {
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: `Cập nhật trạng thái thành công`, life: 1000 });
            loadData(searchTerm)
        }
    }

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className='border-round-3xl bg-white p-4 text-lg'>
                <Panel header="Tìm kiếm">
                    <div className='flex flex-wrap p-fluid gap-3'>
                        <div className='field w-4' >
                            <label>Họ tên</label>
                            <InputText value={searchTerm.hO_TEN} onChange={(e) => setSearchTerm({ ...searchTerm, hO_TEN: e.target.value })} placeholder='Nhập họ tên cần tìm' type='search' style={{ width: '100%' }} />
                        </div>
                        <div className='field w-4' >
                            <label>Tên đăng nhập</label>
                            <InputText value={searchTerm.teN_DANG_NHAP} onChange={(e) => setSearchTerm({ ...searchTerm, teN_DANG_NHAP: e.target.value })} placeholder='Nhập tên đăng nhập cần tìm' type='search' style={{ width: '100%' }} />
                        </div>
                        <div className='field w-3' >
                            <label>Trạng thái</label>
                            <Dropdown value={searchTerm.tranG_THAI} onChange={(e) => setSearchTerm({ ...searchTerm, tranG_THAI: e.target.value })} placeholder='-- Chọn trạng thái --' optionLabel='name' optionValue='id' options={[{ id: -1, name: '-- Tất cả --' }, { id: 1, name: 'Còn hiệu lực' }, { id: 0, name: 'Hết hiệu lực' }]} />
                        </div>
                        <div className='field w-4' >
                            <label>Đơn vị</label>
                            <Dropdown value={searchTerm.dM_DONVI_ID} filter onChange={(e) => setSearchTerm({ ...searchTerm, dM_DONVI_ID: e.target.value })} placeholder='-- Chọn đơn vị --' optionLabel='name' optionValue='id' options={DM_DONVI} />
                        </div>
                        <div className='field w-4' >
                            <label>Chức vụ</label>
                            <Dropdown value={searchTerm.dM_CHUCVU_ID} filter placeholder='-- Tất cả --' optionLabel='name' optionValue='id' onChange={(e) => setSearchTerm({ ...searchTerm, dM_CHUCVU_ID: e.target.value })} options={DM_CHUCVU} />
                        </div>
                    </div>
                    <div className='flex justify-content-center mt-2'>
                        <Button label='Tìm kiếm' style={{ backgroundColor: '#1445a7' }} onClick={() => loadData(searchTerm)} />
                    </div>
                </Panel>


                <p className="mt-4 mb-2">* Ghi chú : <span style={{ color: "red" }}>Tích chọn vào những người cần thao tác sẽ hiển thị nút Bổ sung để Phân Quyền hoặc Xóa nhiều .</span> </p>


                <Panel headerTemplate={headerTemplate}  >
                    <DataTable
                        selection={selectedNguoiDung}
                        onSelectionChange={(e) => { setSelectedNguoiDung(e.value) }} dataKey='teN_DANG_NHAP'
                        value={DataFilter} showGridlines
                        style={{ fontSize: 12, fontWeight: "" }}
                    >

                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column field="hO_TEN" header="Họ tên" className="w-2" />
                        <Column field="teN_DANG_NHAP" header="Tên đăng nhập" className="w-2" />
                        <Column field="teN_DONVI" header="Tên Đơn vị" className="w-3" />
                        <Column field="email" header="Email" className="w-2" />
                        <Column field="teN_CHUCVU" header="Chức vụ" className="w-2" />
                        <Column field="tranG_THAI" header="Trạng thái" body={(row) => <span>{`${row.tranG_THAI === 0 ? "Không" : "Còn"} hiệu lực`}</span>} className="w-2" />
                        <Column header="Thao tác" style={{ width: 100 }} body={(rowData) => {

                            return (
                                <span className="flex  w-1">
                                    <Button size='small' className="w-1rem h-2rem p-3 mr-1" style={{ backgroundColor: "#1146A6" }} icon={rowData.tranG_THAI === 0 ? "pi pi-lock-open" : "pi pi-lock"} tooltip={rowData.tranG_THAI === 0 ? 'Mở khóa người dùng' : 'Khóa người dùng'} onClick={() => onLockOrUnlock(rowData)} />
                                    <Button size='small' className="w-1rem h-2rem p-3 mr-1" style={{ backgroundColor: "#1146A6" }} icon="pi pi-user-plus" tooltip='Phân quyền người dùng' onClick={() => {
                                        setvisiblePhanQuyen(true)
                                        setEditPhanQuyen({ isEdit: true, user: rowData }
                                        )
                                    }} />
                                    <Button size='small' className="w-1rem h-2rem p-3 mr-1" style={{ backgroundColor: "#1146A6" }} icon="pi pi-user-edit" tooltip='Sửa thông tin người dùng' onClick={() => onEdit(rowData)} />
                                    <Button size='small' className="w-1rem h-2rem p-3 mr-1 p-button-danger" icon="pi pi-trash" tooltip='Xóa người dùng' onClick={() => onDelete(rowData)} />
                                    <Button size='small' className="w-1rem h-2rem p-3 mr-1" style={{ backgroundColor: "#1146A6" }} icon="pi pi-sync" tooltip='Reset mật khẩu ' onClick={() => setChangePass({ visible: true, idUser: rowData.id })} />
                                </span>
                            )
                        }} />
                    </DataTable>
                    {totalRecords > 0
                        &&
                        <Paginator
                            first={((pageIndex - 1) * pageSize)}  // Vị trí đầu tiên của trang hiện tại
                            rows={pageSize}
                            totalRecords={totalRecords}
                            onPageChange={onPageChange}
                            rowsPerPageOptions={[5, 10, 20, 50]}
                        />}
                </Panel>
            </div>

            {visiblePhanQuyen && <DialogPhanQuyen
                isDeleteMultiple={isDeleteMultiple}
                dataSelected={selectedNguoiDung}
                loadData={loadData}
                search={searchTerm}
                setDataSelected={setSelectedNguoiDung}
                EditPhanQuyen={editPhanQuyen}
                visible={visiblePhanQuyen}
                setVisible={setvisiblePhanQuyen}
                toast={toast} />}

            {visibleForm && <DialogForm isAdd={isAdd}
                search={searchTerm}

                toast={toast}
                DM_DONVI={DM_DONVI}
                DM_CHUCVU={DM_CHUCVU}
                DM_PHONGBAN={DM_PHONGBAN}
                formData={formData}
                setFormData={setFormData}
                loadData={loadData}
                visible={visibleForm}
                setVisible={setVisibleForm} />}
            {
                changePass.visible &&
                <DialogResetPass
                    toast={toast}
                    idNguoiDung={changePass.idUser}
                    visible={changePass.visible}
                    onClose={() => setChangePass({ ...changePass, visible: false })} />
            }
        </>
    );
};
export default NguoiDung
