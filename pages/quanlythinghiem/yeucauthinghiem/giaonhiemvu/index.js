import { memo, useEffect, useState } from "react";
import { Panel } from "primereact/panel";
import Head from "next/head";
import FillThongTinYCTN from "../../../../utils/Components/FilterYCTN/FillThongTinYCTN";
import QLTN_YCTNService from "../../../../services/quanlythinghiem/QLTN_YCTNService";
import { useRouter } from "next/router";
import ThongTinYCTN from "../../../../utils/Components/ListFieldYCTN/ThongTinYCTN";
const GiaoNhiemVu = () => {
    const [ma_yctn, setMaYCTN] = useState(null);
    const [thongTinYCTN, setThongTinYCTN] = useState(null);
    const router = useRouter();
   

    useEffect(() => {
        if (router.query.code) {
            setMaYCTN(router.query.code);
        }
    }, [router.query.code]);

    useEffect(() => {
        if (ma_yctn) {
            getThongTinYCTN_byMaYCTN();
        }
    }, [ma_yctn]);

    const getThongTinYCTN_byMaYCTN = async () => {
        let res = await QLTN_YCTNService.get_QLTN_YCTN_ByMAYCTN(ma_yctn);
        setThongTinYCTN(res);
    }
    

    return (
        <>
            <Head>
                <title>Giao nhiệm vụ thí nghiệm</title>
            </Head>
            <Panel header={<h3 className="text-xl font-bold">Giao nhiệm vụ thí nghiệm</h3>} className="mt-3">
                <FillThongTinYCTN Element= {thongTinYCTN ? <ThongTinYCTN loai_yctn={thongTinYCTN.loai_yctn_model} formData={thongTinYCTN}/> : <></>}/>
               

            </Panel>
        </>
    );
};

export default memo(GiaoNhiemVu);
