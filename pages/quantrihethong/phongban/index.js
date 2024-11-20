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
import { DM_PHONGBAN } from "../../../models/DM_PHONGBAN";
import { searchDM_PHONGBAN } from "../../../services/quantrihethong/DM_PHONGBANService";
import { get_All_DM_DONVI } from "../../../services/quantrihethong/DM_DONVIService";
const PhongBan = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  const [options, setOptions] = useState({
    ma: "",
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
        ma: options.ma !== "" ? options.ma : ma_dviqly,
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
          <div
            className="card-header flex justify-between mb-3 items-center"
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            {/* <h3 className="card-title text-lg m-0">
              Quản lý danh mục phòng ban
            </h3> */}
          </div>

          <Card title="Tìm kiếm" className="mb-4">
            <Divider style={{ marginTop: "0", marginBottom: "10px" }} />

            <div className="flex flex-col">
              <div
                className="form__group grow"
                style={{ flexGrow: "1", width: "33.33333%" }}
              >
                <label htmlFor="MA" className="form__label mb-3 inline-block">
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
                  optionValue="ma_dviqly"
                  placeholder="Chọn đơn vị "
                  className="w-full mr-2"
                />
              </div>
              <div
                className="form__group grow"
                style={{
                  flexGrow: "1",
                  width: "33.33333%",
                }}
              >
                <label htmlFor="TEN" className="form__label mb-3 inline-block">
                  Tên phòng ban
                </label>
                <InputText
                  id="TEN"
                  style={{ display: "block", width: "90%" }}
                  placeholder="Tên phòng ban ..."
                  onChange={(e) => {
                    console.log(e.target.value);
                    setOptions({ ...options, ten: e.target.value });
                  }}
                  type="text"
                  value={options.ten}
                />
              </div>
              <div
                className="form__group "
                style={{ flexGrow: "1", width: "33.33333%" }}
              >
                <label
                  htmlFor="TRANG_THAI"
                  className="form__label mb-3 inline-block"
                >
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
                  className="w-full mr-2"
                  style={{ width: "90%" }}
                  options={arrTrangThai}
                  placeholder="Chọn một trạng thái"
                  value={options.trang_thai.value}
                ></Dropdown>
              </div>
            </div>
            <div className="flex mt-3" style={{ justifyContent: "center" }}>
              <Button
                label="Tìm kiếm"
                onClick={onClinkSearchBtn}
                severity="info"
              ></Button>
            </div>
          </Card>

          <TableDM_PhongBan
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
          ></TableDM_PhongBan>
          {visible == true && (
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
