import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState, useRef } from "react";
import "primeicons/primeicons.css";
import { useRouter } from "next/router";
import TableDM_PhongBan from "./TableDM_PhongBan";
import { InputDM_PHONGBANModal } from "./InputDM_PHONGBANModal";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";
import { Panel } from "primereact/panel";

import { DM_PHONGBAN } from "../../../models/DM_PHONGBAN";
import { searchDM_PHONGBAN } from "../../../services/quantrihethong/DM_PHONGBANService";
import { get_All_DM_DONVI } from "../../../services/quantrihethong/DM_DONVIService";

const PhongBan = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  const [options, setOptions] = useState({
    ma: undefined,
    ten: "",
    trang_thai: {
      label: "",
      value: "",
    },
  });
  const [arrPhongBan, setArrPhongBan] = useState([DM_PHONGBAN]);
  const [PHONGBAN, setPHONGBAN] = useState(DM_PHONGBAN);
  const [visible, setVisible] = useState(false);
  const [donViQuanLy, setDonViQuanLy] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const toast = useRef(null);

  const arrTrangThai = [
    { label: "Có hiệu lực", value: 1 },
    { label: "Hết hiệu lực", value: 0 },
  ];

  useEffect(() => {
    const getDSDonViQuanLy = async () => {
      const results = await get_All_DM_DONVI();
      console.log(results)
      setDonViQuanLy(results);
    };
    getDSDonViQuanLy();
  }, []);

  const loadData = async () => {
    try {
      const ma_dviqly = JSON.parse(sessionStorage.getItem("current_MADVIQLY"));
      const data = {
        pageIndex: page,
        pageSize: pageSize,
        ma: options.ma,
        ten: options.ten,
        trang_thai: options.trang_thai.value,
      };
      const items = await searchDM_PHONGBAN(data);
      setArrPhongBan(items);
      setPageCount(Math.ceil(items.totalItems / pageSize));
    } catch (err) {
      console.log(err);
      setArrPhongBan([]);
      setPageCount(0);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, pageSize]);

  const onClinkSearchBtn = (e) => {
    loadData();
  };

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <Panel header="Tìm kiếm" className="mb-4">
            <Divider style={{ marginTop: "0", marginBottom: "10px" }} />

            <div className="flex flex-column lg:flex-row gap-3">
              <div className="flex-auto">
                <label htmlFor="MA" className="mb-2 block">
                  Đơn vị
                </label>
                <Dropdown
                  value={options.ma}
                  options={donViQuanLy}
                  onChange={(e) => {
                    setOptions({ ...options, ma: e.target.value });
                  }}
                  optionLabel="ten"
                  id="ma_dviqly"
                  optionValue="id"
                  placeholder="Chọn đơn vị"
                  className="w-full"
                  showClear
                />
              </div>

              <div className="flex-auto">
                <label htmlFor="TEN" className="mb-2 block">
                  Tên phòng ban
                </label>
                <InputText
                  id="TEN"
                  className="w-full"
                  placeholder="Nhập tên"
                  onChange={(e) => {
                    console.log(e.target.value);
                    setOptions({ ...options, ten: e.target.value });
                  }}
                  type="text"
                  value={options.ten}
                />
              </div>

              <div className="flex-auto">
                <label htmlFor="TRANG_THAI" className="mb-2 block">
                  Trạng thái
                </label>
                <Dropdown
                  onChange={(e) => {
                    setOptions({
                      ...options,
                      trang_thai: arrTrangThai.find(
                        (tt) => tt.value === e.value
                      ),
                    });
                  }}
                  optionLabel="label"
                  id="TRANG_THAI"
                  className="w-full"
                  options={arrTrangThai}
                  placeholder="Chọn trạng thái"
                  value={options.trang_thai.value}
                />
              </div>
            </div>

            <div className="flex justify-content-center mt-4">
              <Button
                style={{backgroundColor: '#1445a7', color: '#fff'}}
                label="Tìm kiếm"
                onClick={onClinkSearchBtn}
                severity="info"
              />
            </div>
          </Panel>

          <TableDM_PhongBan
            donvi={donViQuanLy}
            setVisible={setVisible}
            setIsUpdate={setIsUpdate}
            setPHONGBAN={setPHONGBAN}
            data={arrPhongBan}
            pageCount={pageCount}
            setPage={setPage}
            setPageSize={setPageSize}
            page={page}
            pageSize={pageSize}
            loadData={loadData}
            toast={toast}
          />

          {visible && (
            <InputDM_PHONGBANModal
              phongban={PHONGBAN}
              isUpdate={isUpdate}
              visible={visible}
              setVisible={setVisible}
              toast={toast}
              loadData={loadData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PhongBan;
