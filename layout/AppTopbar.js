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

// eslint-disable-next-line react/display-name
const AppTopbar = forwardRef((props, ref) => {
    const menuLeft = useRef(null);
    const menuRight = useRef(null);
    const overlayPanelRef = useRef(null);

    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } =
        useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const [tenDonVi, setTenDonVi] = useState("");
    const [tenPhongBan, setTenPhongBan] = useState("");
    const [tenDangNhap, setTenDangNhap] = useState("");

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user) {
            setTenDonVi(user.ten_donvi);
            setTenPhongBan(user.ten_phongban);
            setTenDangNhap(user.ten_dang_nhap);
        }
    }, []);

    const items = [
        {
            label: tenPhongBan,
            icon: PrimeIcons.HOME,
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
                    className="p-link layout-topbar-button"
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
                    style={{ width: "250px" }}

                >
                    <ul className="p-menu-list" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '20px', margin: '0', padding: '0' }}>
                        <li className="p-menuitem" style={{ height: '50px' }}>
                            <a className="p-menuitem-link text-2xl">
                                <span className="p-menuitem-icon pi pi-home mr-2"></span>
                                <span className="p-menuitem-text">
                                    PB: {tenPhongBan}
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
                                <span className="p-menuitem-icon pi pi-lock mr-2"></span>
                                <span className="p-menuitem-text">
                                    Đổi mật khẩu
                                </span>
                            </a>
                        </li>
                    </ul>
                </OverlayPanel>

                <div style={{ cursor: "pointer" }}>
                    <button
                        type="button"
                        className="p-link layout-topbar-button"
                    >
                        <i className="pi pi-sync"></i>
                    </button>
                    <span className="uppercase">{tenDonVi}</span>
                </div>
                <Link href="/auth/login">
                    <button
                        type="button"
                        className="p-link layout-topbar-button"
                    >
                        <i className="pi pi-power-off"></i>
                        <span>Logout</span>
                    </button>
                </Link>
            </div>
        </div>
    );
});

export default AppTopbar;
