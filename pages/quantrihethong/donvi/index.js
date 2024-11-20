import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import React, { useRef, useState, useEffect, useCallback } from "react";
import "primeicons/primeicons.css";
import { Dropdown } from "primereact/dropdown";
import { DM_DONVI } from "../../../models/DM_DONVI";
import Link from "next/link";
import { Paginator } from 'primereact/paginator';
import { BreadCrumb } from "primereact/breadcrumb";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from "primereact/dialog";
import Head from "next/head";
import provinceData from '/public/demo/data/data_province.json'
import { delete_DM_DONVI, get_All_DM_DONVI, getDM_DONVI_ByID, insert_DM_DONVI, search_DM_DONVI, update_DM_DONVI } from "../../../services/quantrihethong/DM_DONVIService";
import { Password } from "primereact/password";
import { getAllD_DVIQLY, } from "../../../services/quantrihethong/DM_DVIQLYService";

const DonVi = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [arr_DONVI, setArr_DONVI] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [arr_DONVI_QLY, setArr_DONVI_QLY] = useState([]);
  const [formData, setFormData] = useState(DM_DONVI);
  const [formFilter, setFormFilter] = useState({ ten: "", ma: "" });
  const [keyFilter, setKeyFilter] = useState();
  const [showDialog, setShowDialog] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState({});
  const [selectedDonVis, setSelectedDonVis] = useState([]);
  const toast = useRef(null);

  const loadDataDVI = useCallback(async () => {
    try {
      const items = await search_DM_DONVI({ pageIndex: page, pageSize, ...keyFilter });
      setArr_DONVI(items.data);
      
      setTotalRecords(items.totalItems);
      setPageCount(Math.ceil(items.totalItems / pageSize));
    } catch (err) {
      console.error("Không thể tải dữ liệu:", err);
      toast.current.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể tải dữ liệu',
        life: 3000
      });
    }
  }, [page, pageSize, keyFilter]);

  useEffect(() => {
    loadDataDVI();
  }, [page, pageSize, keyFilter, loadDataDVI]);

  useEffect(() => {
    const load_DVIQLY = async () => {
      const data = await get_All_DM_DONVI();
      if (data) {
        setArr_DONVI_QLY(data.map(d => ({ id: d.id, name: d.ten })));
      }
    };
    load_DVIQLY();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredData(arr_DONVI);
    } else {
      const filtered = arr_DONVI.filter(item =>
        item.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ma_dviqly.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, arr_DONVI]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value,
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [field]: !value ? 'Trường này là bắt buộc' : '',
    }));
  };

  const handleChangeFilter = (field, value) => {
    setFormFilter(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleEdit = async (donVi) => {
    try {
      const fetchedData = await getDM_DONVI_ByID(donVi.id);
      setFormData({ ...fetchedData });
      setIsAdd(false);
      setShowDialog(true);
    } catch (error) {
      console.error('Error fetching unit data:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể tải dữ liệu đơn vị để chỉnh sửa.',
        life: 3000,
      });
    }
  };

  const onPageChange = (event) => {
    setPage(event.page + 1);
    setPageSize(event.rows);
  };

  const confirmDelete = async (donVi) => {
    try {
      await delete_DM_DONVI(donVi.id);
      toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đơn vị đã được xóa', life: 3000 });
      loadDataDVI();
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa đơn vị', life: 3000 });
    }
  };

  const confirmDeleteSelected = async () => {
    try {
      await Promise.all(selectedDonVis.map(donVi => delete_DM_DONVI(donVi.id)));
      toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Các đơn vị đã được xóa', life: 3000 });
      setPage(selectedMenus.length===pageSize?(page>1?page-1:1):page);
      setSelectedDonVis([]);

      loadDataDVI();
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa các đơn vị', life: 3000 });
    }
  };

  const onDeleteConfirm = (donVi) => {
    confirmDialog({
      message: 'Bạn có chắc chắn muốn xóa đơn vị này?',
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => confirmDelete(donVi),
      reject: () => {
        toast.current.show({ severity: 'info', summary: 'Đã hủy', detail: 'Hành động xóa đã bị hủy', life: 3000 });
      }
    });
  };

  const onDeleteSelectedConfirm = () => {
    confirmDialog({
      message: 'Bạn có chắc chắn muốn xóa các đơn vị đã chọn?',
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: confirmDeleteSelected,
      reject: () => {
        toast.current.show({ severity: 'info', summary: 'Đã hủy', detail: 'Hành động xóa đã bị hủy', life: 3000 });
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.ten) newErrors.ten = 'Trường này là bắt buộc';
    if (!formData.dm_tinhthanh_id) newErrors.dm_tinhthanh_id = 'Trường này là bắt buộc';
    if (!formData.dm_quanhuyen_id) newErrors.dm_quanhuyen_id = 'Trường này là bắt buộc';

    if (!formData.ma_dviqly) newErrors.ma_dviqly = 'Trường này là bắt buộc';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveDonVi = async () => {
    if (!validateForm()) {
      toast.current.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng điền đầy đủ thông tin',
        life: 3000
      });
      return;
    }

    try {
      if (isAdd) {
        await insert_DM_DONVI(formData);
        toast.current.show({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Thêm mới đơn vị thành công',
          life: 3000
        });
      } else {
        await update_DM_DONVI(formData);
        toast.current.show({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Cập nhật đơn vị thành công',
          life: 3000
        });
      }

      setShowDialog(false);
      loadDataDVI();
    } catch (error) {
      console.error("Không thể lưu hoặc cập nhật đơn vị:", error);
      toast.current.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể lưu hoặc cập nhật đơn vị',
        life: 3000
      });
    }
  };

  const openNewDonVi = () => {
    setFormData(DM_DONVI);
    setIsAdd(true);
    setShowDialog(true);
  };

  const hideDialog = () => {
    setShowDialog(false);
  };

  const donViDialogFooter = (
    <div className="text-center">
      <Button label='Lưu' style={{ backgroundColor: '#1445a7', color: '#fff' }} className="border-transparent" onClick={saveDonVi} />
      <Button label='Đóng' style={{ backgroundColor: '#666666', color: '#fff' }} className="border-transparent" onClick={hideDialog} />
    </div>
  );

  const headerList = (options) => {
    const className = `${options.className} justify-content-space-between`;

    return (
      <div className={className}>
        <span className="font-bold text-2xl">Danh sách</span>
        <div>
          {selectedDonVis.length > 0 && <Button label="Xóa nhiều" style={{ backgroundColor: '#d9534f', marginRight: '8px' }} onClick={onDeleteSelectedConfirm} disabled={!selectedDonVis.length}></Button>}
          <Button label="Thêm mới" style={{ backgroundColor: '#1445a7' }} onClick={openNewDonVi}></Button>
        </div>
      </div>
    );
  };

  const dataTrangThai = [
    { id: 1, name: 'Còn hiệu lực' },
    { id: 0, name: 'Hết hiệu lực' },
  ];

  const breadcrumb_router = [
    { label: 'Danh mục hệ thống' },
    {
      label: 'Đơn vị',
      template: () => <Link href='/danhmuchethong/donvi'>Đơn vị</Link>
    },
  ];
  const home = { icon: 'pi pi-home', url: '/' };

  return (
    <React.Fragment>
      <div className="grid">
        <div className="col-12">
          <div className="card">
            <Toast ref={toast} />
            <Panel header="Tìm kiếm">
              <div className="flex justify-content-between p-fluid gap-3">
                <div className="field" style={{ width: '50%' }}>
                  <label>Mã đơn vị</label>
                  <InputText
                    placeholder="Nhập mã đơn vị "
                    value={formFilter.ma}
                    onChange={(e) => handleChangeFilter("ma", e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="field" style={{ width: '50%' }}>
                  <label>Tên đơn vị</label>
                  <InputText
                    placeholder="Nhập tên đơn vị "
                    value={formFilter.ten}
                    onChange={(e) => handleChangeFilter("ten", e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
              <div className='flex justify-content-center mt-2'>
                <Button label='Tìm kiếm' style={{ backgroundColor: '#1445a7' }} onClick={() => {
                  console.log(formFilter);  
                  setPage(1);
                  setPageSize(5);
                  setKeyFilter(formFilter);
                }} />
              </div>
            </Panel>

            <Panel headerTemplate={headerList} className="mt-4">
              <div style={{ textAlign: "right " }}>
                <InputText
                  style={{ width: 300 }}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Tìm kiếm..."
                />
              </div>

              <DataTable
                value={filteredData}
                className="datatable-responsive mt-5"
                showGridlines
                selection={selectedDonVis}
                onSelectionChange={(e) => setSelectedDonVis(e.value)}
              >
                <Column
                  selectionMode="multiple"
                  headerStyle={{
                    width: '4rem',
                    backgroundColor: '#1445a7',
                    color: '#fff'
                  }}
                />
                <Column
                  field="ten"
                  header='Tên đơn vị'
                  headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                />
                <Column
                  field="ma_dviqly"
                  header='Mã Đơn Vị Quản Lý'
                  headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                />
                <Column
                  field="dm_tinhthanh_id"
                  header="Tỉnh"
                  headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                  body={(rowData) => {
                    const province = provinceData.find(p => p.code === Number.parseInt(rowData.dm_tinhthanh_id));
                    return province ? province.name : 'Không có';
                  }}
                />
                <Column
                  field="dm_quanhuyen_id"
                  header="Huyện"
                  headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                  body={(rowData) => {
                    const province = provinceData.find(p => p.code === Number.parseInt(rowData.dm_tinhthanh_id));
                    const district = province?.districts?.find(d => d.code === Number.parseInt(rowData.dm_quanhuyen_id));
                    return district ? district.name : 'Không có';
                  }}
                  filter
                  filterMatchMode="contains"
                  filterPlaceholder="Tìm huyện"
                />
                <Column
                  header='Thao tác'
                  headerStyle={{ backgroundColor: '#1445a7', color: '#fff', width: '6rem' }}
                  body={(rowData) => (
                    <div className="flex justify-content-between gap-3">
                      <Button icon="pi pi-pencil" tooltip="Sửa" onClick={() => handleEdit(rowData)} style={{ backgroundColor: '#1445a7' }} />
                      <Button icon="pi pi-trash" tooltip="Xóa" onClick={() => onDeleteConfirm(rowData)} style={{ backgroundColor: '#1445a7', border: "none" }} />
                    </div>
                  )}
                />
              </DataTable>
              {totalRecords > 0 && (
                <Paginator
                  first={((page - 1) * pageSize)}
                  rows={pageSize}
                  totalRecords={totalRecords}
                  onPageChange={onPageChange}
                  rowsPerPageOptions={[5, 10, 20, 50]}
                />
              )}
            </Panel>

            <Dialog
              visible={showDialog}
              style={{ width: '40%', height: "85%" }}
              header='Thông tin đơn vị'
              className="p-fluid"
              onHide={hideDialog}
              footer={donViDialogFooter}
            >
              <div className="field">
                <label>
                  <span className="text-red-400">(*) </span>
                  Tên đơn vị
                </label>
                <InputText
                  placeholder="Nhập tên đơn vị"
                  required
                  id="tenDonVi"
                  value={formData.ten}
                  onChange={(e) => handleChange("ten", e.target.value)}
                  className={errors.ten && 'p-invalid'}
                />
                {errors.ten && <small className="p-error">{errors.ten}</small>}
              </div>

              <div className="field">
                <label>
                  <span className="text-red-400">(*) </span>
                  Tỉnh thành
                </label>
                <Dropdown
                  filter
                  value={formData.dm_tinhthanh_id}
                  options={provinceData.map(s => ({ name: s.name, id: s.code + "" }))}
                  onChange={(e) => handleChange("dm_tinhthanh_id", e.value)}
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Chọn Tỉnh/Thành phố"
                  className={errors.dm_tinhthanh_id && 'p-invalid'}
                />
                {errors.dm_tinhthanh_id && <small className="p-error">{errors.dm_tinhthanh_id}</small>}
              </div>

              <div className="field">
                <label>
                  <span className="text-red-400">(*) </span>
                  Quận huyện
                </label>
                <Dropdown
                  filter
                  value={formData.dm_quanhuyen_id}
                  options={(provinceData.find(s => s.code === Number.parseInt(formData.dm_tinhthanh_id)))?.districts?.map(s => ({ name: s.name, id: s.code + "" })) || []}
                  onChange={(e) => handleChange("dm_quanhuyen_id", e.value)}
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Chọn Quận/Huyện"
                  disabled={!formData.dm_tinhthanh_id}
                  className={errors.dm_quanhuyen_id && 'p-invalid'}
                />
                {errors.dm_quanhuyen_id && <small className="p-error">{errors.dm_quanhuyen_id}</small>}
              </div>

              <div className="field">
                <label>
                  <span className="text-red-400">(*) </span>
                  Trạng thái
                </label>
                <Dropdown
                  value={formData.trang_thai}
                  options={dataTrangThai}
                  onChange={(e) => handleChange("trang_thai", e.value)}
                  placeholder="Chọn trạng thái"
                  optionLabel="name"
                  optionValue="id"
                  className={errors.trang_thai && 'p-invalid'}
                />

              </div>

              {/* <div className="field">
                <label>
                  <span className="text-red-400">(*) </span>
                  Sắp xếp
                </label>
                <InputText
                  required
                  id="sapXep"
                  value={formData.sap_xep}
                  onChange={(e) => handleChange("sap_xep", e.target.value)}
                />
              </div> */}

              <div className="field">
                <label>
                  <span className="text-red-400">(*) </span>
                  Mã đơn vị quản lý
                </label>
                <InputText
                  placeholder="Nhập mã đơn vị quản lý"
                  required
                  id="ma_dviqly"
                  value={formData.ma_dviqly}
                  onChange={(e) => handleChange("ma_dviqly", e.target.value)}
                  className={errors.ma_dviqly && 'p-invalid'}
                />
                {errors.ma_dviqly && <small className="p-error">{errors.ma_dviqly}</small>}
              </div>
            </Dialog>
          </div>
        </div>
      </div>
      <ConfirmDialog />
    </React.Fragment>
  );
};

export default DonVi;
