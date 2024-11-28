import { useRouter } from 'next/router';
import React, { useContext, useRef, useState } from 'react';
import AppConfig from '../../../layout/AppConfig';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import styles from './login.module.scss'
import { Message } from 'primereact/message';
import { login_HT_NGUOIDUNG } from '../../../services/quantrihethong/HT_NGUOIDUNGService';
import Head from 'next/head';
import { Toast } from 'primereact/toast';
import Link from 'next/link';

const LoginPage = () => {
    const currentYear = new Date().getFullYear()
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const { layoutConfig } = useContext(LayoutContext);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const containerClassName = classNames('flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const [username, setUsername] = useState('')
    const toast = useRef(null);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const data = { ten_dang_nhap: username, mat_khau: password }
            const response = await login_HT_NGUOIDUNG(data)
            if (response) {
                console.log(response)
                let ds_donvi = response.user.ds_donvi.map(s => ({ ten: s.ten, ma_dviqly: s.ma_dviqly }))
                sessionStorage.setItem('ds_donvi', JSON.stringify(ds_donvi))
                sessionStorage.setItem('user', JSON.stringify(response.user));
                sessionStorage.setItem('token', response.user.token);
                toast.current.show({ severity: 'success', summary: 'Thông báo', detail: 'Đăng nhập thành công', life: 3000 })
                router.push('/')
            }
        } catch (error) {
            console.log(error);
            toast.current.show({ severity: 'error', summary: 'Đăng nhập thất bại', detail: 'Thông tin tài khoản hoặc mật khẩu không chính xác!', life: 4000 })
        } finally {
            setLoading(false);
        }
    }

    const handleUsernameError = () => {
        if (!username) {
            setUsernameError('Tên đăng nhập không được để trống')
        } else {
            setUsernameError('')
        }
    }

    const handlePasswordError = () => {
        if (!password) {
            setPasswordError('Mật khẩu không được để trống')
        } else {
            setPasswordError('')
        }
    }

    return (
        <React.Fragment>
            <Head>
                <title>Đăng nhập - Phần mềm quản lý kìm chì</title>
            </Head>
            <Toast ref={toast} />
            <div className={containerClassName}  style={{ backgroundColor: 'white' }}>
                <div className="w-11 " style={{ backgroundColor: 'white' }}>
                    <div className="grid">
                        <div className="col-12 md:col-6 relative z-5 ">
                            <div className="pb-5">
                                <div className="row">
                                    <img src='/demo/images/login/logologin.png' className="w-4" />
                                </div>
                            </div>
                            <div className='hidden md:block' style={{
                                height: '75vh',
                                backgroundImage: "url('/demo/images/login/bg.jpg')",
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}>
                            </div>
                        </div>
                        <div className="col-12 md:col-6 p-4">
                            <div className="mb-8">
                                <div className="text-center">
                                    <h3 className="page-title uppercase" style={{ color: '#1445a7' }}>hệ thống phần mềm pchungyen.vn</h3>
                                </div>
                                <div className="flex flex-wrap px-3 mb-4 mx-minus-2">
                                    <div className="h-1rem w-5 bg-gray-200 mt-2"></div>
                                    <small className="w-1 font-bold text-center">o0o</small>
                                    <div className="h-1rem w-5 bg-gray-200 mt-2"></div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="username" className="block text-900 text-xl font-medium mb-2">
                                    Tên đăng nhập
                                </label>
                                <InputText inputid="username" value={username} type="text" placeholder="Tài khoản" className="w-full mb-2 p-3" onChange={(e) => setUsername(e.target.value)} onBlur={handleUsernameError} />
                                {
                                    usernameError && (
                                        <Message severity='error' text={usernameError} className='mb-5 w-full' />
                                    )
                                }
                            </div>

                            <label htmlFor="password" className="block text-900 font-medium text-xl mb-2">
                                Mật khẩu
                            </label>
                            <Password inputid="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu" toggleMask feedback={false} className="w-full mb-2" inputClassName="w-full p-3" onBlur={handlePasswordError}></Password>
                            {
                                passwordError && (
                                    <Message severity='error' text={passwordError} className='mb-4 w-full' />
                                )
                            }

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputid="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme1">Lưu mật khẩu</label>
                                </div>
                                <Link className="font-medium no-underline ml-2 text-right cursor-pointer hover:text-blue-700" href='/auth/forgotpassword'>
                                    Quên mật khẩu
                                </Link>
                            </div>
                            <div className="text-center">
                                <Button loading={loading} label="Đăng nhập" className="w-5 h-3rem shadow-6 bg-blue-700 hover:bg-blue-700 hover:opacity-80" onClick={handleLogin}></Button>
                            </div>
                        </div>
                    </div>
                    <div className="text-center py-4 bg-indigo-900">
                        <div className="text-center text-white">
                            <small className="text-center text-lg lg:text-xl">Copyright © {currentYear} <span className="font-bold text-base lg:text-xl">Công ty Điện lực Hưng Yên</span></small>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default LoginPage;