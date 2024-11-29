import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState, useEffect } from "react";
import { DM_KHACHHANG_Service } from "../../../../services/quanlythinghiem/DM_KHACHHANG_Service";

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

  const userName = JSON.parse(sessionStorage.getItem("user")).ho_ten;

  useEffect(() => {
    setForm(formData);
  }, [formData]);

  console.log(form);

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
        await DM_KHACHHANG_Service.create_DM_KHACHHANG(form); 
        toast.current.show({
          severity: "success",
          summary: "Thêm mới thành công",
        });
      } else {
        await DM_KHACHHANG_Service.update_DM_KHACHHANG(form);
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
          {isAdd ? "Thêm mới khách hàng" : "Cập nhật thông tin khách hàng"}
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
            <label htmlFor="ten_kh" className="block mb-2">
              Tên khách hàng<span className="text-red-500">*</span>
            </label>
            <InputText
              id="ten_kh"
              name="ten_kh"
              value={form.ten_kh}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="so_dt" className="block mb-2">
              Số điện thoại<span className="text-red-500">*</span>
            </label>
            <InputText
              id="so_dt"
              name="so_dt"
              value={form.so_dt}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2">
              Email<span className="text-red-500">*</span>
            </label>
            <InputText
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="ma_so_thue" className="block mb-2">
              Mã số thuế
            </label>
            <InputText
              id="ma_so_thue"
              name="ma_so_thue"
              value={form.ma_so_thue}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="dia_chi" className="block mb-2">
              Địa chỉ
            </label>
            <InputText
              id="dia_chi"
              name="dia_chi"
              value={form.dia_chi}
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
