import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState, useEffect } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import {
  headerStyleColumn,
  propSortAndFilter,
} from "../../../../constants/propGlobal";
import { DM_LOAI_TAISANService } from "../../../../services/quanlythinghiem/DM_LOAI_TAISANService";

const DialogForm = ({
  show,
  setShow,
  isAdd,
  formData,
  setShowDialog,
  toast,
  loadData,
}) => {
  const [form, setForm] = useState(formData);

  const userName = JSON.parse(sessionStorage.getItem("user")).ho_ten

  useEffect(() => {
    setForm(formData);
  }, [formData]);

  // Xử lý thay đổi các trường nhập liệu
  const handleChange = (e) => {
    // setForm({
    //   ...form,
    //   [e.target.id]: e.target.value,
    //     nguoi_tao: isAdd ? userName : form.nguoi_tao,
    //     nguoi_sua: !isAdd ?userName : form.nguoi_tao,
    // });
    setForm((prev) => {
        //console.log('prev', prev);
        return {
            ...prev,
            [e.target.id]: e.target.value,
            nguoi_tao: isAdd ? userName : form.nguoi_tao,
            nguoi_sua: !isAdd ?userName : form.nguoi_tao,
        }
    })
  };

  // Hàm gửi dữ liệu khi lưu
  const handleSubmit = async () => {
    if (isAdd) {
   await DM_LOAI_TAISANService.create_DM_LOAI_TAISAN(form);
      toast.current.show({
        severity: "success",
        summary: "Thêm mới thành công",
      });
    } else {
    await DM_LOAI_TAISANService.update_DM_LOAI_TAISAN(form);

      toast.current.show({
        severity: "success",
        summary: "Cập nhật thành công",
      });
    }
    setShowDialog(false);
    loadData();
  };
  //console.log("current-state",form);

  const renderHeader = () => {
    return (
      <div className="flex align-items-center justify-content-between">
        <span>
          {isAdd ? "Thêm mới tên loại thiết bị" : "Cập nhật loại thiết bị"}
        </span>
        <div className="flex gap-2">
          <Button
            label="Lưu"
            onClick={() => handleSubmit()}
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
              setShowDialog(false);
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <Dialog
      header={renderHeader}
      visible={show}
      closable={false}
      style={{ width: "50vw", height: "auto", overflowY: "visible" }}
      contentStyle={{ paddingTop: "10px" }}
    >
      <div className="grid p-fluid">
        <div className="flex flex-column gap-2 w-full">
          <div>
            <label htmlFor="" className="block mb-2">
              Tên loại tài sản<span className="text-red-500">*</span>
            </label>
            <InputText
              id="ten_lts"
              name="ten_lts"
              value={form.ten_lts}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="" className="block mb-2">
              Ghi chú<span className="text-red-500">*</span>
            </label>
            <InputText
              id="ghi_chu"
              name="ghi_chu"
              value={form.ghi_chu}
              onChange={handleChange}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default DialogForm;
