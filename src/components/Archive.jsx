// src/pages/ArchivePage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ArchivePage() {
  const [activeTab, setActiveTab] = useState("drafts");
  const [drafts, setDrafts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDrafts();
    fetchTemplates();
  }, []);

  const fetchDrafts = async () => {
    try {
      const res = await api.get("/archive/drafts");
      setDrafts(res.data);
    } catch (err) {
      console.error("Failed to load drafts", err);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await api.get("/archive/templates");
      setTemplates(res.data);
    } catch (err) {
      console.error("Failed to load templates", err);
    }
  };

  const renderCard = (item, type) => (
    <div
      key={item.id}
      className="p-4 border rounded-lg shadow hover:shadow-md transition cursor-pointer bg-white"
      onClick={() => navigate(`/archive/${type}/${item.id}`)}
    >
      <h3 className="font-semibold text-lg">{item.subject || "Untitled"}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">{item.message}</p>
      <p className="text-xs text-gray-400 mt-2">
        {new Date(item.updatedAt).toLocaleString()}
      </p>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Archive</h1>

      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-6">
        <button
          className={`pb-2 ${
            activeTab === "drafts"
              ? "border-b-2 border-blue-600 font-semibold"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("drafts")}
        >
          Drafts
        </button>
        <button
          className={`pb-2 ${
            activeTab === "templates"
              ? "border-b-2 border-blue-600 font-semibold"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("templates")}
        >
          Templates
        </button>
      </div>

      {/* Content */}
      {activeTab === "drafts" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {drafts.length > 0 ? (
            drafts.map((d) => renderCard(d, "drafts"))
          ) : (
            <p className="text-gray-500">No drafts saved yet.</p>
          )}
        </div>
      )}

      {activeTab === "templates" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.length > 0 ? (
            templates.map((t) => renderCard(t, "templates"))
          ) : (
            <p className="text-gray-500">No templates saved yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
