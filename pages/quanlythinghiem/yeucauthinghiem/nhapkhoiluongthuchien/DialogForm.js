import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { DM_LOAI_THIET_BI_Service } from "../../../../services/quanlythinghiem/DM_LOAITHIETBIService";
import { InputNumber } from "primereact/inputnumber";

const DialogForm = ({
  show,
  setShowDialog,
  isAdd,
  formData,
  arrThietbi,
  toast,
  setFormData,
  setArrThietbi,
  LoatArrThietBi,
}) => {
  const renderHeader = () => {
    return (
      <div className="flex align-items-center justify-content-between">
        <span>
          {isAdd ? "Thêm khối lượng thực hiện" : "Sửa khối lượng thực hiện"}
        </span>
        <div className="flex gap-2">
          <Button
            label={isAdd ? "Lưu" : "Sửa"}
            severity="success"
            style={{
              backgroundColor: "#1445a7",
            }}
            onClick={handleSubmit}
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [arrLoaiThietBi, setArrLoaiThietBi] = useState([]);

  const loadLoaiThietBi = async () => {
    try {
      const items = await DM_LOAI_THIET_BI_Service.getAll_DM_LOAITHIETBI();
      setArrLoaiThietBi(items);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    loadLoaiThietBi();
  }, []);

  const handleSubmit = () => {
    if (isAdd) {
      setArrThietbi((prev) => {
        // Tìm ID lớn nhất trong mảng hiện tại
        const maxId =
          prev.length > 0 ? Math.max(...prev.map((item) => item.id || 0)) : 0;

        // Tạo object mới với ID tự động tăng
        const newItem = {
          ...formData,
          id: maxId + 1,
        };

        const newArray = [...prev, newItem];
        console.log("Dữ liệu sau khi thêm:", newArray);
        return newArray;
      });

      // Reset form data về trạng thái ban đầu

      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Thêm khối lượng thực hiện thành công",
        life: 3000,
      });
      setShowDialog(false);
      setFormData([]);
    } else {
      // Sửa dựa trên ID thay vì stt
      const index = arrThietbi.findIndex((item) => item.id === formData.id);

      if (index !== -1) {
        const newArr = [...arrThietbi];
        newArr[index] = formData;
        setArrThietbi(newArr);

        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: "Cập nhật khối lượng thực hiện thành công",
          life: 3000,
        });
        setShowDialog(false);
        setFormData([]);
      }
    }
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
            <label htmlFor="ten_thiet_bi" className="block mb-2">
              Tên thiết bị<span className="text-red-500">*</span>
            </label>
            <InputText
              id="ten_thiet_bi"
              name="ten_thiet_bi"
              value={formData.ten_thiet_bi || ""}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="ma_loai_tb" className="block mb-2">
              Loại thiết bị<span className="text-red-500">*</span>
            </label>
            <Dropdown
              id="ma_loai_tb"
              name="ma_loai_tb"
              value={formData.ma_loai_tb}
              onChange={(e) => {
                handleChange(e);
                const selectedItem = arrLoaiThietBi.find(
                  (item) => item.ma_loai_tb === e.value
                );
                setFormData((prev) => ({
                  ...prev,
                  ten_loai_thiet_bi: selectedItem?.ten_loai_tb,
                }));
              }}
              options={arrLoaiThietBi}
              optionLabel="ten_loai_tb"
              optionValue="ma_loai_tb"
              placeholder="Chọn loại thiết bị"
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="so_luong" className="block mb-2">
              Số lượng<span className="text-red-500">*</span>
            </label>
            <InputNumber
              id="so_luong"
              name="so_luong"
              value={formData.so_luong}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: "so_luong",
                    value: e.value,
                  },
                })
              }
              mode="decimal"
              showButtons
              min={1}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default DialogForm;
