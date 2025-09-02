
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("customers");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Tabs for navigation */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          <div className="p-4 border rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Customers</h2>
            <p className="mb-4 text-gray-600">Manage your customers, add or import via CSV.</p>
            <Button onClick={() => navigate("/customers")}>Go to Customers</Button>
          </div>
        </TabsContent>

        <TabsContent value="campaigns">
          <div className="p-4 border rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Campaigns</h2>
            <p className="mb-4 text-gray-600">View, create, and manage your campaigns.</p>
            <Button onClick={() => navigate("/campaigns")}>Go to Campaigns</Button>
          </div>
        </TabsContent>

        <TabsContent value="profile">
          <div className="p-4 border rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold mb-2">User Profile</h2>
            <p className="mb-4 text-gray-600">View your account details and settings.</p>
            <Button onClick={() => navigate("/profile")}>Go to Profile</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
