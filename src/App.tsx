import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionProvider } from "./context/AuthContext";
import Home from "./pages/index";
import About from "./pages/about";
import Mission from "./pages/mission";
import Contacts from "./pages/contacts";
import Properties from "./pages/properties";
import PropertyDetails from "./pages/propertyDetails";
import PhotoGallery from "./pages/photoGallery";
import SignIn from "./pages/signIn";
import ResetPassword from "./pages/resetPassword";
import Dashboard from "./pages/dashboard";
import AddOnService from "./pages/addOn/index";
import AddOnDetailsPage from "./pages/addOn/AddOnDetail";
import PaymentSuccess from "./pages/payment/success";
import PaymentCancel from "./pages/payment/cancel";
import Checkout from "./pages/checkout";
import AdminPanel from "./pages/admin/index";
import PropertyEdit from "./pages/admin/PropertyEdit";
import AdminLogin from "./pages/admin/login";

function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/propertyDetails" element={<PropertyDetails />} />
          <Route path="/photoGallery" element={<PhotoGallery />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addOn" element={<AddOnService />} />
          <Route path="/addOn/:id" element={<AddOnDetailsPage />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/properties/:id" element={<PropertyEdit />} />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  );
}

export default App;
