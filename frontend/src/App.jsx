import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Results from './pages/Results';
import PropertyDetails from './pages/PropertyDetails';
import ProviderDashboard from './pages/ProviderDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import LoyaltyDashboard from './pages/LoyaltyDashboard';
import HostAnalyticsDashboard from './pages/HostAnalyticsDashboard';
import UserProfile from './pages/UserProfile';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/dashboard" element={<ProviderDashboard />} />
            <Route path="/analytics" element={<HostAnalyticsDashboard />} />
            <Route path="/loyalty" element={<LoyaltyDashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add-property" element={<AddProperty />} />
            <Route path="/edit-property/:id" element={<EditProperty />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

