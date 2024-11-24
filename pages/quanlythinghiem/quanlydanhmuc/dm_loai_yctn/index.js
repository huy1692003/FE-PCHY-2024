import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";
import { useEffect, useRef, useState } from "react";
import TableDM_LOAI_YCTN from "./TableDM_LOAI_YCTN";
import { Toast } from "primereact/toast";
import DialogForm from "./DialogForm";
import { DM_LOAI_YCTN } from "../../../../models/DM_LOAI_YCTN";
import DM_LOAI_YCTNService from "../../../../services/quanlythinghiem/DM_LOAI_YCTNService";

const DM_LOAIYCTN = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [formData, setFormData] = useState(DM_LOAI_YCTN);
    const [selectedItems, setSelectedItems] = useState([]);
    const [data, setData] = useState([]);
    const toast = useRef(null);



    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const response = await DM_LOAI_YCTNService.get_All_DM_LOAI_YCTN();
            setData(response);
        } catch (error) {
            console.error("Error loading data:", error);
        }
    };
  console.log(data)




    const headerList = (options) => {
        const className = `${options.className} flex flex-wrap justify-content-between align-items-center`;

        return (
            <div className={className}>
                <span className="font-bold text-xl">Danh sách</span>
                <div className="flex flex-wrap gap-2">
                    {selectedItems.length > 0 && (
                        <Button
                            label="Xóa nhiều"
                            severity="danger"
                            onClick={() => { }}
                        />
                    )}
                    <Button
                        label="Thêm mới"
                        style={{ backgroundColor: "#1445a7" }}
                        onClick={() => {
                            setFormData(DM_LOAI_YCTN);
                            setShowDialog(true);
                            setIsAdd(true);
                        }}
                    />
                </div>
            </div>
        );
    };

    console.log(formData)
    return (
        <div className='border-round-3xl bg-white p-4'>
            <Panel headerTemplate={headerList}>
                <TableDM_LOAI_YCTN
                    ListYCTN={data}
                    setFormData={setFormData}
                    loadData={loadData}
                    setShowDialog={setShowDialog}
                    setIsAdd={setIsAdd}
                    toast={toast} />
            </Panel>
            <Toast ref={toast} />
            <DialogForm
                ListYCTN={data}
                setListYCTN={setData}
                loadData={loadData}
                toast={toast}
                show={showDialog}
                setShow={setShowDialog}
                isAdd={isAdd}
                formData={formData}

            />
        </div>
    )
}
export default DM_LOAIYCTN;
