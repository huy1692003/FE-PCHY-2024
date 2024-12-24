import { memo, useEffect, useState } from "react";
import QLTN_CHI_TIET_THI_NGHIEM_Service from "../../../services/quanlythinghiem/QLTN_CHI_TIET_THI_NGHIEM_Service";
import { DM_LOAI_THIET_BI_Service } from "../../../services/quanlythinghiem/DM_LOAITHIETBIService";
import { DM_LOAI_BIENBAN_Service } from "../../../services/quanlythinghiem/DM_LOAI_BIENBAN_Service";
import TableThietBi from "./TableThietBi";
import { useRef } from "react";
import { Toast } from "primereact/toast";



const DanhSachThietBi = ({ thongtinYCTN, ma_yctn }) => {
    const [thietBis, setThietBis] = useState([]);
    const [loaiThietBi, setLoaiThietBi] = useState([]);
    const [loaiBienBan, setLoaiBienBan] = useState([]);
    const [thietBiBanDau, setThietBiBanDau] = useState([]);
    const [thietBiPhatSinh, setThietBiPhatSinh] = useState([]);
    const toast = useRef(null)
    useEffect(() => {
        getThietBis();
        getDM();
    }, [ma_yctn]);

    useEffect(() => {
        setThietBiBanDau(thietBis.filter(thietBi => thietBi.trang_thai === 0));
        setThietBiPhatSinh(thietBis.filter(thietBi => thietBi.trang_thai === 1));
    }, [thietBis]);

    const getDM = async () => {
        const res = await DM_LOAI_THIET_BI_Service.getAll_DM_LOAITHIETBI();
        setLoaiThietBi(res);
        const resLBB = await DM_LOAI_BIENBAN_Service.getAllDM_LOAI_BIENBAN();
        setLoaiBienBan(resLBB);
    }
    const getThietBis = async () => {
        const res = await QLTN_CHI_TIET_THI_NGHIEM_Service.getAll_TBTN_byMA_YCTN(ma_yctn);
        console.log(res);
        setThietBis(res);
    }

    
    return <>
        <Toast ref={toast} />
        <TableThietBi toast={toast} loadData={getThietBis}  thongtinYCTN={thongtinYCTN} label="Thiết bị ban đầu" data={thietBiBanDau} loaiThietBi={loaiThietBi} loaiBienBan={loaiBienBan} />
        {thietBiPhatSinh.length > 0 && <TableThietBi loadData={getThietBis}  toast={toast} thongtinYCTN={thongtinYCTN} label="Thiết bị phát sinh" data={thietBiPhatSinh} loaiThietBi={loaiThietBi} loaiBienBan={loaiBienBan} />}

    </>;
}

export default memo(DanhSachThietBi);

