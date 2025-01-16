import PrimeReact from 'primereact/api';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import { RadioButton } from 'primereact/radiobutton';
import { Sidebar } from 'primereact/sidebar';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { LayoutContext } from './context/layoutcontext';

// Hàm classNames tự viết
const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ');
};

const AppConfig = (props) => {
    const [scales] = useState([12, 13, 14, 15, 16]); // Cỡ chữ
    const { layoutConfig, setLayoutConfig, layoutState, setLayoutState } = useContext(LayoutContext);

    // Chức năng mở sidebar cấu hình
    const onConfigButtonClick = useCallback(() => {
        setLayoutState((prevState) => ({ ...prevState, configSidebarVisible: true }));
    }, [setLayoutState]);

    // Chức năng đóng sidebar cấu hình
    const onConfigSidebarHide = useCallback(() => {
        setLayoutState((prevState) => ({ ...prevState, configSidebarVisible: false }));
    }, [setLayoutState]);

    // Thay đổi kiểu đầu vào
    const changeInputStyle = useCallback((e) => {
        setLayoutConfig((prevState) => ({ ...prevState, inputStyle: e.value }));
    }, [setLayoutConfig]);

    // Bật/tắt ripple effect
    const changeRipple = useCallback((e) => {
        PrimeReact.ripple = e.value;
        setLayoutConfig((prevState) => ({ ...prevState, ripple: e.value }));
    }, [setLayoutConfig]);

    // Chuyển đổi chế độ menu
    const changeMenuMode = useCallback((e) => {
        setLayoutConfig((prevState) => ({ ...prevState, menuMode: e.value }));
    }, [setLayoutConfig]);

    // Thay đổi giao diện sáng/tối
    const changeTheme = useCallback((theme, colorScheme) => {
        PrimeReact.changeTheme(layoutConfig.theme, theme, 'theme-css', () => {
            setLayoutConfig((prevState) => ({ ...prevState, theme, colorScheme }));
        });
    }, [layoutConfig.theme, setLayoutConfig]);

    // Phóng to chữ
    const incrementScale = useCallback(() => {
        setLayoutConfig((prevState) => ({ ...prevState, scale: prevState.scale + 1 }));
    }, [setLayoutConfig]);

    // Thu nhỏ chữ
    const decrementScale = useCallback(() => {
        setLayoutConfig((prevState) => ({ ...prevState, scale: prevState.scale - 1 }));
    }, [setLayoutConfig]);

    // Áp dụng cỡ chữ mới
    const applyScale = useCallback(() => {
        document.documentElement.style.fontSize = layoutConfig.scale + 'px';
    }, [layoutConfig.scale]);

    useEffect(() => {
        applyScale();
    }, [applyScale]);

    return (
        <>
            <button className="layout-config-button p-link" type="button" onClick={onConfigButtonClick}>
                <i className="pi pi-cog"></i>
            </button>

            <Sidebar visible={layoutState.configSidebarVisible} onHide={onConfigSidebarHide} position="right" className="layout-config-sidebar w-20rem">
                <h5>Chế độ giao diện</h5>
                <div className="flex align-items-center">
                    <label className="mr-2">Chế độ sáng/tối</label>
                    <InputSwitch checked={layoutConfig.theme.includes('dark')} onChange={(e) => changeTheme(e.value ? 'md-dark-indigo' : 'md-light-indigo', e.value ? 'dark' : 'light')} />
                </div>

                <h5>Scale (Cỡ chữ)</h5>
                <div className="flex align-items-center">
                    <Button icon="pi pi-minus" type="button" onClick={decrementScale} rounded text className="w-2rem h-2rem mr-2" disabled={layoutConfig.scale === scales[0]}></Button>
                    <div className="flex gap-2 align-items-center">
                        {scales.map((item) => (
                            <i
                                className={classNames('pi pi-circle-fill', { 'text-primary-500': item === layoutConfig.scale, 'text-300': item !== layoutConfig.scale })}
                                key={item}
                            ></i>
                        ))}
                    </div>
                    <Button icon="pi pi-plus" type="button" onClick={incrementScale} rounded text className="w-2rem h-2rem ml-2" disabled={layoutConfig.scale === scales[scales.length - 1]}></Button>
                </div>

                <h5>Mở rộng màn hình</h5>
                <div className="flex">
                    <div className="field-radiobutton flex-1">
                        <RadioButton name="menuMode" value={'static'} checked={layoutConfig.menuMode === 'static'} onChange={(e) => changeMenuMode(e)} inputId="mode1"></RadioButton>
                        <label htmlFor="mode1">Đóng</label>
                    </div>
                    <div className="field-radiobutton flex-1">
                        <RadioButton name="menuMode" value={'overlay'} checked={layoutConfig.menuMode === 'overlay'} onChange={(e) => changeMenuMode(e)} inputId="mode2"></RadioButton>
                        <label htmlFor="mode2">Mở</label>
                    </div>
                </div>

                <h5>Input Style</h5>
                <div className="flex">
                    <div className="field-radiobutton flex-1">
                        <RadioButton name="inputStyle" value={'outlined'} checked={layoutConfig.inputStyle === 'outlined'} onChange={(e) => changeInputStyle(e)} inputId="outlined_input"></RadioButton>
                        <label htmlFor="outlined_input">Outlined</label>
                    </div>
                    <div className="field-radiobutton flex-1">
                        <RadioButton name="inputStyle" value={'filled'} checked={layoutConfig.inputStyle === 'filled'} onChange={(e) => changeInputStyle(e)} inputId="filled_input"></RadioButton>
                        <label htmlFor="filled_input">Filled</label>
                    </div>
                </div>

                <h5>Ripple Effect</h5>
                <InputSwitch checked={layoutConfig.ripple} onChange={(e) => changeRipple(e)}></InputSwitch>
            </Sidebar>
        </>
    );
};

export default AppConfig;
