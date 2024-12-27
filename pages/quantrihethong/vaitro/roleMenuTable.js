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

    // Tạo bản đồ các item menu
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

    // Duyệt qua các item và tạo cây
    menuItems.forEach((item) => {
      if (item.parent_id === null) {
        // Nếu là menu gốc, thêm vào roots
        roots.push(map[item.id]);
      } else {
        // Nếu có parent_id, gán vào children của menu cha
        if (map[item.parent_id]) {
          map[item.parent_id].children.push(map[item.id]);
        }
      }
    });

    // Trả về cây menu với các items đã được xây dựng
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

  const handleAutoSelect = (arrHT_PHANQUYEN, treeData) => {
    // Lấy danh sách menu có quyền được gán
    const menus = treeData.filter((menu) => {
      const isExists = arrHT_PHANQUYEN.some((item) => item.menu_id === menu.key);
      if (isExists) {
        return menu;
      }
    });
  
    const selectedKeys = {};
  
    // Hàm kiểm tra và chọn các menu con ở nhiều cấp
    const processMenuSelection = (menu) => {
      let hasPartialCheck = false;  // Biến kiểm tra trạng thái `partialChecked`
      let hasFullCheck = true;      // Biến kiểm tra nếu tất cả con đều được chọn
  
      // Duyệt qua tất cả các cấp con của menu (recursive)
      menu.children.forEach((child) => {
        const isChildSelected = arrHT_PHANQUYEN.some((item) => item.menu_id === child.data.id);
        
        // Nếu con được chọn, đánh dấu trạng thái
        if (isChildSelected) {
          selectedKeys[child.data.id] = { checked: true, partialChecked: false };
        } else {
          hasFullCheck = false; // Nếu có con không được chọn, cha không thể `checked`
        }
  
        // Nếu có children ở các cấp sâu hơn, tiếp tục kiểm tra
        if (child.children && child.children.length > 0) {
          processMenuSelection(child);  // Đệ quy để xử lý các cấp con
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
    };
  
    // Duyệt qua các menu để xác định trạng thái `checked` cho tất cả menu và các cấp con
    menus.forEach((menu) => {
      processMenuSelection(menu);  // Gọi hàm để xử lý menu cha và các cấp con
    });
  
    // Cập nhật lại state `selectedNodeKeys`
    setSelectedNodeKeys(selectedKeys);
  
    // Lọc các menu đã được chọn và lưu vào state
    const filteredMenus = menus.map((menu) => {
      // Lọc các children của menu cha
      const filteredChildren = menu.children.filter((child) => {
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
  

  const delete_QUYEN = async (id) => {
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
    console.log(nodes);
    let HT_PHANQUYENList = [];

    // Hàm đệ quy để duyệt qua cây
    const processNode = (node) => {
      // Thêm node hiện tại vào danh sách
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

      // Kiểm tra và thêm node cha nếu cần
      if (node.data.parent_id) {
        let nodecha = arrMenu.find((item) => item.key === node.data.parent_id);
        if (nodecha && !HT_PHANQUYENList.find((item) => item.menu_id === nodecha.data.id)) {
          const parentModel = {
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
          HT_PHANQUYENList.push(parentModel);
        }
      }

      // Duyệt qua các children
      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => processNode(child));
      }
    };

    // Bắt đầu duyệt từ các node gốc
    nodes.forEach((node) => processNode(node));

    // Xóa quyền cũ
    await Promise.all(ht_phanQuyenList.map((item) => delete_QUYEN(item.id)));

    // Gán danh sách mới
    let newList = HT_PHANQUYENList;
    console.log(newList);



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

  
  const InsertHT_PhanQuyen = async (data) => {

    try {
      const res = await insert_HT_PHANQUYEN(data);
      return res; // Trả về kết quả để Promise.all có thể theo dõi
    } catch (e) {
      console.log(e.message);
      throw e; // Ném lỗi để Promise.all có thể bắt lỗi
    }
  };
  

  const headerTemplate = (
    <div className="flex justify-content-between align-items-center">
      <span className='text-xl font-bold'>PHÂN QUYỀN MENU</span>
      <div className="flex gap-2">
        <Button
          label="Lưu"
          onClick={() => {
            handleCreateHT_PhanQuyen();
          }}
          severity="success"
          style={{
            backgroundColor: "#1445a7",
          }}
        />
        <Button
          label="Đóng"
          outlined
          severity="secondary"
          onClick={() => {
            setVisible(false);
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
        width: "90vw",
        maxWidth: "1200px"
      }}
      className="p-fluid"
      visible={visible}
      onHide={() => {
        setVisible();
      }}
    >
      <div className="flex flex-column md:flex-row gap-4">
        <div className="flex-1">
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
            scrollable
            scrollHeight="calc(100vh - 300px)"
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
                    : "";

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

{/* đã chọn */}
        <div className="flex-1">
          <TreeTable
            value={nodes}
            selectionKeys={selectedNodeKeys}
            scrollable
            scrollHeight="calc(100vh - 300px)"
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
                    : "";

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
