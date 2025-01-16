import { memo, useEffect, useRef, useState } from "react";
import { Panel } from "primereact/panel";
import Head from "next/head";
import FillThongTinYCTN from "../../../../../utils/Components/FilterYCTN/FillThongTinYCTN";
import QLTN_YCTNService from "../../../../../services/quanlythinghiem/QLTN_YCTNService";
import ThongTinYCTN from "../../../../../utils/Components/ListFieldYCTN/ThongTinYCTN";
import useThongTinYCTN from "../../../../../hooks/useThongTinYCTN";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Notification } from "../../../../../utils/notification";
import DanhSachThietBi from "../../../../../utils/Components/ThiNghiem/DanhSachThietBi";
import { useRouter } from "next/router";
import { getMenuCurrent } from "../../../../../utils/Function";

const ThiNghiem = () => {
    const { ma_yctn, thongTinYCTN } = useThongTinYCTN();
    const [formData, setFormData] = useState({});
    const toast = useRef(null);
    const router=useRouter()

    useEffect(() => {
        if (thongTinYCTN) {
            setFormData(thongTinYCTN);
        }
    }, [thongTinYCTN]);

    const onSubmit = async () => {
        try {
            // TODO: Implement submit logic for thi nghiem
            Notification.success(toast, "Thực hiện thí nghiệm thành công");
        } catch (err) {
            console.log(err);
            Notification.error(toast, "Thực hiện thí nghiệm thất bại");
        }
    }

    return (
        <div className="border-round-3xl bg-white p-3">
            <Head>
                <title>{getMenuCurrent()}</title>
            </Head>
            <Toast ref={toast} />
            <Panel header={<h3 className="text-xl font-bold">{getMenuCurrent()}</h3>} className="mt-3">
                <FillThongTinYCTN Element={thongTinYCTN ? <ThongTinYCTN loai_yctn={thongTinYCTN.loai_yctn_model} formData={thongTinYCTN} /> : <></>} />

                {thongTinYCTN && <><Panel header="Khối lượng thiết bị thí nghiệm" className="mt-3">
                    <DanhSachThietBi thongtinYCTN={thongTinYCTN} ma_yctn={ma_yctn} />
                        </Panel>

                    <div className="flex justify-content-end mt-6">
                        {
                            thongTinYCTN &&
                            <Button label="Bước tiếp theo : Bàn giao kết quả" icon="pi pi-save" onClick={()=>router.push("/quanlythinghiem/thuchienthinghiem/bangiaoketqua")} />
                        }
                    </div>
                </>}
            </Panel>
        </div>
    );
};

export default memo(ThiNghiem);
