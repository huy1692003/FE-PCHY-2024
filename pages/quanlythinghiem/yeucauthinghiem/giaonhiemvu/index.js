import { memo, useEffect, useState } from "react";
import { Panel } from "primereact/panel";
import Head from "next/head";
import FillThongTinYCTN from "../../../../utils/Components/FilterYCTN/FillThongTinYCTN";
import QLTN_YCTNService from "../../../../services/quanlythinghiem/QLTN_YCTNService";
import { useRouter } from "next/router";
import ThongTinYCTN from "../../../../utils/Components/ListFieldYCTN/ThongTinYCTN";
import useThongTinYCTN from "../../../../hooks/useThongTinYCTN";
const GiaoNhiemVu = () => {
    const {ma_yctn,thongTinYCTN}=useThongTinYCTN();

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
