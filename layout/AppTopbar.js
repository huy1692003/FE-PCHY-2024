import Link from "next/link";
import Router, { useRouter } from "next/router";
import { classNames } from "primereact/utils";
import React, {
    forwardRef,
    useContext,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { LayoutContext } from "./context/layoutcontext";
import { Menu } from "primereact/menu";
import { PrimeIcons } from "primereact/api";
import { OverlayPanel } from "primereact/overlaypanel";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from "primereact/dropdown";

// eslint-disable-next-line react/display-name
const AppTopbar = forwardRef((props, ref) => {
    const menuLeft = useRef(null);
    const menuRight = useRef(null);
    const overlayPanelRef = useRef(null);
    const router = useRouter();

    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } =
        useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const [tenDangNhap, setTenDangNhap] = useState("");
    const [tenPhongBan, setTenPhongBan] = useState("");
    const [selectedDonVi, setSelectedDonVi] = useState(JSON.parse(sessionStorage.getItem("current_MADVIQLY"))||""); // Lưu giá trị đã chọn

    useEffect(() => {

        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user) {
            !selectedDonVi&&setSelectedDonVi(user.ma_dviqly)
            setTenPhongBan(user.ten_phongban);
            setTenDangNhap(user.ten_dang_nhap);
            
        }
    }, []);

    useEffect(() => {
        sessionStorage.setItem("current_MADVIQLY", JSON.stringify(selectedDonVi));
        
    }, [selectedDonVi])
    const ds_donvi = JSON.parse(sessionStorage.getItem("ds_donvi"));
    

    const logout = () => {
       
                sessionStorage.removeItem('user');
                sessionStorage.removeItem('current_MADVIQLY');
                sessionStorage.removeItem('token');
                Router.push('/auth/login');
         
    }
    const items = [
        {
            label: tenPhongBan,
            icon: PrimeIcons.BUILDING,
        },
        {
            label: tenDangNhap,
            icon: PrimeIcons.USER,
        },
        {
            label: "Đổi mật khẩu",
            icon: PrimeIcons.LOCK,
        },
    ];

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current,
    }));

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img
                    style={{width:"200px","height":"auto"}}
                    src="/demo/images/login/logologin.png"
                    widt={"true"}
                    alt="logo"
                />
            </Link>

            <button
                ref={menubuttonRef}
                type="button"
                className="p-link layout-menu-button layout-topbar-button"
                onClick={onMenuToggle}
            >
                <i className="pi pi-bars" />
            </button>

            <button
                ref={topbarmenubuttonRef}
                type="button"
                className="p-link layout-topbar-menu-button layout-topbar-button"
                onClick={showProfileSidebar}
            >
                <i className="pi pi-ellipsis-v" />
            </button>

            <div
                ref={topbarmenuRef}
                className={classNames("layout-topbar-menu", {
                    "layout-topbar-menu-mobile-active":
                        layoutState.profileSidebarVisible,
                })}
            >
                <button
                    type="button"
                    className="p-link layout-topbar-button mr-2"
                    onClick={(e) => overlayPanelRef.current.toggle(e)}
                >
                    <i className="pi pi-user"></i>
                    <span>Profile</span>
                    {/* <Menu
                        model={items}
                        popup
                        id="popup_menu_left"
                        ref={menuLeft}
                        style={{ width: "250px" }}
                    /> */}
                </button>

                <OverlayPanel
                    ref={overlayPanelRef}
                    id="overlay_panel"
                    style={{ width: "300px" }}

                >
                    <ul className="p-menu-list" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '20px', margin: '0', padding: '0' }}>
                        <li className="p-menuitem" style={{ height: 'auto' }}>
                            <a className="p-menuitem-link text-xl">
                                <span className="p-menuitem-icon pi pi-home mr-2"></span>
                                <span title="Tên phòng ban" className="p-menuitem-text"  >
                                    {tenPhongBan}
                                </span>
                            </a>
                        </li>
                        <li className="p-menuitem">
                            <a className="p-menuitem-link text-xl">
                                <span className="p-menuitem-icon pi pi-user mr-2"></span>
                                <span className="p-menuitem-text">
                                    {tenDangNhap}
                                </span>
                            </a>
                        </li>
                        <li className="p-menuitem">
                            <a className="p-menuitem-link text-xl">
                                <span className="p-menuitem-icon pi pi-lock mr-2" ></span>
                                <span className="p-menuitem-text">
                                    Đổi mật khẩu
                                </span>
                            </a>
                        </li>
                    </ul>
                </OverlayPanel>

                <div style={{ cursor: "pointer", position: "relative" }}>

                    <div className="menuitem">
                        <Dropdown
                            tooltip="Chuyển đơn vị"
                            value={selectedDonVi}
                            filter
                            onChange={(e) => {

                                setSelectedDonVi(e.value);
                                router.reload()

                            }}
                            options={ds_donvi}
                            optionLabel="ten"
                            optionValue="ma_dviqly"
                            placeholder="Chọn đơn vị"
                            style={{ border: 0, fontSize: 22 }}
                            dropdownIcon="pi pi-sync"
                        />
                    </div>

                </div>

                <div onClick={()=>logout()} className="p-menuitem" style={{ cursor: "pointer" }} >
                    <button
                        tooltip="Đăng xuất"
                        title="Đăng xuất"
                        type="button"
                        style={{color:"red"}}
                        className="p-link layout-topbar-button"
                    >
                        <i className="pi pi-power-off"></i>
                    </button>
                    
                </div>
            </div>
        </div>
    );

});

export default AppTopbar;
