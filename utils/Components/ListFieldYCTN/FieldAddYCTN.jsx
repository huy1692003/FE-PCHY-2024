import { memo, useEffect, useRef, useState, useLayoutEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from "primereact/fileupload";
import { DM_TRUONG_YCTN_Service } from "../../../services/quanlythinghiem/DM_TRUONG_YCTN_Service";
import DM_LOAI_YCTNService from "../../../services/quanlythinghiem/DM_LOAI_YCTNService";
import { Dropdown } from "primereact/dropdown";
import InputFile from "../InputFile";
import { Button } from "primereact/button";
import QLTN_YCTN from "../../../models/QLTN_YCTN";
import UploadFileService from "../../../services/UploadFileService";
import QLTN_YCTNService from "../../../services/quanlythinghiem/QLTN_YCTNService";
import { Notification } from "../../notification";
import { useRouter } from "next/router";
import { DM_LOAI_TAISANService } from "../../../services/quanlythinghiem/DM_LOAI_TAISANService";
import { DM_KHACHHANG_Service } from "../../../services/quanlythinghiem/DM_KHACHHANG_Service";

export const FormField = ({ label, className, style, placeholder, value, onChange, id, isCalendar = false, isNumber = false,row=5, isFileUpload = false, isDropdown = false, isTextArea = false, options = [], prefix, isDisabled = false, styleField, props, mode, currency, locale, childrenIPNumber, optionsValue, optionsLabel }) => (
    <div className={className} style={style}>
        <label className='font-medium text-sm my-3 block' htmlFor={id}>{label}</label>
        {isCalendar ? (
            <Calendar id={id} name={id} value={value} onChange={(e) => onChange(id, e.value)} showIcon className="w-full" disabled={isDisabled} />
        ) : isNumber ? (
            <div className="p-inputgroup">
                <InputNumber id={id} name={id} value={value} onChange={(e) => onChange(id, e.value)} className="w-full" disabled={isDisabled} />
                <span className="p-inputgroup-addon" style={{ backgroundColor: "#6366F1", color: "white" }}>VNĐ</span>
            </div>
        ) : isDropdown ? (
            <Dropdown  {...props} id={id} name={id} value={value} options={options} showClear onChange={(e) => onChange(id, e.value)} className="w-full" disabled={isDisabled} filter optionValue={optionsValue} optionLabel={optionsLabel} placeholder="--Mời chọn--" />
        ) : isTextArea ? (
            <InputTextarea id={id} name={id} value={value} onChange={(e) => onChange(id, e.target.value)} rows={row} className="w-full" disabled={isDisabled} autoResize />
        ) : (
            <InputText style={styleField} id={id} name={id} value={value} onChange={(e) => onChange(id, e.target.value)} className="w-full" disabled={isDisabled} />
        )}
    </div>
);

const FieldAddYCTN = ({ loai_yctn, isAdd = true, toast, isEdit = false }) => {

    const [formData, setFormData] = useState(QLTN_YCTN);
    const [fieldbyLoaiYCTN, setFieldbyLoaiYCTN] = useState([]);
    const [fields, setFields] = useState([]);
    const [fieldCurrent, setFieldCurrent] = useState([]);
    const [dm_LTS, setDM_LTS] = useState([]);
    const [dm_KH, setDM_KH] = useState([]);
    const router = useRouter();

    // Lấy danh sách trường dữ liệu và các trường tương ứng với loai_yctn  
    useEffect(() => {
     
        getAllFields();
        setFormData({ ...QLTN_YCTN, ma_yctn: loai_yctn?.key_word, ma_loai_yctn: loai_yctn?.ma_loai_yctn });
        getFieldByLoaiYCTN();
        getAllDM_LTS();
        getAllDM_KH();
    }, [loai_yctn]);

    console.log(formData)
    useEffect(() => {
        let res = findMatchingFields(fields, fieldbyLoaiYCTN);
        setFieldCurrent(res);
    }, [fieldbyLoaiYCTN, fields]);
  
    const getAllFields = async () => {
        let res = await DM_TRUONG_YCTN_Service.getAll_DM_TRUONG_YCTN();
        setFields(res);
    }

    const getAllDM_LTS = async () => {
        try {
            let res = await DM_LOAI_TAISANService.get_DM_LOAI_TAISAN();
            setDM_LTS(res?.data);
        } catch (err) {
            setDM_LTS([])
        }
    }

    const getAllDM_KH = async () => {
        try {
            let res = await DM_KHACHHANG_Service.get_ALL_DM_KHACHHANG();
            setDM_KH(res);
        } catch (err) {
            setDM_KH([]);
        }
    }

    const getFieldByLoaiYCTN = async () => {
        let res = await DM_LOAI_YCTNService.get_PHAN_MIEN_YCTN_BY_LOAI_YCTN(loai_yctn.id)
        setFieldbyLoaiYCTN(res);
    }

    const handleInputChange = (fieldName, value) => {
        setFormData(prev => {
            const newData = {
                ...prev,
                [fieldName]: value
            };

            // Tính toán các giá trị phụ thuộc
            if (fieldName === 'gtdt_truoc_thue' || fieldName === 'gtdt_chiet_giam') {
                if (newData.gtdt_truoc_thue && newData.gtdt_chiet_giam) {
                    newData.phan_tram_chiet_giam = newData.gtdt_chiet_giam * 100 / newData.gtdt_truoc_thue;
                }
            }

            if (fieldName === 'gtdt_truoc_thue' || fieldName === 'phan_tram_chiet_giam') {
                if (newData.gtdt_truoc_thue && newData.phan_tram_chiet_giam) {
                    newData.gtdt_chiet_giam = newData.phan_tram_chiet_giam * newData.gtdt_truoc_thue / 100;
                }
            }
             
            // Tính gtdt_sau_chiet_giam
            if (newData.gtdt_truoc_thue && newData.gtdt_chiet_giam) {
                newData.gtdt_sau_chiet_giam = newData.gtdt_truoc_thue - newData.gtdt_chiet_giam;
            } else {
                newData.gtdt_sau_chiet_giam = newData.gtdt_truoc_thue;
            }

            // Tính lại gtdt_thue dựa trên % thuế hiện tại khi gtdt_sau_chiet_giam thay đổi
            if (newData.gtdt_sau_chiet_giam && newData.phan_tram_thue) {
                newData.gtdt_thue = newData.phan_tram_thue * newData.gtdt_sau_chiet_giam / 100;
            }

            // Tính phan_tram_thue khi gtdt_thue thay đổi
            if (fieldName === 'gtdt_thue') {
                if (newData.gtdt_sau_chiet_giam && newData.gtdt_thue) {
                    newData.phan_tram_thue = newData.gtdt_thue * 100 / newData.gtdt_sau_chiet_giam;
                }
            }

            // Tính gtdt_thue khi phan_tram_thue thay đổi
            if (fieldName === 'phan_tram_thue') {
                if (newData.gtdt_sau_chiet_giam && newData.phan_tram_thue) {
                    newData.gtdt_thue = newData.phan_tram_thue * newData.gtdt_sau_chiet_giam / 100;
                }
            }

            // Tính gtdt_sau_thue
            if (newData.gtdt_sau_chiet_giam && newData.gtdt_thue) {
                newData.gtdt_sau_thue = newData.gtdt_sau_chiet_giam + newData.gtdt_thue;
            } else {
                newData.gtdt_sau_thue = newData.gtdt_sau_chiet_giam;
            }

            return newData;
        });
    };

    const fieldInput = [
        {
            stt: 1,
            key: "ma_yctn",
            element: <FormField label={<>Mã yêu cầu <span className="text-sm">(STT sẽ được hệ thống quy định)</span> <span className="text-lg text-red-500">*</span></>} id="ma_yctn" value={formData?.ma_yctn} isDisabled={true} />
        },
        {
            stt: 2,
            key: "ten_yctn",
            element: <FormField label="Tên YCTN" id="ten_yctn"  value={formData?.ten_yctn||""} onChange={handleInputChange} />
        },
        {
            stt: 3,
            key: "noi_dung",
            element: <FormField label="Nội dung" id="noi_dung" value={formData?.noi_dung||""} isTextArea onChange={handleInputChange} />
        },
        {
            stt: 4,
            key: "loai_tai_san", 
            element: loai_yctn.ma_loai_yctn === "ke_hoach_thi_nghiem" ? <FormField
                label="Loại tài sản"
                id="loai_tai_san"
                value={Number.parseInt(formData.loai_tai_san)} 
                isDropdown
                options={dm_LTS}
                optionsLabel="ten_lts"
                optionsValue="id"
                onChange={handleInputChange}
            /> : <></>
        },
        {
            stt: 5,
            key: "id_khach_hang",
            element: <div className="flex gap-4">
                <div style={{ width: "49%" }}>
                    <FormField
                        label="Khách hàng / Đơn vị điện lực"
                        id="id_khach_hang"
                        value={Number.parseInt(formData?.id_khach_hang)}
                        isDropdown
                        options={dm_KH}
                        optionsLabel="ten_kh"
                        optionsValue="id"
                        onChange={handleInputChange}
                    />
                </div>
                <div style={{ width: "49%" }}>
                    <FormField
                        label="Loại tài sản"
                        id="loai_tai_san"
                        value={Number.parseInt(formData.loai_tai_san)}
                        isDropdown
                        options={dm_LTS}
                        optionsLabel="ten_lts"
                        optionsValue="id"
                        onChange={handleInputChange}
                    />
                </div>
            </div>
        },
        {
            stt: 6,
            key: "ngay_tao",
            element: <FormField label="Ngày tạo" id="ngay_tao" value={formData?.ngay_tao} onChange={handleInputChange} isCalendar />
        },
        {
            stt: 7,
            key: "ngay_ky_hop_dong",
            element: <FormField label="Ngày ký hợp đồng" id="ngay_ky_hop_dong" value={formData?.ngay_ky_hop_dong} onChange={handleInputChange} isCalendar />
        },
        {
            stt: 8,
            key: "ngay_xay_ra_su_co",
            element: <FormField label="Ngày xảy ra sự cố" id="ngay_xay_ra_su_co" value={formData?.ngay_xay_ra_su_co} onChange={handleInputChange} isCalendar />
        },
        {
            stt: 9,
            key: "gtdt_truoc_thue",
            element: <FormField label="Giá trị trước thuế" id="gtdt_truoc_thue" value={formData?.gtdt_truoc_thue} onChange={handleInputChange} isNumber childrenIPNumber={"(VNĐ)"} />
        },
        {
            stt: 10,
            key: "phan_tram_chiet_giam",
            element: <div className="flex gap-4">
                <div style={{ width: "20%" }}>
                    <label className='font-medium text-sm my-3 block' htmlFor="phan_tram_chiet_giam">Phần trăm chiết giảm</label>
                    <div className="p-inputgroup">
                        <InputNumber id="phan_tram_chiet_giam" name="phan_tram_chiet_giam" value={formData.phan_tram_chiet_giam} onChange={(e) => handleInputChange("phan_tram_chiet_giam", e.value)} className="w-full" mode={"decimal"} min={0} minFractionDigits={1} maxFractionDigits={2} />
                        <span className="p-inputgroup-addon" style={{ backgroundColor: "#6366F1", color: "white" }}>%</span>
                    </div>
                </div>
                <div style={{ width: "38%" }}>
                    <label className='font-medium text-sm my-3 block' htmlFor="gtdt_chiet_giam">Giá trị chiết giảm</label>
                    <div className="p-inputgroup">
                        <InputNumber id="gtdt_chiet_giam" name="gtdt_chiet_giam" value={formData.gtdt_chiet_giam} onChange={(e) => handleInputChange("gtdt_chiet_giam", e.value)} className="w-full" min={0} />
                        <span className="p-inputgroup-addon" style={{ backgroundColor: "#6366F1", color: "white" }}>VNĐ</span>
                    </div>
                </div>
                <div style={{ width: "39%" }}>
                    <label className='font-medium text-sm my-3 block' htmlFor="gtdt_sau_chiet_giam">Giá trị sau chiết giảm</label>
                    <div className="p-inputgroup">
                        <InputNumber id="gtdt_sau_chiet_giam" disabled name="gtdt_sau_chiet_giam" value={formData.gtdt_sau_chiet_giam} onChange={(e) => handleInputChange("gtdt_sau_chiet_giam", e.value)} className="w-full" min={0} />
                        <span className="p-inputgroup-addon" style={{ backgroundColor: "#6366F1", color: "white" }}>VNĐ</span>
                    </div>
                </div>
            </div>
            <div style={{ width: "38%" }}>
              <label
                className="font-medium text-sm my-3 block"
                htmlFor="gtdt_chiet_giam"
              >
                Giá trị chiết giảm
              </label>
              <div className="p-inputgroup">
                <InputNumber
                  id="gtdt_chiet_giam"
                  name="gtdt_chiet_giam"
                  value={formData.gtdt_chiet_giam}
                  onChange={(e) =>
                    handleInputChange("gtdt_chiet_giam", e.value)
                  }
                  className="w-full"
                  min={0}
                />
                <span
                  className="p-inputgroup-addon"
                  style={{ backgroundColor: "#6366F1", color: "white" }}
                >
                  VNĐ
                </span>
              </div>
            </div>
            <div style={{ width: "39%" }}>
              <label
                className="font-medium text-sm my-3 block"
                htmlFor="gtdt_sau_chiet_giam"
              >
                Giá trị sau chiết giảm
              </label>
              <div className="p-inputgroup">
                <InputNumber
                  id="gtdt_sau_chiet_giam"
                  disabled
                  name="gtdt_sau_chiet_giam"
                  value={formData.gtdt_sau_chiet_giam}
                  onChange={(e) =>
                    handleInputChange("gtdt_sau_chiet_giam", e.value)
                  }
                  className="w-full"
                  min={0}
                />
                <span
                  className="p-inputgroup-addon"
                  style={{ backgroundColor: "#6366F1", color: "white" }}
                >
                  VNĐ
                </span>
              </div>
            </div>
          </div>
        ),
      },
      {
        stt: 11,
        key: "phan_tram_thue",
        element: (
          <div className="flex gap-4">
            <div style={{ width: "20%" }}>
              <label
                className="font-medium text-sm my-3 block"
                htmlFor="phan_tram_thue"
              >
                Phần trăm thuế
              </label>
              <div className="p-inputgroup">
                <InputNumber
                  mode={"decimal"}
                  min={0}
                  minFractionDigits={1}
                  maxFractionDigits={2}
                  id="phan_tram_thue"
                  name="phan_tram_thue"
                  value={formData.phan_tram_thue}
                  onChange={(e) => handleInputChange("phan_tram_thue", e.value)}
                  className="w-full"
                />
                <span
                  className="p-inputgroup-addon"
                  style={{ backgroundColor: "#6366F1", color: "white" }}
                >
                  %
                </span>
              </div>
            </div>
            <div style={{ width: "38%" }}>
              <label
                className="font-medium text-sm my-3 block"
                htmlFor="gtdt_thue"
              >
                Giá trị thuế
              </label>
              <div className="p-inputgroup">
                <InputNumber
                  id="gtdt_thue"
                  name="gtdt_thue"
                  value={formData.gtdt_thue}
                  onChange={(e) => handleInputChange("gtdt_thue", e.value)}
                  className="w-full"
                  min={0}
                />
                <span
                  className="p-inputgroup-addon"
                  style={{ backgroundColor: "#6366F1", color: "white" }}
                >
                  VNĐ
                </span>
              </div>
            </div>
            <div style={{ width: "39%" }}>
              <label
                className="font-medium text-sm my-3 block"
                htmlFor="gtdt_sau_thue"
              >
                Giá trị sau thuế
              </label>
              <div className="p-inputgroup">
                <InputNumber
                  id="gtdt_sau_thue"
                  disabled
                  name="gtdt_sau_thue"
                  value={formData.gtdt_sau_thue}
                  onChange={(e) => handleInputChange("gtdt_sau_thue", e.value)}
                  className="w-full"
                  min={0}
                />
                <span
                  className="p-inputgroup-addon"
                  style={{ backgroundColor: "#6366F1", color: "white" }}
                >
                  VNĐ
                </span>
              </div>
            </div>
          </div>
        ),
      },
      {
        stt: 16,
        key: "file_upload",
        element: (
          <>
            <label
              className="font-bold text-sm my-3 block"
              htmlFor="file_upload"
            >
              Upload file
            </label>
            <InputFile nameField="file_upload" setFormData={setFormData} />
          </>
        ),
      },
    ];

    const findMatchingFields = (fields, fieldByYCTN) => {
        // Lấy danh sách ma_truong_yctn từ fieldByYCTN      
        return fieldByYCTN.map(item => fields.find(field => field.id === item.ma_truong_yctn + ""));
    }

    const handleSubmit = async () => {
        if (formData.file_upload) {
            console.log(formData)
            let resUpload = await UploadFileService.file(formData.file_upload)

            formData.file_upload = resUpload.filePath
        }
        if (isAdd) {
            try {
                console.log(formData)
                 await QLTN_YCTNService.create_QLTN_YCTN(formData)

                Notification.success(toast, "Tạo mới YCTN thành công")
            } catch (err) {
                console.log(err)
                Notification.error(toast, "Tạo mới YCTN thất bại")
            }
        }

    }
    return (
        <div className="">
            <div>
                {fieldInput.map(field => {
                    if (fieldCurrent.find(i => i?.ma_code === field.key)) {
                        return <div key={field.stt}>{field.element}</div>
                    }
                    
                })}
            </div>
            <br />
            <br />
            <br />
            <div style={{ borderTop: "1px solid #ccc" }} className='flex justify-content-end gap-2 mt-10 pt-5'>
                <Button label="Quay lại" icon="pi pi-arrow-left" className='p-button-danger' onClick={() => router.back()} />
                {loai_yctn && <Button label={"Tạo mới " + loai_yctn?.ten_loai_yc} icon="pi pi-check" onClick={handleSubmit} />}
            </div>
        </div>
    );
};

export default memo(FieldAddYCTN);