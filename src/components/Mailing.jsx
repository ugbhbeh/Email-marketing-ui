import { useEffect, useState } from "react";
import api from "../services/api";

export default function MailingPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const [aiInput, setAiInput] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  const fetchCampaigns = async () => {
    try {
      const res = await api.get("/campaigns");
      setCampaigns(res.data);
    } catch (err) {
      setStatus(err.response?.data?.error || "Failed to fetch campaigns");
    }
  };

const saveAsDraft = async () => {
  if (!subject && !message) {
    setStatus("Cannot save empty draft");
    return;
  }
  try {
    const _res = await api.post("/archive/drafts", {
      subject,
      message,
      campaignId: selectedCampaign || null,
    });
    setStatus("✅ Draft saved successfully");
  } catch (err) {
    console.error(err);
    setStatus(err.response?.data?.error || "Failed to save draft");
  }
};

const saveAsTemplate = async () => {
  if (!subject && !message) {
    setStatus("Cannot save empty template");
    return;
  }
  try {
    const _res = await api.post("/archive/templates", {
      subject,
      message,
    });
    setStatus("✅ Template saved successfully");
  } catch (err) {
    console.error(err);
    setStatus(err.response?.data?.error || "Failed to save template");
  }
};


  useEffect(() => {
    fetchCampaigns();
  }, []);

  const sendCampaign = async () => {
    if (!selectedCampaign || !subject || !message) {
      setStatus("All fields are required");
      return;
    }

    try {
      const res = await api.post("/mails/send", {
        campaignId: selectedCampaign,
        subject,
        message,
      });
      setStatus(`✅ Sent to ${res.data.sent} customers`);
      setSubject("");
      setMessage("");
      setSelectedCampaign("");
    } catch (err) {
      setStatus(err.response?.data?.error || "Failed to send campaign emails");
    }
  };

  const askAi = async () => {
    if (!aiInput.trim()) return;

    setLoading(true);
    setAiReply("");

    try {
      const res = await api.post("/ai", {
        messages: [{ role: "user", content: aiInput }],
        tone,
      });
      setAiReply(res.data.reply);
    } catch (err) {
      console.error(err);
      setAiReply("⚠️ Failed to get AI response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white rounded-xl shadow-md space-y-4 relative">
      {status && (
        <p className="text-sm text-green-700 bg-green-100 p-2 rounded">{status}</p>
      )}
      <div className="flex flex-col space-y-3">
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">To / Campaign</label>
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="px-2 py-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/3"
          >
            <option value="">Select a campaign</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Subject</label>
          <input
            type="text"
            placeholder="Enter subject line"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="px-2 py-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>

        <div className="relative">
          <textarea
            placeholder="Write your email here..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            className="flex-1 px-2 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px] max-h-[600px] resize-none w-full"
          />
          <div
  className="bg-gray-50 border-l border-gray-200 p-2 rounded-l-lg shadow-lg transition-all duration-300 max-h-[80vh] overflow-y-auto"
  style={{
    position: "fixed",
    top: "156px",
    right: "20px",
    width: aiPanelOpen ? "650px" : "250px",
    zIndex: 50,
  }}
>
  <div className="flex justify-between items-center mb-2">
    <span className="text-sm font-semibold">AI Assistant</span>
    <button
      onClick={() => setAiPanelOpen(!aiPanelOpen)}
      className="text-xs px-1 py-0.5 bg-gray-200 rounded hover:bg-gray-300"
    >
      {aiPanelOpen ? "−" : "+"}
    </button>
  </div>

  {/* panel content */}
  <div className="flex flex-col space-y-2">
    <textarea
      placeholder="Ask AI to draft or refine an email..."
      value={aiInput}
      onChange={(e) => setAiInput(e.target.value)}
      className="flex-1 px-2 py-1 text-sm border rounded-lg resize-none mb-2"
    />
    <select
      value={tone}
      onChange={(e) => setTone(e.target.value)}
      className="px-2 py-1 text-sm border rounded-lg mb-2"
    >
      <option value="professional">Professional</option>
      <option value="funny">Funny</option>
      <option value="informal">Informal</option>
    </select>
    <button
      onClick={askAi}
      disabled={loading}
      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 mb-2 disabled:opacity-50"
    >
      {loading ? "Thinking..." : "Ask AI"}
    </button>
    {aiReply && (
      <div className="p-2 text-sm border rounded-lg bg-white whitespace-pre-line space-y-2">
        <div>{aiReply}</div>
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => setSubject(aiReply)}
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Use as Subject
          </button>
          <button
            onClick={() => setMessage(aiReply)}
            className="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Use as Message
          </button>
        </div>
      </div>
    )}
  </div>

</div>
<div className="flex justify-end gap-2">
   <button onClick={sendCampaign} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" >
     Send </button>
      <button onClick={saveAsDraft} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition" >
         Save as Draft </button> 
         <button onClick={saveAsTemplate} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition" > Save as Template </button> </div> </div>

   </div>

  </div>
    
  );
}
