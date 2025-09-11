import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function EmailDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mail, setMail] = useState(null);
  const [status, setStatus] = useState("");

  const fetchMail = async () => {
    try {
      const res = await api.get(`/mails/${id}`);
      setMail(res.data);
    } catch (err) {
      setStatus(err.response?.data?.error || "Failed to fetch email details");
    }
  };

  useEffect(() => {
    fetchMail();
  });

  if (status) {
    return (
      <div className="w-full max-w-3xl mx-auto p-4 bg-white rounded-xl shadow-md">
        <p className="text-sm text-red-600">{status}</p>
      </div>
    );
  }

  if (!mail) {
    return (
      <div className="w-full max-w-3xl mx-auto p-4 bg-white rounded-xl shadow-md">
        <p className="text-sm text-gray-600">Loading email details...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white rounded-xl shadow-md space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Email Details</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Back
        </button>
      </div>

      <div>
        <h2 className="text-sm font-medium text-gray-500">Subject</h2>
        <p className="text-base font-semibold text-gray-800 bg-gray-50 border rounded p-2">
          {mail.campaign?.subject || "No subject"}
        </p>
      </div>

      <div>
        <h2 className="text-sm font-medium text-gray-500">Message</h2>
        <div className="text-sm text-gray-700 bg-gray-50 border rounded p-3 whitespace-pre-line">
          {mail.campaign?.message || "No message"}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium text-gray-500 mb-1">Recipients</h2>
        <ul className="list-disc list-inside text-sm text-gray-700 bg-gray-50 border rounded p-2 max-h-40 overflow-y-auto">
          {mail.customer ? (
            <li>{mail.customer.email}</li>
          ) : (
            mail.recipients?.map((c) => (
              <li key={c.id}>{c.email}</li>
            ))
          )}
        </ul>
      </div>

      <div className="text-xs text-gray-500">
        Sent on: {new Date(mail.createdAt).toLocaleString()}
      </div>
    </div>
  );
}
