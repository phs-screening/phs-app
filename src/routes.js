import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/components/DashboardLayout';
import MainLayout from 'src/components/MainLayout';
import Account from 'src/pages/Account';
import CustomerList from 'src/pages/CustomerList';
import Dashboard from 'src/pages/Dashboard';
import Login from 'src/pages/Login';
import NotFound from 'src/pages/NotFound';
import ProductList from 'src/pages/ProductList';
import Register from 'src/pages/Register';
import Registration from 'src/pages/Registration';
import Settings from 'src/pages/Settings';
import DoctorSConsultForm from 'src/forms/DoctorSConsultForm';
import FeedbackForm from 'src/forms/FeedbackForm';
import FitForm from 'src/forms/FitForm';
import GeriAmtForm from 'src/forms/GeriAmtForm';
import GeriEbasDepForm from 'src/forms/GeriEbasDepForm';
//import GeriFrailScaleForm from 'src/forms/GeriFrailScaleForm';
import GeriGeriApptForm from 'src/forms/GeriGeriApptForm';
import GeriOtConsultForm from 'src/forms/GeriOtConsultForm';
import GeriOtQuestionnaireForm from 'src/forms/GeriOtQuestionnaireForm';
import GeriParQForm from 'src/forms/GeriParQForm';
import GeriPhysicalActivityLevelForm from 'src/forms/GeriPhysicalActivityLevelForm';
import GeriPtConsultForm from 'src/forms/GeriPtConsultForm';
import GeriSppbForm from 'src/forms/GeriSppbForm';
import GeriTugForm from 'src/forms/GeriTugForm';
import GeriVisionForm from 'src/forms/GeriVisionForm';
import HxCancerForm from 'src/forms/HxCancerForm';
import HxHcsrForm from 'src/forms/HxHcsrForm';
import HxNssForm from 'src/forms/HxNssForm';
import HxSocialForm from 'src/forms/HxSocialForm';
import PhleboForm from 'src/forms/PhleboForm';
import PreregForm from 'src/forms/PreregForm';
import RegForm from 'src/forms/RegForm';
import SocialServiceForm from 'src/forms/SocialServiceForm';
import WceForm from 'src/forms/WceForm';
import GeriTabs from './forms/Geri';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'registration', element: <Registration /> },
      { path: 'summary', element: <Account /> },
      { path: 'customers', element: <CustomerList /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'products', element: <ProductList /> },
      { path: 'settings', element: <Settings /> },
      { path: 'doctorsconsult', element: <DoctorSConsultForm /> },
      { path: 'feedback', element: <FeedbackForm /> },
      { path: 'fit', element: <FitForm /> },
      { path: 'geri', element: <GeriTabs /> },
      { path: 'prereg', element: <PreregForm /> },
      { path: 'reg', element: <RegForm /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to="/app/dashboard" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
