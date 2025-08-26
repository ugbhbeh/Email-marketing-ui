import { useState, useEffect } from "react";
import api from "../services/api"

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newName, setNewName] = useState("");

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await api.get("/campaign");
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
      await api.post("/campaign", { name: newName });
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
    <div>
      <h1>Campaigns</h1>

      <div>
        <input
          type="text"
          placeholder="New campaign name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={createCampaign}>Create Campaign</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <ul>
        {campaigns.map((c) => (
          <li key={c.id}>
            {c.name} (Created: {new Date(c.createdAt).toLocaleDateString()})
          </li>
        ))}
      </ul>
    </div>
  );
}
