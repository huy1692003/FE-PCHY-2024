import React, { useContext, useState, useEffect } from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { HT_NGUOIDUNG_Service } from '../services/quantrihethong/HT_NGUOIDUNGService';

const AppMenu = () => {
    const [menu, setMenu] = useState([]);

    useEffect(() => {
        const getMenu = async () => {
            try {
                const idUser = JSON.parse(sessionStorage.getItem('user')).id;
                const res = await HT_NGUOIDUNG_Service.getMenuByIdUser(idUser);

                // Chuyển đổi dữ liệu từ API về định dạng menu
                const transformedMenu = transformMenuData(res);
                setMenu(transformedMenu);
            } catch (error) {
                console.error('Error fetching menu:', error);
            }
        };

        getMenu();
    }, []);

    // Hàm chuyển đổi dữ liệu từ API
    const transformMenuData = (data) => {
        return data.map((item) => ({
            label: item.ten_menu,
            icon: item.icon,
            to: item.duong_dan,
            items: item.children ? transformMenuData(item.children) : null,
        }));
    };

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {menu.map((item, index) => (
                    <AppMenuitem item={item} root={true} index={index} key={item.label} />
                ))}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
