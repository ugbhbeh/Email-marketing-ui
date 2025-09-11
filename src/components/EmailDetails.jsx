import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function EmailDetailsPage() {
  const { id } = useParams();
  const [mail, setMail] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMail = async () => {
      try {
        const res = await api.get(`/mails/${id}`);
        setMail(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch email details");
      }
    };
    fetchMail();
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!mail) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="p-4 border rounded-lg shadow bg-white">
        <h1 className="text-2xl font-bold mb-2">{mail.subject}</h1>
        <span
          className={`px-3 py-1 text-sm rounded ${
            mail.status === "SENT"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {mail.status}
        </span>
      </div>

      <div className="p-4 border rounded-lg shadow bg-white space-y-2">
        <h2 className="text-lg font-semibold">Email Content</h2>
        <p className="whitespace-pre-line">{mail.message}</p>
        <p className="text-sm text-gray-600">
          Sent At: {new Date(mail.sentAt).toLocaleString()}
        </p>
        {mail.error && (
          <p className="text-sm text-red-600">Error: {mail.error}</p>
        )}
      </div>

     
      <div className="p-4 border rounded-lg shadow bg-white">
        <h2 className="text-lg font-semibold mb-2">Campaign Info</h2>
        <p><b>Name:</b> {mail.campaign?.name}</p>
        <p>
          <b>Created:</b>{" "}
          {mail.campaign?.createdAt
            ? new Date(mail.campaign.createdAt).toLocaleString()
            : "N/A"}
        </p>
      </div>

    
      <div className="p-4 border rounded-lg shadow bg-white">
        <h2 className="text-lg font-semibold mb-2">Recipient</h2>
        <p><b>Email:</b> {mail.customer?.email}</p>
        <p><b>Name:</b> {mail.customer?.name || "—"}</p>
        <p>
          <b>Added:</b>{" "}
          {mail.customer?.createdAt
            ? new Date(mail.customer.createdAt).toLocaleString()
            : "N/A"}
        </p>
      </div>
     
      <div className="p-4 border rounded-lg shadow bg-white">
        <h2 className="text-lg font-semibold mb-4">Timeline</h2>
        <ol className="relative border-l border-gray-300">
          
          <li className="mb-6 ml-4">
            <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-1.5 border border-white"></div>
            <time className="mb-1 text-sm font-normal text-gray-400">
              {mail.campaign?.createdAt
                ? new Date(mail.campaign.createdAt).toLocaleString()
                : "N/A"}
            </time>
            <p className="text-base font-semibold text-gray-900">
              Campaign Created
            </p>
            <p className="text-sm text-gray-600">{mail.campaign?.name}</p>
          </li>

          
          <li className="mb-6 ml-4">
            <div className="absolute w-3 h-3 bg-purple-500 rounded-full -left-1.5 border border-white"></div>
            <time className="mb-1 text-sm font-normal text-gray-400">
              {mail.customer?.createdAt
                ? new Date(mail.customer.createdAt).toLocaleString()
                : "N/A"}
            </time>
            <p className="text-base font-semibold text-gray-900">
              Customer Added
            </p>
            <p className="text-sm text-gray-600">{mail.customer?.email}</p>
          </li>

          <li className="ml-4">
            <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-1.5 border border-white"></div>
            <time className="mb-1 text-sm font-normal text-gray-400">
              {mail.sentAt ? new Date(mail.sentAt).toLocaleString() : "N/A"}
            </time>
            <p className="text-base font-semibold text-gray-900">Email Sent</p>
            <p className="text-sm text-gray-600">{mail.subject}</p>
          </li>
        </ol>
      </div>

    
    </div>
  );
}
