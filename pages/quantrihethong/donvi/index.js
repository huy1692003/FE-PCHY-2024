import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import React, { useRef, useState, useEffect } from "react";
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
import { delete_DM_DONVI, getDM_DONVI_ByID, insert_DM_DONVI, search_DM_DONVI, update_DM_DONVI } from "../../../services/DM_DONVIService";
import { Password } from "primereact/password";
import { getAllD_DVIQLY, } from "../../../services/D_DVIQLYService";

const DonVi = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [arr_DONVI, setArr_DONVI] = useState([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [arr_DONVI_QLY, setArr_DONVI_QLY] = useState([])
  const [formData, setFormData] = useState(DM_DONVI)
  const [formFilter, setFormFilter] = useState({ ten: "", ma: "" })
  const [keyFilter, setkeyFilter] = useState()
  const [showDialog, setShowDialog] = useState(false)
  const [isAdd, setIsAdd] = useState(false)
  const [dataEdit, setDataEdit] = useState()
  const toast = useRef(null)


  useEffect(() => {
    loadDataDVI();
  }, [page, pageSize, keyFilter]);


  useEffect(() => {
    const load_DVIQLY = async () => {
      let data = await getAllD_DVIQLY()
      console.log(data)
      data && setArr_DONVI_QLY(data.map(d => ({ id: d.mA_DVIQLY, name: d.teN_DVIQLY })))
    }
    load_DVIQLY()
  }, [])

  const loadDataDVI = async () => {
    try {

      const items = await search_DM_DONVI({ pageIndex: page, pageSize, ...keyFilter });
      console.log(items.data)
      setArr_DONVI(items.data);
      console.log(items)
      setTotalRecords(items.totalItems)
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
  };


  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleChangeFilter = (field, value) => {
    setFormFilter((prevData) => ({
      ...prevData,
      [field]: value,
    }));

  };

  const handleEdit = async (donVi) => {

    try {
      const fetchedData = await getDM_DONVI_ByID(donVi.id); // Call API with ID to get the data
      setFormData({ ...fetchedData }); // Set the fetched data into formData
      setIsAdd(false)
      setShowDialog(true); // Open the dialog
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

    setPage(event.page + 1);  // Cập nhật pageIndex từ sự kiện
    setPageSize(event.rows);    // Cập nhật pageSize từ sự kiện

  };

  const confirmDelete = async (donVi) => {
    try {
      await delete_DM_DONVI(donVi.id);
      toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đơn vị đã được xóa', life: 3000 });
      loadDataDVI(); // Reload the data after deletion
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa đơn vị', life: 3000 });
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


  const saveDonVi = async () => {
    console.log(formData)
    try {
      if (isAdd) {
        // Nếu có ID, thực hiện cập nhật
        await insert_DM_DONVI(formData);
        toast.current.show({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Thêm mới đơn vị thành công',
          life: 3000
        });
      } else {

        // Nếu không có ID, thêm mới
        await update_DM_DONVI(formData);
        toast.current.show({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Cập nhật đơn vị thành công',
          life: 3000
        });
      }

      setShowDialog(false); // Đóng dialog sau khi lưu hoặc cập nhật
      loadDataDVI(); // Tải lại dữ liệu
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
    setFormData(DM_DONVI)
    setIsAdd(true)
    setShowDialog(true)
  }

  const hideDialog = () => {
    setShowDialog(false)

  }



  const donViDialogFooter = (
    <div className="text-center">
      <Button label='Lưu' style={{ backgroundColor: '#1445a7', color: '#fff' }} className="border-transparent" onClick={saveDonVi} />
      <Button label='Đóng' style={{ backgroundColor: '#666666', color: '#fff' }} className="border-transparent" onClick={hideDialog} />
    </div>
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

  // const dataDonViCha = [
  //   { id: 1, name: 'Tập đoàn điện lực' },
  //   { id: 2, name: 'Tổng công ty điện lực miền Bắc' },
  //   { id: 3, name: 'Công ty điện lực Hưng Yên' }
  // ]

  // const dataDonViChuQuan = [
  //   { id: 1, name: 'Tập đoàn điện lực' },
  //   { id: 2, name: 'Tổng công ty điện lực miền Bắc' },
  //   { id: 3, name: 'Công ty điện lực Hưng Yên' }
  // ]

  const dataTrangThai = [
    { id: 1, name: 'Còn hiệu lực' },
    { id: 0, name: 'Hết hiệu lực' },
  ]

  const dataTrangThaiDuThao = [
    { id: 1, name: 'Được dự thảo' },
    { id: 0, name: 'Không được dự thảo' },
  ]

  const dataDonViChuQuan = [
    { id: 1 + "", name: 'Tập đoàn điện lực' },
    { id: 3 + "", name: 'Công ty điện lực Hưng Yên' },
    { id: 2 + "", name: 'Tổng công ty điện lực miền Bắc' }
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
  console.log(formData)
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
                  <label>Đơn vị quản lý</label>
                  <Dropdown
                    filter
                    value={formFilter.ma}
                    options={arr_DONVI_QLY}
                    onChange={(e) => handleChangeFilter("ma", e.value)}
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Chọn đơn vị"
                  />
                </div>
                <div className="field" style={{ width: '50%' }}>
                  <label>Tên đơn vị</label>

                  <InputText
                    placeholder="Nhập tên đơn vị cần tìm kiếm"
                    value={formFilter.ten}
                    onChange={(e) => handleChangeFilter("ten", e.target.value)}
                    style={{ width: '100%' }} />
                </div>

              </div>
              <div className='flex justify-content-center mt-2'>
                <Button label='Tìm kiếm' style={{ backgroundColor: '#1445a7' }} onClick={() => {
                  setPage(1)
                  setPageSize(5)
                  setkeyFilter(formFilter)
                }} />
              </div>
            </Panel>
            <Panel headerTemplate={headerList} className="mt-4">

              <DataTable
                value={arr_DONVI}

                className="datatable-responsive mt-5"
                showGridlines

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

                {/* <Column
                  field="stt"
                  header='STT'
                  headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                  body={(rowData, { rowIndex }) => {
                    return rowIndex + 1;
                  }}
                >
                </Column> */}

                {/* <Column
                  field="ma"
                  header='Mã đơn vị'
                  headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                >
                </Column> */}

                {/* <Column
                  field="ma_fmis"
                  header='Mã FMIS'
                  headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                >
                </Column> */}

                <Column
                  field="ten"
                  header='Tên đơn vị'
                  headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                >
                </Column>

                <Column
                  field="ma_dviqly"
                  header='Mã Đơn Vị Quản Lý'
                  headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                >
                </Column>

                {/* <Column
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
                </Column> */}
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

                    const district = province.districts.find(d => d.code === Number.parseInt(rowData.dm_quanhuyen_id));
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
                      <Button label="Sửa" onClick={() => handleEdit(rowData)} style={{ backgroundColor: '#1445a7' }} />
                      <Button label="Xóa" onClick={() => onDeleteConfirm(rowData)} style={{ backgroundColor: '#e74c3c' }} />
                    </div>
                  )}
                >
                </Column>

              </DataTable>
              <Paginator
                first={page - 1} // Dịch chuyển cho PrimeReact bắt đầu từ 0
                rows={pageSize}
                totalRecords={totalRecords} // Tổng số items (dữ liệu từ server hoặc database)
                onPageChange={onPageChange} // Khi thay đổi trang hoặc page size
                rowsPerPageOptions={[10, 20, 50, 100]} // Các tùy chọn page size
                showPerPageDropdown={true} // Hiển thị dropdown cho người dùng chọn page size
                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
              />

            </Panel>

            <Dialog
              visible={showDialog}
              style={{ width: '70%', height: "85%" }}
              header='Thông tin đơn vị'
              className="p-fluid"
              onHide={hideDialog}
              footer={donViDialogFooter}
            >
              {/* <div className="field">
                <label>Chọn đơn vị cha</label>
                <Dropdown
                  value={donViCha}
                  options={dataDonViCha}
                  placeholder="Vui lòng chọn"
                  optionLabel="name"
                />
              </div>
              */}
              <div className="field">
                <label>Chọn đơn vị chủ quản</label>
                <Dropdown
                  value={formData.dm_donvi_chuquan_id}
                  options={dataDonViChuQuan}

                  onChange={(e) => handleChange("dm_donvi_chuquan_id", e.value)}
                  placeholder="Vui lòng chọn"
                  optionLabel="name"
                  optionValue="id"
                />
              </div>

              <div className=" flex justify-content-between align-items-center gap-3">
                <div style={{ width: '100%' }} className="field">
                  <label>
                    <span className="text-red-400">(*) </span>
                    Chọn đơn vị quản lý
                  </label>
                  <Dropdown
                    filter
                    value={formData.ma_dviqly}
                    options={arr_DONVI_QLY}
                    onChange={(e) => handleChange("ma_dviqly", e.value)}
                    optionLabel="name"
                    optionValue="id"

                    placeholder="Chọn đơn vị"
                  />
                </div>

                <div style={{ width: '100%' }} className="field">
                  <label>
                    <span className="text-red-400">(*) </span>
                    Tên đơn vị
                  </label>
                  <InputText
                    required
                    id="tenDonVi"
                    value={formData.ten}
                    onChange={(e) => handleChange("ten", e.target.value)}
                  />
                </div>

                <div style={{ width: '100%' }} className="field">
                  <label>
                    <span className="text-red-400">(*) </span>
                    Tỉnh thành
                  </label>
                  <Dropdown
                    filter
                    value={formData.dm_tinhthanh_id}
                    options={provinceData.map(s => ({ name: s.name, id: s.code + "" }))}
                    onChange={(e) => {

                      handleChange("dm_tinhthanh_id", e.value)
                    }}
                    optionLabel="name"
                    optionValue="id"
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
                    filter
                    value={formData.dm_quanhuyen_id}
                    options={(provinceData.find(s => s.code === Number.parseInt(formData.dm_tinhthanh_id)))?.districts?.map(s => ({ name: s.name, id: s.code + "" })) || []}
                    onChange={(e) => handleChange("dm_quanhuyen_id", e.value)}
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Chọn Quận/Huyện"
                    disabled={!formData.dm_tinhthanh_id}
                  />
                </div>

                <div style={{ width: '100%' }} className="field">
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
                  />
                </div>

                <div style={{ width: '100%' }} className="field">
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
                </div>
              </div>

              <div className="flex justify-content-between align-items-center gap-3">
                <div style={{ flexBasis: '67.8%' }} className="field">
                  <label>
                    Ghi chú
                  </label>
                  <InputText
                    required

                    id="ghiChu"
                    value={formData.ghi_chu}
                    onChange={(e) => handleChange("ghi_chu", e.target.value)}
                  />
                </div>

                <div style={{ flexBasis: '33.33%' }} className="field">
                  <label>
                    Trạng thái dự thảo
                  </label>

                </div>
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
