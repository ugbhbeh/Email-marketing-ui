import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api"

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newName, setNewName] = useState("");

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await api.get("/campaigns");
      setCampaigns(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch campaigns");
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async () => {
    if (!newName.trim()) return;
    try {
      await api.post("/campaigns", { name: newName });
      setNewName("");
      fetchCampaigns();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create campaign");
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Campaigns</h1>

      <div className="flex gap-2 mb mb-6">
        <input
          type="text"
          placeholder="New campaign name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={createCampaign}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Create
        </button>
      </div>
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid gap-4">
        {campaigns.map((c) => (
          <Link
            key={c.id}
            to={`/campaigns/${c.id}`}
            className="block p-4 border rounded-lg hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold">{c.name}</h3>
            <p className="text-sm text-gray-500">
              Created: {new Date(c.createdAt).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}