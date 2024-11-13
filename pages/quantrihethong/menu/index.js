import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import React, { useRef, useState, useEffect } from "react";
import "primeicons/primeicons.css";
import { Dropdown } from "primereact/dropdown";
import { HT_MENU } from "../../../models/HT_MENU";
import Link from "next/link";
import { Paginator } from "primereact/paginator";
import { BreadCrumb } from "primereact/breadcrumb";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import Head from "next/head";
import provinceData from "/public/demo/data/data_province.json";
import {
  delete_DM_DONVI,
  delete_HT_MENU,
  create_HT_MENU,
  get_All_HT_MENU,
  update_DM_DONVI,
} from "../../../services/HT_MENUService";
import { Password } from "primereact/password";
import { getAllD_DVIQLY } from "../../../services/D_DVIQLYService";

const Menu = () => {
  const toast = useRef(null);
  const [arr_MENU, setArr_MENU] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [formData, setFormData] = useState(HT_MENU);
  const [subMenus, setSubMenus] = useState({});
  useEffect(() => {
    loadDataMENU();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  const headerList = (options) => {
    const className = `${options.className} justify-content-space-between`;

    return (
      <div className={className}>
        <span className="font-bold text-2xl">Danh sách</span>
        <Button
          label="Thêm mới"
          style={{ backgroundColor: "#1445a7" }}
          onClick={ThemMoi}
        ></Button>
      </div>
    );
  };
  const ThemMoi = () => {
    setFormData(HT_MENU);
    setShowDialog(true);
    setIsAdd(true);
  };
  const loadDataMENU = async () => {
    try {
      const items = await get_All_HT_MENU();
      console.log(items);
      setArr_MENU(items);
      //   console.log(items)
      //   setTotalRecords(items.totalItems)
      //   setPageCount(Math.ceil(items.totalItems / pageSize));
    } catch (err) {
      console.error("Không thể tải dữ liệu:", err);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không thể tải dữ liệu",
        life: 3000,
      });
    }
  };
  const hideDialog = () => {
    setShowDialog(false);
  };
  const handleEdit = (menu) => {
    // console.log(menu)
    setFormData(menu);
    setIsAdd(false);
    setShowDialog(true);
  };
  const saveMenu = async () => {
    if (isAdd) {
      try {
        const response = await create_HT_MENU(formData);
        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: "Thêm mới menu thành công",
          life: 3000,
        });
        loadDataMENU();
        setShowDialog(false);
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Lỗi",
          detail: "Thêm menu thất bại",
          life: 3000,
        });
      }
    } else {
    }
  };
  const onDeleteConfirm = (menu) => {
    // console.log(menu)
    confirmDialog({
      message: "Bạn có muốn xóa menu " + menu.ten_menu + "?",
      header: "Xác nhận xóa",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try {
          await delete_HT_MENU(menu.id);
          toast.current.show({
            severity: "success",
            summary: "Thành công",
            detail: "Xóa thành công",
            life: 3000,
          });
          loadDataMENU();
        } catch (error) {
          toast.current.show({
            severity: "error",
            summary: "Lỗi",
            detail: "Không thể xóa Menu",
            life: 3000,
          });
        }
      },
      reject: () => {
        toast.current.show({
          severity: "info",
          summary: "Đã hủy",
          detail: "Hành động xóa đã bị hủy",
          life: 3000,
        });
      },
    });
  };
  const donViDialogFooter = (
    <div className="text-center">
      <Button
        label="Lưu"
        style={{ backgroundColor: "#1445a7", color: "#fff" }}
        className="border-transparent"
        onClick={saveMenu}
      />
      <Button
        label="Đóng"
        style={{ backgroundColor: "#666666", color: "#fff" }}
        className="border-transparent"
        onClick={hideDialog}
      />
    </div>
  );

  // Filter sub-menus based on parent_id
  const getSubMenus = (parentId) => {
    return sampleMenus.filter(menu => menu.parent_id === parentId);
  };

  // Handle dropdown click to fetch sub-menu data dynamically
  const onDropdownClick = async (parentId, rowData) => {
    // Simulate an API call to fetch sub-menus for the clicked parent
    console.log(rowData.id)
    const fetchedSubMenus = getSubMenus(parentId);
    
    // Save the fetched sub-menus to the state
    setSubMenus(prevState => ({
      ...prevState,
      [parentId]: fetchedSubMenus,
    }));
  };
  return (
    <React.Fragment>
      <div className="grid">
        <div className="col-12">
          <div className="flex justify-content-between align-items-center mb-2">
            {/* <BreadCrumb model={breadcrumb_router} home={home} className='bg-transparent border-transparent' /> */}
          </div>
          <div className="card">
            <h3 className="card-title text-lg m-0">Quản lý menu</h3>

            <Toast ref={toast} />

            {/* table */}
            <Panel headerTemplate={headerList} className="mt-4">
              <DataTable
                value={arr_MENU}
                className="datatable-responsive mt-5"
                showGridlines
                paginator // Hiển thị phân trang
                rows={10} // Số mục trên mỗi trang
                rowsPerPageOptions={[5, 10, 20]} // Các tùy chọn cho số mục trên mỗi trang
                paginatorTemplate="RowsPerPageDropdown PageLinks" // Hiển thị bộ chọn số hàng và liên kết trang
              >
                <Column
                  selectionMode="multiple"
                  headerStyle={{
                    width: "4rem",
                    backgroundColor: "#1445a7",
                    color: "#fff",
                  }}
                ></Column>
                <Column
                  field="id"
                  header="Mã Menu"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                  hidden={true}
                ></Column>

                <Column
                  field="ten_menu"
                  header="Tên Menu"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                ></Column>

                <Column
                  field="icon"
                  header="Biểu tượng"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                  body={(rowData) => <i className={`pi ${rowData.icon}`} />}
                />

                <Column
                  header="Danh sách menu con"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                  body={(rowData) => {
                    return (
                      <Dropdown
                        value={null}
                        options={subMenuData}
                        optionLabel="ten_menu"
                        onClick={() => onDropdownClick(parentId, rowData)} // Trigger when dropdown is clicked
                      />
                    );
                  }}
                />
                <Column
                  header="Thao tác"
                  headerStyle={{
                    backgroundColor: "#1445a7",
                    color: "#fff",
                    width: "6rem",
                  }}
                  body={(rowData) => (
                    <div className="flex justify-content-between gap-3">
                      <Button
                        label="Sửa"
                        onClick={() => handleEdit(rowData)}
                        style={{ backgroundColor: "#1445a7" }}
                      />
                      <Button
                        label="Xóa"
                        // onClick={() => onDeleteConfirm(rowData)}
                        style={{ backgroundColor: "#e74c3c" }}
                        onClick={() => onDeleteConfirm(rowData)}
                      />
                    </div>
                  )}
                ></Column>
              </DataTable>
            </Panel>

            {/* Dialog ADD+update */}
            <Dialog
              visible={showDialog}
              style={{ width: "70%", height: "auto" }}
              header="Thông tin Menu"
              className="p-fluid"
              onHide={hideDialog}
              footer={donViDialogFooter}
            >
              <div className="field">
                <label>Tên menu</label>
                <InputText
                  required
                  id="ten_menu"
                  value={formData.ten_menu}
                  onChange={(e) => handleChange("ten_menu", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Icon</label>
                <InputText
                  required
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => handleChange("icon", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Đường dẫn</label>
                <InputText
                  required
                  id="duong_dan"
                  value={formData.duong_dan}
                  onChange={(e) => handleChange("duong_dan", e.target.value)}
                />
              </div>

              <div className="field">
                <label>Menu Cha</label>
                <Dropdown
                  filter
                  value={formData.parent_id}
                  options={arr_MENU}
                  onChange={(e) => handleChange("parent_id", e.value)}
                  optionLabel="ten_menu"
                  optionValue="id"
                  placeholder="Chọn menu"
                />
              </div>

              <div className="field">
                <label>Ghi chú</label>
                <InputText
                  required
                  id="ghi_chu"
                  value={formData.ghi_chu}
                  onChange={(e) => handleChange("ghi_chu", e.target.value)}
                />
              </div>
            </Dialog>
          </div>
        </div>
      </div>
      <ConfirmDialog />
    </React.Fragment>
  );
};
export default Menu;
