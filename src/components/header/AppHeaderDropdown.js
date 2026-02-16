import React from 'react'
import {
  CAvatar,

  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
 
  cilAccountLogout,

  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'


import { useNavigate } from 'react-router-dom'

const AppHeaderDropdown = () => {
      const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem('token')
     localStorage.removeItem("user"); 
     localStorage.removeItem("id"); 
     localStorage.removeItem("userId"); 
     localStorage.removeItem("name"); 
     localStorage.removeItem("role"); 
  
   navigate("/login")
  }
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        
        <CAvatar src="https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg?semt=ais_hybrid&w=740&q=80" size="md" className="border border-2 border-primary"
            shape="rounded-circle" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
        
        
        
       
<CDropdownItem onClick={() => navigate('/')}>
  <CIcon icon={cilUser} className="me-2" />
  Profile
</CDropdownItem>
       
        
       
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogout}
          className="pointer-cursor" >
          <CIcon icon={cilAccountLogout} className="me-2" />
         Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
