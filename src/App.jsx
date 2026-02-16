import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

import { SettingsProvider } from './Context/SettingContext'
import PrivateRoute from './Routes/PrivateRoute'
import PublicRoute from './Routes/PublicRoute'
// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const ForgetPassword = React.lazy(() => import('./views/pages/login/ForgetPassword'))
const ResetPassword = React.lazy(() => import('./views/pages/login/ResetPassword'))

const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const Page403 = React.lazy(() => import('./views/pages/page403/Page403'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, [])

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div>
        <SettingsProvider>
          <HashRouter>
            <Suspense
              fallback={
                <div className="pt-3 text-center">
                  <CSpinner color="primary" variant="grow" />
                </div>
              }
            >
              <Routes>
                {/* Public routes */}
                <Route
                  path="/login"
                  name="Login Page"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  name="Register Page"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />
                <Route path="/404" name="Page 404" element={<Page404 />} />
                <Route path="/403" name="Page 403" element={<Page403 />} />
                <Route path="/500" name="Page 500" element={<Page500 />} />
                <Route
                  path="/forget-password"
                  name="Forget Password"
                  element={<ForgetPassword />}
                />
                <Route
                  path="/reset-password/:token"
                  name="Reset Password"
                  element={<ResetPassword />}
                />
                <Route path="/500" name="Page 500" element={<Page500 />} />

                <Route
                  path="*"
                  name="Home"
                  element={
                    <PrivateRoute>
                      <DefaultLayout />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Suspense>
          </HashRouter>
        </SettingsProvider>
      </div>
    </>
  )
}

export default App
