import { Button } from "primereact/button";
import { memo, useEffect, useState } from "react";
import CreateThiNghiemTB from "./CreateThiNghiemTB";
import { get_All_DM_DONVI } from "../../../services/quantrihethong/DM_DONVIService";
import { urlServer } from "../../../constants/api";
import { Notification } from "../../notification";
import QLTN_CHI_TIET_THI_NGHIEM_Service from "../../../services/quanlythinghiem/QLTN_CHI_TIET_THI_NGHIEM_Service";
import { ConfirmDialog } from "primereact/confirmdialog";

const TagStatus = ({ status }) => {
    const getStatusColor = () => {
        switch (status) {
            case 1:
                return "#1170E4"; // xanh dương - đang chờ ký
            case 2:
                return "#13BFA6"; // xanh lá cây nhạt - đã ký
            case -1:
                return "#E82646"; // đỏ nhạt - từ chối ký
            default:
                return "#1170E4";
        }
    }

    const getStatusText = () => {
        switch (status) {
            case 1:
                return "Thí nghiệm và Đang chờ ký";
            case 2:
                return "Đã ký số";
            case -1:
                return "Từ chối ký";
            default:
                return "Đang chờ ký";
        }
    }

    return <span className="px-5 text-sm py-2" style={{
        padding: "5px",
        display: "inline-block",
        borderRadius: "20px",
        backgroundColor: getStatusColor(),
        color: "white"
    }}>
        {getStatusText()}
    </span>
}

