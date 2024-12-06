import { memo, useEffect, useState } from "react";
import QLTN_CHI_TIET_THI_NGHIEM_Service from "../../../services/quanlythinghiem/QLTN_CHI_TIET_THI_NGHIEM_Service";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { DM_LOAI_THIET_BI_Service } from "../../../services/quanlythinghiem/DM_LOAITHIETBIService";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { IconUtils } from "primereact/utils";

const DanhSachThietBi = ({ ma_yctn }) => {
    const [thietBis, setThietBis] = useState([]);
    const [loaiThietBi, setLoaiThietBi] = useState([]);
    const [thietBiBanDau, setThietBiBanDau] = useState([]);
    const [thietBiPhatSinh, setThietBiPhatSinh] = useState([]);

    useEffect(() => {
        getThietBis();
        loadLoaiThietBi();
    }, [ma_yctn]);
    
    useEffect(() => {
        // setThietBiBanDau(thietBis.filter(thietBi => thietBi.loai_thiet_bi === "BAN_DAU"));
        // setThietBiPhatSinh(thietBis.filter(thietBi => thietBi.loai_thiet_bi === "PHAT_SINH"));
    }, [thietBis]);
    
    const loadLoaiThietBi = async () => {
        const res = await DM_LOAI_THIET_BI_Service.getAll_DM_LOAITHIETBI();
        setLoaiThietBi(res);
    }
    const getThietBis = async () => {
        const res = await QLTN_CHI_TIET_THI_NGHIEM_Service.getAll_TBTN_byMA_YCTN(ma_yctn);
        console.log(res);
        setThietBis(res);
    }
    return <>
        <h5 className="text-lg font-bold">Thiết bị ban đầu</h5>
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
                <tr>
                    <th className="border-1 border-300 p-3">STT</th>
                    <th className="border-1 border-300 p-3">Tên thiết bị</th>
                    <th className="border-1 border-300 p-3">Loại thiết bị</th>
                    <th className="border-1 border-300 p-3">Mã loại thiết bị</th>
                    <th className="border-1 border-300 p-3">Số lượng</th>
                    <th className="border-1 border-300 p-3">Trạng thái</th>
                    <th className="border-1 border-300 p-3">Thao tác</th>
                </tr>
            </thead>
            <tbody>
                {
                    thietBis.map((thietBi, index) => (
                        <>
                            <tr key={index}>
                                <td rowSpan={thietBi.listTN.length+1} style={{width: "20px", verticalAlign: "top"}} className="text-center border-1 border-300 py-5">{index + 1}</td>
                                <td rowSpan={thietBi.listTN.length+1} style={{verticalAlign: "top"}} className="text-center border-1 border-300 py-5">{thietBi.ma_tbtn}</td>
                                <td rowSpan={thietBi.listTN.length+1} style={{verticalAlign: "top"}} className="text-center border-1 border-300 py-5">{loaiThietBi.find(l=> l.ma_loai_tb === thietBi.ma_loai_tb)?.ten_loai_tb}</td>
                                <td rowSpan={thietBi.listTN.length+1} style={{verticalAlign: "top"}} className="text-center border-1 border-300 py-5">{thietBi.ma_loai_tb}</td>
                                <td  className="text-center border-1 border-300 py-5">{thietBi.so_luong}</td>
                                <td className="text-center border-1 border-300 py-5">
                                    <Tag className="px-5" severity={thietBi.trang_thai === 0 ? "info" : "warning"} 
                                         value={thietBi.trang_thai === 0 ? "Tạo mới" : "Phát sinh"} />
                                </td>
                                <td  className="text-center border-1 border-300 py-5">
                                </td>
                            </tr>
                            {thietBi.listTN.length > 0 && thietBi.listTN.map(t=> 
                            <tr>                               
                                <td className="text-center border-1 border-300 py-5">{t.ma_chi_tiet_tn}</td>
                                <td className="text-center border-1 border-300 py-5">{thietBi.so_luong}</td>
                                <td className="text-center border-1 border-300 py-5">{thietBi.so_luong}</td>
                            </tr>)}
                        </>
                    ))
                }
            </tbody>
        </table>


    </>;
}

export default memo(DanhSachThietBi);

