import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CampaignsPage from "./Campaigns";
import CustomersPage from "./Customer";
import api from "../services/api";

export default function HomePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile"); 
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="p-6">
      <Tabs defaultValue="campaigns">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* Campaigns */}
        <TabsContent value="campaigns">
          <CampaignsPage />
        </TabsContent>

        {/* Customers */}
        <TabsContent value="customers">
          <CustomersPage />
        </TabsContent>

        {/* Profile */}
        <TabsContent value="profile">
          {profile ? (
            <div className="space-y-4 rounded-xl p-6 shadow-md border">
              <h2 className="text-xl font-semibold">User Profile</h2>
              <p><span className="font-medium">ID:</span> {profile.id}</p>
              <p><span className="font-medium">Email:</span> {profile.email}</p>
              <p><span className="font-medium">Name:</span> {profile.name || "—"}</p>
              <p><span className="font-medium">Created At:</span> {new Date(profile.createdAt).toLocaleString()}</p>
            </div>
          ) : (
            <p>Loading profile...</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
