import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CampaignsPage from "./Campaigns";
import CustomersPage from "./Customer";
import ProfilePage from "./Profile";
import MailingPage from "./Mailing";

export default function HomePage() {
  return (
    <div className="p-6 lg:px-16">
      <Tabs defaultValue="campaigns">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns">
          <div className="w-full space-y-6">
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <MailingPage />
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <CampaignsPage />
            </div>
          </div>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers">
          <div className="w-full p-6 bg-white rounded-2xl shadow-lg">
            <CustomersPage />
          </div>
        </TabsContent>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard">
          <div className="w-full p-6 bg-white rounded-2xl shadow-lg">
            <ProfilePage />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
