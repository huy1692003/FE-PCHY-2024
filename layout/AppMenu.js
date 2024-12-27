import React, { useState, useEffect } from 'react';
import { PanelMenu } from 'primereact/panelmenu';
import { useRouter } from 'next/router';
import { MenuProvider } from './context/menucontext';
import { HT_NGUOIDUNG_Service } from '../services/quantrihethong/HT_NGUOIDUNGService';

const AppMenu = () => {
    const [menu, setMenu] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const getMenu = async () => {
            try {
                const idUser = JSON.parse(sessionStorage.getItem('user')).id;
                const res = await HT_NGUOIDUNG_Service.getMenuByIdUser(idUser);
                console.log('menu:', res);

                // Hàm đệ quy để tạo cấu trúc menu nhiều cấp
                const buildMenuModel = (menuItems) => {
                    return menuItems.map(menu => {
                        // Kiểm tra xem menu có children hay không
                        const hasChildren = menu.children && menu.children.length > 0;

                        return {
                            label: menu.ten_menu,
                            icon: menu.icon,
                            key: menu.id,
                            items: hasChildren ? buildMenuModel(
                                menu.children.sort((a, b) => a.ten_menu.localeCompare(b.ten_menu))
                            ) : null,
                            command: menu.duong_dan ? () => handleMenuClick(menu.duong_dan) : undefined,
                            // Nếu không có children, không cần thêm items
                            className: !hasChildren ? 'menu-item-no-children' : '' // Thêm class để dễ dàng tùy chỉnh CSS nếu cần
                        };
                    });
                };

                const model = buildMenuModel(res);

                setMenu(model);
            } catch (error) {
                console.error('Lỗi khi lấy menu:', error);
            }
        };

        getMenu();
    }, []);

    const handleMenuClick = (url) => {
        router.push(url);
    };

    return (
        <MenuProvider>
            <PanelMenu
                model={menu}
                multiple // Cho phép mở nhiều cấp cùng lúc
            />
        </MenuProvider>
    );
};

export default AppMenu;
