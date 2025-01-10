import { useEffect, useState } from "react";
import { QLTN_BUOC_YCTN_Service } from "../../../../services/quanlythinghiem/QLTN_BUOC_YCTN_Service";
import { Panel } from "primereact/panel";
import TableBUOC_YCTN from "./TableBUOC_YCTN";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { QLTN_BUOC_YCTN } from "../../../../models/QLTN_BUOC_YCTN";
import { useRef } from "react";
import DialogForm from "./DialogForm";
import { ConfirmDialog } from "primereact/confirmdialog";
import { getMenuCurrent } from "../../../../utils/Function";
const BuocYCTN = () => {
  const [data, setData] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [formData, setFormData] = useState(QLTN_BUOC_YCTN);
  const toast = useRef(null);

  const user = JSON.parse(sessionStorage.getItem("user"))?.ten_dang_nhap || "";//ten dang nhap

  const [visible, setVisible] = useState(false); //comfirm xóa đơn
  const [itemToDelete, setItemToDelete] = useState(null); //item cần xóa

  const [visibleMultiple, setVisibleMultiple] = useState(false); //comfirm xóa nhiều
  const [selected, setSelected] = useState([]); //item đã chọn

  const loadData = async () => {
    try {
      const items = await QLTN_BUOC_YCTN_Service.getAll_QLTN_BUOC_YCTN();
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
              setFormData(QLTN_BUOC_YCTN);
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
      await QLTN_BUOC_YCTN_Service.delete_QLTN_BUOC_YCTN(itemToDelete.id);
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Xóa thành công",
        life: 3000,
      });
      loadData();
      setVisible(false);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không thể xóa mục này",
        life: 3000,
      });
    }
  };
  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selected.map((item) => QLTN_BUOC_YCTN_Service.delete_QLTN_BUOC_YCTN(item.id))
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
      <Toast ref={toast} />
      <div className="border-round-3xl bg-white p-4">
        <Panel headerTemplate={headerList}>
          <TableBUOC_YCTN
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
        </Panel>
        <DialogForm
          show={showDialog}
          setShowDialog={setShowDialog}
          formData={formData}
          setFormData={setFormData}
          isAdd={isAdd}
          loadData={loadData}
          toast={toast}
          user={user}
        />
      </div>

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

export default BuocYCTN;
