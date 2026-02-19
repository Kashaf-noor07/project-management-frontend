import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="ibex Stack" rel="noopener noreferrer">
        
        </a>
        <span className="ms-1">&copy; 2025 ibexStack</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <span className="text-primary">
           
             ibexStack</span>
     
      </div>
    </CFooter>
  )
}
// okay done 

export default React.memo(AppFooter)
