import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { Toaster } from "react-hot-toast";
import SignIn from "./pages/AuthPages/SignIn";
import { AuthProvider } from "./context/AuthContext";
import { FeatureFlagProvider } from "./context/FeatureFlagContext";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import OTPLogin from "./pages/AuthPages/OTPLogin";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import PieChart from "./pages/Charts/PieChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import LandingPage from "./pages/LandingPage";
import MarketingLayout from "./layout/MarketingLayout";
import FeaturesPage from "./pages/Marketing/FeaturesPage";
import HowItWorksPage from "./pages/Marketing/HowItWorksPage";
import PricingPage from "./pages/Marketing/PricingPage";
import DocumentationPage from "./pages/Marketing/DocumentationPage";
import DocumentationArticlePage from "./pages/Marketing/DocumentationArticlePage";
import ApiReferencePage from "./pages/Marketing/ApiReferencePage";
import CommunityPage from "./pages/Marketing/CommunityPage";
import ContactPage from "./pages/Marketing/ContactPage";
import PrivacyPolicyPage from "./pages/Marketing/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/Marketing/TermsOfServicePage";
import RegisterMunicipality from "./pages/Onboarding/RegisterMunicipality";
import Users from "./pages/Users/Users";
import Roles from "./pages/Users/Roles";
import Citizens from "./pages/Citizens/Citizens";
import Registrations from "./pages/Registrations/Registrations";
import ServiceRequests from "./pages/Services/ServiceRequests";
import Complaints from "./pages/Services/Complaints";
import Correspondence from "./pages/Correspondence/Correspondence";
import Notifications from "./pages/Notifications/Notifications";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AuditLogs from "./pages/AuditLogs/AuditLogs";
import Health from "./pages/Departments/Health";
import Education from "./pages/Departments/Education";
import Infrastructure from "./pages/Departments/Infrastructure";
import Agriculture from "./pages/Departments/Agriculture";
import Finance from "./pages/Departments/Finance";
import Administrative from "./pages/Departments/Administrative";
import DisasterManagement from "./pages/Departments/DisasterManagement";
import Approvals from "./pages/Approvals/Approvals";
import FeatureFlagsAdmin from "./pages/System/FeatureFlagsAdmin";
import BrandingSettings from "./pages/System/BrandingSettings";
import TenantAdminDashboard from "./pages/System/TenantAdminDashboard";
import SuperAdminDashboard from "./pages/System/SuperAdminDashboard";
import Billing from "./pages/System/Billing";
import BillingVerify from "./pages/System/BillingVerify";
import PlatformBilling from "./pages/System/PlatformBilling";
import WardsAdmin from "./pages/System/WardsAdmin";
import SifarisAdmin from "./pages/Services/SifarisAdmin";
import SifarisList from "./pages/Services/SifarisList";
import ServiceCatalog from "./pages/ServiceCatalog/ServiceCatalog";
import Clients from "./pages/Clients/Clients";
import StaffDirectory from "./pages/Staff/StaffDirectory";

// Phase 2 - Academy Core
import CourseBuilder from "./pages/Academy/CourseBuilder";
import Batches from "./pages/Academy/Batches";
import AttendanceTracker from "./pages/Academy/AttendanceTracker";
import CertificationRules from "./pages/Academy/CertificationRules";
import BatchProgress from "./pages/Academy/BatchProgress";
import StudentProgress from "./pages/Academy/StudentProgress";

// Phase 3 - Booking Engine
import BookingCalendar from "./pages/Bookings/BookingCalendar";

// Phase 5 - Inventory & Billing
import InventoryManager from "./pages/Inventory/InventoryManager";
import Invoices from "./pages/Billing/Invoices";
import CommissionsReport from "./pages/Billing/CommissionsReport";

// Phase 6 - Portals
import ClientPortal from "./pages/Portal/ClientPortal";
import StudentPortal from "./pages/Portal/StudentPortal";

