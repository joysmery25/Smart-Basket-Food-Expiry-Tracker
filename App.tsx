import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { AddItem } from './pages/AddItem';
import { Recipes } from './pages/Recipes';
import { Community } from './pages/Community';
import { Impact } from './pages/Impact';
import { Settings } from './pages/Settings';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Toaster position="top-center" richColors />
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add" element={<AddItem />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/community" element={<Community />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}
