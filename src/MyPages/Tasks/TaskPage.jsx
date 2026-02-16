import React from 'react'
import TaskTable from './TaskTable'
import { useState } from 'react'
import { CButton, CFormInput, CInputGroup, CInputGroupText } from '@coreui/react'

import { Link } from 'react-router-dom'
import { FaPlusCircle } from 'react-icons/fa'
import OverDueTaskChart from './OverDueTaskChart'
import TaskStatusChart from './TaskStatusChart'
import { cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
function TaskPage() {
  const [searchTerm, setSearchTerm] = useState('')
const role = localStorage.getItem ("role")
  return (
    <div>
      <div className="m-2 d-flex gap-2">
        <div>
          <TaskStatusChart />
        </div>
        <div>
          <OverDueTaskChart />
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Task List</h2>

        <div className="d-flex align-items-center gap-2">
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '250px', height: '35px' }}
            />
          </CInputGroup>
 {role === "admin" && (
    <Link to="/tasks/add-tasks">
         <CButton
  color="primary"
  size="md"
  className="d-flex align-items-center gap-2 px-3 py-2 text-nowrap"
  
>
 
  <FaPlusCircle size={10} />
  <span className="small">Add Task</span>
</CButton>

          </Link>
  )}
          
        </div>
      </div>

      <div className="mt-4">
        <TaskTable searchTerm={searchTerm} />
      </div>
    </div>
  )
}

export default TaskPage
