import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'

import axios from 'axios'
import { AppSidebarNav } from './AppSidebarNav'
import getNav from '../_nav'


const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const [settings, setSettings] = useState(null)
  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchSettings()
  }, [])
  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token')
      const { data } = await axios.get(`${API_URL}/setting/fetch-setting`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setSettings(data.data)
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/" className="d-flex align-items-center justify-content-center">
          <img
            src={settings?.sidebarLogo ? `${API_URL}/${settings.sidebarLogo}` : '/default-logo.png'}
            alt="Logo"
            style={{ height: '40px', width: '220px' }}
          />
        </CSidebarBrand>

        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

     <AppSidebarNav items={getNav()} />


      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
