import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ClientDashboard from './pages/ClientDashboard';
import DashboardLayout from './components/layout/DashboardLayout';
import PostJob from './pages/PostJob';
import MyJobs from './pages/MyJobs';
import Notifications from './pages/Notifications';
import Freelancers from './pages/Freelancers';
import Settings from './pages/Settings';
import JobDetails from './pages/JobDetails';
import { DashboardProvider } from './context/DashboardContext';
import FreelancerOnboarding from './pages/FreelancerOnboarding';
import Proposals from './pages/Proposals';
import FreelancerDashboardLayout from './components/layout/FreelancerDashboardLayout';
import FreelancerDashboard from './pages/FreelancerDashboard';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import JobManagement from './pages/admin/JobManagement';
import ErrorBoundary from './components/common/ErrorBoundary';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import SavedJobs from './pages/SavedJobs';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route path="/client-dashboard" element={
          <DashboardProvider>
            <DashboardLayout />
          </DashboardProvider>
        }>
          <Route index element={<ClientDashboard />} />
          <Route path="job/:id" element={<JobDetails isClientView={true} />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="my-jobs" element={<MyJobs />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="freelancers" element={<Freelancers />} />
          <Route path="freelancer/:id" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="/freelancer-dashboard" element={
          <DashboardProvider>
            <FreelancerDashboardLayout />
          </DashboardProvider>
        }>
          <Route index element={<FreelancerDashboard />} />
          <Route path="job/:id" element={<JobDetails />} />
          <Route path="proposals" element={<Proposals />} />
          <Route path="saved-jobs" element={<SavedJobs />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        <Route path="/freelancer-onboarding" element={<FreelancerOnboarding />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="jobs" element={<JobManagement />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
