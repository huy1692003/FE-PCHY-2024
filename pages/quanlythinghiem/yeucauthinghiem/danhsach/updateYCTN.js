import { Panel } from "primereact/panel";
import { memo, useEffect, useRef, useState } from "react";
import Head from "next/head";
import FieldAddYCTN from "../../../../utils/Components/ListFieldYCTN/FieldAddYCTN";
import DM_LOAI_YCTNService from "../../../../services/quanlythinghiem/DM_LOAI_YCTNService";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import FillThongTinYCTN from "../../../../utils/Components/FilterYCTN/FillThongTinYCTN";
import FieldGiaoNV from "../../../../utils/Components/ListFieldYCTN/FieldGiaoNV";
import useThongTinYCTN from "../../../../hooks/useThongTinYCTN";
import QLTN_YCTN from "../../../../models/QLTN_YCTN";
import ThongTinYCTN from "../../../../utils/Components/ListFieldYCTN/ThongTinYCTN";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { formatDate, formatPrice } from "../../../../utils/FunctionFormart";

const Update_QLTN = () => {
    const toast = useRef(null);
    const { ma_yctn, thongTinYCTN , refeshData } = useThongTinYCTN();
    const [formData, setFormData] = useState();
    const user = JSON.parse(sessionStorage.getItem("user"))?.ten_dang_nhap || "";
    const [loaiYCTN, setLoaiYCTN] = useState([]);
    const [loaiYCTN_Current, setLoaiYCTNCurrent] = useState(null)
    const [yctnLog, setYCTNLog] = useState([])





    useEffect(() => {
        let loai = loaiYCTN.find(item => item.ma_loai_yctn === thongTinYCTN.ma_loai_yctn);
        setLoaiYCTNCurrent(loai)
    }, [thongTinYCTN])
    useEffect(() => {
        getLoaiYCTN()
    }, []);



    const getLoaiYCTN = async () => {
        let res = await DM_LOAI_YCTNService.get_All_DM_LOAI_YCTN();
        console.log(res)
        setLoaiYCTN(res);
    }
    useEffect(() => {
        if (thongTinYCTN) {
            setFormData(thongTinYCTN);
        }
    }, [thongTinYCTN]);


    useEffect(() => {

        if (thongTinYCTN && thongTinYCTN.qltn_yctn_log) {
            var result = []
            let old = thongTinYCTN.qltn_yctn_log || []
            old = [...old, { ...thongTinYCTN, qltn_yctn_log: null }]


            // Tạo mảng gồm giá trị trước sửa và sau sửa
            for (let index = 0; index < old.length - 1; index++) {
                let log = {
                    truoc: old[index],
                    sau: old[index + 1]
                }
                result.push(log)
            }
            setYCTNLog(result)
        }
    }, [thongTinYCTN])


    console.log(yctnLog)
    return (
        <div className="border-round-3xl bg-white p-3">
            <Head>
                <title>Chỉnh sửa yêu cầu thí nghiệm</title>
            </Head>
            <Toast ref={toast} />

            <Toast ref={toast} />
            <Panel header={<h3 className="text-xl font-bold">Chỉnh sửa yêu cầu thí nghiệm</h3>} className="mt-3">
                <FillThongTinYCTN Element={thongTinYCTN && loaiYCTN_Current ? <FieldAddYCTN refeshData={refeshData} toast={toast} formDataInit={formData} isAdd={false} isUpdateHD={false} loai_yctn={loaiYCTN_Current} /> : <></>} />



            </Panel>

           

        </div>
    );
};

export default memo(Update_QLTN);