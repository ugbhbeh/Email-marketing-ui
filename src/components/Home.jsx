import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CampaignsPage from "./Campaigns";
import CustomersPage from "./Customer";
import ProfilePage from "./Profile";
import MailingPage from "./Mailing";
export default function HomePage() {


  return (
    <div className="p-6">
      <Tabs defaultValue="campaigns">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
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
          <ProfilePage/>
          <MailingPage/>
        </TabsContent>

      </Tabs>
    </div>
  );
}
