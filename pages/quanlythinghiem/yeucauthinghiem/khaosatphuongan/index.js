import React, { useState, useEffect, useCallback, useRef } from "react";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import Head from "next/head";
import FillThongTinYCTN from "../../../../utils/Components/FilterYCTN/FillThongTinYCTN";
import useThongTinYCTN from "../../../../hooks/useThongTinYCTN";
import UploadFileService from "../../../../services/UploadFileService"; // Import API upload
import QLTN_YCTNService from "../../../../services/quanlythinghiem/QLTN_YCTNService";
import FieldKhaoSatPA from "../../../../utils/Components/ListFieldYCTN/FieldKhaoSatPA";
import ThongTinYCTN from "../../../../utils/Components/ListFieldYCTN/ThongTinYCTN";

const KhaoSatPhuongAn = () => {
  const { ma_yctn, thongTinYCTN } = useThongTinYCTN();
  //console.log(thongTinYCTN);

  const [formData, setFormData] = useState({
    file_pa_thi_cong: null,
    nguoi_th_ks_lap_pa_thi_cong: null,
    ngay_ks_lap_pa_thi_cong: null,
  });
  const toast = useRef(null);


  //console.log("before formData", formData);


  useEffect(() => {
    thongTinYCTN &&
      setFormData({
        ...thongTinYCTN,
        file_pa_thi_cong: thongTinYCTN?.file_pa_thi_cong || null,
        nguoi_th_ks_lap_pa_thi_cong:
          thongTinYCTN?.nguoi_th_ks_lap_pa_thi_cong || null,
        ngay_ks_lap_pa_thi_cong: thongTinYCTN?.ngay_ks_lap_pa_thi_cong || null,
      });
  }, [thongTinYCTN]);

  const handleSave = async () => {
    try {
      let filePath = formData.file_pa_thi_cong;
      if (filePath && filePath instanceof File) {
        const fileData = new FormData();
        fileData.append("file", filePath);
        const response = await UploadFileService.file(fileData);
        filePath = response.filePath;

        setFormData((prevState) => ({
          ...prevState,
          file_pa_thi_cong: filePath,
        }));
  }

      await QLTN_YCTNService.khao_sat_phuong_an_YCTN({
        ma_yctn,
        file_pa_thi_cong: filePath, 
        nguoi_th_ks_lap_pa_thi_cong: formData.nguoi_th_ks_lap_pa_thi_cong,
        ngay_ks_lap_pa_thi_cong: formData.ngay_ks_lap_pa_thi_cong,
      });

      toast.current.show({ severity: "success", summary: "Lưu thành công" });
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
    }
  };

  const handleChange = useCallback((field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  }, []);

  //console.log(">>>> FILE PATH:", formData.file_pa_thi_cong);

  return (
    <div className="border-round-3xl bg-white p-3">
      <Toast ref={toast} />
      <Head>
        <title>Khảo sát lập phương án thi công</title>
      </Head>
      <Panel
        header={
          <h3 className="text-xl font-bold">Khảo sát lập phương án thi công</h3>
        }
        className="mt-3"
      >
        <FillThongTinYCTN
          Element={
            thongTinYCTN ? (
              <ThongTinYCTN
                loai_yctn={thongTinYCTN.loai_yctn_model}
                formData={thongTinYCTN}
              >
                <br className="mt-2"></br>
               <Panel header={<p  className="text-base font-bold">Lập phương án thi công</p>}>
               <FieldKhaoSatPA
                  formData={formData}
                  setFormData={setFormData}
                  handleChange={handleChange}
                />
               </Panel>
                <div className="flex justify-content-end mt-6">
                  {thongTinYCTN && (
                    <div>
                      {thongTinYCTN?.crr_step === 4 ? (
                        <Button
                          label="Bước tiếp theo : Thuc hien thi nghiem"
                          icon="pi pi-arrow-right"
                        />
                      ) : (
                        <Button
                          label="Lưu"
                          icon="pi pi-save"
                          onClick={handleSave}
                        />
                      )}
                    </div>
                  )}
                </div>
              </ThongTinYCTN>
            ) : (
              <></>
            )
          }
        />
      </Panel>
    </div>
  );
};