const TableThietBi = ({ thongtinYCTN, label, data, loaiThietBi, loaiBienBan, toast, loadData }) => {
    const [visible, setVisible] = useState(false);
    const [thietBiSelected, setThietBiSelected] = useState(null);
    const [donVi, setDonVi] = useState([])
    const [visibleConfirm, setVisibleConfirm] = useState({ state: false, id: "" });

    useEffect(() => {
        getDonVi();
    }, []);
    const showCreateThiNghiemTB = (data) => {
        setVisible(true);
        setThietBiSelected({ ...data, ten_loai_tb: loaiThietBi.find(l => l.ma_loai_tb === data.ma_loai_tb)?.ten_loai_tb });
    }
    const getDonVi = async () => {
        const res = await get_All_DM_DONVI();
        setDonVi(res);
    }

    const refeshData = () => {

        loadData()
        setVisible(false)
    }

    const openfileBienBan = (link) => {
        if (!link) {
            console.error("Đường dẫn không hợp lệ.");
            return;
        }

        // Mở tệp PDF trong tab mới
        window.open(link, "_blank");
    };

    const resetChi_Tiet_Thi_Nghiem = async (ma_chi_tiet_tn) => {
        try {
            let res = await QLTN_CHI_TIET_THI_NGHIEM_Service.delete_QLTN_CHITIET_TN_BYID(ma_chi_tiet_tn)
            Notification.success(toast, "Bạn vừa reset thí nghiệm #" + ma_chi_tiet_tn)
            loadData()
        } catch (error) {
            Notification.error(toast, "Có lỗi xảy ra hãy thử lại sau !")
        }
    }
    return <>
        <h5 className="text-lg font-bold">{label}</h5>
        <div className="max-w-screen overflow-x-scroll">

            <table className="w-full"  style={{ borderCollapse: "collapse" , minWidth: "1000px"}}>
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
                        data.map((thietBi, index) => (
                            <>
                                <tr key={index}>
                                    <td rowSpan={thietBi.listTN.length + 1} style={{ width: "15px",  }} className="text-center border-1 border-300 py-3">{index + 1}</td>
                                    <td rowSpan={thietBi.listTN.length + 1}  style={{ width: "15%",  }} className="text-center border-1 border-300 py-3">{thietBi.ten_thiet_bi}</td>
                                    <td rowSpan={thietBi.listTN.length + 1}  style={{ width: "18%",  }} className="text-center border-1 border-300 py-3">{loaiThietBi.find(l => l.ma_loai_tb === thietBi.ma_loai_tb)?.ten_loai_tb}</td>
                                    <td rowSpan={thietBi.listTN.length + 1}  style={{ width: "15%",  }} className="text-center border-1 border-300 py-3">{thietBi.ma_loai_tb}</td>
                                    <td className="text-center border-1 border-300 py-3"  style={{ width: "25%",  }}>{thietBi.so_luong}</td>
                                    <td className="text-center border-1 border-300 py-3"  style={{ width: "23%",  }}>
                                        <span className="px-5" style={{ cursor: "pointer", padding: "5px", borderRadius: "20px", backgroundColor: thietBi.trang_thai === 0 ? "#E9E9F1" : "#1170E4", color: thietBi.trang_thai === 0 ? "black" : "white" }} >
                                            {thietBi.trang_thai === 0 ? "Tạo mới" : "Phát sinh"}
                                        </span>
                                    </td>
                                    <td className="text-center border-1 border-300 py-3"  style={{ width: "30px",  }}>
                                        <Button onClick={() => showCreateThiNghiemTB(thietBi)} tooltip="Thí nghiệm" icon="fas fa-thermometer-three-quarters" className="p-button-text text-primary text-xl hover:bg-primary-600 hover:text-white" />
                                    </td>
                                </tr>
                                {thietBi.listTN.length > 0 && thietBi.listTN.map((t, index) =>
                                    <tr>
                                        <td className="text-center border-1 border-300 py-4">
                                            <span>
                                                <span className="mb-1">Đợt {(index + 1) + " : " + t.so_luong}</span><br />
                                                <span>Loại biên bản : {loaiBienBan.find(l => l.id === +t.ma_loai_bb)?.ten_loai_bb} </span>
                                            </span>
                                        </td>
                                        <td className="text-center border-1 border-300 py-4"><TagStatus  status={t.trang_thai_ky} /></td>
                                        <td className="text-center border-1 border-300 py-4">
                                            {
                                                t.trang_thai_ky <= 2 &&
                                                <span>

                                                    <Button onClick={() => openfileBienBan(urlServer + t.file_upload)} tooltip="Xem biên bản" style={{ color: "#13BFA6" }} icon={"fas fa-file-arrow-up"} className="p-button-text text-2xl hover:bg-green-600 hover:text-white" />
                                                    {t.trang_thai_ky <= 1 && <Button tooltip="Thực hiện lại" onClick={() => setVisibleConfirm({ state: true, id: t.ma_chi_tiet_tn })} style={{ color: "#13BFA6" }} icon={"fas fa-history"} className="p-button-text text-2xl hover:bg-green-600 hover:text-white" />}
                                                </span>
                                            }
                                        </td>
                                    </tr>)}
                            </>
                        ))
                    }
                </tbody>
            </table>
        </div>


        <ConfirmDialog
            visible={visibleConfirm.state}
            onHide={() => setVisibleConfirm({ state: false, id: "" })} // Đóng hộp thoại
            message="Bạn có chắc chắn muốn thực hiện lại thí nghiệm này không?"
            header="Xác nhận"
            icon="pi pi-exclamation-triangle"
            acceptClassName="p-button-danger"
            accept={() => {
                resetChi_Tiet_Thi_Nghiem(visibleConfirm.id); // Thực hiện reset nếu người dùng đồng ý
                setVisibleConfirm({ state: false, id: "" }); // Ẩn hộp thoại sau khi xác nhận
            }}
            reject={() => setVisibleConfirm({ state: false, id: "" })} // Đóng hộp thoại khi hủy
        />

        {thietBiSelected &&
            <CreateThiNghiemTB
                refeshData={refeshData}
                toastCurrent={toast}
                thongtinYCTN={thongtinYCTN}
                stateDialog={{ visible, setVisible }}
                thongtinThietBi={thietBiSelected}
                donVi={donVi} />}
    </>;
}

export default memo(TableThietBi);