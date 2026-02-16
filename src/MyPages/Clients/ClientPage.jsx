import React, { useState } from 'react'
import ClientTable from './ClientTable'
import { CButton, CFormInput, CInputGroup, CInputGroupText } from '@coreui/react'
import { Link } from 'react-router-dom'
import { FaPlusCircle } from 'react-icons/fa'
import { cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
function ClientPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Client List</h2>

        <div className="d-flex align-items-center gap-2">
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '150px', height: '35px' }}
            />
          </CInputGroup>

          {/* ➕ Add Button */}
          <Link to="/clients/add-clients">
            <CButton color="primary" className="d-flex align-items-center gap-2 text-nowrap">
              <FaPlusCircle size={14} />
              <span className="small">Add Client</span>
            </CButton>
          </Link>
        </div>
      </div>

      <div className="mt-4">
        <ClientTable searchTerm={searchTerm} />
      </div>
    </div>
  )
}

export default ClientPage
