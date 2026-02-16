import React from 'react'
import { useState } from 'react'
import MemberTable from './MemberTable'
import { cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CInputGroup,CInputGroupText,CFormInput} from "@coreui/react";
function MembersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  return (
<div>
 
 <div>
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h2 className="mb-0">Members List</h2>

      <div className="d-flex align-items-center gap-2">
            <CInputGroup>
              <CInputGroupText>
                <CIcon icon={cilSearch} />
              </CInputGroupText>
              <CFormInput
                type="text"
                placeholder="Search Mmebers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '250px', height: '35px' }}
              />
            </CInputGroup>
  </div>
  </div>

  <div className="mt-4">
<MemberTable  searchTerm={searchTerm}/>
  </div>
</div>
</div>

   

  )
}

export default MembersPage