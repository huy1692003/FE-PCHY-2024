import React, { useCallback, useEffect, useRef, useState } from "react";
import { DM_LOAI_BIENBAN_Service } from "../../../../services/quanlythinghiem/DM_LOAI_BIENBAN_Service";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import TableDM_LOAI_BB from "./TableDM_LOAI_BB";
import DialogForm from "./DialogForm";
import { DM_LOAI_BIENBAN } from "../../../../models/DM_LOAI_BIENBAN";
import { getMenuCurrent } from "../../../../utils/Function";

const DM_LOAI_BIEN_BAN = () => {
  const toast = useRef(null);
  const [formData, setFormData] = useState(DM_LOAI_BIENBAN);
  const [showDialog, setShowDialog] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isAdd, setIsAdd] = useState(false);
  const [data, setData] = useState([]);

  const loadData = useCallback(async (searchData = '', pageIndex = 1, pageSize = 5) => {
    try {
      const response = await DM_LOAI_BIENBAN_Service.searchDM_LOAI_BIENBAN(searchData, pageIndex, pageSize);
      console.log(response)
      setData(response?.data || []);
      setTotalRecords(response?.totalRecords || 0);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const headerList = (options) => {
    const className = `${options.className} flex flex-wrap justify-content-between align-items-center`;

    return (
      <div className={className}>
        <span className="font-bold text-xl">{getMenuCurrent()}</span>
        <div className="flex flex-wrap gap-2">
          <Button
            label="Thêm mới"
            style={{ backgroundColor: "#1445a7" }}
            onClick={() => {
              setFormData(DM_LOAI_BIENBAN);
              setShowDialog(true);
              setIsAdd(true);
            }}
          />
        </div>
      </div>
    );
  };
  console.log(">>> formData:", formData);

  return (
    <div className="border-round-3xl bg-white p-4">
      <Toast ref={toast} />

      <Panel headerTemplate={headerList}>
        <TableDM_LOAI_BB
          data={data}
          setFormData={setFormData}
          setShowDialog={setShowDialog}
          setIsAdd={setIsAdd}
          toast={toast}
          loadData={loadData}
          totalRecords={totalRecords}
        />

        <DialogForm
          loadData={loadData}
          toast={toast}
          show={showDialog}
          setShowDialog={setShowDialog}
          isAdd={isAdd}
          formData={formData}
        />
      </Panel>
    </div>
  );
};

export default DM_LOAI_BIEN_BAN;