export default KhaoSatPhuongAn;




// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { Toast } from "primereact/toast";
// import { Panel } from "primereact/panel";
// import { Button } from "primereact/button";
// import { useRouter } from "next/router";
// import Head from "next/head";
// import FillThongTinYCTN from "../../../../utils/Components/FilterYCTN/FillThongTinYCTN";
// import ThongTinYCTN, {
//   FormField,
// } from "../../../../utils/Components/ListFieldYCTN/ThongTinYCTN";
// import useThongTinYCTN from "../../../../hooks/useThongTinYCTN";
// import InputFile from "../../../../utils/Components/InputFile";
// import UploadFileService from "../../../../services/UploadFileService"; // Import API upload
// import { HT_NGUOIDUNG_Service } from "../../../../services/quantrihethong/HT_NGUOIDUNGService";
// import QLTN_YCTNService from "../../../../services/quanlythinghiem/QLTN_YCTNService";

// const KhaoSatPhuongAn = () => {
//   const { ma_yctn, thongTinYCTN } = useThongTinYCTN();
//   const [dm_KH, setDM_KH] = useState([]);
//   //console.log(thongTinYCTN);

//   const [formData, setFormData] = useState({
//     file_pa_thi_cong: null,
//     nguoi_th_ks_lap_pa_thi_cong: null,
//     ngay_ks_lap_pa_thi_cong: null,
//   });
//   const toast = useRef(null);
//   const isFormDisabled =
//     formData.file_pa_thi_cong &&
//     formData.nguoi_th_ks_lap_pa_thi_cong &&
//     formData.ngay_ks_lap_pa_thi_cong;

//   console.log("before formData", formData);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await HT_NGUOIDUNG_Service.getAll();
//         console.log(res.data);
//         setDM_KH(res.data || []);
//       } catch (err) {
//         console.error("------Lỗi ----:", err);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     thongTinYCTN &&
//       setFormData({
//         ...thongTinYCTN,
//         file_pa_thi_cong: thongTinYCTN?.file_pa_thi_cong || null,
//         nguoi_th_ks_lap_pa_thi_cong:
//           thongTinYCTN?.nguoi_th_ks_lap_pa_thi_cong || null,
//         ngay_ks_lap_pa_thi_cong: thongTinYCTN?.ngay_ks_lap_pa_thi_cong || null,
//       });
//   }, [thongTinYCTN]);

//   //console.log(dm_KH);
//   // const handleSave = async () => {
//   //   try {
//   //     if (formData.file_pa_thi_cong) {
//   //       const fileData = new FormData();
//   //       fileData.append("file", formData.file_pa_thi_cong);
//   //       const response = await UploadFileService.file(fileData);
//   //       console.log('calling --------', response.filePath);
//   //       setFormData((prevState) => ({
//   //         ...prevState,
//   //         file_pa_thi_cong: response.filePath,
//   //       }));
//   //     }

//   //     await QLTN_YCTNService.khao_sat_phuong_an_YCTN({
//   //       ma_yctn,
//   //       file_pa_thi_cong: formData.file_pa_thi_cong,
//   //       nguoi_th_ks_lap_pa_thi_cong: formData.nguoi_th_ks_lap_pa_thi_cong,
//   //       ngay_ks_lap_pa_thi_cong: formData.ngay_ks_lap_pa_thi_cong,
//   //     });
//   //       toast.current.show({ severity: "success", summary: "Lưu thành công" });
//   //   } catch (error) {
//   //       console.error("Lỗi khi lưu dữ liệu:", error);
//   //   }
//   // };

