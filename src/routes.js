import { Navigate } from 'react-router-dom'
import DashboardLayout from 'src/components/DashboardLayout'
import MainLayout from 'src/components/MainLayout'
import Account from 'src/pages/Account'
import CustomerList from 'src/pages/CustomerList'
import Dashboard from 'src/pages/Dashboard'
import Login from 'src/pages/Login'
import Reset from 'src/pages/Reset'
import NotFound from 'src/pages/NotFound'
import Register from 'src/pages/Register'
import Registration from 'src/pages/Registration'
import Settings from 'src/pages/Settings'
import DoctorSConsultForm from 'src/forms/DoctorSConsultForm'
import DietitiansConsultForm from 'src/forms/DietitiansConsultForm'
import OralHealthForm from 'src/forms/OralHealthForm'
import FitForm from 'src/forms/FitForm'
import PhleboForm from 'src/forms/PhleboForm'
import PreregForm from 'src/forms/PreregForm'
import RegForm from 'src/forms/RegForm'
import SocialServiceForm from 'src/forms/SocialServiceForm'
import OverviewForm from 'src/forms/OverviewForm'
import WceForm from 'src/forms/WceForm'
import GeriTabs from './forms/Geri'
import HxTabs from './forms/HistoryTaking'
import ManageVolunteers from 'src/pages/ManageVolunteers'
import Edit from 'src/pages/EditForms'
import SummaryForm from 'src/forms/SummaryForm'
import React from 'react'

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'registration', element: <Registration /> },
      { path: 'customers', element: <CustomerList /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'settings', element: <Settings /> },
      { path: 'doctorsconsult', element: <DoctorSConsultForm /> },
      { path: 'summary', element: <SummaryForm /> },
      { path: 'fit', element: <FitForm /> },
      { path: 'geri', element: <GeriTabs /> },
      { path: 'hxtaking', element: <HxTabs /> },
      { path: 'phlebo', element: <PhleboForm /> },
      { path: 'prereg', element: <PreregForm /> },
      { path: 'reg', element: <RegForm /> },
      { path: 'dietitiansconsultation', element: <DietitiansConsultForm /> },
      { path: 'socialservice', element: <SocialServiceForm /> },
      { path: 'oralhealth', element: <OralHealthForm /> },
      { path: 'overview', element: <OverviewForm /> },
      { path: 'manage', element: <ManageVolunteers /> },
      { path: 'edit', element: <Edit /> },
      { path: 'wce', element: <WceForm /> },
      { path: '*', element: <Navigate to='/404' /> },
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'reset', element: <Reset /> },
      { path: 'register', element: <Register /> },
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to='/login' /> },
      { path: '*', element: <Navigate to='/404' /> },
    ],
  },
]

export default routes
