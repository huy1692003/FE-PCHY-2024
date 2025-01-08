import { Panel } from "primereact/panel";
import { memo, useEffect, useRef, useState } from "react";
import Head from "next/head";
import FieldAddYCTN from "../../../../utils/Components/ListFieldYCTN/FieldAddYCTN";
import DM_LOAI_YCTNService from "../../../../services/quanlythinghiem/DM_LOAI_YCTNService";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const ThemMoiYCTN = () => {
    const [selectLoaiYCTN, setSelectLoaiYCTN] = useState(null);
    const [loaiYCTN, setLoaiYCTN] = useState([]);
    const toast = useRef(null);
    useEffect(() => {
        getLoaiYCTN()
    }, []);

    const getLoaiYCTN = async () => {
        let res = await DM_LOAI_YCTNService.get_All_DM_LOAI_YCTN();
        console.log(res)
        setLoaiYCTN(res);
    }

    const handleSelectLoaiYCTN = (e) => {

        let loai = loaiYCTN.find(item => item.id === e.value);      
        setSelectLoaiYCTN(loai);
    }

    




    return (
        <>
            <Head>
                <title>Tạo mới Yêu cầu thí nghiệm</title>
            </Head>
            <Toast ref={toast} />
            <div className='border-round-3xl bg-white p-3'>
                <Panel header={<span className="font-bold text-xl">Thêm mới Yêu cầu thí nghiệm</span>}>
                    <div className="field ">
                        <label className='font-bold text-base my-3 block' htmlFor="selectLoaiYCTN">Loại hình dịch vụ</label>
                        <Dropdown filter placeholder="--Mời chọn--" showClear id="selectLoaiYCTN" name="selectLoaiYCTN" value={selectLoaiYCTN?.id} optionValue="id" optionLabel="ten_loai_yc" options={loaiYCTN} onChange={handleSelectLoaiYCTN} className="w-full text-base" />
                    </div>
                    {selectLoaiYCTN && <FieldAddYCTN isAdd={true} toast={toast} loai_yctn={selectLoaiYCTN}  />}


                    
                </Panel>
            </div>
        </>
    );
};

export default memo(ThemMoiYCTN);