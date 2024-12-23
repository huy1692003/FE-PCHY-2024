import { memo, useRef, useState } from "react";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import TableYCTN from "./TableYCTN";
import { useRouter } from "next/router";

const mockDataYCTN = [
    {
        id: 1,
        thongTinYCTN: 'YCTN-001/2024',
        thongTinChung: 'Thí nghiệm MBA 110kV TBA Hòa Khánh',
        donViThucHien: 'Phòng Thí nghiệm Điện',
        thongTinKhoiTao: 'Nguyễn Văn A - 01/01/2024',
        trangThai: 'Chờ phê duyệt'
    },
    {
        id: 2,
        thongTinYCTN: 'YCTN-002/2024', 
        thongTinChung: 'Thí nghiệm Máy cắt 220kV TBA Hòa Phát',
        donViThucHien: 'Phòng Thí nghiệm Cao áp',
        thongTinKhoiTao: 'Trần Văn B - 02/01/2024',
        trangThai: 'Đã phê duyệt'
    },
    {
        id: 3,
        thongTinYCTN: 'YCTN-003/2024',
        thongTinChung: 'Thí nghiệm Cáp ngầm 22kV',
        donViThucHien: 'Phòng Thí nghiệm Điện',
        thongTinKhoiTao: 'Lê Văn C - 03/01/2024', 
        trangThai: 'Đang thực hiện'
    }
];

const DanhSachYCTN = () => {
    const toast = useRef(null);
    const router = useRouter();
    const [dataYCTN, setDataYCTN] = useState(mockDataYCTN);

    const headerList = (options) => {
        const className = `${options.className} flex flex-wrap justify-content-between align-items-center`;

        return (
            <div className={className +" mt-3"}>
                <span className="font-bold text-xl">Danh sách yêu cầu thí nghiệm</span>
                <div className="flex flex-wrap gap-2">
                   
                    <Button
                        label="Thêm mới"
                        style={{ backgroundColor: "#1445a7" }}
                        onClick={() => {router.push('/quanlythinghiem/yeucauthinghiem/themmoi')}}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className='border-round-3xl bg-white p-3'>
            <Panel headerTemplate={headerList}>
                <TableYCTN dataYCTN={dataYCTN}/>
            </Panel>
            <Toast ref={toast} />
        </div>
    );
};

export default memo(DanhSachYCTN);
