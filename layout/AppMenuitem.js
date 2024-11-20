import { useRouter } from 'next/router';
import Link from 'next/link';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import React, { useEffect, useContext, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { MenuContext } from './context/menucontext';

const AppMenuitem = (props) => {
    const { activeMenu, setActiveMenu } = useContext(MenuContext);
    const router = useRouter();
    const item = props.item;
    const key = props.parentKey ? props.parentKey + '-' + props.index : String(props.index);
    const isActiveRoute = item.to && router.pathname === item.to;
    const active = activeMenu === key || activeMenu.startsWith(key + '-');

    // Xử lý sự kiện nhấp vào item menu
    const itemClick = (event) => {
        // Tránh xử lý các item bị vô hiệu hóa
        if (item.disabled) {
            event.preventDefault();
            return;
        }

        // Thực thi command
        if (item.command) {
            item.command({ originalEvent: event, item: item });
        }

        // Chuyển trạng thái mở/đóng cho menu cha
        if (item.items) {
            setActiveMenu(active ? '' : key); // Chuyển trạng thái mở/đóng menu cha
        } else {
            setActiveMenu(key); // Mở item nếu đây là một item không có mục con
        }
    };

    const subMenu = item.items && item.visible !== false && (
        <CSSTransition timeout={{ enter: 300, exit: 200 }} classNames="layout-submenu" in={active} key={item.label}>
            <ul>
                {item.items.map((child, i) => {
                    return <AppMenuitem item={child} index={i} className={child.badgeClass} parentKey={key} key={child.label} />;
                })}
            </ul>
        </CSSTransition>
    );

    return (
        <li className={classNames({ 'layout-root-menuitem': props.root, 'active-menuitem': active })}>
            {props.root && item.visible !== false && <div className="layout-menuitem-root-text">{item.label}</div>}
            {(!item.to || item.items) && item.visible !== false ? (
                <a href={item.url} onClick={(e) => itemClick(e)} className={classNames(item.class, 'p-ripple')} target={item.target} tabIndex="0">
                    <i className={classNames('layout-menuitem-icon', item.icon)}></i>
                    <span className="layout-menuitem-text">{item.label}</span>
                    {item.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                    <Ripple />
                </a>
            ) : null}

            {item.to && !item.items && item.visible !== false ? (
                <Link href={item.to} replace={item.replaceUrl} target={item.target} onClick={(e) => itemClick(e)} className={classNames(item.class, 'p-ripple', { 'active-route': isActiveRoute })} tabIndex={0}>
                    <i className={classNames('layout-menuitem-icon', item.icon)}></i>
                    <span className="layout-menuitem-text">{item.label}</span>
                    {item.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                    <Ripple />
                </Link>
            ) : null}

            {subMenu}
        </li>
    );
};

export default AppMenuitem