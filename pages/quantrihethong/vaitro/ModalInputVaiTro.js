import React, { useEffect, useState } from "react";
import { HT_NHOMQUYEN } from "../../../models/HT_NHOMQUYEN";
import { get_All_DM_DONVI } from "../../../services/DM_DONVIService";
import {
  create_HT_NHOMQUYEN,
  update_HT_NHOMQUYEN,
} from "../../../services/HT_NHOMQUYENService";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { DM_DONVI } from "../../../models/DM_DONVI";
import { v4 as uuidv4 } from "uuid";
import { Button } from "primereact/button";
import { getAllD_DVIQLY } from "../../../services/D_DVIQLYService";

const ModalInputVaiTro = ({
  isUpdate,
  vaitro,
  visible,
  setVisible,
  toast,
  loadData,
}) => {
  const [vaiTro, setVaiTro] = useState(vaitro);

  const [dviQLY, setDVIQLY] = useState([]);

  const [errors, setErrors] = useState({});



  const getDVIQLY = async () => {
    let data = await getAllD_DVIQLY()
    data && setDVIQLY(data.map(d => ({ id: d.mA_DVIQLY, name: d.teN_DVIQLY })))
  }



  useEffect(() => {
    getDVIQLY()
  }, []);

  console.log(vaiTro)
  const handleCreateVaiTro = () => {
    let tempErrors = {};
    let isValid = true;

    if (vaiTro.ten_nhom == null) {
      isValid = false;
      tempErrors.ten_nhom = "Tên nhóm quyền không được để trống";
    }
    if (vaiTro.ma_dviqly == null) {
      isValid = false;
      tempErrors.ten_nhom = "Vui lòng chọn đơn vị";
    }
    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = () => {
    console.log(isUpdate)
    if (isUpdate) {
      updateVaiTro();
    } else {
      createVaiTro();
    }
  };

  const createVaiTro = async () => {
    alert()
    const nhom_id = uuidv4();
    try {
      if (handleCreateVaiTro) {

        const results = await create_HT_NHOMQUYEN({
          ...vaiTro,
          nhom_id: nhom_id,
          nguoi_tao: "1",
          cap_bac: 0,
          sap_xep: 0,
          ma_dviqly: vaiTro.ma_dviqly,
        });
        toast.current.show({
          severity: "success",
          summary: "Thông báo",
          detail: "Thêm vai trò thành công",
          life: 3000,
        });

        setVisible(false);
        loadData();
      }
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Thông báo",
        detail: "Thêm vai trò không thành công",
        life: 3000,
      });
    }
  };

  const updateVaiTro = async () => {
    console.log({
      ...vaiTro,
      nguoi_sua: "1",
    })
    try {
      if (handleCreateVaiTro()) {
        const result = await update_HT_NHOMQUYEN({
          ...vaiTro,
          nguoi_sua: "1",
        });

        toast.current.show({
          severity: "success",
          summary: "Thông báo",
          detail: "Cập nhật vai trò thành công",
          life: 3000,
        });

        setVisible(false);
        loadData();
      }
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Thông báo",
        detail: "Sửa vai trò không thành công",
        life: 3000,
      });
    }
  };

  return (
    <Dialog
      header={!isUpdate ? "Thêm mới vai trò" : "Cập nhật vai trò"}
      style={{ width: "600px" }}
      className="p-fluid"
      visible={visible}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
        setVaiTro(null);
      }}
    >
      <div className="field">
        <label htmlFor="TEN_NHOM">Tên vai trò</label>
        <InputText
          id="ten_nhom"
          onChange={(e) => {
            setVaiTro({ ...vaiTro, ten_nhom: e.target.value })
          }}
          type="text"
          value={vaiTro.ten_nhom}
        />
      </div>

      <div className="field">
        <label htmlFor="GHI_CHU">Ghi chú</label>
        <InputText
          id="ghi_chu"
          onChange={(e) => {
            setVaiTro({ ...vaiTro, ghi_chu: e.target.value })
          }}
          type="text"
          value={vaiTro.ghi_chu}
        />
      </div>

      <div className="field">
        <label htmlFor="MA_DVIQLY">Đơn vị quản lý</label>
        <Dropdown
          value={vaiTro.ma_dviqly}
          options={dviQLY}
          onChange={(e) => {
            setVaiTro({ ...vaitro, ma_dviqly: e.value });
            console.log(e.value);
          }}
          filter
          optionLabel="name"
          optionValue="id"
          id="MA_DVIQLY"
          placeholder="Chọn đơn vị"
          className="w-full"
        ></Dropdown>
      </div>

      <div className="flex mt-4" style={{ justifyContent: "center" }}>
        <Button
          label="Lưu"
          onClick={() => {
            handleSubmit();
          }}
          style={{
            backgroundColor: "#1445a7",
          }}
          className="mr-4"
        />
        <Button
          label="Đóng"
          outlined
          severity="secondary"
          onClick={() => {
            setVisible(false);
            setVaiTro(null);
          }}
        />
      </div>
    </Dialog>
  );
};

export default ModalInputVaiTro;