//   const handleSave = async () => {
//     try {
//       let filePath = formData.file_pa_thi_cong;
//       if (filePath && filePath instanceof File) {
//         const fileData = new FormData();
//         fileData.append("file", filePath);
//         const response = await UploadFileService.file(fileData);
//         filePath = response.filePath;




//         setFormData((prevState) => ({
//           ...prevState,
//           file_pa_thi_cong: filePath,
//         }));
//   }

//       await QLTN_YCTNService.khao_sat_phuong_an_YCTN({
//         ma_yctn,
//         file_pa_thi_cong: filePath, 
//         nguoi_th_ks_lap_pa_thi_cong: formData.nguoi_th_ks_lap_pa_thi_cong,
//         ngay_ks_lap_pa_thi_cong: formData.ngay_ks_lap_pa_thi_cong,
//       });

//       toast.current.show({ severity: "success", summary: "Lưu thành công" });
//     } catch (error) {
//       console.error("Lỗi khi lưu dữ liệu:", error);
//     }
//   };

//   const handleChange = useCallback((field, value) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [field]: value,
//     }));
//   }, []);

//   console.log(">>>> FILE PATH:", formData.file_pa_thi_cong);

//   return (
//     <>
//       <Toast ref={toast} />
//       <Head>
//         <title>Khảo sát lập phương án thi công</title>
//       </Head>
//       <Panel
//         header={
//           <h3 className="text-xl font-bold">Khảo sát lập phương án thi công</h3>
//         }
//         className="mt-3"
//       >
//         <FillThongTinYCTN
//           Element={
//             thongTinYCTN ? (
//               <ThongTinYCTN
//                 loai_yctn={thongTinYCTN.loai_yctn_model}
//                 formData={thongTinYCTN}
//               >
//                 <h4 className="text-xl text-gray-700 my-4">
//                   Khảo sát lập phương án thi công
//                 </h4>

//                 <InputFile
//                   isDisabled={isFormDisabled}
//                   nameField="file_upload"
//                   setFormData={setFormData}
//                   onChange={(formData) => {
//                     if (formData) {
//                       const file = formData.get("file");
//                       file
//                         ? handleChange("file_pa_thi_cong", file)
//                         : console.log("Không có file.");
//                     } else {
//                       console.log("formData không hợp lệ.");
//                     }
//                   }}
//                 />

//                 {/* {formData.file_pa_thi_cong && (
//                   <div style={{ marginTop: '10px', color: 'blue', fontWeight: 'bold' }}>
//                     <strong style={{
//                       color: 'black',
//                     }}>Tên file: </strong>
//                     {formData.file_pa_thi_cong}
//                   </div>
//                 )} */}

//                 <FormField
//                   label="Người khảo sát"
//                   id="nguoi_th_ks_lap_pa_thi_cong"
//                   isDropdown
//                   isDisabled={isFormDisabled}
//                   options={dm_KH}
//                   optionsValue="id"
//                   optionsLabel="hO_TEN"
//                   value={formData.nguoi_th_ks_lap_pa_thi_cong}
//                   onChange={(e) =>
//                     handleChange("nguoi_th_ks_lap_pa_thi_cong", e.value)
//                   }
//                 />

//                 <FormField
//                   label="Ngày khảo sát"
//                   isDisabled={isFormDisabled}
//                   id="ngay_ks_lap_pa_thi_cong"
//                   isCalendar
//                   value={formData.ngay_ks_lap_pa_thi_cong}
//                   onChange={(e) =>
//                     handleChange("ngay_ks_lap_pa_thi_cong", e.value)
//                   }
//                 />

//                 <div className="text-right my-2">
//                   <Button
//                     label="Lưu"
//                     icon="pi pi-save"
//                     className="mt-3"
//                     isDisabled={isFormDisabled}
//                     onClick={handleSave}
//                   />
//                 </div>
//               </ThongTinYCTN>
//             ) : (
//               <></>
//             )
//           }
//         />
//       </Panel>
//     </>
//   );
// };

// export default KhaoSatPhuongAn;