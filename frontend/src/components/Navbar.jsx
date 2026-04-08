import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import RoomBookifyLogo from './Logo';

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <RoomBookifyLogo width={400} height={68} />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/results?view=list" className="text-gray-700 hover:text-royal-blue font-medium transition-colors">
              Browse Properties
            </Link>
            <Link to="/results?view=map" className="text-gray-700 hover:text-royal-blue font-medium transition-colors">
              Explore Map
            </Link>
            {user?.role === 'provider' && (
              <Link to="/dashboard" className="text-gray-700 hover:text-royal-blue font-medium transition-colors">
                Manage Properties
              </Link>
            )}
            {user && (
              <Link to="/loyalty" className="text-gray-700 hover:text-royal-blue font-medium transition-colors">
                Loyalty Program
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="w-8 h-8 bg-royal-blue rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm text-gray-700 font-medium">{user.name}</span>
                  <svg className={`w-4 h-4 text-gray-600 transition ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <p className="text-xs text-royal-blue font-medium mt-1 capitalize">{user.role}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => { navigate('/profile'); setIsProfileOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </button>

                      <button
                        onClick={() => { navigate('/my-bookings'); setIsProfileOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        My Bookings
                      </button>

                      <button
                        onClick={() => { navigate('/loyalty'); setIsProfileOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Loyalty Program
                      </button>

                      {user.role === 'provider' && (
                        <>
                          <button
                            onClick={() => { navigate('/dashboard'); setIsProfileOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 5h4" />
                            </svg>
                            Provider Dashboard
                          </button>

                          <button
                            onClick={() => { navigate('/analytics'); setIsProfileOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Analytics
                          </button>
                        </>
                      )}

                      {user.role === 'admin' && (
                        <button
                          onClick={() => { navigate('/admin'); setIsProfileOpen(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                          </svg>
                          Admin Panel
                        </button>
                      )}
                    </div>

                    <div className="border-t border-gray-200 py-1">
                      <button
                        onClick={() => {
                          localStorage.removeItem('token');
                          localStorage.removeItem('user');
                          setUser(null);
                          setIsProfileOpen(false);
                          navigate('/');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="hidden sm:block btn-outline text-sm"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="btn-primary text-sm"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden ml-4 text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/results?view=list" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
              Browse Properties
            </Link>
            <Link to="/results?view=map" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
              Explore Map
            </Link>
            {user?.role === 'provider' && (
              <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
                Manage Properties
              </Link>
            )}
            {user && (
              <Link to="/loyalty" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
                Loyalty Program
              </Link>
            )}
            {!user && (
              <>
                <button onClick={() => navigate('/login')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
                  Login
                </button>
                <button onClick={() => navigate('/register')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
                  Sign Up
                </button>
              </>
            )}
            {user && (
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded text-red-600">
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
