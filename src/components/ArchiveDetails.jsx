import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ArchiveDetailPage() {
  const { type, id } = useParams(); 
  const [item, setItem] = useState(null);
  const [_status, setStatus] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchItem();
  }, [id, type]);

  const fetchItem = async () => {
    try {
      const res = await api.get(`/archive/${type}/${id}`);
      setItem(res.data);
    } catch (err) {
      console.error("Failed to load archive item", err);
    }
  };

   const deleteItem = async () => {
    if (!window.confirm("Are you sure you want to delete this?")) return;

    try {
      await api.delete(`/archive/${type}/${id}`);
      setStatus("✅ Deleted successfully");
      setTimeout(() => navigate("/archive"), 1000);
    } catch (err) {
      console.error(err);
      setStatus(err.response?.data?.error || "Failed to delete");
    }
  };

  if (!item) return <p className="p-6 text-gray-500">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{item.subject || "Untitled"}</h1>
      <p className="text-sm text-gray-500 mb-6">
        Last updated: {new Date(item.updatedAt).toLocaleString()}
      </p>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="whitespace-pre-wrap">{item.message}</p>
      </div>
       <button
        onClick={deleteItem}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Delete {type === "drafts" ? "Draft" : "Template"}
      </button>
    </div>
  );
}
