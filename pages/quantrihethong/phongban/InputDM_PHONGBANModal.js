import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { DM_PHONGBAN } from "../../../models/DM_PHONGBAN";
import { getAllD_DVIQLY } from "../../../services/quantrihethong/DM_DVIQLYService";
import { Button } from "primereact/button";

import {
  insertDM_PHONGBAN,
  updateDM_PHONGBAN,
} from "../../../services/quantrihethong/DM_PHONGBANService";
import { get_All_DM_DONVI } from "../../../services/quantrihethong/DM_DONVIService";

export const InputDM_PHONGBANModal = ({
  isUpdate,
  phongban,
  visible,
  setVisible,
  toast,
  loadData,
}) => {
  const [phongBan, setPhongBan] = useState(DM_PHONGBAN);
  const [donViQuanLy, setDonViQuanLy] = useState();
  const [dsDonViQuanLy, setDSDonViQuanLy] = useState([]);
  const [trangThai, setTrangThai] = useState();
  const [errors, setErrors] = useState({});
  const arrTrangThai = [
    { label: "Có hiệu lực", value: 1 },
    { label: "Hết hiệu lực", value: 0 },
  ];


  useEffect(() => {
    let dvi = (dsDonViQuanLy.find(d => d.id === phongBan.dm_donvi_id)) || null
    setPhongBan({ ...phongBan, ma_dviqly: dvi?.ma_dviqly, ten_dviqly: dvi?.ten })
  },
    [phongBan.dm_donvi_id])

  const getDSDVIQLY = async () => {
    try {
      const results = await get_All_DM_DONVI();
      setDSDonViQuanLy(results);
    } catch (err) {
      console.log(err);
    }
    if (isUpdate) {
      console.log(phongban);
      setPhongBan(phongban);
      setTrangThai(phongban.trang_thai);
      setDonViQuanLy(getDVIQLY(phongban.ten_dviqly));
    } else {
      setPhongBan(DM_PHONGBAN);
    }
  };
  const getDVIQLY = (ten_dviqly) => {
    return dsDonViQuanLy.find((d) => d.teN_DVIQLY === ten_dviqly);
  };
  useEffect(() => {
    setDonViQuanLy(getDVIQLY(phongBan.ten_dviqly));
  }, [phongBan.ten_dviqly]);
  useEffect(() => {
    getDSDVIQLY();
    console.log(isUpdate);
  }, []);
  const handleCreate = () => {
    let tempErrors = {};
    let isValid = true;


    if (phongBan.ten == null) {
      isValid = false;
      tempErrors.ten = "Tên phòng ban không được để trống";
    }
    if (phongBan.dm_donvi_id == null) {
      isValid = false;
      tempErrors.donViQuanLy = "Vui lòng chọn đơn vị ";
    }
    setErrors(tempErrors);
    return isValid;
  };
  const handleSubmit = () => {
    if (isUpdate) {
      Update();
    } else {
      Create();
    }
  };
  const Create = async () => {
    console.log(phongBan);
    try {
      if (handleCreate()) {
        const result = await insertDM_PHONGBAN({
          ...phongBan,
          nguoi_tao: "1",
        });

        toast.current.show({
          severity: "success",
          summary: "Thông báo",
          detail: "Thêm phòng ban thành công",
          life: 3000,
        });
        setVisible(false);
        loadData();
      }
    } catch (err) {
      console.error(err);
      toast.current.show({
        severity: "error",
        summary: "Thông báo",
        detail: "Thêm phòng ban không thành công",
        life: 3000,
      });
    }
  };
  const Update = async () => {
    console.log(phongBan);
    try {
      if (handleCreate()) {
        const result = await updateDM_PHONGBAN({
          ...phongBan,
          nguoi_cap_nhat: "1",
        });

        toast.current.show({
          severity: "success",
          summary: "Thông báo",
          detail: "Cập nhật phòng ban thành công",
          life: 3000,
        });
        setVisible(false);
        loadData();
      }
    } catch (err) {
      console.error(err);
      toast.current.show({
        severity: "success",
        summary: "Thông báo",
        detail: "Cập nhật phòng ban không thành công",
        life: 3000,
      });
    }
  };

  return (
    <Dialog
      header={
        !isUpdate ? "Thêm mới danh mục phòng ban" : "Sửa danh mục phòng ban"
      }
      visible={visible}
      style={{ width: "40vw" }}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
        setPhongBan(null);
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <div className="form__group w-full">
          <label htmlFor="SAP_XEP" className="form__label mb-3 inline-block">
            Chọn đơn vị
          </label>
          <Dropdown
            value={donViQuanLy}
            options={dsDonViQuanLy}
            onChange={(e) => {
              setPhongBan({ ...phongBan, dm_donvi_id: e.value });
              setDonViQuanLy(e.value);
            }}
            optionLabel="ten"
            id="ma_dviqly"
            optionValue="id"
            placeholder="Chọn đơn vị "
            className="w-full mr-2"
            onFocus={() => {
              if (errors.donViQuanLy) {
                setErrors({});
              }
            }}
          />
          {errors.donViQuanLy && (
            <p style={{ color: "red" }}>{errors.donViQuanLy}</p>
          )}
        </div>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <div className="form__group">
          <label htmlFor="TEN" className="form__label mb-3 inline-block">
            Tên phòng ban
          </label>
          <InputText
            id="TEN"
            style={{ display: "block", width: "100%" }}
            placeholder="Tên phòng ban ..."
            onChange={(e) => {
              setPhongBan({ ...phongBan, ten: e.target.value });
            }}
            onFocus={() => {
              if (errors.ten) {
                console.log("re render");
                setErrors({});
              }
            }}
            type="text"
            value={phongBan.ten}
          />
          {errors.ten && <p style={{ color: "red" }}>{errors.ten}</p>}
        </div>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <div className="form__group w-2/5">
          <label htmlFor="TRANG_THAI" className="form__label mb-3 inline-block">
            Trạng thái
          </label>
          <Dropdown
            onChange={(e) => {
              setTrangThai(e.value);
              setPhongBan({ ...phongBan, trang_thai: e.value });
            }}
            optionLabel="label"
            id="TRANG_THAI"
            className="w-full mr-2"
            style={{ width: "90%" }}
            options={arrTrangThai}
            placeholder="Chọn một trạng thái"
            value={trangThai}
          />
        </div>
        <div className="form__group w-1/2 mt-2">
          <label htmlFor="SAP_XEP" className="form__label mb-3 inline-block">
            Sắp xếp
          </label>
          <InputText
            id="SAP_XEP"
            style={{ display: "block", width: "100%" }}
            onChange={(e) => {
              setPhongBan({ ...phongBan, sap_xep: e.target.value });
            }}
            type="text"
            className="w-full"
            value={phongBan.sap_xep}
          />
        </div>
      </div>

      <div className="flex mt-4" style={{ justifyContent: "center" }}>
        <Button
          label="Lưu"
          onClick={() => {
            handleSubmit();
          }}
          severity="success"
          style={{
            backgroundColor: '#1445a7'
          }}
          className="mr-4"
        />
        <Button
          label="Đóng"
          outlined
          severity="secondary"
          onClick={() => {
            setVisible(false);
            setPhongBan(null);
          }}
        />
      </div>
    </Dialog>
  );
};
