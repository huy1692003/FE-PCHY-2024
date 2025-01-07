import { memo, useState, useEffect, useRef } from "react";
import { Panel } from "primereact/panel";
import { AutoComplete } from "primereact/autocomplete";
import QLTN_YCTNService from "../../../services/quanlythinghiem/QLTN_YCTNService";
import DM_LOAI_YCTNService from "../../../services/quanlythinghiem/DM_LOAI_YCTNService";
import { useRouter } from "next/router";

const FillThongTinYCTN = ({ Element }) => {
    const router = useRouter();
    const [ma_yctn_Current, setMaYCTNCurrent] = useState("");
    const [listMa_YCTN, setListMa_YCTN] = useState([]);

    const toast = useRef(null);

    useEffect(() => {
        const searchYCTN = async () => {
            let res = await QLTN_YCTNService.search_Ma_YCTN();
            console.log(res);
            const suggestions = res.map(code => ({
                ma_yctn: code
            }));
            setListMa_YCTN(suggestions);
        };
        searchYCTN();
    }, []);


    useEffect(() => {
        if (router.query.code && router.query.code !== "" && listMa_YCTN.length > 0) {
            let res = listMa_YCTN.find(item => item.ma_yctn === router.query.code);
            setMaYCTNCurrent(res);

        }
    }, [router.query.code, listMa_YCTN]);


    useEffect(() => {
        if (ma_yctn_Current) {
            router.push({
                query: { ...router.query, code: ma_yctn_Current.ma_yctn }
            });
        }
    }, [ma_yctn_Current]);


    const searchYCTN = async (event) => {
        let res = await QLTN_YCTNService.search_Ma_YCTN(event.query);
        const suggestions = res?.map(code => ({
            ma_yctn: code
        }));
        setListMa_YCTN(suggestions);
    }

    return (
        <Panel header="Thông tin của yêu cầu thí nghiệm" className="mt-3 mb-3">
            <div className="mt-3">
                <label className='font-medium text-sm my-3 block' htmlFor="ma_yctn">Mã yêu cầu thí nghiệm <span>(STT được hệ thống quy định)</span> <span className="text-lg text-red-500">*</span></label>

                <AutoComplete
                    maxLength={20}
                    id="ma_yctn"
                    value={ma_yctn_Current}
                    suggestions={listMa_YCTN}
                    completeMethod={searchYCTN}
                    onChange={(e) => {
                        {
                            console.log(e.value);
                            setMaYCTNCurrent(e.value)
                        }
                    }}
                    field="ma_yctn"
                    className="w-full"
                    inputClassName="w-full"
                    filter
                />
            </div>
            {Element}
        </Panel>
    );
};

export default memo(FillThongTinYCTN);
