import { Button } from "primereact/button";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import React, { useRef, useState, useEffect, useCallback } from "react";
import "primeicons/primeicons.css";
import { Dropdown } from "primereact/dropdown";
import { TreeTable } from "primereact/treetable";

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
} from "../../../services/quantrihethong/HT_MENUService";
import { Tooltip } from "primereact/tooltip";

const Menu = () => {
  const toast = useRef(null);
  const [arr_MENU, setArr_MENU] = useState([]);
  const [menuOld, setMenuOld] = useState([])
  const [showDialog, setShowDialog] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [formData, setFormData] = useState(HT_MENU);
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [selectedNodeKeys, setSelectedNodeKeys] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

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

  const [expandedKeys, setExpandedKeys] = useState({});

  useEffect(() => {
    if (arr_MENU.length > 0) {
      const allExpanded = expandAllNodes(arr_MENU);
      setExpandedKeys(allExpanded);
    }
  }, [arr_MENU]);

  const headerList = (options) => {
    const className = `${options.className} flex flex-wrap justify-content-between align-items-center`;

    return (
      <div className={className}>
        <span className="font-bold text-xl">Danh sách</span>
        <div className="flex flex-wrap gap-2">
          {selectedMenus.length > 0 && (
            <Button
              label="Xóa nhiều"
            severity="danger"
              onClick={onDeleteSelectedConfirm}
              disabled={!selectedMenus.length}
            />
          )}
          <Button
            label="Thêm mới"
            style={{ backgroundColor: "#1445a7" }}
            onClick={ThemMoi}
          />
        </div>
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
      setMenuOld(items)
      const treeData = buildTree(items);
      setArr_MENU(treeData);
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

  useEffect(() => {
    const treeData = buildTree(menuOld);
    const filteredMenus = treeData.map((menu) => {
      const filteredChildren = menu.children.filter((child) => {
        return selectedNodeKeys[child.data.id] && selectedNodeKeys[child.data.id].checked === true;
      });

      if ((selectedNodeKeys[menu.data.id] && selectedNodeKeys[menu.data.id].checked === true) || filteredChildren.length > 0) {
        return {
          ...menu,
          children: filteredChildren,
        };
      }
      return null;
    }).filter(menu => menu !== null);

    const result = extractKeys(filteredMenus);
    setSelectedMenus(result)
  }, [selectedNodeKeys])

  function extractKeys(data) {
    let keys = new Set();

    function traverse(node, parentSelected) {
      if (parentSelected) {
        keys.add(node.key);
        if (node.children && node.children.length > 0) {
          node.children.forEach(child => traverse(child, true));
        }
      } else {
        if (node.children && node.children.length > 0) {
          node.children.forEach(child => traverse(child, false));
          const allChildrenSelected = node.children.every(child => keys.has(child.key));
          if (!allChildrenSelected) {
            node.children.forEach(child => keys.add(child.key));
          }
        } else {
          keys.add(node.key);
        }
      }
    }

    data.forEach(node => traverse(node, false));
    return Array.from(keys);
  }

  const hideDialog = () => {
    setShowDialog(false);
  };

  const handleEdit = (menu) => {
    setFormData(menu);
    setIsAdd(false);
    setShowDialog(true);
  };

  const handleSelectionChange = useCallback((e) => {
    let listSelect = e.value
    setSelectedNodeKeys(listSelect)
  }, [selectedNodeKeys]);

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
        await update_HT_MENU(formData);
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
    confirmDialog({
      message: "Bạn có muốn xóa menu " + menu.data.ten_menu + "?",
      header: "Xác nhận xóa",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try {
          await delete_HT_MENU(menu.data.id);
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

  const onDeleteSelectedConfirm = () => {
    confirmDialog({
      message: "Bạn có chắc chắn muốn xóa các menu đã chọn?",
      header: "Xác nhận xóa",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try {
          await Promise.all(
            selectedMenus.map((menu) => delete_HT_MENU(menu))
          );

          toast.current.show({
            severity: "success",
            summary: "Thành công",
            detail: "Xóa thành công",
            life: 3000,
          });
          loadDataMENU();
          setSelectedMenus([]);
        } catch (error) {
          toast.current.show({
            severity: "error",
            summary: "Lỗi",
            detail: "Không thể xóa các menu đã chọn",
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
    <div className="flex flex-wrap justify-content-center gap-2">
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

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredMenu(arr_MENU);
    } else {
      const filtered = arr_MENU.filter((item) =>
        item.ten_menu.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMenu(filtered);
    }
  }, [searchTerm, arr_MENU]);

  const expandAllNodes = (nodes) => {
    const expanded = {};

    const traverse = (node) => {
      expanded[node.key] = true;
      if (node.children) {
        node.children.forEach(traverse);
      }
    };

    nodes.forEach(traverse);
    return expanded;
  };

  const buildTree = (menuItems) => {
    const map = {};
    const roots = [];
    let parentCounter = 0;

    menuItems.forEach((item) => {
      map[item.id] = {
        key: item.id,
        data: {
          id: item.id,
          ten_menu: item.ten_menu,
          duong_dan: item.duong_dan,
          parent_id: item.parent_id,
          icon: item.icon,
          stt: ''
        },
        children: [],
      };
    });

    menuItems.forEach((item) => {
      if (item.parent_id === null) {
        parentCounter++;
        map[item.id].data.stt = parentCounter.toString();
        roots.push(map[item.id]);
      } else {
        if (map[item.parent_id]) {
          const parentStt = map[item.parent_id].data.stt;
          const childIndex = map[item.parent_id].children.length + 1;
          map[item.id].data.stt = `${parentStt}.${childIndex}`;
          map[item.parent_id].children.push(map[item.id]);
        }
      }
    });

    return roots;
  };

  return (
    <React.Fragment>
      <div className="grid">
        <div className="col-12">
          <div className="flex justify-content-between align-items-center mb-2"></div>
          <div className="card">
            <div className="flex flex-column md:flex-row justify-content-between align-items-center mb-3">
            </div>
            <Toast ref={toast} />

            <Panel headerTemplate={headerList} className="mt-3 mb-2">
              <div className="flex flex-column md:flex-row justify-content-end align-items-center mb-2">
                <InputText
                  className="w-full md:w-3 mb-2 md:mb-0"
                  type="search"
                  onInput={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Tìm kiếm"
                />
              </div>
              <div className="overflow-x-auto">
                <TreeTable
                  style={{
                    width: window.innerWidth < 700 ? '900px' : '100%',                    
                  }}
                  filterMode={"lenient"}
                  globalFilter={globalFilter}
                  selectionKeys={selectedNodeKeys}
                  onSelectionChange={handleSelectionChange}
                  selectionMode="checkbox"
                  paginator
                  rows={5}
                  rowsPerPageOptions={[5, 10, 25]}
                  expandedKeys={expandedKeys}
                  onToggle={(e) => setExpandedKeys(e.value)}
                  value={arr_MENU}
                >
                  <Column
                    field="stt"
                    header="STT"
                    expander
                    headerStyle={{ backgroundColor: '#1445a7', color: '#fff', width: '200px' }}
                  />
                  <Column
                    field="ten_menu"
                    header="Tên Menu"
                    headerStyle={{ backgroundColor: '#1445a7', color: '#fff', minWidth: '350px' }}
                  />
                  <Column
                    field="icon"
                    header="Icon"
                    headerStyle={{ backgroundColor: '#1445a7', color: '#fff', width: '100px' }}
                    body={(rowData) => <i className={`${rowData.data.icon}`} />}
                  />
                  <Column
                    header="Thao tác"
                    headerStyle={{
                      backgroundColor: "#1445a7",
                      color: "#fff",
                      width: '120px'
                    }}
                    body={(rowData) => (
                      <div className="flex flex-wrap gap-2">
                        <Button
                          icon="pi pi-pencil"
                          tooltip="Sửa"
                          onClick={() => handleEdit(rowData.data)}
                          style={{ backgroundColor: "#1445a7", color: "#fff" }}
                        />
                        <Button
                          icon="pi pi-trash"
                          tooltip="Xóa"
                          onClick={() => onDeleteConfirm(rowData)}
                          style={{ backgroundColor: "#1445a7", color: "#fff" }}
                        />
                      </div>
                    )}
                  />
                </TreeTable>
              </div>
            </Panel>

            <Dialog
              visible={showDialog}
              header="Thông tin Menu"
              className="p-fluid w-11 md:w-6"
              onHide={hideDialog}
              footer={donViDialogFooter}
            >
              <div className="grid">
                <div className="col-12 md:col-6">
                  <div className="field">
                    <label>Tên menu</label>
                    <InputText
                      required
                      id="ten_menu"
                      value={formData.ten_menu}
                      onChange={(e) => handleChange("ten_menu", e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-12 md:col-6">
                  <div className="field">
                    <label>Icon</label>
                    <InputText
                      required
                      id="icon"
                      value={formData.icon}
                      onChange={(e) => handleChange("icon", e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="field">
                    <label>Đường dẫn <span style={{ color: 'red' }}>(* Bỏ qua nếu là Menu cấp cha)</span></label>
                    <InputText
                      required
                      id="duong_dan"
                      value={formData.duong_dan}
                      onChange={(e) => handleChange("duong_dan", e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-12 md:col-6">
                  <div className="field">
                    <label>Menu Cha</label>
                    <Dropdown
                      filter
                      value={formData.parent_id}
                      options={[{ id: null, ten_menu: 'Là Menu Cấp Cha' }, ...menuOld]}
                      onChange={(e) => handleChange("parent_id", e.value)}
                      optionLabel="ten_menu"
                      optionValue="id"
                      placeholder="Chọn menu"
                    />
                  </div>
                </div>
                <div className="col-12 md:col-6">
                  <div className="field">
                    <label>Ghi chú</label>
                    <InputText
                      required
                      id="ghi_chu"
                      value={formData.ghi_chu}
                      onChange={(e) => handleChange("ghi_chu", e.target.value)}
                    />
                  </div>
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

export default Menu;