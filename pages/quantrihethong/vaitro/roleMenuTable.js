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
  const [menuInit, setMenuInit] = useState([]);
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
          parent_id: item.parent_id,
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
      setMenuInit(menus)
      GetHT_PhanQuyenByMaNhomTV(treeData);
    };
    fetchData();
  }, []);

  //hàm xử lý việc hiển thị các chức năng đã được gán cho nhóm và tự động select các các chức năng đã được gán
  const handleAutoSelect = (arrHT_PHANQUYEN, treeData) => {
    // Lấy danh sách menu có quyền được gán
    const menus = treeData.filter((menu) => {
      const isExists = arrHT_PHANQUYEN.some((item) => item.menu_id === menu.key);
      if (isExists) {
        return menu;
      }
    });

    const selectedKeys = {};

    menus.forEach((menu) => {
      let hasPartialCheck = false; // Biến kiểm tra trạng thái `partialChecked`
      let hasFullCheck = true;     // Biến kiểm tra nếu tất cả con đều được chọn

      // Xử lý menu cha
      menu.children.forEach((child) => {
        const isChildSelected = arrHT_PHANQUYEN.some((item) => item.menu_id === child.data.id);
        if (isChildSelected) {
          selectedKeys[child.data.id] = { checked: true, partialChecked: false };
        } else {
          hasFullCheck = false; // Nếu có con không được chọn, cha không thể `checked`
        }
      });

      // Xử lý trạng thái của menu cha
      if (menu.children.length > 0) {
        // Nếu chỉ một phần con được chọn
        hasPartialCheck = Object.keys(selectedKeys).some((key) =>
          menu.children.some((child) => child.data.id === parseInt(key))
        );

        selectedKeys[menu.data.id] = {
          checked: hasFullCheck,         // Đánh dấu nếu tất cả con đều được chọn
          partialChecked: hasPartialCheck && !hasFullCheck, // Đánh dấu `partialChecked`
        };
      } else {
        // Nếu không có con, kiểm tra menu cha trực tiếp
        const isParentSelected = arrHT_PHANQUYEN.some((item) => item.menu_id === menu.data.id);
        if (isParentSelected) {
          selectedKeys[menu.data.id] = { checked: true, partialChecked: false };
        }
      }
    });

    // Cập nhật lại state
    setSelectedNodeKeys(selectedKeys);
    // Lọc chỉ các menu có trong selectedKeys và lưu vào state
    // Lọc các menu cha và lọc tiếp các children đã được chọn
    const filteredMenus = menus.map((menu) => {
      // Lọc các children của menu cha
      const filteredChildren = menu.children.filter((child) => {
        // Kiểm tra xem child có được chọn hay không trong selectedKeys
        return selectedKeys[child.data.id] && selectedKeys[child.data.id].checked === true;
      });

      // Nếu menu cha hoặc có bất kỳ children nào được chọn, giữ lại menu cha với children đã lọc
      if ((selectedKeys[menu.data.id] && selectedKeys[menu.data.id].checked === true) || filteredChildren.length > 0) {
        return {
          ...menu,
          children: filteredChildren, // Cập nhật lại các children đã lọc
        };
      }

      // Nếu không có gì được chọn, loại bỏ menu này
      return null;
    }).filter(menu => menu !== null); // Loại bỏ các menu không có gì được chọn

    // Cập nhật lại state với các menu đã được lọc
    setNodes(filteredMenus);
  };

  const delete_QUYEN=async(id)=>{
    try {
      const res = await delete_HT_PHANQUYEN(id);
      return res;
    } catch (e) {
      console.log(e.message);
    }
  }

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
    let listSelect = e.value
    console.log(selectedNodeKeys)
    setSelectedNodeKeys(listSelect)
  },
    [selectedNodeKeys]);


  useEffect(() => {
    
    const treeData = buildTree(menuInit);
    const filteredMenus = treeData.map((menu) => {
      // Lọc các children của menu cha
      const filteredChildren = menu.children.filter((child) => {
        // Kiểm tra xem child có được chọn hay không trong selectedKeys
        return selectedNodeKeys[child.data.id] && selectedNodeKeys[child.data.id].checked === true;
      });

      // Nếu menu cha hoặc có bất kỳ children nào được chọn, giữ lại menu cha với children đã lọc
      if ((selectedNodeKeys[menu.data.id] && selectedNodeKeys[menu.data.id].checked === true) || filteredChildren.length > 0) {
        return {
          ...menu,
          children: filteredChildren, // Cập nhật lại các children đã lọc
        };
      }

      // Nếu không có gì được chọn, loại bỏ menu này
      return null;
    }).filter(menu => menu !== null); // Loại bỏ các menu không có gì được chọn
    setNodes(filteredMenus)
  }, [selectedNodeKeys])

  const handleCreateHT_PhanQuyen = async () => {
    console.log(nodes)
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
      if (node.data.parent_id) {
        console.log(arrMenu)
        let nodecha = arrMenu.find(item => item.key === node.data.parent_id)
        if (!HT_PHANQUYENList.find(item => item.menu_id === nodecha.data.id)) {
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
            menu_id: nodecha.data.id,
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
        }
      }

    });
    await Promise.all(ht_phanQuyenList.map((item) => delete_QUYEN(item.id)));
  let newList = HT_PHANQUYENList;
    
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

  const headerTemplate = (
    <div className="flex justify-content-between">
      <span className='inline-block w-4'>PHÂN QUYỀN MENU</span>
      <div className="w-full text-right" >
        <Button
          label="Lưu"
          onClick={() => {
            handleCreateHT_PhanQuyen();
            
          }}
          severity="success"
          style={{
            backgroundColor: "#1445a7",
            width: "10%",
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
            width: "10%",
          }}
        />
      </div>
    </div>
  );

  return (
    <Dialog
      closable={false}
      header={headerTemplate}
      style={{
        width: "1200px",
      }}
      className="p-fluid"
      visible={visible}
      onHide={() => {
        setVisible();
      }}
    >

      <div className="flex justify-content-between align-items-start gap-5">
        <div className="field">
          <TreeTable
            selectionKeys={selectedNodeKeys}
            onSelectionChange={handleSelectionChange}
            selectionMode="checkbox"
            onSelect={(e) => {

              setNodes(prevNodes => {

                console.log(prevNodes)

                return [...prevNodes, e.node]
              })

            }}
            value={arrMenu}
          >
            <Column field="" header="ID" expander></Column>
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

          <TreeTable
            value={nodes}
            selectionKeys={selectedNodeKeys}

          >
            <Column field="" header="ID" expander></Column>
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
