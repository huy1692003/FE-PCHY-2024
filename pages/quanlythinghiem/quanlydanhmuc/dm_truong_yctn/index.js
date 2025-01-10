import { useEffect, useState } from "react";
import { DM_TRUONG_YCTN_Service } from "../../../../services/quanlythinghiem/DM_TRUONG_YCTN_Service";
import TableDM_TruongYCTN from "./TableDM_TRUONG_YCTN";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import DialogForm from "./DialogForm";
import { DM_TRUONG_YCTN } from "../../../../models/DM_TRUONG_YCTN";
import { useRef } from "react";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';


const TruongYCTN = () => {
  const [data, setData] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [formData, setFormData] = useState(DM_TRUONG_YCTN);
  const toast = useRef(null);
  
  // Thêm states cho confirm dialog
  const [visible, setVisible] = useState(false);//comfirm xóa đơn
  const [itemToDelete, setItemToDelete] = useState(null); //item cần xóa

  const [visibleMultiple, setVisibleMultiple] = useState(false);//comfirm xóa nhiều
  const [selected, setSelected] = useState([]); //item đã chọn

  const loadData = async () => {
    try {
      const items = await DM_TRUONG_YCTN_Service.getAll_DM_TRUONG_YCTN();
      setData(items);
      console.log(items);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  const headerList = (options) => {
    const className = `${options.className} flex flex-wrap justify-content-between align-items-center`;

    return (
      <div className={className}>
        <span className="font-bold text-xl">{getMenuCurrent()}</span>

        <div className="flex flex-wrap gap-2">
          {selected.length > 0 && (
            <Button
              label="Xóa nhiều"
              severity="danger"
              onClick={() => setVisibleMultiple(true)}
            />
          )}
          <Button
            label="Thêm mới"
            style={{ backgroundColor: "#1445a7" }}
            onClick={() => {
              setFormData(DM_TRUONG_YCTN);
              setShowDialog(true);
              setIsAdd(true);
            }}
          />
        </div>
      </div>
    );
  };

  // Thêm các hàm xử lý xóa
  const handleDelete = async () => {
    try {
      await DM_TRUONG_YCTN_Service.delete_DM_TRUONG_YCTN(itemToDelete.id);
      toast.current.show({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Xóa thành công',
        life: 3000
      });
      loadData();
      setVisible(false);
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể xóa mục này',
        life: 3000
      });
    }
  };
  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selected.map((item) => DM_TRUONG_YCTN_Service.delete_DM_TRUONG_YCTN(item.id))
      );
      toast.current.show({
        severity: 'success',
        summary: 'Thành công',
        detail: `Xóa thành công ${selected.length} mục đã chọn`,
        life: 3000
      });
      setSelected([]);
      loadData();
      setVisibleMultiple(false);
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể xóa các mục đã chọn',
        life: 3000
      });
    }
  };


  return (
    <>
      <div className="border-round-3xl bg-white p-4">
        <Panel headerTemplate={headerList}>
          <TableDM_TruongYCTN
            data={data}
            setShowDialog={setShowDialog}
            setIsAdd={setIsAdd}
            setFormData={setFormData}

            setVisible={setVisible}
            setVisibleMultiple={setVisibleMultiple}
            setItemToDelete={setItemToDelete}
            setSelected={setSelected}
            selected={selected}
          />
          <DialogForm
            show={showDialog}
            setShowDialog={setShowDialog}
            formData={formData}
            setFormData={setFormData}
            isAdd={isAdd}
            setIsAdd={setIsAdd}
            loadData={loadData}
            toast={toast}
          />
        </Panel>
      </div>
      <Toast ref={toast} />

      {/* Dialog xóa đơn */}
      <ConfirmDialog
        visible={visible}
        onHide={() => setVisible(false)}
        message="Bạn có chắc chắn muốn xóa mục này?"
        header="Xác nhận xóa"
        icon="pi pi-exclamation-triangle"
        acceptClassName="p-button-danger"
        accept={handleDelete}
        reject={() => setVisible(false)}
        acceptLabel="Có"
        rejectLabel="Không"
      />
        <ConfirmDialog
        visible={visibleMultiple}
        onHide={() => setVisibleMultiple(false)}
        message={`Bạn có chắc chắn muốn xóa ${selected.length} mục đã chọn?`}
        header="Xác nhận xóa nhiều"
        icon="pi pi-exclamation-triangle"
        acceptClassName="p-button-danger"
        accept={handleDeleteSelected}
        reject={() => setVisibleMultiple(false)}
        acceptLabel="Có"
        rejectLabel="Không"
      />

    </>
  );
};

export default TruongYCTN;
