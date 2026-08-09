import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';

// Attendee Pages
import EventsList from './pages/EventsList';
import EventDetail from './pages/EventDetail';
import CalendarView from './pages/CalendarView';
import MyEvents from './pages/MyEvents';
import Certificates from './pages/Certificates';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';
import NotFound from './pages/NotFound';
import MobileTicket from './pages/MobileTicket';
import PaymentConfirmation from './pages/PaymentConfirmation';
import EntertainmentManager from './pages/EntertainmentManager';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEvents from './pages/admin/AdminEvents';
import AdminEventAttendees from './pages/admin/AdminEventAttendees';
import AdminActivity from './pages/admin/AdminActivity';

import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import KineticGrid from './components/ui/kinetic-grid';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PageTransition>
              <EventsList />
            </PageTransition>
          }
        />
        <Route
          path="/calendar"
          element={
            <PageTransition>
              <CalendarView />
            </PageTransition>
          }
        />
        <Route path="/comedy" element={<PageTransition><EntertainmentManager kind="comedy" /></PageTransition>} />
        <Route path="/movies" element={<PageTransition><EntertainmentManager kind="movies" /></PageTransition>} />
        <Route path="/ticket" element={<PageTransition><MobileTicket /></PageTransition>} />
        <Route path="/payment" element={<PageTransition><PaymentConfirmation /></PageTransition>} />
        <Route
          path="/events/:id"
          element={
            <PageTransition>
              <EventDetail />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/register"
          element={
            <PageTransition>
              <Register />
            </PageTransition>
          }
        />
        <Route
          path="/auth/callback"
          element={
            <PageTransition>
              <AuthCallback />
            </PageTransition>
          }
        />

        {/* Protected Attendee Routes */}
        <Route
          path="/my-registrations"
          element={
            <ProtectedRoute>
              <PageTransition>
                <MyEvents />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/certificates"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Certificates />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Profile />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <PageTransition>
                <AdminDashboard />
              </PageTransition>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <AdminRoute>
              <PageTransition>
                <AdminEvents />
              </PageTransition>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/events/:id/attendees"
          element={
            <AdminRoute>
              <PageTransition>
                <AdminEventAttendees />
              </PageTransition>
            </AdminRoute>
          }
        />
        <Route path="/admin/activity" element={<AdminRoute><PageTransition><AdminActivity /></PageTransition></AdminRoute>} />

        {/* 404 Catch-All Route */}
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <BrowserRouter>
            <KineticGrid globalColor="default" className="text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
              <div className="relative z-10 flex min-h-screen flex-col">
                <Navbar />
                <main className="flex flex-1 flex-col">
                  <AnimatedRoutes />
                </main>
                <Footer />
              </div>
            </KineticGrid>
          </BrowserRouter>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
