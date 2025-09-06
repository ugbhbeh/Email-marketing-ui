import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
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

  // Chart data guarded
  const mailStatsData = profile
    ? [
        { name: "Sent", value: profile.stats.totalSent },
        { name: "Success", value: profile.stats.successCount },
        { name: "Failed", value: profile.stats.failureCount },
      ]
    : [];

  const entityCounts = profile
    ? [
        { name: "Campaigns", value: profile.stats.campaigns },
        { name: "Customers", value: profile.stats.customers },
      ]
    : [];

  if (!profile) return <p className="p-4">Loading profile...</p>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">📊 User Dashboard</h2>

      {status && <p className="text-red-500">{status}</p>}

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-4 bg-white shadow rounded-lg">
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-semibold">{profile.email}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <p className="text-sm text-gray-500">Name</p>
          <p className="font-semibold">{profile.name || "N/A"}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <p className="text-sm text-gray-500">Campaigns</p>
          <p className="font-bold text-lg">{profile.stats.campaigns}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <p className="text-sm text-gray-500">Customers</p>
          <p className="font-bold text-lg">{profile.stats.customers}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Mail Stats</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mailStatsData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  <Cell fill="#8884d8" />
                  <Cell fill="#82ca9d" />
                  <Cell fill="#ff6b6b" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Entity Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={entityCounts}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Mails */}
      <div className="p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Recent Mails</h3>
        <ul className="space-y-3">
          {profile.stats.recentMails.length === 0 ? (
            <p className="text-gray-500">No mails sent yet</p>
          ) : (
            profile.stats.recentMails.map((m) => (
              <li
                key={m.id}
                className="p-3 border rounded-md hover:bg-gray-50 transition"
              >
                <p className="font-semibold">
                  {m.subject || "No Subject"} —{" "}
                  <span
                    className={
                      m.status === "SENT"
                        ? "text-green-600"
                        : m.status === "FAILED"
                        ? "text-red-600"
                        : "text-gray-600"
                    }
                  >
                    {m.status}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  To: {m.customer?.email || "unknown"} | Campaign:{" "}
                  {m.campaign?.name || "N/A"} |{" "}
                  {new Date(m.sentAt).toLocaleString()}
                </p>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
