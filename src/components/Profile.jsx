import { useEffect, useState } from "react";
import api from "../services/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/profile");
      setProfile(res.data);
    } catch (err) {
      setStatus(err.response?.data?.error || "Failed to fetch profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow bg-white mb-6">
      <h2 className="text-lg font-bold mb-2">User Profile</h2>
      {status && <p className="text-red-500">{status}</p>}
      {profile ? (
        <div>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Name:</strong> {profile.name || "N/A"}</p>
          <p><strong>Campaigns:</strong> {profile.campaignsCount }</p>
          <p><strong>Customers:</strong> { profile.customersCount}</p>
          <p><strong>Mails sent:</strong> { profile.mailsSent}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}


     
    