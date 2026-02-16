import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilNotes,
  cilSpeedometer,
  cilPeople,
  cilTask,
  cilCalendar,
  cilSettings
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const getNav = () => {
  const role = localStorage.getItem("role");

  return [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    },

    {
      component: CNavTitle,
      name: 'Components',
    },

    ...(role === "admin"
      ? [
          {
            component: CNavItem,
            name: 'Clients',
            to: '/clients',
            icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
          },
        ]
      : []),

    {
      component: CNavItem,
      name: 'Projects',
      to: '/projects',
      icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    },

    ...(role === "admin"
      ? [
          {
            component: CNavItem,
            name: 'Members',
            to: '/members',
            icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
          },
        ]
      : []),

    {
      component: CNavItem,
      name: 'Tasks',
      to: '/tasks',
      icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
    },

    {
      component: CNavItem,
      name: 'Deadlines',
      to: '/deadlines',
      icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
    },

    ...(role === "admin"
      ? [
          {
            component: CNavItem,
            name: 'Settings',
            to: '/settings',
            icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
          },
        ]
      : []),
  ]
}

export default getNav
