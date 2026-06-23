import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0a0f]/80 border-b border-white/10">
      <div className="flex items-center justify-between px-6 md:px-12 py-4">

        {/* LOGO */}
        <Link
          to="/"
          className="text-xl md:text-2xl font-semibold tracking-tight"
        >
          <span className="text-white">X</span>
          <span className="text-indigo-400">pose</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-3">

          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-3 border border-white/20 rounded-full px-3 py-2 hover:bg-white/5 transition"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <span className="text-white font-medium">
                  {user.name}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="text-sm text-white/60 hover:text-white px-4 py-2 transition"
              >
                Sign Up
              </Link>

              <Link
                to="/login"
                className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-5 py-2 rounded-lg transition"
              >
                Log In
              </Link>
            </>
          )}

        </div>

        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-2 px-6 pb-4 pt-2 border-t border-white/10">

          {user ? (
            <>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 py-3"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <span className="text-white">
                  {user.name}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-white/60 hover:text-white py-2"
              >
                Sign Up
              </Link>

              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="bg-indigo-500 text-white text-sm px-5 py-2 rounded-lg text-center"
              >
                Log In
              </Link>
            </>
          )}

        </div>
      )}
    </nav>
  );
}

export default Navbar;