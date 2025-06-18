import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import SearchPage from './components/SearchPage/SearchPage';
import AddProperty from './components/AddProperty/AddProperty';
import LocationForm from './components/AdminPages/LocationForm/LocationForm';
import StartPage from './components/StartPage/StartPage';
import StartRegister from './components/StartRegister/StartRegister';
import RegisterOwner from './components/RegisterOwner/RegisterOwner';
import RegisterTenant from './components/RegisterTenant/RegisterTenant';
import LoginPage from './components/LoginPage/LoginPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import RegisterAdmin from './components/AdminPages/RegisterAdmin/RegisterAdmin';
import TenantPage from './components/TenantPage/TenantPage';
import PropertyDetails from './components/PropertyDetails/PropertyDetails';
import AdminPage from './components/AdminPages/AdminPage/AdminPage';
import EmailVerification from './components/EmailVerification/EmailVerification';
function App() {
  return (
          <Routes>
            <Route path="/" element={<StartPage />} />
            {/* <Route path="/property" element={<Property />} />  */}
            {/* <Route path="/editproperty" element={<EditProperty />} />  */}
            {/* <Route path="/bookingrequests" element={<BookingRequests />} />  */}
            {/* <Route path="/tourrequests" element={<TourRequests />} />  */}
            {/* <Route path="/logout" element={<Property />} />  */}
            <Route path="/search" element={<SearchPage />} />
            {/* <Route path="/tenant-login" element={<TenantLogin />} /> */}
            {/* <Route path="/tenantsignup" element={<TenantSignUp />} /> */}
            <Route path="/home" element={<Home />} />
            {/* <Route path="/sidenav" element={<SideNav />} /> */}
            <Route path="/startregister" element={<StartRegister />} />
            <Route path="/registerowner" element={<RegisterOwner/>} />
            <Route path="/registertenant" element={<RegisterTenant/>} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/profile" element={<ProfilePage/>} />            
            <Route path="/addlocation" element={<LocationForm/>} />            
            <Route path="/addproperty" element={<AddProperty/>} />    
            <Route path="/tenantprofile" element={<TenantPage/>} />  
            <Route path="/propertydetails/:id" element={<PropertyDetails />} /> 
            {/* <Route path="/landing" element={<Startpage />} />  */}
            <Route path="/adminpage" element={<AdminPage />} /> 
            <Route path="/verify-email" element={<EmailVerification />} />
          </Routes>
      
  );
}

export default App;
