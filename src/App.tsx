import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthForm from './components/AuthForm';
import LeaveRequests from './pages/LeaveRequests';
import { Toaster } from "@/components/ui/toaster"
import { ShieldCheck } from "lucide-react";
import AdminPortal from './pages/AdminPortal';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
      <Toaster />
    </AuthProvider>
  );
};

const AppContent: React.FC = () => {
  const { isLoggedIn, isAdmin } = useAuth();

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center py-4">
        <Link to="/" className="text-2xl font-bold">Leave Management System</Link>
        <Navigation />
      </header>

      <main>
        <Routes>
          <Route path="/login" element={!isLoggedIn ? <AuthForm isLogin={true} onSubmit={(data) => {
            return new Promise<void>(() => { });
          }} /> : <LeaveRequests />} />
          <Route path="/signup" element={!isLoggedIn ? <AuthForm isLogin={false} onSubmit={(data) => {
            return new Promise<void>(() => { });
          }} /> : <LeaveRequests />} />
          <Route path="/" element={isLoggedIn ? <LeaveRequests /> : <AuthForm isLogin={true} onSubmit={(data) => {
            return new Promise<void>(() => { });
          }} />} />
          <Route path="/admin" element={<AdminPortal />} />
        </Routes>
      </main>

      <footer className="text-center mt-8">
        <p>&copy; {new Date().getFullYear()} Leave Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

const Navigation: React.FC = () => {
  const { isLoggedIn, logout, isAdmin } = useAuth();

  return (
    <nav>
      <ul className="flex space-x-4">
        {isLoggedIn ? (
          <>
            <li><Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors">My Requests</Link></li>
            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors">
                <ShieldCheck className="h-4 w-4" />
                <span>Admin Portal</span>
              </Link>
            )}
            <li><button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-colors">Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors">Login</Link></li>
            <li><Link to="/signup" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition-colors">Signup</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default App;
