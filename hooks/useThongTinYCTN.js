import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import QLTN_YCTNService from "../services/quanlythinghiem/QLTN_YCTNService";

/**
 * Hook để lấy thông tin yêu cầu thí nghiệm
 * @returns {Object} Trả về object chứa:
 * - ma_yctn: Mã yêu cầu thí nghiệm từ query parameter 'code'
 * - thongTinYCTN: Thông tin chi tiết của yêu cầu thí nghiệm, bao gồm:
 *   + id: ID của yêu cầu
 *   + ma_yctn: Mã yêu cầu thí nghiệm
 *   + loai_yctn_model: Model loại yêu cầu thí nghiệm
 *   + ngay_tao: Ngày tạo yêu cầu
 *   + trang_thai: Trạng thái yêu cầu
 *   + ... các thông tin khác của yêu cầu thí nghiệm
 */
const useThongTinYCTN = () => {
    // State lưu mã yêu cầu thí nghiệm
    const router = useRouter();
    const [ma_yctn, setMaYCTN] = useState(null);
    // State lưu thông tin chi tiết yêu cầu thí nghiệm
    const [thongTinYCTN, setThongTinYCTN] = useState(null);

    // Effect lấy mã YCTN từ query parameter
    useEffect(() => {
        if (router.query.code) {
            setMaYCTN(router.query.code);
        }
        else{
            setMaYCTN(null);
        }
    }, [router.query.code]);

    // Effect gọi API lấy thông tin YCTN khi có mã
    useEffect(() => {
        if (ma_yctn) {
            getThongTinYCTN_byMaYCTN();
        }
    }, [ma_yctn]);

    /**
     * Hàm gọi API lấy thông tin chi tiết yêu cầu thí nghiệm
     * @async
     * @private
     */
    const getThongTinYCTN_byMaYCTN = async () => {
        try {
            const res = await QLTN_YCTNService.get_QLTN_YCTN_ByMAYCTN(ma_yctn);
            setThongTinYCTN(res);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    return { ma_yctn, thongTinYCTN };
};

export default useThongTinYCTN;
