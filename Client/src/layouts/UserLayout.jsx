import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ToastContainer, useToast } from '../components/Toast';

const UserLayout = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto mt-5">
        <div className=" sm:px-0 rounded-s-2xl">
          <Outlet />
        </div>
      </main>
      
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto  ">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              © 2025 LearnLink. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-600">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-600">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-600">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
