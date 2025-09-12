import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Map current path to tab
  const getActiveTab = () => {
    if (location.pathname.startsWith("/campaigns")) return "campaigns";
    if (location.pathname.startsWith("/customers")) return "customers";
    if (location.pathname.startsWith("/mailing") || location.pathname.startsWith("/mail")) return "mailing";
    if (location.pathname.startsWith("/archive")) return "archive";
    return "dashboard";
  };

  return (
    <div className="p-6 lg:px-16 max-w-7xl mx-auto">
      <Tabs value={getActiveTab()}>
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="dashboard" onClick={() => navigate("/")}>
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="campaigns" onClick={() => navigate("/campaigns")}>
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="customers" onClick={() => navigate("/customers")}>
            Customers
          </TabsTrigger>
          <TabsTrigger value="mailing" onClick={() => navigate("/mailing")}>
            Mailing
          </TabsTrigger>
          <TabsTrigger value="archive" onClick={() => navigate("/archive")}>
            Archive
          </TabsTrigger>
        </TabsList>

        {/* Floating panel area: swapped by routes */}
        <div className="p-6 bg-white rounded-2xl shadow-lg">
          <Outlet />
        </div>
      </Tabs>
    </div>
  );
}
