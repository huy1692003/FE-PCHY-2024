import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { QLTN_THIET_BI_YCTN_Service } from "../../../../services/quanlythinghiem/QLTN_THIET_BI_YCTN_Service";
import { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import { DM_LOAI_THIET_BI_Service } from "../../../../services/quanlythinghiem/DM_LOAITHIETBIService";

const DialogForm_ImportFIle = ({ show, setShowDialogImportFile ,setArrThietbi,arrThietbi}) => {
  const toast = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [arrLoaiThietBi, setArrLoaiThietBi] = useState([]);

  const loadLoaiThietBi = async () => {
    try {
      const items = await DM_LOAI_THIET_BI_Service.getAll_DM_LOAITHIETBI();
      setArrLoaiThietBi(items);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    loadLoaiThietBi();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.current.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng chọn file trước khi import',
        life: 3000
      });
      return;
    }
    try {
      const response = await QLTN_THIET_BI_YCTN_Service.importExcel_QLTN_THIET_BI_YCTN(selectedFile);
      
      if (!Array.isArray(response)) {
        throw new Error('Dữ liệu không hợp lệ');
      }

      // Kiểm tra mã loại thiết bị hợp lệ
      const hasInvalidMaLoaiTB = response.some(item => 
        !arrLoaiThietBi.find(loai => loai.ma_loai_tb === item.ma_loai_tb)
      );

      if (hasInvalidMaLoaiTB) {
        throw new Error('File chứa mã loại thiết bị không hợp lệ. Vui lòng kiểm tra và import lại.');
      }

      // Map dữ liệu và cập nhật state
      const newArrThietbi = response.map((item, index) => {
        const loaiThietBi = arrLoaiThietBi.find(loai => loai.ma_loai_tb === item.ma_loai_tb);
        return {
          ...item,
          id: (arrThietbi.length || 0) + index + 1,
          ten_loai_thiet_bi: loaiThietBi?.ten_loai_tb || "Không xác định"
        };
      });
      setArrThietbi(prevArr => [...prevArr, ...newArrThietbi]);
      
      toast.current.show({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Import file thành công',
        life: 2000
      });
      
      setShowDialogImportFile(false);

    } catch (error) {
      console.error("Import error:", error);
      toast.current.show({
        severity: 'error',
        summary: 'Lỗi', 
        detail: `Import file thất bại: ${error.message}`,
        life: 3000
      });
    }
  };

  const handleDownloadTemplate = async (e) => {
    e.preventDefault();
    try {
      await QLTN_THIET_BI_YCTN_Service.downloadExcelTemplate_Thiet_Bi_YCTN();
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể tải file mẫu',
        life: 3000
      });
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex align-items-center justify-content-between">
        <span>Import file excel</span>
        <div className="flex gap-2">
          <Button
            label="Import"
            onClick={handleImport}
            style={{ backgroundColor: "#1445a7" }}
          />
          <Button
            label="Đóng"
            outlined
            severity="secondary"
            onClick={() => setShowDialogImportFile(false)}
          />
        </div>
      </div>
    );
  };

  return (
     <div>
      <Toast ref={toast} />
      <Dialog
        header={renderHeader()}
        visible={show}
        onHide={() => setShowDialogImportFile(false)}
        closable={false}
        style={{ width: "30vw" }}
      >
        <div className="flex flex-column gap-3">
          <div className="flex align-items-center gap-2" onClick={() => document.getElementById('file').click()} >
            <Button 
              label="Choose File" 
              
              className="bg-gray-100 text-gray-700"
              
            />
            <span className="text-gray-600">
              {selectedFile ? selectedFile.name : "No file chosen"}
            </span>
          </div>
          
          <input
            type="file"
            id="file"
            hidden
            accept=".xlsx,.xls"
            onChange={handleFileChange}
          />

          <div className="text-center text-gray-600 italic">
            Có thể tải file mẫu <a href="#" className="text-purple-500" onClick={handleDownloadTemplate}>tại đây</a>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DialogForm_ImportFIle;
