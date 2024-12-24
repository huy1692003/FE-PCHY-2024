import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEventListener, useMountEffect, useUnmountEffect } from 'primereact/hooks';
import { classNames, DomHandler } from 'primereact/utils';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AppFooter from './AppFooter';
import AppSidebar from './AppSidebar';
import AppTopbar from './AppTopbar';
import AppConfig from './AppConfig';
import { LayoutContext } from './context/layoutcontext';
import PrimeReact from 'primereact/api';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { locale, addLocale, updateLocaleOption, updateLocaleOptions, localeOption, localeOptions } from 'primereact/api';
import vi from '../constants/local';
        
addLocale('vi', vi);


locale('vi');
const Layout = (props) => {
    const { layoutConfig, layoutState, setLayoutState } = useContext(LayoutContext);
    const topbarRef = useRef(null);
    const sidebarRef = useRef(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const router = useRouter();
    const [bindMenuOutsideClickListener, unbindMenuOutsideClickListener] = useEventListener({
        type: 'click',
        listener: (event) => {
            const isOutsideClicked = !(sidebarRef.current.isSameNode(event.target) || sidebarRef.current.contains(event.target) || topbarRef.current.menubutton.isSameNode(event.target) || topbarRef.current.menubutton.contains(event.target));

            if (isOutsideClicked) {
                hideMenu();
            }
        }
    });

    const [bindProfileMenuOutsideClickListener, unbindProfileMenuOutsideClickListener] = useEventListener({
        type: 'click',
        listener: (event) => {
            const isOutsideClicked = !(
                topbarRef.current.topbarmenu.isSameNode(event.target) ||
                topbarRef.current.topbarmenu.contains(event.target) ||
                topbarRef.current.topbarmenubutton.isSameNode(event.target) ||
                topbarRef.current.topbarmenubutton.contains(event.target)
            );

            if (isOutsideClicked) {
                hideProfileMenu();
            }
        }
    });

    const hideMenu = () => {
        setLayoutState((prevLayoutState) => ({ ...prevLayoutState, overlayMenuActive: false, staticMenuMobileActive: false, menuHoverActive: false }));
        unbindMenuOutsideClickListener();
        unblockBodyScroll();
    };

    const hideProfileMenu = () => {
        setLayoutState((prevLayoutState) => ({ ...prevLayoutState, profileSidebarVisible: false }));
        unbindProfileMenuOutsideClickListener();
    };

    const blockBodyScroll = () => {
        DomHandler.addClass('blocked-scroll');
    };

    const unblockBodyScroll = () => {
        DomHandler.removeClass('blocked-scroll');
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.pageYOffset > window.innerHeight);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useMountEffect(() => {
        PrimeReact.ripple = true;
    });

    useEffect(() => {
        if (layoutState.overlayMenuActive || layoutState.staticMenuMobileActive) {
            bindMenuOutsideClickListener();
        }

        layoutState.staticMenuMobileActive && blockBodyScroll();
    }, [layoutState.overlayMenuActive, layoutState.staticMenuMobileActive]);

    useEffect(() => {
        if (layoutState.profileSidebarVisible) {
            bindProfileMenuOutsideClickListener();
        }
    }, [layoutState.profileSidebarVisible]);

    useEffect(() => {
        router.events.on('routeChangeComplete', () => {
            hideMenu();
            hideProfileMenu();
        });
    }, []);

    useUnmountEffect(() => {
        unbindMenuOutsideClickListener();
        unbindProfileMenuOutsideClickListener();
    });


    useEffect(() => {
        const isAuthenticated = !!sessionStorage.getItem('token');
        setIsLoggedIn(isAuthenticated);
    }, []);

    useEffect(() => {
        const isAuthenticated = !!sessionStorage.getItem('token');

        if (!isAuthenticated) {
            router.replace('/auth/login');
        }
    }, [router]);

    const containerClass = classNames('layout-wrapper', {
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive,
        'p-input-filled': layoutConfig.inputStyle === 'filled',
        'p-ripple-disabled': !layoutConfig.ripple
    });

    return (
        isLoggedIn ? (
            <React.Fragment>
                <Head>
                    <title>Phần mềm PCHY- PCHY</title>
                    <meta charSet="UTF-8" />
                    <meta name="description" content="The ultimate collection of design-agnostic, flexible and accessible React UI Components." />
                    <meta name="robots" content="index, follow" />
                    <meta name="viewport" content="initial-scale=1, width=device-width" />
                    <meta property="og:type" content="website"></meta>
                    <meta property="og:title" content="Sakai by PrimeReact | Free Admin Template for NextJS"></meta>
                    <meta property="og:url" content="https://www.primefaces.org/sakai-react"></meta>
                    <meta property="og:description" content="The ultimate collection of design-agnostic, flexible and accessible React UI Components." />
                    <meta property="og:image" content="https://www.primefaces.org/static/social/sakai-nextjs.png"></meta>
                    <meta property="og:ttl" content="604800"></meta>
                    <link rel='icon' href='/demo/images/login/Logo.ico' sizes='any'></link>
                </Head>

                <div className={containerClass}>
                    <AppTopbar ref={topbarRef} />
                    <div ref={sidebarRef} className="layout-sidebar">
                        <AppSidebar />
                    </div>
                    <div className="layout-main-container">
                        <div className="layout-main">{props.children}</div>
                        <AppFooter />
                    </div>
                    <AppConfig />
                    <div className="layout-mask"></div>
                    {showScrollTop && (
                        <Button 
                            tooltip='Lên đầu trang'
                            tooltipOptions={{
                                showDelay: 1000,
                                hideDelay: 300,
                                position: 'left'
                            }}
                            icon="pi pi-angle-up" 
                            onClick={scrollToTop}
                            style={{
                                position: 'fixed',
                                bottom: '20px',
                                right: '20px',
                                zIndex: 1000,
                                backgroundColor: '#1445A7',
                            }}
                            
                           
                            severity="secondary"
                        />
                    )}
                </div>
            </React.Fragment>
        ) : "Không có quyền truy cập !!"
    );
};

export default Layout;
