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
          <p><strong>Campaigns:</strong> {profile.stats.campaigns}</p>
          <p><strong>Customers:</strong> {profile.stats.customers}</p>
          <p><strong>Mails Sent:</strong> {profile.stats.totalSent}</p>
          <p><strong>Success:</strong> {profile.stats.successCount}</p>
          <p><strong>Failed:</strong> {profile.stats.failureCount}</p>

          <h3 className="mt-4 font-semibold">Recent Mails</h3>
          <ul>
            {profile.stats.recentMails.map((m) => (
              <li key={m.id}>
                <strong>{m.subject}</strong> — {m.status}  
                (to {m.customer?.email || "unknown"})  
                in campaign {m.campaign?.name || "N/A"}  
                at {new Date(m.sentAt).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}


     
    