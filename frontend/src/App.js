import './App.css';
import { Routes, Route } from 'react-router-dom';
// import VerifyTeacher from './components/verify';
import EditProperty from './components/Unused/EditProperty';
// import EditProperty from "./components/EditProperty";
import SideNav from './components/Unused/SideNav';
import BookingRequests from './components/Unused/BookingRequests';
import TourRequests from './components/Unused/TourRequests';
import Home from './components/Home/Home';
import SearchPage from './components/SearchPage/SearchPage';
import AddProperty from './components/AddProperty/AddProperty';
import Property from './components/Unused/Property';
// import TenantSignUp from './components/TenantSignUp';
// import TenantLogin from './components/TenantLogin';
import LocationForm from './components/LocationForm/LocationForm';
import StartPage from './components/StartPage/StartPage';
import StartRegister from './components/StartRegister/StartRegister';
import RegisterOwner from './components/RegisterOwner/RegisterOwner';
import RegisterTenant from './components/RegisterTenant/RegisterTenant';
import LoginPage from './components/LoginPage/LoginPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import RegisterAdmin from './components/RegisterAdmin/RegisterAdmin';
import property from './components/Unused/Property';
// import Login from './components/Login';
function App() {
  return (
      <div className="App">
        {/* <AddProperty/> */}
        {/* <RegisterAdmin/> */}
        {/* <ProfilePage/> */}
        {/* <RegisterOwner/> */}
        {/* <RegisterTenant/> */}
        {/* <StartPage/> */}
        {/* <Home/> */}
        {/* <LocationForm/> */}
        {/* <TenantSignUp/> */}
        {/* <TenantLogin/> */}
        {/* <SearchPage/> */}
        {/* <Home/> */}
        {/* <SideNav/> */}
        {/* <EditProperty/> */}
        {/* <Property/> */}
        {/* <LoginPage/> */}
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/property" element={<Property />} /> 
            <Route path="/editproperty" element={<EditProperty />} /> 
            <Route path="/bookingrequests" element={<BookingRequests />} /> 
            <Route path="/tourrequests" element={<TourRequests />} /> 
            <Route path="/logout" element={<Property />} /> 
            <Route path="/search" element={<SearchPage />} />
            {/* <Route path="/tenant-login" element={<TenantLogin />} /> */}
            {/* <Route path="/tenantsignup" element={<TenantSignUp />} /> */}
            <Route path="/home" element={<Home />} />
            <Route path="/sidenav" element={<SideNav />} />
            <Route path="/startregister" element={<StartRegister />} />
            <Route path="/registerowner" element={<RegisterOwner/>} />
            <Route path="/registertenant" element={<RegisterTenant/>} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/profile" element={<ProfilePage/>} />            
            <Route path="/addlocation" element={<LocationForm/>} />            
            <Route path="/addproperty" element={<AddProperty/>} />            

          </Routes>
      </div>
  );
}

export default App;
