import { Button } from "primereact/button";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import React, { useRef, useState, useEffect } from "react";
import "primeicons/primeicons.css";
import { Dropdown } from "primereact/dropdown";
import { HT_MENU } from "../../../models/HT_MENU";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import {
  delete_HT_MENU,
  create_HT_MENU,
  get_All_HT_MENU,
  update_HT_MENU,
} from "../../../services/HT_MENUService";

const Menu = () => {
  const toast = useRef(null);
  const [arr_MENU, setArr_MENU] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [formData, setFormData] = useState(HT_MENU);

  // State to store input value and filtered menu items
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMenu, setFilteredMenu] = useState(arr_MENU);
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
      try {
        // console.log(formData.id)
        const response = await update_HT_MENU(formData);
        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: "Cập nhật menu thành công",
          life: 3000,
        });
        loadDataMENU();
        setShowDialog(false);
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Lỗi",
          detail: "Thất bại",
          life: 3000,
        });
      }
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredMenu(arr_MENU); // Không có từ khóa thì hiển thị tất cả
    } else {
      const filtered = arr_MENU.filter(item =>
        item.ten_menu.toLowerCase().includes(searchTerm.toLowerCase()) 
      );
      setFilteredMenu(filtered);
    }
  }, [searchTerm, arr_MENU]);

  // Hàm lấy danh sách menu con của mỗi parent khi dropdown được click
  const renderSubMenuDropdown = (rowData) => {
    const subMenuData = arr_MENU.filter(
      (menu) => menu.parent_id === rowData.id
    ); // Lọc các menu con của parent
    // Kiểm tra nếu không có menu con, trả về thông báo "Không có"
    if (subMenuData.length === 0) {
      return <span>Không có</span>;
    }
    return (
      <Dropdown
        options={subMenuData}
        optionLabel="ten_menu"
        placeholder="Nhấn để xem"
      />
    );
  };

  return (
    <React.Fragment>
      <div className="grid">
        <div className="col-12">
          <div className="flex justify-content-between align-items-center mb-2"></div>
          <div className="card">
            <div
              className="card-header flex justify-between mb-3 items-center"
              style={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <h3 className="card-title text-lg m-0">
                Quản lý Menu
              </h3>
            </div>
            <Toast ref={toast} />

            {/* start_search */}
            {/* <Panel header="Tìm kiếm">
              <div
                className="field"
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <label style={{ marginBottom: "5px" }}>Tên Menu</label>
                <InputText
                  placeholder="Nhập tên đơn vị cần tìm kiếm"
                  style={{ width: "50%" }}
                />
              </div>
              <div className="flex justify-content-center mt-2">
                <Button
                  label="Tìm kiếm"
                  style={{ backgroundColor: "#1445a7" }}
                />
              </div>
            </Panel> */}
            {/* end_search */}

            {/*start_table */}
            <Panel headerTemplate={headerList} className="mt-4">
              <div style={{ textAlign: "right " }}>
                {" "}
                <InputText
                  style={{ width: 300 }}
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={handleSearchChange} // Update search term and filter menu
                />
              </div>
              <DataTable
                value={filteredMenu}
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
                  header="Danh sách Menu con"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                  body={renderSubMenuDropdown} // Gọi hàm lấy menu con trực tiếp khi render
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
                        style={{ backgroundColor: "#e74c3c" }}
                        onClick={() => onDeleteConfirm(rowData)}
                      />
                    </div>
                  )}
                ></Column>
              </DataTable>
            </Panel>
            {/* end_table */}

            {/* Start_Dialog_ADD+update */}
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
            {/* end_Dialog_ADD+update */}
          </div>
        </div>
      </div>
      <ConfirmDialog />
    </React.Fragment>
  );
};
export default Menu;
