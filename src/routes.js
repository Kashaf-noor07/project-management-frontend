import React from 'react'
import PrivateRoute from './Routes/PrivateRoute'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Clients = React.lazy(() => import('./MyPages/Clients/ClientPage'))
const AddClientForm = React.lazy(() => import('./MyPages/Clients/AddClientForm'))
const ClientDetailsPage = React.lazy(() => import('./MyPages/Clients/ClientDetailsPage'))
const Projects = React.lazy(() => import('./MyPages/Projects/ProjectPage'))
const AddProjectsForm = React.lazy(() => import('./MyPages/Projects/AddProjectForm'))
const Tasks = React.lazy(() => import('./MyPages/Tasks/TaskPage'))
const AddTaskForm = React.lazy(() => import('./MyPages/Tasks/AddTaskForm'))
const Members = React.lazy(() => import('./MyPages/Members/MembersPage'))
const MemberStatCharts = React.lazy(() => import('./MyPages/Members/MemberTaskStatCharts'))
const Profile = React.lazy(() => import('./MyPages/Profile/ProfilePage'))
const Deadline = React.lazy(() => import('./MyPages/Tasks/TaskDeadlinePage'))
const Settings = React.lazy(() => import('./MyPages/Settings/SettingPage'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard',  element: () => (
      <PrivateRoute allowedRoles={['admin', 'member']}>
     < Dashboard/>
      </PrivateRoute>
    ),},

  {
    path: '/clients',
    name: 'Clients',
    element: () => (
      <PrivateRoute allowedRoles={['admin']}>
        <Clients />
      </PrivateRoute>
    ),
  },

  { path: '/clients/add-clients', name: 'Add Clients', element: AddClientForm },
  { path: '/clients/client-details', name: 'Client Details', element: ClientDetailsPage },

  { path: '/projects', name: 'Projects', element: Projects },
  { path: '/projects/add-projects', name: 'Add Projects', element: AddProjectsForm },

  { path: '/tasks', name: 'Tasks', element: Tasks },
  { path: '/tasks/add-tasks', name: 'Add Tasks', element: AddTaskForm },
  { path: '/deadlines', name: 'Deadlines', element: Deadline },

  { path: '/members', name: 'Members',  element: () => (
      <PrivateRoute allowedRoles={['admin']}>
       <Members/>
      </PrivateRoute>
    ), },
  { path: '/member-stats/:id', name: 'Members Stat', element: MemberStatCharts },

  { path: '/profile', name: 'Profile', element: Profile },
  { path: '/settings', name: 'Settings',element: () => (
      <PrivateRoute allowedRoles={['admin']}>
     <Settings/>
      </PrivateRoute>
    ), },
]

export default routes
