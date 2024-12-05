import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { QLTN_BUOC_YCTN_Service } from "../../../../services/quanlythinghiem/QLTN_BUOC_YCTN_Service";
import { Notification } from "../../../../utils/notification";
import { QLTN_BUOC_YCTN } from "../../../../models/QLTN_BUOC_YCTN";
import { InputNumber } from "primereact/inputnumber";

const DialogForm = ({show, setShowDialog, formData, setFormData, isAdd, loadData,toast,user}) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (isAdd) {
            formData.nguoi_tao = user;
            // console.log(formData);
            try {
                await QLTN_BUOC_YCTN_Service.create_QLTN_BUOC_YCTN(formData);
                Notification.success(toast, "Thêm mới thành công");
                loadData();
                setShowDialog(false);
            } catch (error) {
                Notification.error(toast, "Thêm mới thất bại");
            }
        } else {
            try {
                formData.nguoi_sua = user;

                // console.log(formData);
                await QLTN_BUOC_YCTN_Service.update_QLTN_BUOC_YCTN(formData);
                Notification.success(toast, "Cập nhật thành công");
                loadData();
                setShowDialog(false);
            } catch (error) {
                Notification.error(toast, "Cập nhật thất bại");
            }
        }
        setFormData(QLTN_BUOC_YCTN)
    }
    const renderHeader = () => {
        return (
            <div className="flex align-items-center justify-content-between">
                <span>{isAdd ? "Thêm mới bước yêu cầu thí nghiệm" : "Cập nhật bước yêu cầu thí nghiệm"}</span>
                <div className="flex gap-2">
                    <Button
                        label="Lưu"
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
            style={{ width: '50vw', height: 'auto', overflowY: "visible" }}
            contentStyle={{ paddingTop: "10px" }}
        >
            <div className="grid p-fluid">
                <div className="flex flex-column gap-2 w-full">
                    <div>
                        <label htmlFor="" className="block mb-2">Tên<span className="text-red-500">*</span></label>
                        <InputText
                            id="ten_buoc_yctn"
                            name="ten_buoc_yctn"
                            value={formData.ten_buoc_yctn}
                            className="w-full"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="" className="block mb-2">Bước<span className="text-red-500">*</span></label>
                        <InputNumber
                            id="buoc" 
                            name="buoc"
                            value={formData.buoc}
                            className="w-full"
                            onChange={(e) => handleChange({
                                target: {
                                    name: 'buoc',
                                    value: e.value
                                }
                            })}
                            placeholder="Nhập số"
                            useGrouping={false}
                        />
                    </div>

                   
                </div>
            </div>
        </Dialog>
    )
}

export default DialogForm;