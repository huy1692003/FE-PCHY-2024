// ContextProvider.js
import React, { createContext, useEffect, useState } from "react";
import { QLTN_BUOC_YCTN_Service } from "../services/quanlythinghiem/QLTN_BUOC_YCTN_Service";

export const MyContext = createContext();


export const MyProvider = ({ children }) => {
    const [data, setData] = useState({ listBuocYCTN: [] });


    useEffect(() => {
        const getBuocYCTN = async () => {
            let res = await QLTN_BUOC_YCTN_Service.getAll_QLTN_BUOC_YCTN();
            setData({ ...data, listBuocYCTN: res });
        }
        getBuocYCTN();
    }, []);
    return (
        <MyContext.Provider value={{ data }}>
            {children}
        </MyContext.Provider>
    );
};
