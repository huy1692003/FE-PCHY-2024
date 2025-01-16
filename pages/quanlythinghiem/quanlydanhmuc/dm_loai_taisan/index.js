import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";
import { useCallback, useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import DialogForm from "./DialogForm";
import { DM_LOAI_TAISANService } from "../../../../services/quanlythinghiem/DM_LOAI_TAISANService";

import TableDM_LOAI_TAI_SAN from "./TableDM_LOAI_TAISAN";
import { DM_LOAI_TAISAN } from "../../../../models/DM_LOAI_TAISAN";
import { getMenuCurrent } from "../../../../utils/Function";

const DM_LOAI_TAI_SAN = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [formData, setFormData] = useState(DM_LOAI_TAISAN);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  const [selectedItems, setSelectedItems] = useState([]);
  const [data, setData] = useState([]);
  const toast = useRef(null);

  const loadData = useCallback(
    async (pageNumber = 1, pageSize = 10, search = "") => {
      try {
        setLoading(true);
        const response = await DM_LOAI_TAISANService.get_DM_LOAI_TAISAN({
          search,
          page: pageNumber,
          pagesize: pageSize,
        });
        setData(response?.data || []);
        setTotalRecords(response?.totalCount || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  console.log("data", data);

  const headerList = (options) => {
    const className = `${options.className} flex flex-wrap justify-content-between align-items-center`;

    return (
      <div className={className}>
        <span className="font-bold text-xl">{getMenuCurrent()}</span>
        <div className="flex flex-wrap gap-2">
          {selectedItems.length > 0 && (
            <Button label="Xóa nhiều" severity="danger" onClick={() => {}} />
          )}
          <Button
            label="Thêm mới"
            style={{ backgroundColor: "#1445a7" }}
            onClick={() => {
              setFormData(DM_LOAI_TAISAN);
              setShowDialog(true);
              setIsAdd(true);
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="border-round-3xl bg-white p-4">
      <Panel headerTemplate={headerList}>
        <TableDM_LOAI_TAI_SAN
          data={data}
          setFormData={setFormData}
          setShowDialog={setShowDialog}
          setIsAdd={setIsAdd}
          toast={toast}
          loadData={loadData}
          totalRecords={totalRecords}
        />
      </Panel>
      <Toast ref={toast} />
      <DialogForm
        loadData={loadData}
        toast={toast}
        show={showDialog}
        setShowDialog={setShowDialog}
        isAdd={isAdd}
        formData={formData}
      />
    </div>
  );
};

export default DM_LOAI_TAI_SAN;
