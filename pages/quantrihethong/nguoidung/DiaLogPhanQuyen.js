import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Panel } from "primereact/panel";
import { TreeSelect } from 'primereact/treeselect';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useEffect, useState } from "react";
import { getNhomQuyen_byMaDVQLY, HT_NHOMQUYENService } from "../../../services/HT_NHOMQUYENService";
import { getAllD_DVIQLY } from '../../../services/DM_DVIQLYService';
import { HT_NGUOIDUNG_Service } from "../../../services/HT_NGUOIDUNGService";
import { HT_QUYEN_NGUOIDUNG_Service } from "../../../services/HT_QUYEN_NGUOIDUNG";

export const DialogPhanQuyen = ({ isDeleteMultiple, dataSelected, setDataSelected, visible, setVisible, toast, EditPhanQuyen = { isEdit: true, user: null }, loadData, search }) => {
    const [dataDVIQLY, setDataDVIQLY] = useState([]);
    const [dataNhomQuyen, setDataNhomQuyen] = useState([]);
    const [selectedDVIQLY, setSelectedDVIQLY] = useState(null)
    const [selectedNhomQuyen, setSelectedNhomQuyen] = useState(null)
    // Danh sách nhóm quyền của ng dùng khi sửa
    const [nhomQuyen_Old_ByUser, setNhomQuyen_Old_ByUser] = useState([])
    const [nhomQuyenEdit, setNhomQuyenEdit] = useState([])

    useEffect(() => {
        setSelectedDVIQLY(null)
        setNhomQuyenEdit([])
        setSelectedNhomQuyen(null)
        const getDVIQLY = async () => {

            let res = await getAllD_DVIQLY()
            res && setDataDVIQLY(res.map((d) => ({ label: d.teN_DVIQLY, value: d.mA_DVIQLY })))
        }
        getDVIQLY()
    }, [visible])

    const getQuyenOld_ByUser = async () => {
        let res = await HT_QUYEN_NGUOIDUNG_Service.getQuyenByUserID(EditPhanQuyen.user.id)
        setNhomQuyenEdit(res.map((d) => ({
            tenDonVi: d.tenDonVi,
            tenNhom: d.tenNhomQuyen,
            maNhom: d.idNhomQuyen
        })))
        setNhomQuyen_Old_ByUser(res.map((d) => ({
            id: d.id,
            maNhom: d.idNhomQuyen
        })))

    }

    useEffect(() => {
        if (EditPhanQuyen.user) {
            getQuyenOld_ByUser()
        }
    }, [EditPhanQuyen.user])

    useEffect(() => {
        console.log("selectedDVIQLY", selectedDVIQLY)
        const getNhomQuyen = async () => {
            let res = await getNhomQuyen_byMaDVQLY(selectedDVIQLY)
            res && setDataNhomQuyen(res.map((d) => ({ label: d.ten_nhom, value: d.nhom_id })))
        }
        selectedDVIQLY && getNhomQuyen()
    }, [selectedDVIQLY])

    const onPhanQuyenNhieu = async () => {

        if (selectedNhomQuyen) {
            let res = await HT_QUYEN_NGUOIDUNG_Service.create(dataSelected.map((d) => ({ mA_NGUOI_DUNG: String(d.id), mA_NHOM_TV: String(selectedNhomQuyen) })))
            if (res) {
                toast.current.show({ severity: 'success', summary: 'Thành công!', detail: 'Phân quyền thành công.', life: 3000 });
            }
        }
        else {
            toast.current.show({ severity: "error", summary: 'Thất bại!', detail: 'Hãy chọn quyền cho người dùng.', life: 3000 });

        }

    }


    // Thêm mới các quyền cho người cần sửa
    const onAddQuyenNew = () => {
        if (nhomQuyenEdit.find(n => n.maNhom == selectedNhomQuyen)) {

            toast.current.show({ severity: "error", summary: 'Thất bại!', detail: 'Quyền này đã tồn tại hãy thử quyền khác !', life: 3000 });

        }
        else {
            setNhomQuyenEdit([...nhomQuyenEdit,
            {
                tenDonVi: dataDVIQLY.find(d => d.value === selectedDVIQLY).label,
                tenNhom: dataNhomQuyen.find(n => n.value === selectedNhomQuyen).label,
                maNhom: selectedNhomQuyen
            }])

        }
    }


    const submitEditQuyen = async () => {
        if (selectedNhomQuyen) {
            console.log(nhomQuyenEdit.map((d) => ({ mA_NGUOI_DUNG: String(EditPhanQuyen.user.id), mA_NHOM_TV: String(d.maNhom) })))
            let res = await HT_QUYEN_NGUOIDUNG_Service.create(nhomQuyenEdit.map((d) => ({ mA_NGUOI_DUNG: String(EditPhanQuyen.user.id), mA_NHOM_TV: String(d.maNhom) })))
            if (res) {
                toast.current.show({ severity: 'success', summary: 'Thành công!', detail: 'Phân quyền thành công.', life: 3000 });
            }
        }
        else {
            toast.current.show({ severity: "error", summary: 'Thất bại!', detail: 'Hãy chọn quyền cho người dùng.', life: 3000 });

        }
    }

    // Xóa người dùng
    const onDelete = async () => {
        confirmDialog({
            message: 'Bạn có chắc chắn muốn xóa các người dùng này không?',
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {

                    await Promise.all(dataSelected.map(nd => HT_NGUOIDUNG_Service.delete(nd.id)));
                    // Hiển thị thông báo thành công
                    toast.current.show({
                        severity: 'success',
                        summary: 'Thành công!',
                        detail: 'Xóa danh sách người dùng thành công',
                        life: 3000
                    });
                    setDataSelected([])
                    loadData(search)
                    setVisible(false);
                }
                catch {
                    toast.current.show({ severity: "error", summary: 'Thất bại!', detail: 'Xóa danh sách người dùng thất bại.', life: 3000 });
                }
            }
        });
    }
    return (
        <>
            {!EditPhanQuyen.isEdit ?
                <Dialog header={<h4>{isDeleteMultiple ? "Xóa nhiều người dùng" : "Phân quyền người dùng"}</h4>} visible={visible} onHide={() => setVisible(false)}>
                    <Panel header="Danh sách " className="mb-2" >
                        <DataTable value={dataSelected} showGridlines paginator rows={10} style={{ fontSize: 12, fontWeight: "" }} rowsPerPageOptions={[5, 10, 25, 50, 100]}>
                            <Column header="STT" body={(_, { rowIndex }) => rowIndex + 1} className='w-auto' />
                            <Column field="hO_TEN" header="Họ tên" className="w-2" />
                            <Column field="teN_DANG_NHAP" header="Tên đăng nhập" className="w-2" />
                            <Column field="teN_DONVI" header="Tên Đơn vị" className="w-3" />
                            <Column field="email" header="Email" className="w-2" />
                            <Column field="teN_CHUCVU" header="Chức vụ" className="w-2" />
                            <Column field="tranG_THAI" header="Trạng thái" body={(row) => <span>{`${row.tranG_THAI === 0 ? "Hết" : "Còn"} hiệu lực`}</span>} className="w-2" />
                            <Column header="Thao tác" style={{ width: 100 }} body={(row) => (
                                <span className="flex  w-1">
                                    <Button size='small' className="w-1rem h-2rem p-3 mr-1 p-button-danger" icon="pi pi-trash"
                                        onClick={() => {

                                            setDataSelected(dataSelected.filter(nd => nd.teN_DANG_NHAP != row.teN_DANG_NHAP))
                                        }} />
                                </span>
                            )} />
                        </DataTable >


                    </Panel>

                    {!isDeleteMultiple &&
                        <Panel header="Chọn quyền">
                            <div className="flex justify-content-between ">
                                <Dropdown value={selectedDVIQLY} onChange={(e) => setSelectedDVIQLY(e.value)}
                                    options={dataDVIQLY}
                                    filter className="md:w-6 w-full mt-2" placeholder="-- Đơn vị quản lý -- "></Dropdown>
                                <Dropdown value={selectedNhomQuyen} onChange={(e) => setSelectedNhomQuyen(e.value)} options={dataNhomQuyen}
                                    filter className="md:w-5 w-full mt-2" placeholder="-- Nhóm Quyền -- "></Dropdown>

                            </div>
                        </Panel>
                    }


                    <div className='flex justify-content-end gap-2 mt-4'>
                        <Button label="Đóng" icon="pi pi-times" onClick={() => setVisible(false)} className='p-button-outlined' />

                        {!isDeleteMultiple ?
                            <Button label="Lưu lại" icon="pi pi-check" onClick={() => onPhanQuyenNhieu()} /> :
                            <Button label="Xóa nhiều" icon="pi pi-trash" className='p-button-danger' onClick={() => onDelete()} />}
                    </div>
                </Dialog >
                :

                <Dialog className='w-6' header={<h4>Sửa quyền người dùng </h4>} visible={visible} onHide={() => setVisible(false)}>
                    <Panel header={`Danh sách quyền của ${EditPhanQuyen.user.hO_TEN}`} className='mb-2 '>
                        <DataTable value={nhomQuyenEdit} showGridlines style={{ fontSize: 12 }} >
                            <Column field="tenDonVi" header="Tên Đơn vị" className="w-5" />
                            <Column field="tenNhom" header="Nhóm quyền hiện tại" className="w-5" />
                            <Column header="Thao tác" style={{ width: 50 }} body={(row) => (
                                <span className="flex  w-1">
                                    <Button size='small' className="w-1rem h-2rem p-3 mr-1 p-button-danger" icon="pi pi-trash"
                                        onClick={async () => {
                                            let quyenOld = nhomQuyen_Old_ByUser.find(n => n.maNhom === row.maNhom)
                                            if (quyenOld) {
                                                try {
                                                    await HT_QUYEN_NGUOIDUNG_Service.delete(quyenOld.id)
                                                    setNhomQuyen_Old_ByUser(nhomQuyen_Old_ByUser.filter(q => q.maNhom !== quyenOld.maNhom))
                                                }
                                                catch {
                                                    toast.current.show({ severity: "error", summary: 'Thất bại!', detail: 'Xóa quyền thất bại hãy thử lại sau.', life: 3000 });
                                                }
                                            }
                                            setNhomQuyenEdit(nhomQuyenEdit.filter(s => s.maNhom !== row.maNhom))
                                        }
                                        } />
                                </span>
                            )} />
                        </DataTable>
                    </Panel>
                    <Panel header="Chọn quyền mới">
                        <div className="flex justify-content-between ">
                            <Dropdown value={selectedDVIQLY} onChange={(e) => setSelectedDVIQLY(e.value)}
                                options={dataDVIQLY}
                                filter className="md:w-6 w-full mt-2" placeholder="-- Đơn vị quản lý -- " />
                            <Dropdown value={selectedNhomQuyen} onChange={(e) => setSelectedNhomQuyen(e.value)} options={dataNhomQuyen}
                                filter className="md:w-5 w-full mt-2" placeholder="-- Nhóm Quyền -- " />
                        </div>
                        <Button size="small" className="mt-4" label="Thêm quyền" severity="info" icon="pi pi-plus"
                            onClick={() => {
                                onAddQuyenNew()
                            }} />
                    </Panel>

                    <div className='flex justify-content-end gap-2 mt-4'>
                        <Button label="Đóng" icon="pi pi-times" onClick={() => setVisible(false)} className='p-button-outlined' />
                        <Button label="Lưu lại" icon="pi pi-check" onClick={() => { submitEditQuyen() }} />
                    </div>
                </Dialog>
            }
        </>



    );
};