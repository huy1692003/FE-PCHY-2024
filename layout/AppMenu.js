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
                console.log(res )
                // Chuyển đổi dữ liệu từ API về định dạng menu
                const model = res.map(menu => ({
                    label: menu.ten_menu,
                    icon: menu.icon,
                    to: menu.duong_dan || '/',
                    items: menu.children ? menu.children.map(child => ({
                        label: child.ten_menu,
                        icon: child.icon,
                        to: child.duong_dan || '/'
                    })) : []
                }));
                
                setMenu(model);
            } catch (error) {
                console.error('Error fetching menu:', error);
            }
        };

        getMenu();
    }, []);

   
  
 
    return (
        <MenuProvider>
            <ul className="layout-menu">
                {menu.map((item, i) => {
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
