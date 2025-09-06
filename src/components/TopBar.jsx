import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../services/AuthContext";
import api from "../services/api";

export default function TopBar() {
  const { logout, isLoggedIn, userId } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        setUserName(res.data.name || "User");
      } catch (err) {
        console.log(err)
        setUserName("User");
      }
    };
    fetchProfile();
  }, [isLoggedIn]);

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    try {
      await api.delete(`/users/${userId}`);
      logout();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete account");
    }
  };

  return (
    <div className="bg-red-500 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <div>
        {isLoggedIn ? <span className="font-semibold">Hello, {userName}!</span> : <span>Welcome!</span>}
      </div>

      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <div className="relative">
            <button
              className="bg-white text-red-500 px-3 py-1 rounded hover:bg-gray-100 transition"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Account
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-10">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-white text-red-500 px-4 py-1 rounded hover:bg-gray-100 transition"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
