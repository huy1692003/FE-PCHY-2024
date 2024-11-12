import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { PrimeIcons } from 'primereact/api'

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model = [
        {
            label: 'Trang chủ',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Quản trị hệ thống',
            items: [
                // {
                //     label: 'Nhóm người dùng',
                //     icon: 'pi pi-users',
                //     to: '/quantrihethong/quyen_nguoidung',

                // },
                {
                    label: 'Đơn vị',
                    icon: 'pi pi-user',
                    to: '/quantrihethong/donvi'

                },
                {
                    label: 'Menu',
                    icon: 'pi pi-user',
                    to: '/quantrihethong/menu'

                },
                // {
                //     label: 'Chức vụ',
                //     icon: 'pi pi-user'
                // },
                {
                    label: 'Phòng ban',
                    icon: 'pi pi-user',
                    to: '/quantrihethong/phongban'
                },
                {
                    label: 'Người dùng',
                    icon: 'pi pi-list',
                    to: '/quantrihethong/nguoidung'
                },
                {
                    label: 'Vai trò',
                    icon: 'pi pi-user',
                    to: '/quantrihethong/vaitro'
                }
            ]
        },
        {
            label: 'Cá nhân',
            icon: 'pi pi-fw pi-briefcase',
            to: '/pages',
            items: [
                {
                    label: 'Tài khoản',
                    icon: 'pi pi-cog',
                }
            ]
        },

    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}

                {/* <Link href="https://blocks.primereact.org" target="_blank" style={{ cursor: 'pointer' }}>
                    <img alt="Prime Blocks" className="w-full mt-3" src={`/layout/images/banner-primeblocks${layoutConfig.colorScheme === 'light' ? '' : '-dark'}.png`} />
                </Link> */}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
