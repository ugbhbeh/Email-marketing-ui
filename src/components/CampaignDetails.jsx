// show all the deatils for a single campagin for the get campaign by id route
// show some three dots somewhere and give a delete option 
// have an add customers option that shows all customers already tied to a user 
// have btn to mass import a csv for clients 
// show all he cusotmers in a card format, with dots to delete them from the campagin 

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/campaign/${id}`);
      setCampaign(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch campaign");
    } finally {
      setLoading(false);
    }
  };

  const deleteCampaign = async () => {
    try {
      await api.delete(`/campaign/${id}`);
      navigate("/campaign");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete campaign");
    }
  };

  const deleteCustomer = async (customerId) => {
    try {
      await api.delete(`/campaign/${id}/customers/${customerId}`);
      fetchCampaign(); 
    } catch (err) {
      setError(err.response?.data?.error || "Failed to remove customer");
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!campaign) return <p>No campaign found.</p>;

  return (
    <div>
      <h1>Campaign Details</h1>
      <p>ID: {campaign.id}</p>
      <p>Name: {campaign.name}</p>
      <p>Created: {new Date(campaign.createdAt).toLocaleDateString()}</p>
      <p>Updated: {new Date(campaign.updatedAt).toLocaleDateString()}</p>

      <button onClick={deleteCampaign}>Delete Campaign</button>

      <h2>Customers</h2>
      {campaign.customers.length === 0 ? (
        <p>No customers linked</p>
      ) : (
        <div>
          {campaign.customers.map((customer) => (
            <div
              key={customer.id}
              style={{
                border: "1px solid gray",
                padding: "8px",
                marginBottom: "8px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <p>Name: {customer.name}</p>
                <p>Email: {customer.email}</p>
              </div>
              <button onClick={() => deleteCustomer(customer.id)}>...</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
