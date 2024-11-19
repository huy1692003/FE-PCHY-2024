import { useRouter } from "next/router";
import { Dialog } from "primereact/dialog";
import { TreeTable } from "primereact/treetable";
import React, { useEffect, useState, useCallback } from "react";
import { get_All_HT_MENU } from "../../../services/quantrihethong/HT_MENUService";
import { HT_MENU } from "../../../models/HT_MENU";
import { Column } from "primereact/column";
import { Tooltip } from "primereact/tooltip";
import { Button } from "primereact/button";
import {
  delete_HT_PHANQUYEN,
  get_HT_PHANQUYENByMA_NHOM_TV,
  insert_HT_PHANQUYEN,
} from "../../../services/quantrihethong/HT_PHANQUYEN";

const QuanLyMenuVaiTro = ({
  isUpdate,
  menu,
  visible,
  setVisible,
  toast,
  setSelectedVaiTro,
  loadDataMenu,
  vaiTro,
}) => {
  const [arrMenu, setArrMenu] = useState([HT_MENU]);
  const [nodes, setNodes] = useState([]);
  const [selectedNodeKeys, setSelectedNodeKeys] = useState({});
  const [ht_phanQuyenList, setHT_PhanQuyenList] = useState([]);
  const [unselectNodes, setUnSelectedNode] = useState([]);
  const buildTree = (menuItems) => {
    const map = {};
    const roots = [];

    menuItems.forEach((item) => {
      map[item.id] = {
        key: item.id,
        data: {
          id: item.id,
          ten_menu: item.ten_menu,
          duong_dan: item.duong_dan,
          icon: <i className={`pi ${item.icon}`} />,
        },
        children: [],
      };
    });
    console.log(vaiTro)
    menuItems.forEach((item) => {
      if (item.parent_id === null) {
        roots.push(map[item.id]);
      } else {
        if (map[item.parent_id]) {
          map[item.parent_id].children.push(map[item.id]);
        }
      }
    });

    return roots;
  };
  const GetHT_PhanQuyenByMaNhomTV = async (treeData) => {
    try {
      const res = await get_HT_PHANQUYENByMA_NHOM_TV(vaiTro.id);
      console.log(res)
      setHT_PhanQuyenList(res);
      handleAutoSelect(res, treeData);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const menus = await get_All_HT_MENU();
      const treeData = buildTree(menus);
      setArrMenu(treeData);
      GetHT_PhanQuyenByMaNhomTV(treeData);
    };
    fetchData();
  }, []);

  //hàm xử lý việc hiển thị các chức năng đã được gán cho nhóm và tự động select các các chức năng đã được gán
  const handleAutoSelect = (arrHT_PHANQUYEN, treeData) => {
    //đoạn xử lý để lấy ra các node quyền mà nhóm đã được gán
    const menus = treeData.filter((menu) => {
      const isExists = arrHT_PHANQUYEN.some((item) => {
        return item.menu_id === menu.key;
      });
      if (isExists) {
        return menu;
      }
    });

    const selectedKeys = {};
    menus.forEach((item) => {
      const selectedKey = { checked: true, partialChecked: false };

      selectedKeys[item.data.id] = selectedKey;
      if (item.children.length > 0) {
        item.children.forEach((child) => {
          const selectedKey = { checked: true, partialChecked: false };

          selectedKeys[child.data.id] = selectedKey;
        });
      }
    });
    setSelectedNodeKeys(selectedKeys);
    setNodes(menus);
  };
  const MAX_LENGTH = 8;

  const shortenText = (text, maxLength) => {
    if (!text) {
      return ""; // Trả về chuỗi rỗng nếu text là null hoặc undefined
    }
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "..."; // Cắt ngắn chuỗi
    }
    return text;
  };

  const handleSelectionChange = useCallback((e) => {
    const selectedKeys = e.value || {};
    const updatedKeys = { ...selectedKeys };

    // Chỉ xử lý các node không có con
    Object.keys(selectedKeys).forEach((key) => {
      const node = arrMenu.find((menuItem) => menuItem.key === key);
      if (node && (!node.children || node.children.length === 0)) {
        let parentId = node.parent_id;
        if (parentId) {
          const parentNode = arrMenu.find((menuItem) => menuItem.key === parentId);
          if (parentNode && parentNode.children && parentNode.children.length > 0) {
            updatedKeys[parentId] = { checked: true, partialChecked: false };
          }
        }
      }
    });

    const previousSelection = Object.keys(selectedNodeKeys);
    const currentSelection = Object.keys(updatedKeys);
    console.log("pre", previousSelection);
    console.log("cu", currentSelection);

    const unselect = previousSelection.filter((item) => !currentSelection.includes(item));

    if (unselect.length > 0) {
      // Xử lý khi bỏ chọn node
      const newNodes = nodes.filter((node) => !unselect.includes(String(node.key)));
      const unselectedNodes = nodes.filter((node) => unselect.includes(String(node.key)));
      setUnSelectedNode([...unselectedNodes]);
      setNodes(newNodes);
    } else {
      setUnSelectedNode([]);
    }

    setSelectedNodeKeys(updatedKeys);
  }, [selectedNodeKeys, nodes]);

  const handleCreateHT_PhanQuyen = async () => {
    let HT_PHANQUYENList = [];
    nodes.forEach((node) => {
      const newModel = {
        tieu_de: null,
        ghi_chu: null,
        tt_khoa: null,
        nguoi_khoa: null,
        tt_xoa: null,
        nguoi_xoa: null,
        ngay_tao: null,
        nguoi_tao: null,
        ngay_sua: null,
        nguoi_sua: null,
        menu_id: node.data.id,
        view: null,
        insert: null,
        edit: null,
        delete: null,
        export: null,
        dong_bo: null,
        hard_edit: null,
        chuyen_buoc: null,
        ma_nhom_tv: vaiTro.id,
        ma_dviqly: null,
      };
      HT_PHANQUYENList.push(newModel);
      if (node.children.length > 0) {
        node.children.forEach((children) => {
          const newModel = {
            tieu_de: null,
            ghi_chu: null,
            tt_khoa: null,
            nguoi_khoa: null,
            tt_xoa: null,
            nguoi_xoa: null,
            ngay_tao: null,
            nguoi_tao: null,
            ngay_sua: null,
            nguoi_sua: null,
            menu_id: children.data.id,
            view: null,
            insert: null,
            edit: null,
            delete: null,
            export: null,
            dong_bo: null,
            hard_edit: null,
            chuyen_buoc: null,
            ma_nhom_tv: vaiTro.id,
            ma_dviqly: null,
          };
          HT_PHANQUYENList.push(newModel);
        });
      }
    });

    //xử lý để tránh việc thêm lại các menu đã được gán cho nhóm thành viên từ trước
    const newList = handleDuplicateData(HT_PHANQUYENList);

    if (newList.length > 0) {
      try {
        // Sử dụng Promise.all để đợi tất cả các lệnh insert hoàn thành
        await Promise.all(newList.map((item) => InsertHT_PhanQuyen(item)));

        // Nếu tất cả thành công, hiển thị thông báo thành công
        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: "Đã lưu phân quyền thành công",
        });
        setNodes([]);
        setSelectedNodeKeys({});
        setVisible(false);
      } catch (e) {
        // Nếu có lỗi xảy ra trong quá trình insert
        toast.current.show({
          severity: "error",
          summary: "Lỗi",
          detail: "Có lỗi xảy ra trong quá trình lưu phân quyền",
        });
        console.log(e.message);
      }
    }
  };

  const handleDeleteHT_PhanQuyen = async () => {
    const HT_PHANQUYENList = ht_phanQuyenList.filter((item) => {
      const isExists = unselectNodes.some((node) => {
        let exists = false;
        if (node.data.id === item.menu_id) exists = true;
        if (node.children.length > 0) {
          node.children.forEach((child) => {
            if (child.data.id === item.menu_id) {
              exists = true;
            }
          });
        }
        return exists;
      });
      if (isExists) {
        return item;
      }
    });

    try {
      // Sử dụng Promise.all để đợi tất cả các lệnh insert hoàn thành
      await Promise.all(
        HT_PHANQUYENList.map((item) => {
          DeleteHT_PhanQuyen(item.id);
        })
      );

      // Nếu tất cả thành công, hiển thị thông báo thành công
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Đã lưu phân quyền thành công",
      });
      setVisible(false);
    } catch (e) {
      // Nếu có lỗi xảy ra trong quá trình insert
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Có lỗi xảy ra trong quá trình lưu phân quyền",
      });
      console.log(e.message);
    }
  };
  // hàm handleDuplicateData sẽ trả về mảng đã loại bỏ các chức năng được mà nhóm người dùng đã có, chỉ giữ lại những chức năng mới
  const handleDuplicateData = (HT_PHANQUYENList) => {
    const newList = HT_PHANQUYENList.filter((item) => {
      const isExists = ht_phanQuyenList.some((prev) => {
        return item.menu_id === prev.menu_id;
      });
      if (!isExists) {
        return item;
      }
    });
    return newList;
  };
  const InsertHT_PhanQuyen = async (data) => {
    try {
      const res = await insert_HT_PHANQUYEN(data);
      return res; // Trả về kết quả để Promise.all có thể theo dõi
    } catch (e) {
      console.log(e.message);
      throw e; // Ném lỗi để Promise.all có thể bắt lỗi
    }
  };
  const DeleteHT_PhanQuyen = async (data) => {
    try {
      const res = await delete_HT_PHANQUYEN(data);
      return res; // Trả về kết quả để Promise.all có thể theo dõi
    } catch (e) {
      console.log(e.message);
      throw e; // Ném lỗi để Promise.all có thể bắt lỗi
    }
  };
  return (
    <Dialog
      modal
      style={{
        width: "1200px",
      }}
      className="p-fluid"
      visible={visible}
      onHide={() => {
        // if (!visible) return;
        setVisible();
      }}
    >
      <div className="flex justify-content-between align-items-start gap-5">
        <div className="flex mt-4" style={{ justifyContent: "center" }}>
          <Button
            label="Lưu"
            onClick={() => {
              handleCreateHT_PhanQuyen();
              if (unselectNodes.length > 0) {
                console.log("dlete", unselectNodes);

                handleDeleteHT_PhanQuyen();
              }
            }}
            severity="success"
            style={{
              backgroundColor: "#1445a7",
              width: "20%",
            }}
            className="mr-4"
          />
          <Button
            label="Đóng"
            outlined
            severity="secondary"
            onClick={() => {
              setVisible(false);
            }}
            style={{
              width: "20%",
            }}
          />
        </div>
        <div className="field">
          <TreeTable
            selectionKeys={selectedNodeKeys}
            onSelectionChange={handleSelectionChange}
            selectionMode="checkbox"
            onSelect={(e) => setNodes(prevNodes => [...prevNodes, e.node])}
            value={arrMenu}
          >
            <Column field="id" header="ID" expander></Column>
            <Column field="ten_menu" header="Tên menu"></Column>
            <Column
              field="duong_dan"
              style={{ width: "20%" }}
              header="Đường dẫn"
              body={(rowData) => {
                const duongDan =
                  rowData.data && rowData.data.duong_dan
                    ? rowData.data.duong_dan
                    : ""; // Kiểm tra sự tồn tại của rowData.data

                return (
                  <>
                    <span id={`duongDanTooltip_${rowData.key}`}>
                      {shortenText(duongDan, MAX_LENGTH)}
                    </span>
                    <Tooltip
                      position="top"
                      mouseTrack
                      mouseTrackLeft={10}
                      target={`#duongDanTooltip_${rowData.key}`}
                      content={duongDan}
                    />
                  </>
                );
              }}
            ></Column>
            <Column
              field="icon"
              header="Icon"
              style={{ width: "10%" }}
            ></Column>
          </TreeTable>
        </div>

        <div className="field">
          <div className="flex mt-4" style={{ justifyContent: "center" }}>
            <Button
              label="Lưu"
              onClick={() => {
                handleCreateHT_PhanQuyen();
                if (unselectNodes.length > 0) {
                  console.log("dlete", unselectNodes);

                  handleDeleteHT_PhanQuyen();
                }
              }}
              severity="success"
              style={{
                backgroundColor: "#1445a7",
                width: "20%",
              }}
              className="mr-4"
            />
            <Button
              label="Đóng"
              outlined
              severity="secondary"
              onClick={() => {
                setVisible(false);
              }}
              style={{
                width: "20%",
              }}
            />
          </div>
          <TreeTable
            value={nodes}
            selectionKeys={selectedNodeKeys}
            onSelectionChange={(e) => setSelectedNodeKeys(e.value)}
          >
            <Column field="id" header="ID" expander></Column>
            <Column field="ten_menu" header="Tên menu"></Column>
            <Column
              field="duong_dan"
              style={{ width: "20%" }}
              header="Đường dẫn"
              body={(rowData) => {
                const duongDan =
                  rowData.data && rowData.data.duong_dan
                    ? rowData.data.duong_dan
                    : ""; // Kiểm tra sự tồn tại của rowData.data

                return (
                  <>
                    <span id={`duongDanTooltip_${rowData.key}`}>
                      {shortenText(duongDan, MAX_LENGTH)}
                    </span>
                    <Tooltip
                      position="top"
                      mouseTrack
                      mouseTrackLeft={10}
                      target={`#duongDanTooltip_${rowData.key}`}
                      content={duongDan}
                    />
                  </>
                );
              }}
            ></Column>
            <Column
              field="icon"
              header="Icon"
              style={{ width: "10%" }}
            ></Column>
          </TreeTable>
        </div>
      </div>

    </Dialog>
  );
};

export default QuanLyMenuVaiTro;
