import './App.css';
import { Routes, Route } from 'react-router-dom';
// import VerifyTeacher from './components/verify';
import Property from "./components/Property";
// import EditProperty from "./components/EditProperty";
import SideNav from "./components/SideNav";
import EditProperty from './components/EditProperty';
import BookingRequests from './components/BookingRequests';
import TourRequests from './components/TourRequests';
import Home from './components/Home';
import SearchPage from './components/SearchPage';
import TenantSignUp from './components/TenantSignUp';
import TenantLogin from './components/TenantLogin';
import LocationForm from './components/LocationForm';
function App() {
  return (
      <div className="App">
        {/* <Home/> */}
        {/* <LocationForm/> */}
        {/* <TenantSignUp/> */}
        {/* <TenantLogin/> */}
        {/* <SearchPage/> */}
        {/* <Home/> */}
        {/* <SideNav/> */}
        {/* <EditProperty/> */}
        <Property/>
        {/* <Login/> */}
          <Routes>
            <Route path="/property" element={<Property />} /> 
            <Route path="/editproperty" element={<EditProperty />} /> 
            <Route path="/bookingrequests" element={<BookingRequests />} /> 
            <Route path="/tourrequests" element={<TourRequests />} /> 
            <Route path="/logout" element={<Property />} /> 
            <Route path="/search" element={<SearchPage />} />
            <Route path="/tenant-login" element={<TenantLogin />} />
            <Route path="/home" element={<Home />} />
            <Route path="/sidenav" element={<SideNav />} />
          </Routes>
      </div>
  );
}

export default App;
