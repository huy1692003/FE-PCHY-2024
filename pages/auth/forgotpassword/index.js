import React, { useRef, useState } from 'react'
import AppConfig from '../../../layout/AppConfig'
import Head from 'next/head'
import { classNames } from 'primereact/utils'
import { LayoutContext } from '../../../layout/context/layoutcontext'
import { useMountEffect } from 'primereact/hooks';
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import styles from '../login/login.module.scss'
import { Message } from 'primereact/message';
import { Roboto } from 'next/font/google'
import Link from 'next/link'
const ForgotPassword = () => {

  const containerClassName = classNames('  flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden');

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('')

  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

  const handleEmailError = () => {
    if (!email) {
      setEmailError('Email không được để trống')
    } else if (!regex.test(email)) {
      setEmailError('Email không đúng định dạng')
    } else {
      setEmailError('')
    }
  }



  return (
    <React.Fragment>
      <Head>
        <title>Quên mật khẩu</title>
      </Head>

      <div className={containerClassName} style={{ backgroundColor: '#DDE6ED' }}>

        <div className=' p-6'>
          <div className='text-center mb-4'>
            <div>
              <img src='/demo/images/login/logologin.png' style={{ width: '200px' }} />
            </div>
            <h2 className="font-bold" style={{ fontSize: '3rem' }}>Quên mật khẩu</h2>
            <p>Vui lòng nhập email để reset mật khẩu</p>
          </div>
          <div className='p-fluid' style={{ width: '400px' }}>
            <div className='field'>
              <label>Email</label>
              <InputText type='text' placeholder='Email' className='mb-2' style={{ height: '50px', fontSize: '1.2rem' }} onChange={(e) => setEmail(e.target.value)} onBlur={handleEmailError} />
              {
                emailError && (
                  <Message severity='error' text={emailError} style={{ height: '30px' }} />

                )
              }
            </div>
            <Button label='Reset Password' className={`${styles.buttonLogin} mb-3`} onClick={handleEmailError} ></Button>
            <div className='text-center underline'>
              <Link href='/auth/login' className='underline' style={{fontSize: '1.1rem'}}><i className='pi pi-arrow-left' style={{fontSize: '10px'}}></i> Back to Login</Link>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

ForgotPassword.getLayout = function getLayout(page) {
  return (
    <React.Fragment>
      {page}
      <AppConfig simple />
    </React.Fragment>
  )
}

export default ForgotPassword
