//#Global Imports
import React from 'react';
import { useNavigate } from 'react-router-dom';

//#Local Imports
import { UserConfigContext } from '../../context';

function Navbar() {
  const navigate = useNavigate();
  const { user } = React.useContext(UserConfigContext);

  return (
    <header className="bg-indigo-600">
      <nav className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex items-center justify-between w-full py-6 border-b border-indigo-500 lg:border-none">
          <div className="flex items-center">
            <a href="/home">
              <span className="sr-only">Bike Rental</span>
              <img
                className="w-auto h-10"
                src="https://tailwindui.com/img/logos/workflow-mark.svg?color=white"
                alt="company-logo"
              />
            </a>
            <div className="hidden ml-10 space-x-8 lg:block">
              <button
                onClick={() => navigate('/home')}
                className="text-base font-medium text-white hover:text-indigo-50">
                Home
              </button>
              <button
                onClick={() => navigate('/my-bike')}
                className="text-base font-medium text-white hover:text-indigo-50">
                My Bikes
              </button>
              {user?.role === 'manager' && (
                <>
                  <button
                    onClick={() => navigate('/manage-role')}
                    className="text-base font-medium text-white hover:text-indigo-50">
                    Manage Role
                  </button>
                  <button
                    onClick={() => navigate('/manage-bike')}
                    className="text-base font-medium text-white hover:text-indigo-50">
                    Manage Bikes
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="ml-10 space-x-4">
            <a
              href="/auth/sign-in"
              className="inline-block px-4 py-2 text-base font-medium text-white bg-indigo-500 border border-transparent rounded-md hover:bg-opacity-75">
              Logout
            </a>
          </div>
        </div>
        <div className="flex flex-wrap justify-center py-4 space-x-6 lg:hidden">
          <button
            onClick={() => navigate('/home')}
            className="text-base font-medium text-white hover:text-indigo-50">
            Home
          </button>
          <button
            onClick={() => navigate('/my-bike')}
            className="text-base font-medium text-white hover:text-indigo-50">
            My Bikes
          </button>
          {user?.role === 'manager' && (
            <>
              <button
                onClick={() => navigate('/manage-role')}
                className="text-base font-medium text-white hover:text-indigo-50">
                Manage Role
              </button>
              <button
                onClick={() => navigate('/manage-bike')}
                className="text-base font-medium text-white hover:text-indigo-50">
                Manage Bikes
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
