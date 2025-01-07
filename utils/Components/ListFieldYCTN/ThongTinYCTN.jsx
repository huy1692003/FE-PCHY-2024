import { memo, useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
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
import { InputTextarea } from "primereact/inputtextarea";
import { DM_LOAI_TAISANService } from "../../../services/quanlythinghiem/DM_LOAI_TAISANService";
import { DM_KHACHHANG_Service } from "../../../services/quanlythinghiem/DM_KHACHHANG_Service";

const FormField = ({
  label,
  className,
  style,
  placeholder,
  value,
  onChange,
  id,
  isCalendar = false,
  isNumber = false,
  isFileUpload = false,
  isDropdown = false,
  isTextArea = false,
  options = [],
  prefix,
  // isDisabled = true,
  styleField,
  props,
  mode,
  currency,
  locale,
  childrenIPNumber,
  optionsValue,
  optionsLabel,
}) => (
  <div className={className} style={style}>
    <label className="font-medium text-sm my-3 block" htmlFor={id}>
      {label}
    </label>
    {isCalendar ? (
      <Calendar
        id={id}
        name={id}
        value={value ? new Date(value) : new Date()}
        showIcon
        onChange={onChange}
        className="w-full flex align-items-center justify-content-start p-disabled-custom"
        // disabled={isDisabled}
      />
    ) : isNumber ? (
      <div className="p-inputgroup">
        <InputNumber
          id={id}
          name={id}
          value={value}
          className="w-full"
          // disabled={isDisabled}
          style={{ opacity: 1 }}
        />
        <span
          className="p-inputgroup-addon"
          style={{ backgroundColor: "#6366F1", color: "white" }}
        >
          {childrenIPNumber}
        </span>
      </div>
    ) : isDropdown ? (
      <Dropdown
        {...props}
        id={id}
        name={id}
        value={value}
        options={options}
        showClear
        className="w-full"
        // disabled={isDisabled}
        filter
        optionValue={optionsValue}
        onChange={onChange}
        optionLabel={optionsLabel}
        placeholder="--Mời chọn--"
        style={{ opacity: 1 }}
      />
    ) : isTextArea ? (
      <InputTextarea
        id={id}
        name={id}
        value={value}
        rows={5}
        className="w-full"
        // disabled={isDisabled}
        autoResize
        style={{ opacity: 1 }}
      />
    ) : (
      <InputText
        style={{ ...styleField, opacity: 1 }}
        id={id}
        name={id}
        value={value}
        className="w-full"
        // disabled={isDisabled}
      />
    )}
  </div>

);

export { FormField };


const ThongTinYCTN = ({ loai_yctn, formData, children }) => {
  const [fieldbyLoaiYCTN, setFieldbyLoaiYCTN] = useState([]);
  const [fields, setFields] = useState([]);
  const [fieldCurrent, setFieldCurrent] = useState([]);
  const [dm_LTS, setDM_LTS] = useState([]);
  const [dm_KH, setDM_KH] = useState([]);

  const getAllDanhMuc = async () => {
    try {
      const [resLTS, resKH] = await Promise.all([
        DM_LOAI_TAISANService.get_DM_LOAI_TAISAN(),
        DM_KHACHHANG_Service.get_ALL_DM_KHACHHANG(),
      ]);
      setDM_LTS(resLTS?.data);
      setDM_KH(resKH);
    } catch (err) {
      setDM_LTS([]);
      setDM_KH([]);

    }
  };
  // Lấy danh sách trường dữ liệu và các trường tương ứng với loai_yctn
  useEffect(() => {
    getAllFields();
    getFieldByLoaiYCTN();
    getAllDanhMuc();
  }, [loai_yctn]);


  useEffect(() => {
    let res = findMatchingFields(fields, fieldbyLoaiYCTN);
    setFieldCurrent(res);
  }, [fieldbyLoaiYCTN, fields]);

  //console.log(formData);
  const getAllFields = async () => {
    let res = await DM_TRUONG_YCTN_Service.getAll_DM_TRUONG_YCTN();
    setFields(res);
  };

  const getFieldByLoaiYCTN = async () => {
    let res = await DM_LOAI_YCTNService.get_PHAN_MIEN_YCTN_BY_LOAI_YCTN(loai_yctn.id)
    setFieldbyLoaiYCTN(res);
  }

  const fieldInput = [

    {
      stt: 2,
      key: "ten_yctn",
      element: <FormField label="Tên YCTN" id="ten_yctn" value={formData?.ten_yctn} />
    },
    {
      stt: 3,
      key: "noi_dung",
      element: <FormField label="Nội dung" id="noi_dung" value={formData?.ten_yctn} />
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
      /> : <>
      </>
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
          />
        </div>
      </div>
    },
    {
      stt: 6,
      key: "ngay_tao",
      element: <FormField label="Ngày tạo" id="ngay_tao" value={formData?.ngay_tao} isCalendar />
    },
    {
      stt: 7,
      key: "ngay_ky_hop_dong",
      element: <FormField label="Ngày ký hợp đồng" id="ngay_ky_hop_dong" value={formData?.ngay_ky_hop_dong} isCalendar />
    },
    {
      stt: 8,
      key: "ngay_xay_ra_su_co",
      element: <FormField label="Ngày xảy ra sự cố" id="ngay_xay_ra_su_co" value={formData?.ngay_xay_ra_su_co} isCalendar />
    },
    {
      stt: 9,
      key: "gtdt_truoc_thue",
      element: <FormField label={<>Giá trị dự toán trước thuế <span className="text-lg text-red-500">*</span></>} id="gtdt_truoc_thue" value={formData?.gtdt_truoc_thue} isNumber childrenIPNumber={"(VNĐ)"} />
    },
    {
      stt: 10,
      key: "gtdt_chiet_giam",
      element: <div className="flex gap-4">
        <div style={{ width: "49%" }}>
          <FormField label={<>Giá trị chiết giảm <span className="text-lg text-red-500">*</span></>} id="gtdt_chiet_giam" value={formData?.gtdt_chiet_giam} isNumber childrenIPNumber={"(VNĐ)"} />
        </div>
        <div style={{ width: "49%" }}>
          <FormField label={<>Giá trị sau chiết giảm <span className="text-lg text-red-500">*</span></>} id="gtdt_sau_chiet_giam" value={formData?.gtdt_sau_chiet_giam} isNumber childrenIPNumber={"(VNĐ)"} />
        </div>
      </div>
    },
    {
      stt: 11,
      key: "gtdt_thue",
      element: <div className="flex gap-4">
        <div style={{ width: "49%" }}>
          <FormField label={<>Thuế <span className="text-lg text-red-500">*</span></>} id="gtdt_thue" value={formData?.gtdt_thue} isNumber childrenIPNumber={"(VNĐ)"} />
        </div>
        <div style={{ width: "49%" }}>
          <FormField label={<>Giá trị dự toán sau thuế <span className="text-lg text-red-500">*</span></>} id="gtdt_sau_thue" value={formData?.gtdt_sau_thue} isNumber childrenIPNumber={"(VNĐ)"} />
        </div>
      </div>
    }
  ];

  const findMatchingFields = (fields, fieldByYCTN) => {
    // Lấy danh sách ma_truong_yctn từ fieldByYCTN      
    return fieldByYCTN.map(item => fields.find(field => field.id === item.ma_truong_yctn + ""));
  }


  return (
    <div className="">
      <div>
        {fieldInput.map((field) => {
          if (fieldCurrent.find((i) => i?.ma_code === field.key)) {
            return <div key={field.stt}>{field.element}</div>;
          }
        })}
        {children}
      </div>
    </div>
  );

};

export default memo(ThongTinYCTN);
