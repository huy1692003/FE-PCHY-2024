import React, { useEffect, useRef, useState } from "react";
import { Panel } from "primereact/panel";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { BreadCrumb } from "primereact/breadcrumb";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { HT_NHOMQUYEN } from "../../../models/HT_NHOMQUYEN";
import { search_HT_NHOMQUYEN } from "../../../services/HT_NHOMQUYENService";
import TableVaiTro from "./TableVaiTro";
import ModalInputVaiTro from "./ModalInputVaiTro";
import { HT_MENU } from "../../../models/HT_MENU";
import QuanLyMenuVaiTro from "./roleMenuTable";

const QuanLyVaiTro = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [options, setOptions] = useState({
    ten_nhom: "",
  });

  const [arrVaiTro, setArrVaiTro] = useState([HT_NHOMQUYEN]);
  const [arrMenu, setArrMenu] = useState([HT_MENU]);
  const [vaiTro, setVaiTro] = useState(HT_NHOMQUYEN);
  const [visible, setVisible] = useState(false);
  const [menuDialogVisible, setMenuDialogVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedVaiTro, setSelectedVaiTro] = useState(null); // Để lưu vai trò đang được chọn cho gán menu

  const toast = useRef(null);
  const dt = useRef(null);

  const router = useRouter();

  const breadcrumb_router = [
    {
      label: "Quản trị hệ thống",
    },
    {
      label: "Vai trò",
      template: () => <Link href="/quantrihethong/vaitro">Vai trò</Link>,
    },
  ];
  const home = { icon: "pi pi-home", url: "/" };
  const handleCloseModal = () => {
    setMenuDialogVisible(false);
  };
  const loadData = async () => {
    try {
      const data = {
        pageIndex: page,
        pageSize: pageSize,
        ten_nhom: options.ten_nhom,
      };
      const items = await search_HT_NHOMQUYEN(data);
      setArrVaiTro(items);
      setPageCount(Math.ceil(items.totalItems / pageSize));
    } catch (error) {
      console.log(error);
      setArrVaiTro([]);
      setPageCount(0);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, pageSize]);

  const loadDataMenu = async () => {
    try {
      const data = await get_All_HT_MENU();
      setArrMenu(data);
    } catch (error) {
      console.log(erorr);
      setArrMenu([]);
    }
  };

  useEffect(() => {
    loadDataMenu;
  }, []);

  useEffect(() => {
    console.log(vaiTro);
  }, [vaiTro]);

  const onClickSearchButton = (e) => {
    loadData();
  };

  // const vaiTroDialogFooter = (
  //     <>
  //         <Button label="Hủy" icon="pi pi-times" text onClick={hideDialog} />
  //         <Button label="Lưu" icon="pi pi-check" text />
  //     </>
  // );

  return (
    <React.Fragment>
      <Head>
        <title>Quản lý Vai trò - Phần mềm quản lý kìm chì</title>
      </Head>

      <div className="grid">
        <div className="col-12">
          <div className="flex justify-content-between align-items-center mb-2">
            <div>Vai trò</div>
            <BreadCrumb
              model={breadcrumb_router}
              home={home}
              className="bg-transparent border-transparent"
            />
          </div>
          <div className="card">
            <Toast ref={toast} />
            <Panel header="Tìm kiếm">
              <div className="flex justify-content-between p-fluid gap-3">
                <div className="field">
                  <label>Tên vai trò</label>
                  <InputText
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      setOptions({
                        ...options,
                        ten_nhom: e.target.value,
                      });
                    }}
                    type="text"
                    value={options.ten_nhom}
                  />
                </div>
              </div>
              <div className="flex justify-content-center mt-2">
                <Button
                  label="Tìm kiếm"
                  style={{ backgroundColor: "#1445a7" }}
                  onClick={onClickSearchButton}
                />
              </div>
            </Panel>

            <TableVaiTro
              setVisible={setVisible}
              setIsUpdate={setIsUpdate}
              setVaiTro={setVaiTro}
              data={arrVaiTro}
              pageCount={pageCount}
              setPage={setPage}
              setPageSize={setPageSize}
              page={page}
              pageSize={pageSize}
              loadData={loadData}
              setMenuDialogVisible={setMenuDialogVisible}
              toast={toast}
              setSelectedVaiTro={setSelectedVaiTro}
            ></TableVaiTro>
            {visible == true && (
              <ModalInputVaiTro
                vaitro={vaiTro}
                isUpdate={isUpdate}
                visible={visible}
                setVisible={setVisible}
                toast={toast}
                loadData={loadData}
              />
            )}
            {menuDialogVisible && (
              <QuanLyMenuVaiTro
                isUpdate={isUpdate}
                menu={selectedVaiTro}
                visible={menuDialogVisible}
                setVisible={handleCloseModal}
                toast={toast}
                loadDataMenu={loadDataMenu}
                vaiTro={vaiTro}
              />
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default QuanLyVaiTro;
