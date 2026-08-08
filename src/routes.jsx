import React, { lazy, Suspense } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { Navigate } from 'react-router-dom'
import AdminRoute from 'src/components/AdminRoute'
import DashboardLayout from 'src/components/DashboardLayout'
import DefaultRoute from 'src/components/DefaultRoute'
import GuestOnlyRoute from 'src/components/GuestOnlyRoute'
import MainLayout from 'src/components/MainLayout'
import ProtectedRoute from 'src/components/ProtectedRoute'

const Queue = lazy(() => import('./pages/Queue'))
const Dashboard = lazy(() => import('src/pages/Dashboard'))
const EventDashboard = lazy(() => import('src/pages/EventDashboard'))
const Login = lazy(() => import('src/pages/Login'))
const NotFound = lazy(() => import('src/pages/NotFound'))
const Registration = lazy(() => import('src/pages/Registration'))
const Settings = lazy(() => import('src/pages/Settings'))
const DoctorsConsultForm = lazy(() => import('src/forms/DoctorsConsultForm'))
const DietitiansConsultForm = lazy(() => import('src/forms/DietitiansConsultForm'))
const OralHealthForm = lazy(() => import('src/forms/OralHealthForm'))
const RegForm = lazy(() => import('src/forms/RegForm'))
const TriageForm = lazy(() => import('src/forms/TriageForm'))
const SocialServiceForm = lazy(() => import('src/forms/SocialServiceForm'))
const HxTabs = lazy(() => import('./forms/HistoryTakingTabs/HistoryTaking'))
const ManageVolunteers = lazy(() => import('src/pages/ManageVolunteers'))
const DoctorAdmin = lazy(() => import('src/pages/DoctorAdmin'))
const FormAAdmin = lazy(() => import('src/pages/FormAAdmin'))
const SummaryForm = lazy(() => import('src/forms/SummaryForm'))
const HsgForm = lazy(() => import('./forms/HsgForm'))
const Cancer365Form = lazy(() => import('./forms/Cancer365Form'))
const LungFnForm = lazy(() => import('./forms/LungFnForm'))
const OsteoForm = lazy(() => import('./forms/OsteoForm'))
const MentalHealthForm = lazy(() => import('./forms/MentalHealthTabs/MentalHealthMain'))
const ArthritisForm = lazy(() => import('./forms/ArthritisForm'))
const LtfuForm = lazy(() => import('./forms/LtfuForm'))
const HpvForm = lazy(() => import('./forms/HpvForm'))
const VaccineForm = lazy(() => import('./forms/VaccineForm'))
const WceTabs = lazy(() => import('./forms/WceTabs/WceMain'))
const AudiometryForm = lazy(() => import('./forms/AudiometryForm'))
const OphthalForm = lazy(() => import('./forms/OphthalForm'))
const GeriMobilityTabs = lazy(() => import('./forms/GeriMobilityTabs/GeriMobility'))
const GeriCognitiveTabs = lazy(() => import('./forms/GeriCognitiveTabs/GeriCognitive'))
const MammobusForm = lazy(() => import('./forms/MammobusForm'))
const PodiatryForm = lazy(() => import('./forms/PodiatryForm'))
const FitForm = lazy(() => import('./forms/FitForm'))
const ScoliosisForm = lazy(() => import('./forms/ScoliosisForm'))
const Eligibility = lazy(() => import('./pages/Eligibility'))

const loadable = (Component) => (
  <Suspense fallback={<CircularProgress />}>
    <Component />
  </Suspense>
)

const routes = [
  {
    path: 'app',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to='registration' replace /> },
      { path: 'registration', element: loadable(Registration) },
      { path: 'dashboard', element: loadable(Dashboard) },
      { path: 'event-dashboard', element: loadable(EventDashboard) },
      { path: 'settings', element: loadable(Settings) },
      { path: 'doctorsconsult', element: loadable(DoctorsConsultForm) },
      { path: 'summary', element: loadable(SummaryForm) },
      { path: 'ltfu', element: loadable(LtfuForm) },
      { path: 'lungfn', element: loadable(LungFnForm) },
      { path: 'gerimobility', element: loadable(GeriMobilityTabs) },
      { path: 'hxtaking', element: loadable(HxTabs) },
      { path: 'reg', element: loadable(RegForm) },
      { path: 'vax', element: loadable(VaccineForm) },
      { path: 'hsg', element: loadable(HsgForm) },
      { path: 'cancer365', element: loadable(Cancer365Form) },
      { path: 'fit', element: loadable(FitForm) },
      { path: 'audio', element: loadable(AudiometryForm) },
      { path: 'ophthal', element: loadable(OphthalForm) },
      { path: 'scoliosis', element: loadable(ScoliosisForm) },
      { path: 'gericog', element: loadable(GeriCognitiveTabs) },
      { path: 'triage', element: loadable(TriageForm) },
      { path: 'osteoporosis', element: loadable(OsteoForm) },
      { path: 'dietitiansconsultation', element: loadable(DietitiansConsultForm) },
      { path: 'socialservice', element: loadable(SocialServiceForm) },
      { path: 'mentalhealth', element: loadable(MentalHealthForm) },
      { path: 'arthritis', element: loadable(ArthritisForm) },
      { path: 'oralhealth', element: loadable(OralHealthForm) },
      { path: 'hpv', element: loadable(HpvForm) },
      {
        path: 'manage',
        element: (
          <AdminRoute>
            {loadable(ManageVolunteers)}
          </AdminRoute>
        ),
      },
      { path: 'wce', element: loadable(WceTabs) },
      { path: 'queue', element: loadable(Queue) },
      { path: 'eligibility', element: loadable(Eligibility) },
      { path: '*', element: <Navigate to='/404' /> },
      { path: 'docadmin', element: loadable(DoctorAdmin) },
      { path: 'mammobus', element: loadable(MammobusForm) },
      { path: 'podiatry', element: loadable(PodiatryForm) },
      { path: 'formAadmin', element: loadable(FormAAdmin) },
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'login',
        element: (
          <GuestOnlyRoute>
            {loadable(Login)}
          </GuestOnlyRoute>
        ),
      },
      { path: '404', element: loadable(NotFound) },
      { path: '/', element: <DefaultRoute /> },
      { path: '*', element: <Navigate to='/404' /> },
    ],
  },
]

export default routes
