// src/pages/ArchiveDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function ArchiveDetailPage() {
  const { type, id } = useParams(); // type = drafts | templates
  const [item, setItem] = useState(null);

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
    </div>
  );
}
