import React, { useCallback, useEffect, useRef, useState } from "react";
import { DM_KHACHHANG_Service } from "../../../../services/quanlythinghiem/DM_KHACHHANG_Service";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import TableDM_KHACHHANG from "./TableDM_KHACHHANG";
import DialogForm from "./DialogForm";
import { DM_KHACH_HANG } from "../../../../models/DM_KHACHHANG";

const DM_KHACHHANG = () => {
  const toast = useRef(null);
  const [formData, setFormData] = useState(DM_KHACH_HANG);
  const [showDialog, setShowDialog] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isAdd, setIsAdd] = useState(false);
  const [data, setData] = useState([]);

  const loadData = useCallback(async (searchData = '', pageIndex = 1, pageSize = 5) => {
    try {
      const response = await DM_KHACHHANG_Service.get_DM_KHACHHANG({
        searchData,  
        pageIndex,   
        pageSize,    
      });
  
      console.log(response);
      
      setData(response?.data || []);        
      setTotalRecords(response?.totalRecords || 0); 
  
    } catch (err) {
      console.error("Error loading data:", err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);   


  const headerList = (options) => {
    const className = `${options.className} flex flex-wrap justify-content-between align-items-center`;

    return (
      <div className={className}>
        <span className="font-bold text-xl">Danh sách Khách Hàng</span>
        <div className="flex flex-wrap gap-2">
          <Button
            label="Thêm mới"
            style={{ backgroundColor: "#1445a7" }}
            onClick={() => {
              setFormData(DM_KHACH_HANG);
              setShowDialog(true);
              setIsAdd(true);
            }}
          />
        </div>
      </div>
    );
  };


  console.log(formData);

  return (
    <div className="border-round-3xl bg-white p-4">
      <Toast ref={toast} />

      <Panel headerTemplate={headerList}>
        <TableDM_KHACHHANG
          data={data}
          setFormData={setFormData}
          setShowDialog={setShowDialog}
          setIsAdd={setIsAdd}
          toast={toast}
          loadData={loadData}
          totalRecords={totalRecords}
        />

        <DialogForm
          loadData={loadData}
          ListYCTN={data}
          setListYCTN={setData}
          toast={toast}
          show={showDialog}
          setShowDialog={setShowDialog}
          isAdd={isAdd}
          formData={formData}
        />
      </Panel>
    </div>
  );
};

export default DM_KHACHHANG;
