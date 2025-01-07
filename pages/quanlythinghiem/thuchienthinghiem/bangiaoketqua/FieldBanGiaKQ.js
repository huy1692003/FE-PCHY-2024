import { useEffect, useState } from "react";
import { FormField } from "../../../../utils/Components/ListFieldYCTN/FieldAddYCTN";
import QLTN_YCTN from "../../../../models/QLTN_YCTN";
import { MultiSelect } from "primereact/multiselect";
import { get_All_DM_DONVI } from "../../../../services/quantrihethong/DM_DONVIService";

const FieldBanGiaKQ = ({ thongTinYCTN, formData, setFormData }) => {
  const [donVi, setDonVi] = useState([]);

  const user = JSON.parse(sessionStorage.getItem("user"))?.ten_dang_nhap || "";

  useEffect(() => {
    getDonVi();
  }, []);

  const getDonVi = async () => {
    const res = await get_All_DM_DONVI();
    setDonVi(res);
  };
  return (
    <>
      <div className="flex gap-4">
        <div style={{ width: "49%" }}>
          <FormField
            label="Người bàn giao kết quả"
            id="nguoi_ban_giao"
            value={formData?.nguoi_ban_giao || user}
            onChange={(id, value) =>
              setFormData((prev) => ({ ...prev, [id]: value }))
            }
          />
        </div>
        <div style={{ width: "49%" }}>
          <FormField
            label="Ngày bàn giao kết quả"
            id="ngay_ban_giao"
            value={formData?.ngay_ban_giao ? new Date(formData.ngay_ban_giao) : new Date()}

            onChange={(id, value) =>
              setFormData((prev) => ({ ...prev, [id]: value }))
            }
            isCalendar
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div style={{ width: "49%" }}>
          <FormField
            label="Ghi chú"
            id="ghi_chu_ban_giao"
            value={formData?.ghi_chu_ban_giao}
            onChange={(id, value) =>
              setFormData((prev) => ({ ...prev, [id]: value }))
            }
          />
        </div>
        <div style={{ width: "49%" }}>
          <label className="font-medium text-sm my-2 block">
            Đơn vị bàn giao
          </label>
          <MultiSelect
            value={donVi.length > 0 && formData?.don_vi_nhan_ban_giao || []}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, don_vi_nhan_ban_giao: e.value }))
            }
            options={donVi}
            optionLabel="ten"
            display="chip"
            optionValue="id"
            placeholder="Chọn đơn vị"
            filter
            className="w-full"
          />
        </div>
      </div>
    </>
  );
};

export default FieldBanGiaKQ;
