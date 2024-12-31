import { memo, useEffect, useRef, useState } from "react";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import TableYCTN from "./TableYCTN";
import { useRouter } from "next/router";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import QLTN_YCTNService from "../../../../services/quanlythinghiem/QLTN_YCTNService";
import { DM_KHACHHANG_Service } from "../../../../services/quanlythinghiem/DM_KHACHHANG_Service";
import { get_All_DM_DONVI } from "../../../../services/quantrihethong/DM_DONVIService";

const DanhSachYCTN = () => {
  const toast = useRef(null);
  const router = useRouter();
  const [dataYCTN, setDataYCTN] = useState();
  const [dmKhachHang, setDmKhachHang] = useState([]);
  const [dmDonVi, setDmDonVi] = useState([]);

  //phan trang

  const [totalRecords, setTotalRecords] = useState(0);

  const [filters, setFilters] = useState({
    searchTerm: "",
    maLoaiYCTN: "",
    donViThucHien: "",
    idKhachHang: "",
    crrStep: "",
    limit: 10,
  });


  const loadYCTN = async (page = 1, rows = 20) => {
    try {
      const params = {
        searchTerm: filters.searchTerm || "",
        maLoaiYCTN: filters.maLoaiYCTN || "",
        donViThucHien: filters.donViThucHien || "",
        idKhachHang: filters.idKhachHang ? Number(filters.idKhachHang) : null,
        crrStep: filters.crrStep ? Number(filters.crrStep) : null,
        pageIndex: page,
        pageSize: rows,
      };


      const response = await QLTN_YCTNService.get_DANH_SACH_YCTN(params);
      setDataYCTN(response?.data || []);
      setTotalRecords(response?.totalRecords || 0);
    } catch (error) {
      console.error("Lỗi khi tải danh sách YCTN:", error);
    }
  };


  console.log('cpn index >> data YCTN:', dataYCTN);

const load_DANHMUC = async () => {
  try {
    const [responseKH, responseDV] = await Promise.all([
      DM_KHACHHANG_Service.get_ALL_DM_KHACHHANG(),
      get_All_DM_DONVI(),
    ]);
    setDmKhachHang(responseKH || []);
    setDmDonVi(responseDV || []);
    console.log(responseKH, responseDV)
  } catch (error) {
    console.error("Lỗi khi tải danh sách khách hàng:", error);
  }
};



  useEffect(() => {
    loadYCTN();
    load_DANHMUC();
  }, []);
  // console.log(dmDonVi)


  

  const headerList = (options) => {
    const className = `${options.className} flex flex-wrap justify-content-between align-items-center`;


    return (
      <div className={className}>
        <span className="font-bold text-xl">Danh sách yêu cầu thí nghiệm</span>
        <div className="flex flex-wrap gap-2">
          <Button
            label="Thêm mới"
            style={{ backgroundColor: "#1445a7" }}
            onClick={() => {
              router.push("/quanlythinghiem/yeucauthinghiem/themmoi");
            }}
          />
        </div>

        <Panel header="Tìm kiếm" style={{ margin: "20px 0", width: "100%" }}>
          <div className="grid">

            <div className="col-12 md:col-6 lg:col-4">
              <label className="block mb-2">Nhập từ khóa</label>
              <InputText
                className="w-full"
                value={filters.searchTerm}
                onChange={(e) =>
                  setFilters({ ...filters, searchTerm: e.target.value })
                }
                placeholder="Nhập...."
                type="search"
              />
            </div>

            <div className="col-12 md:col-6 lg:col-2">
              <label className="block mb-2">Loại hình dịch vụ</label>
              <Dropdown
                className="w-full"
                value={filters.maLoaiYCTN}
                onChange={(e) =>
                  setFilters({ ...filters, maLoaiYCTN: e.value })
                }
                placeholder="Chọn"
                filter
                showClear
                options={[
                  { label: "Xử lý sự cố", value: "xu_ly_su_co" },
                  {
                    label: "Kế hoạch thí nghiệm",
                    value: "ke_hoach_thi_nghiem",
                  },
                  { label: "Hợp đồng", value: "hop_dong" },
                ]}
              />
            </div>

            <div className="col-12 md:col-6 lg:col-2">
              <label className="block mb-2">Đơn vị thực hiện</label>
              <Dropdown
                className="w-full"
                value={filters.donViThucHien}
                onChange={(e) =>
                  setFilters({ ...filters, donViThucHien: e.value })
                }
                filter
                showClear
                placeholder="Chọn"
                options={dmDonVi.map((item) => ({
                  label: item.ten,
                  value: item.id,
                }))}
              />
            </div>

            <div className="col-12 md:col-6 lg:col-2">
              <label className="block mb-2">Khách hàng</label>
              <Dropdown
                className="w-full"
                value={filters.idKhachHang}
                onChange={(e) =>
                  setFilters({ ...filters, idKhachHang: e.value })
                }
                placeholder="Chọn"
                filter
                showClear
                options={dmKhachHang.map((item) => ({
                  label: item.ten_kh,
                  value: item.id,
                }))}
              />
            </div>

            <div className="col-12 md:col-6 lg:col-2">
              <label className="block mb-2">Trạng thái</label>
              <Dropdown
                className="w-full"
                value={filters.crrStep}
                onChange={(e) => setFilters({ ...filters, crrStep: e.value })}
                placeholder="Chọn"
                filter
                showClear
                options={[
                  { label: "Tất cả", value: -1 },
                  { label: "Tạo mới", value: 1 },
                  { label: "Giao nhiệm vụ", value: 2 },
                  { label: "Nhập khối lượng hợp đồng", value: 3 },
                  { label: "Khảo sát lập phương án", value: 4 },
                  { label: "Thực hiện thí nghiệm", value: 5 },
                  { label: "Bàn giao kết quả", value: 6 },
                ]}
              />
            </div>
          </div>
          <div className="flex justify-content-center mt-4">
          <Button
              label="Tìm kiếm"
              style={{ backgroundColor: "#1445a7" }}
              onClick={() => loadYCTN(1, filters.limit)}
            />
          </div>
        </Panel>
      </div>
    );
  };




  return (
    <div className="border-round-3xl bg-tranpe p-3">
      <Panel headerTemplate={headerList}>
        <TableYCTN
          toast={toast}
          loadYCTN={loadYCTN}
          dataYCTN={dataYCTN}
          totalRecords={totalRecords}        
          />
      </Panel>
      <Toast ref={toast} />
    </div>
  );
};

export default memo(DanhSachYCTN);
