import { memo, useEffect, useState } from "react";
import { FormField } from "./FieldAddYCTN";
import InputFile from "../InputFile";
import { get_All_DM_DONVI } from "../../../services/quantrihethong/DM_DONVIService";
import { MultiSelect } from "primereact/multiselect";

const FieldGiaoNV = ({ formData, setFormData }) => {
    const [donVi, setDonVi] = useState([]);
    useEffect(() => {
        getDonVi();
    }, []);
    const getDonVi = async () => {
        const res = await get_All_DM_DONVI();
        setDonVi(res);
    }

    console.log(formData);
    return (
        <div>
            <div className="flex gap-4">
                <div style={{ width: "49%" }}>
                    <label className='font-bold text-sm my-3 block' htmlFor="file_dinh_kem_giao_nv">File quyết định</label>
                    <InputFile nameField="file_dinh_kem_giao_nv" setFormData={setFormData} />
                </div>
                <div style={{ width: "49%" }}>
                    <FormField
                        label="Người giao nhiệm vụ"
                        id="nguoi_giao_nhiem_vu"
                        value={formData?.nguoi_giao_nhiem_vu || ""}
                        onChange={(id, value) => setFormData(prev => ({ ...prev, [id]: value }))}
                    />
                </div>
            </div>
            <div className="flex gap-4">
                <div style={{ width: "49%" }}>
                    <FormField
                        label="Ngày giao nhiệm vụ"
                        id="ngay_giao_nv"
                        value={formData.ngay_giao_nv}
                        onChange={(id, value) => setFormData(prev => ({ ...prev, [id]: value }))}
                        isCalendar
                    />
                </div>
                <div style={{ width: "49%" }}>
                    <label className='font-medium text-sm my-3 block'>Đơn vị thực hiện</label>
                    <MultiSelect
                        value={formData?.don_vi_thuc_hien || []}
                        onChange={(e) => setFormData(prev => ({ ...prev, don_vi_thuc_hien: e.value }))}
                        options={donVi}
                        optionLabel="ten"
                        optionValue="id"
                        placeholder="Chọn đơn vị thực hiện"
                        filter
                        className="w-full"
                    />
                </div>

            </div>

        </div>
    );
};

export default memo(FieldGiaoNV);