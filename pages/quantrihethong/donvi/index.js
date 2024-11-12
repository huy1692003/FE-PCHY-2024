import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import React, { useRef, useState, useEffect } from "react";
import "primeicons/primeicons.css";
import { useRouter } from "next/router";
import TableDM_DonVi from "./TableDM_DonVi";
import { InputDM_DONVIModal } from "./InputDM_DONVIModal";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";
import { DM_DONVI } from "../../../models/DM_DONVI";
import { DM_DVIQLY } from "../../../models/DM_DVIQLY";
import Link from "next/link";
import { BreadCrumb } from "primereact/breadcrumb";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import Head from "next/head";
import provinceData from '/public/demo/data/data_province.json'
import { search_DM_DONVI } from "../../../services/DM_DONVIService";
import { Password } from "primereact/password";

const DonVi = () => {
  let emptyDonVi = {
    id: null,
    dm_donvi_id: null,
    loai_don_vi: null,
    ma: null,
    ten: '',
    trang_thai: '',
    sap_xep: null,
    ghi_chu: null,
    ngay_tao: null,
    nguoi_tao: '',
    ngay_cap_nhat: null,
    nguoi_cap_nhat: '',
    cap_so: null,
    cap_ma: null,
    dm_tinhthanh_id: null,
    dm_quanhuyen_id: null,
    dm_donvi_chuquan_id: null,
    ma_fmis: null,
    db_madonvi: null,
    db_madonvi_fmis: null,
    db_ngay: null,
    type_donvi: null,
    group_donvi: null,
    do_duthao: null,
    su_dung: null,
    ten_dviqly: "",
  }

  const [donVi, setDonVi] = useState(DM_DONVI);
  const [donVis, setDonVis] = useState(null);
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [MA, setMA] = useState("");
  const [TEN, setTEN] = useState("");
  const [TRANG_THAI, setTRANG_THAI] = useState("");
  const [donViCha, setDonViCha] = useState('');
  const [donViChuQuan, setDonViChuQuan] = useState('')
  const [maDonVi, setMaDonVi] = useState(null)
  const [tenDonVi, setTenDonVi] = useState('')
  const [tinhThanh, setTinhThanh] = useState('')
  const [quanHuyen, setQuanHuyen] = useState('')
  const [trangThai, setTrangThai] = useState('')
  const [sapXep, setSapXep] = useState('')
  const [ghiChu, setGhiChu] = useState('')
  const [trangThaiDuThao, setTrangThaiDuThao] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false);
  const [deleteDonViDialog, setDeleteDonViDialog] = useState(false)
  const [deleteDonVisDialog, setDeleteDonVisDialog] = useState(false)
  const [selectedDonVi, setSelectedDonVis] = useState(null)
  const [donViDialog, setDonViDialog] = useState(false)
  const toast = useRef(null)
  const dt = useRef(null)
  const [arrDonVi, setArrDonVi] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null)
  const [selectedDistrict, setSelectedDistrict] = useState(null)

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.value)
    setSelectedDistrict(null)
  }

  const [options, setOptions] = useState({
    ma: "",
    ten: "",
    trang_thai: {
      label: "",
      value: "",
    },
  });

  const loadData = async () => {
    try {
      const data = {
        pageIndex: page,
        pageSize: pageSize,
        ma: options.ma,
        ten: options.ten,
        trang_thai: options.trang_thai.value,
      };
      const items = await search_DM_DONVI(data);
      setArrDonVi(items.data);
      setPageCount(Math.ceil(items.totalItems / pageSize));
    } catch (err) {
      console.error("Không thể tải dữ liệu:", err);
      toast.current.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể tải dữ liệu',
        life: 3000
      });
      setArrDonVi([]); // Đặt lại thành mảng rỗng nếu có lỗi
      setPageCount(0);
    }
  };

  const handleEdit = (donVi) => {
    setSelectedDonVi(donVi);
    setIsUpdate(true);
    setDonViDialog(true); // Mở dialog chỉnh sửa
  };

  const handleDelete = (donVi) => {
    setSelectedDonVi(donVi);
    setDeleteDonViDialog(true); // Mở dialog xác nhận xóa
  };

  const confirmDelete = async () => {

    try {
      await deleteDonVi(selectedDonVi.id); 
      toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đơn vị đã được xóa', life: 3000 });
      loadData(); // Tải lại dữ liệu
      setDeleteDonViDialog(false); 
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa đơn vị', life: 3000 });
    }
  };

  useEffect(() => {
    loadData();
  }, [page, pageSize]);

  const filterDistricts = selectedProvince?.districts || []


  const openNewDonVi = () => {
    setDonVi(emptyDonVi)
    setSubmitted(false)
    setDonViDialog(true)
  }

  const hideDialog = () => {
    setSubmitted(true)
    setDonViDialog(false)
  }

  const hideDeleteDonViDialog = () => {
    setDeleteDonViDialog(false)
  }

  const hideDeleteDonVisDialog = () => {
    setDeleteDonVisDialog(false)
  }

  const donViDialogFooter = (
    <div className="text-center">
      <Button label='Lưu' style={{ backgroundColor: '#1445a7', color: '#fff' }} className="border-transparent" />
      <Button label='Đóng' style={{ backgroundColor: '#666666', color: '#fff' }} className="border-transparent" onClick={hideDialog} />
    </div>
  )

  const deleteDonVisDialogFooter = (
    <>
      <Button label='No' icon='pi pi-times' text onClick={hideDeleteDonViDialog} />
      <Button label='Yes' icon='pi pi-check' text />
    </>
  )

  const headerList = (options) => {
    const className = `${options.className} justify-content-space-between`

    return (
      <div className={className}>
        <span className="font-bold text-2xl">Danh sách</span>
        <Button label="Thêm mới" style={{ backgroundColor: '#1445a7' }} onClick={openNewDonVi}></Button>
      </div>
    )

  }

  const dataDonViCha = [
    { id: 1, name: 'Tập đoàn điện lực' },
    { id: 2, name: 'Tổng công ty điện lực miền Bắc' },
    { id: 3, name: 'Công ty điện lực Hưng Yên' }
  ]

  const dataDonViChuQuan = [
    { id: 1, name: 'Tập đoàn điện lực' },
    { id: 2, name: 'Tổng công ty điện lực miền Bắc' },
    { id: 3, name: 'Công ty điện lực Hưng Yên' }
  ]

  const dataTrangThai = [
    { id: 1, name: 'Còn hiệu lực' },
    { id: 2, name: 'Hết hiệu lực' },
  ]

  const dataTrangThaiDuThao = [
    { id: 1, name: 'Được dự thảo' },
    { id: 2, name: 'Không được dự thảo' },
  ]


  const breadcrumb_router = [
    {
      label: 'Danh mục hệ thống'
    },
    {
      label: 'Đơn vị',
      template: () => <Link href='/danhmuchethong/donvi'>Đơn vị</Link>
    },
  ]
  const home = { icon: 'pi pi-home', url: '/' }

  return (

    <React.Fragment>
      <Head>
        <title>Quản lý Đơn Vị - Phần mềm quản lý kìm chì</title>
      </Head>
      <div className="grid">
        <div className="col-12">
          <div className="flex justify-content-between align-items-center mb-2">
            <div>Đơn vị</div>
            <BreadCrumb model={breadcrumb_router} home={home} className='bg-transparent border-transparent' />
          </div>
          <div className="card">
            <Toast ref={toast} />
            <Panel header="Tìm kiếm">
              <div className="flex justify-content-between p-fluid gap-3">
                <div className="field" style={{ width: '50%' }}>
                  <label>Chọn đơn vị cha</label>
                  <InputText style={{ width: '100%' }} placeholder="Nhập từ khóa" />
                </div>
                <div className="field" style={{ width: '50%' }}>
                  <label>Mã đơn vị</label>
                  <InputText style={{ width: '100%' }} />
                </div>
                <div className="field" style={{ width: '50%' }}>
                  <label>Tên đơn vị</label>
                  <InputText style={{ width: '100%' }} />
                </div>

              </div>
              <div className='flex justify-content-center mt-2'>
                <Button label='Tìm kiếm' style={{ backgroundColor: '#1445a7' }} />
              </div>
            </Panel>
            <Panel headerTemplate={headerList} className="mt-4">
              <DataTable
                data={arrDonVi}
                value={arrDonVi}
                setDonVi={setDonVi}
                paginator
                rows={pageSize}
                totalRecords={pageCount * pageSize}
                first={page * pageSize - pageSize}
                page={page}
                pageSize={pageSize}
                rowsPerPageOptions={[5, 10]}
                className="datatable-responsive mt-5"
                showGridlines
                paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
                currentPageReportTemplate="Hiện {first} đến {last} của {totalRecords} đơn vị"
              >
                <Column
                  selectionMode="multiple"
                  headerStyle={{
                    width: '4rem',
                    backgroundColor: '#1445a7',
                    color: '#fff'
                  }}
                >
                </Column>

                <Column
                  field="stt"
                  header='STT'
                  headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                  body={(rowData, { rowIndex }) => {
                    return rowIndex + 1;
                  }}
                >
                </Column>

                <Column
                  field="ma"
                  header='Mã đơn vị'
                  headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                >
                </Column>

                <Column
                  field="ma_fmis"
                  header='Mã FMIS'
                  headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                >
                </Column>

                <Column
                  field="ten"
                  header='Tên đơn vị'
                  headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                >
                </Column>

                <Column
                  field="dm_donvi_chuquan_id"
                  header='Tên đơn vị chủ quản'
                  headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                >
                </Column>

                <Column
                  field="trang_thai"
                  header='Trạng thái'
                  headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                >
                </Column>

                <Column
                  field="sap_xep"
                  header='Sắp xếp'
                  headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                >
                </Column>

                <Column
                  header='Thao tác'
                  headerStyle={{ backgroundColor: '#1445a7', color: '#fff', width: '6rem' }}
                  body={(rowData) => (
                    <div className="flex justify-content-between gap-3">
                      <Button label='Sửa' style={{ backgroundColor: '#1445a7' }} />
                      <Button label='Xóa' style={{ backgroundColor: '#1445a7' }} />
                    </div>
                  )}
                >
                </Column>

              </DataTable>
            </Panel>

            <Dialog
              visible={donViDialog}
              style={{ width: '1000px' }}
              header='Thông tin đơn vị'
              modal
              className="p-fluid"
              onHide={hideDialog}
              footer={donViDialogFooter}
            >
              <div className="field">
                <label>Chọn đơn vị cha</label>
                <Dropdown
                  value={donViCha}
                  onChange={(e) => setDonViCha(e.value)}
                  options={dataDonViCha}
                  placeholder="Vui lòng chọn"
                  optionLabel="name"
                />
              </div>
              <div className="field">
                <label>Chọn đơn vị chủ quản</label>
                <Dropdown
                  value={donViChuQuan}
                  onChange={(e) => setDonViCha(e.value)}
                  options={dataDonViChuQuan}
                  placeholder="Vui lòng chọn"
                  optionLabel="name"
                />
              </div>

              <div className=" flex justify-content-between align-items-center gap-3">
                <div style={{ width: '100%' }} className="field">
                  <label>
                    <span className="text-red-400">(*) </span>
                    Mã đơn vị
                  </label>
                  <InputText required id="maDonVi" />
                </div>

                <div style={{ width: '100%' }} className="field">
                  <label>
                    <span className="text-red-400">(*) </span>
                    Tên đơn vị
                  </label>
                  <InputText required id="tenDonVi" />
                </div>

                <div style={{ width: '100%' }} className="field">
                  <label>
                    <span className="text-red-400">(*) </span>
                    Tỉnh thành
                  </label>
                  <Dropdown
                    value={selectedProvince}
                    options={provinceData}
                    onChange={handleProvinceChange}
                    optionLabel="name"
                    placeholder="Chọn Tỉnh/Thành phố"
                  />
                </div>
              </div>

              <div className="flex justify-content-between align-items-center gap-3">
                <div style={{ width: '100%' }} className="field">
                  <label>
                    <span className="text-red-400">(*) </span>
                    Quận huyện
                  </label>
                  <Dropdown
                    value={selectedDistrict}
                    options={filterDistricts}
                    onChange={(e) => setSelectedDistrict(e.value)}
                    optionLabel="name"
                    placeholder="Chọn Quận/Huyện"
                    disabled={!selectedProvince}
                  />
                </div>

                <div style={{ width: '100%' }} className="field">
                  <label>
                    <span className="text-red-400">(*) </span>
                    Trạng thái
                  </label>
                  <Dropdown
                    value={trangThai}
                    onChange={(e) => setTrangThai(e.value)}
                    options={dataTrangThai}
                    placeholder="Chọn trạng thái"
                    optionLabel="name"
                  />
                </div>

                <div style={{ width: '100%' }} className="field">
                  <label>
                    <span className="text-red-400">(*) </span>
                    Sắp xếp
                  </label>
                  <InputText required id="tenDonVi" />
                </div>
              </div>

              <div className="flex justify-content-between align-items-center gap-3">
                <div style={{ flexBasis: '67.8%' }} className="field">
                  <label>
                    Ghi chú
                  </label>
                  <InputText required id="ghiChu" />
                </div>

                <div style={{ flexBasis: '33.33%' }} className="field">
                  <label>
                    Trạng thái dự thảo
                  </label>
                  <Dropdown
                    value={trangThaiDuThao}
                    onChange={(e) => setTrangThai(e.value)}
                    options={dataTrangThaiDuThao}
                    placeholder="Chọn trạng thái dự thảo"
                    optionLabel="name"
                  />
                </div>
              </div>
            </Dialog>
          </div>
        </div>
      </div>

    </React.Fragment>
  );
};

export default DonVi;