// Phase 7 - Notifications
import NotificationTemplates from "./pages/Notifications/NotificationTemplates";
import CommunicationCenter from "./pages/Notifications/CommunicationCenter";
import NotificationLogs from "./pages/Notifications/NotificationLogs";

// Phase 8 - Analytics
import AnalyticsDashboard from "./pages/Analytics/AnalyticsDashboard";

// Phase 9 - AI Layer
import OcrIntake from "./pages/Academy/OcrIntake";

// Phase 10 - SaaS Admin & Hardening
import Signup from "./pages/Auth/Signup";
import SettingsBilling from "./pages/Settings/Billing";
import SettingsDeveloper from "./pages/Settings/Developer";

import GhatanaDarta from "./pages/GhatanaDarta/GhatanaDarta";
import TaxEngine from "./pages/Tax/TaxEngine";
import CitizenTrack from "./pages/Citizen/CitizenTrack";
import VerifyDocument from "./pages/Public/VerifyDocument";
import { SocketProvider } from "./context/SocketContext";
import { TooltipProvider } from "./components/ui/tooltip/Tooltip";

export default function App() {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  let subdomain = "";
  if (hostname.includes("localhost") && parts.length > 1) {
    subdomain = parts[0];
  } else if (parts.length > 2) {
    subdomain = parts[0];
  }
  const isNakedDomain = !subdomain || subdomain === "www" || subdomain === "app" || subdomain === "palikaos";

  return (
    <>
      <Toaster position="top-right" />
      <AuthProvider>
        <FeatureFlagProvider>
          <SocketProvider>
            <TooltipProvider delayDuration={300}>
              <Router>
                <ScrollToTop />
              <Routes>
                {/* Marketing Pages */}
                {isNakedDomain ? (
                  <Route element={<MarketingLayout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/how-it-works" element={<HowItWorksPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/docs" element={<DocumentationPage />} />
                    <Route path="/docs/:slug" element={<DocumentationArticlePage />} />
                    <Route path="/api-reference" element={<ApiReferencePage />} />
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms" element={<TermsOfServicePage />} />
                  </Route>
                ) : (
                  <Route path="/" element={<Navigate to="/signin" replace />} />
                )}
                <Route path="/register" element={<RegisterMunicipality />} />

                {/* Dashboard Layout */}
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<ProtectedRoute action="read" subject="dashboard"><Home /></ProtectedRoute>} />

                  {/* Others Page */}
                  <Route path="/profile" element={<ProtectedRoute><UserProfiles /></ProtectedRoute>} />
                  <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                  <Route path="/blank" element={<ProtectedRoute><Blank /></ProtectedRoute>} />
                  
                  <Route path="/users" element={<ProtectedRoute action="read" subject="users"><Users /></ProtectedRoute>} />
                  <Route path="/roles" element={<ProtectedRoute action="read" subject="rbac"><Roles /></ProtectedRoute>} />
                  <Route path="/citizens" element={<ProtectedRoute action="read" subject="citizens"><Citizens /></ProtectedRoute>} />
                  <Route path="/registrations" element={<ProtectedRoute action="read" subject="registration"><Registrations /></ProtectedRoute>} />
                  <Route path="/service-requests" element={<ProtectedRoute action="read" subject="service_requests"><ServiceRequests /></ProtectedRoute>} />
                  <Route path="/complaints" element={<ProtectedRoute action="read" subject="complaints"><Complaints /></ProtectedRoute>} />
                  <Route path="/correspondence" element={<ProtectedRoute action="read" subject="correspondence"><Correspondence /></ProtectedRoute>} />
                  <Route path="/notifications" element={<ProtectedRoute action="read" subject="notifications"><Notifications /></ProtectedRoute>} />
                  <Route path="/audit-logs" element={<ProtectedRoute action="read" subject="audit_logs"><AuditLogs /></ProtectedRoute>} />
                  <Route path="/approvals" element={<ProtectedRoute action="read" subject="ApprovableDocument"><Approvals /></ProtectedRoute>} />
                  <Route path="/feature-flags" element={<ProtectedRoute action="manage" subject="FeatureFlag"><FeatureFlagsAdmin /></ProtectedRoute>} />
                  <Route path="/administrator" element={<ProtectedRoute><TenantAdminDashboard /></ProtectedRoute>} />
                  <Route path="/superadmindashboard" element={<ProtectedRoute action="manage" subject="all"><SuperAdminDashboard /></ProtectedRoute>} />
                  <Route path="/system/tenants" element={<ProtectedRoute action="manage" subject="all"><SuperAdminDashboard /></ProtectedRoute>} />
                  <Route path="/system/billing-admin" element={<ProtectedRoute action="manage" subject="all"><PlatformBilling /></ProtectedRoute>} />
                  <Route path="/system/wards" element={<ProtectedRoute action="manage" subject="system"><WardsAdmin /></ProtectedRoute>} />
                  <Route path="/settings/branding" element={<ProtectedRoute><BrandingSettings /></ProtectedRoute>} />

                  {/* Billing Routes */}
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/billing/verify" element={<BillingVerify />} />

                  {/* Core Municipality */}
                  <Route path="/ghatana-darta" element={<ProtectedRoute action="read" subject="VitalEvent"><GhatanaDarta /></ProtectedRoute>} />
                  <Route path="/tax-engine" element={<ProtectedRoute action="read" subject="Finance"><TaxEngine /></ProtectedRoute>} />

                  {/* Settings */}
                  {/* Departments */}
                  <Route path="/departments/health" element={<ProtectedRoute action="read" subject="health"><Health /></ProtectedRoute>} />
                  <Route path="/departments/education" element={<ProtectedRoute action="read" subject="education"><Education /></ProtectedRoute>} />
                  <Route path="/departments/infrastructure" element={<ProtectedRoute action="read" subject="infrastructure"><Infrastructure /></ProtectedRoute>} />
                  <Route path="/departments/agriculture" element={<ProtectedRoute action="read" subject="agriculture"><Agriculture /></ProtectedRoute>} />
                  <Route path="/departments/finance" element={<ProtectedRoute action="read" subject="finance"><Finance /></ProtectedRoute>} />
                  <Route path="/departments/administrative" element={<ProtectedRoute action="read" subject="administrative"><Administrative /></ProtectedRoute>} />
                  <Route path="/departments/disaster-management" element={<ProtectedRoute action="read" subject="disaster_management"><DisasterManagement /></ProtectedRoute>} />

                  {/* Forms */}
                  <Route path="/form-elements" element={<FormElements />} />

                  {/* Tables */}
                  <Route path="/basic-tables" element={<BasicTables />} />

                  {/* Ui Elements */}
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/avatars" element={<Avatars />} />
                  <Route path="/badge" element={<Badges />} />
                  <Route path="/buttons" element={<Buttons />} />
                  <Route path="/images" element={<Images />} />
                  <Route path="/videos" element={<Videos />} />

                  {/* Charts */}
                  <Route path="/line-chart" element={<LineChart />} />
                  <Route path="/bar-chart" element={<BarChart />} />
                  <Route path="/pie-chart" element={<PieChart />} />

                  {/* Phase 1 - Beauty Studio OS */}
                  <Route path="/services" element={<ProtectedRoute action="read" subject="ServiceCatalog"><ServiceCatalog /></ProtectedRoute>} />
                  <Route path="/clients" element={<ProtectedRoute action="read" subject="ClientProfile"><Clients /></ProtectedRoute>} />
                  <Route path="/staff" element={<ProtectedRoute action="read" subject="StaffProfile"><StaffDirectory /></ProtectedRoute>} />

                  {/* Phase 2 - Academy Core */}
                  <Route path="/academy/courses" element={<ProtectedRoute action="read" subject="Course"><CourseBuilder /></ProtectedRoute>} />
                  <Route path="/academy/batches" element={<ProtectedRoute action="read" subject="Batch"><Batches /></ProtectedRoute>} />
                  <Route path="/academy/attendance" element={<ProtectedRoute action="read" subject="Batch"><AttendanceTracker /></ProtectedRoute>} />
                  
                  {/* Phase 4 - Certifications */}
                  <Route path="/academy/certification-rules" element={<ProtectedRoute action="read" subject="CertificationRequirement"><CertificationRules /></ProtectedRoute>} />
                  <Route path="/academy/batch-progress" element={<ProtectedRoute action="read" subject="CertificationStatus"><BatchProgress /></ProtectedRoute>} />
                  <Route path="/academy/my-progress" element={<ProtectedRoute action="read" subject="CertificationStatus"><StudentProgress /></ProtectedRoute>} />

                  {/* Phase 3 - Booking Engine */}
                  <Route path="/bookings" element={<ProtectedRoute action="read" subject="Appointment"><BookingCalendar /></ProtectedRoute>} />

                  {/* Phase 5 - Inventory & Billing */}
                  <Route path="/inventory" element={<ProtectedRoute action="read" subject="Product"><InventoryManager /></ProtectedRoute>} />
                  <Route path="/billing/invoices" element={<ProtectedRoute action="read" subject="Invoice"><Invoices /></ProtectedRoute>} />
                  <Route path="/billing/commissions" element={<ProtectedRoute action="read" subject="Commission"><CommissionsReport /></ProtectedRoute>} />

                  {/* Phase 6 - Portals */}
                  <Route path="/portal/client" element={<ProtectedRoute action="read" subject="Portal"><ClientPortal /></ProtectedRoute>} />
                  <Route path="/portal/student" element={<ProtectedRoute action="read" subject="Portal"><StudentPortal /></ProtectedRoute>} />

                  {/* Phase 7 - Notifications */}
                  <Route path="/notifications/templates" element={<ProtectedRoute action="read" subject="Notification"><NotificationTemplates /></ProtectedRoute>} />
                  <Route path="/notifications/communication-center" element={<ProtectedRoute action="read" subject="Notification"><CommunicationCenter /></ProtectedRoute>} />
                  <Route path="/notifications/logs" element={<ProtectedRoute action="read" subject="Notification"><NotificationLogs /></ProtectedRoute>} />

                  {/* Phase 8 - Analytics */}
                  <Route path="/analytics" element={<ProtectedRoute action="read" subject="Report"><AnalyticsDashboard /></ProtectedRoute>} />

                  {/* Phase 9 - AI Layer */}
                  <Route path="/academy/ai-ocr" element={<ProtectedRoute action="read" subject="AiFeature"><OcrIntake /></ProtectedRoute>} />

                  {/* Phase 10 - SaaS Settings */}
                  <Route path="/settings/billing" element={<ProtectedRoute><SettingsBilling /></ProtectedRoute>} />
                  <Route path="/settings/developer" element={<ProtectedRoute><SettingsDeveloper /></ProtectedRoute>} />
                </Route>

                {/* Public Citizen Portal */}
                <Route path="/citizen/track" element={<CitizenTrack />} />
                <Route path="/verify/:hash" element={<VerifyDocument />} />

                {/* Auth Layout */}
                <Route path="/sifaris" element={<SifarisList />} />
                <Route path="/sifaris/admin" element={<SifarisAdmin />} />

                <Route path="/signin" element={<SignIn />} />
                <Route path="/login" element={<OTPLogin />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Phase 10 - Public Signup */}
                <Route path="/signup" element={<Signup />} />

                {/* Fallback Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            </TooltipProvider>
          </SocketProvider>
        </FeatureFlagProvider>
      </AuthProvider>
    </>
  );
}
