import { useEffect, useState, useRef } from "react";

import { Button } from "primereact/button";
import TableDM_LoaiThietBi from "./TableDM_LOAITHIETBI";
import { DM_LOAITHIETBI } from "../../../../models/DM_LOAITB";
import { DM_LOAI_THIET_BI_Service } from "../../../../services/quanlythinghiem/DM_LOAITHIETBIService";
import DialogForm from "./DialogForm";
import { Toast } from "primereact/toast";

const LoaiThietBi = () => {
  const [data, setData] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [formData, setFormData] = useState(DM_LOAITHIETBI);
  const toast = useRef(null);

  const loadData = async () => {
    try {
      const items = await DM_LOAI_THIET_BI_Service.getAll_DM_LOAITHIETBI();
      setData(items);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  return (
    <>
      <div className="border-round-3xl bg-white p-4">
        
        <TableDM_LoaiThietBi
          data={data}
          formData={formData}
          loadData={loadData}
          setFormData={setFormData}
          setShowDialog={setShowDialog}
          setIsAdd={setIsAdd}
        />

        <DialogForm
          formData={formData}
          show={showDialog}
          setShowDialog={setShowDialog}
          loadData={loadData}
          isAdd={isAdd}
          toast={toast}
        ></DialogForm>
      </div>
      <Toast ref={toast} />
    </>
  );
};

export default LoaiThietBi;
