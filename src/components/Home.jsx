import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Outlet, useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleTabClick = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };

  return (
    <div className="p-6 lg:px-16 max-w-7xl mx-auto">
      <Tabs value={activeTab}>
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="dashboard" onClick={() => handleTabClick("dashboard")}>
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="campaigns" onClick={() => handleTabClick("campaigns", "/campaigns")}>
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="customers" onClick={() => handleTabClick("customers", "/customers")}>
            Customers
          </TabsTrigger>
          <TabsTrigger value="mailing" onClick={() => handleTabClick("mailing", "/mailing")}>
            Mailing
          </TabsTrigger>
          <TabsTrigger value="archive" onClick={() => handleTabClick("archive", "/archive")}>
            Archive
          </TabsTrigger>
        </TabsList>

        <div className="p-6 bg-white rounded-2xl shadow-lg">
          <Outlet />
        </div>
      </Tabs>
    </div>
  );
}
