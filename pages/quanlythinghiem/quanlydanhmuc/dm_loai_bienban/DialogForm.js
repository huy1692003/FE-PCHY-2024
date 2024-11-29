import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState, useEffect } from "react";
import { DM_LOAI_BIENBAN_Service } from "../../../../services/quanlythinghiem/DM_LOAI_BIENBAN_Service";
import { DM_LOAI_BIENBAN } from "../../../../models/DM_LOAI_BIENBAN";

const DialogForm = ({
  show,
  setShow,
  isAdd,
  formData,
  setShowDialog,
  toast,
  loadData,
}) => {
  const [form, setForm] = useState(formData || DM_LOAI_BIENBAN);

  const userName = JSON.parse(sessionStorage.getItem("user")).ho_ten;

  useEffect(() => {
    setForm(formData || DM_LOAI_BIENBAN);
  }, [formData]);

  // Xử lý thay đổi các trường nhập liệu
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
      nguoi_tao: isAdd ? userName : prev.nguoi_tao,
      nguoi_sua: !isAdd ? userName : prev.nguoi_sua,
    }));
  };

  // Hàm gửi dữ liệu khi lưu
  const handleSubmit = async () => {
    try {
      if (isAdd) {
        await DM_LOAI_BIENBAN_Service.insertDM_LOAI_BIENBAN(form);
        toast.current.show({
          severity: "success",
          summary: "Thêm mới thành công",
        });
      } else {
        await DM_LOAI_BIENBAN_Service.updateDM_LOAI_BIENBAN(form.id, form);
        toast.current.show({
          severity: "success",
          summary: "Cập nhật thành công",
        });
      }
      setShowDialog(false);
      loadData();
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Có lỗi xảy ra khi lưu dữ liệu!",
      });
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex align-items-center justify-content-between">
        <span>
          {isAdd ? "Thêm mới loại biên bản" : "Cập nhật thông tin loại biên bản"}
        </span>
        <div className="flex gap-2">
          <Button
            label="Lưu"
            onClick={handleSubmit}
            severity="success"
            style={{ backgroundColor: "#1445a7" }}
          />
          <Button
            label="Đóng"
            outlined
            severity="secondary"
            onClick={() => setShowDialog(false)}
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
            <label htmlFor="ten_loai_bb" className="block mb-2">
              Tên loại biên bản<span className="text-red-500">*</span>
            </label>
            <InputText
              id="ten_loai_bb"
              name="ten_loai_bb"
              value={form.ten_loai_bb}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="ghi_chu" className="block mb-2">
              Ghi chú
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
