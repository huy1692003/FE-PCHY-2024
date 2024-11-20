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

                const model = res.map(menu => ({
                    label: menu.ten_menu,
                    icon: menu.icon,
                    key: menu.id,
                    items: menu.children ? menu.children.map(child => ({
                        label: child.ten_menu,
                        icon: child.icon,
                        key: child.id,
                        command: () => handleMenuClick(child.duong_dan || '/'),
                    })) : []
                }));

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
                
                    // Cập nhật trạng thái mở rộng khi thay đổi
            />
        </MenuProvider>
    );
};

export default AppMenu;
