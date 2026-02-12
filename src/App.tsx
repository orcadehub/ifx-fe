import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { DashboardProvider } from "@/context/DashboardContext";
import Index from "./pages/Index";
import InfluencersPage from "./pages/influencers/simple";
import InfluencerDetailPage from "./pages/influencers/detail";
import ChatsPage from "./pages/chats";
import ReachPage from "./pages/reach";
import ServicesPage from "./pages/services";
import OrdersPage from "./pages/orders";
import PlaceOrderPage from "./pages/orders/place";
import RequestsPage from "./pages/requests";
import LandingPage from "./pages/landing";
import SignUpPage from "./pages/auth/signup";
import SignInPage from "./pages/auth/signin";
import AdminDashboard from "./pages/dashboard/admin";
import InfluencerDashboard from "./pages/dashboard/influencer";
import BusinessDashboard from "./pages/dashboard/business";
import BusinessProfile from "./pages/account/business";
import InfluencerProfile from "./pages/account/influencer";
import AdminProfile from "./pages/account/admin";
import SettingsPage from "./pages/account/settings";
import NotificationsPage from "./pages/notifications";
import NotFound from "./pages/NotFound";
import { BillingPage } from "./pages/billing";
import OnboardPage from "./pages/onboard";
import { ErrorBoundary } from "./components/ErrorBoundary";
import AnalyticsPage from "./pages/dashboard/admin/analytics";
import TeamManagementPage from "./pages/dashboard/admin/team";
import SiteSettingsPage from "./pages/dashboard/admin/settings";
import BusinessUsersPage from "./pages/dashboard/admin/business-users";
import InfluencersManagementPage from "./pages/dashboard/admin/influencers";
import OffersPage from "./pages/offers";
import MarketingDashboard from "./pages/dashboard/admin/marketing";
import AdminSupportPage from "./pages/admin/support";
import SupportPage from "./pages/support";
import BusinessWalletPage from "./pages/wallet/business";
import InfluencerWalletPage from "./pages/wallet/influencer";
import AdminWalletSettingsPage from "./pages/dashboard/admin/wallet-settings";
import AdminWalletTransactionsPage from "./pages/dashboard/admin/wallet-transactions";
import CheckoutPage from "./pages/checkout";
import PaymentPage from "./pages/payment";
import ServiceOrdersPage from "./pages/dashboard/admin/service-orders";
import ServiceOrderDetailPage from "./pages/dashboard/admin/service-order-detail";
import ReportsPage from "./pages/reports";
import FeaturesPage from "./pages/features";
import AboutPage from "./pages/about";
import ContactPage from "./pages/contact";
import PricingPage from "./pages/pricing";
import AdminReportsPage from "./pages/admin/reports/AdminReportsPage";
import WishlistPage from "./pages/wishlist";
import PublicProfilePage from "./pages/profile";
import SuccessPage from "./pages/auth/success";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 30000,
        refetchOnWindowFocus: false,
        meta: {
          errorHandler: (error: Error) => {
            console.error("Query error:", error);
          }
        }
      }
    }
  });

  return (
    <ThemeProvider defaultTheme="system">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ErrorBoundary>
            <BrowserRouter>
              <DashboardProvider>
                <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/app" element={<Index />} />
                
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/auth/success" element={<SuccessPage />} />
                
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                
                <Route path="/influencers" element={<InfluencersPage />} />
                <Route path="/influencers/simple" element={<InfluencersPage />} />
                <Route path="/influencers/simple/:id" element={<InfluencersPage />} />
                <Route path="/influencers/:id" element={<InfluencerDetailPage />} />
                <Route path="/chats" element={<ChatsPage />} />
                <Route path="/reach" element={<ReachPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/place" element={<PlaceOrderPage />} />
                <Route path="/requests" element={<RequestsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/offers" element={<OffersPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                
                <Route path="/wallet/business" element={<BusinessWalletPage />} />
                <Route path="/wallet/influencer" element={<InfluencerWalletPage />} />
                
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
                <Route path="/dashboard/admin/analytics" element={<AnalyticsPage />} />
                <Route path="/dashboard/admin/team" element={<TeamManagementPage />} />
                <Route path="/dashboard/admin/settings" element={<SiteSettingsPage />} />
                <Route path="/dashboard/admin/business-users" element={<BusinessUsersPage />} />
                <Route path="/dashboard/admin/influencers" element={<InfluencersManagementPage />} />
                <Route path="/dashboard/admin/marketing" element={<MarketingDashboard />} />
                <Route path="/dashboard/admin/wallet-settings" element={<AdminWalletSettingsPage />} />
                <Route path="/dashboard/admin/wallet-transactions" element={<AdminWalletTransactionsPage />} />
                <Route path="/dashboard/admin/service-orders" element={<ServiceOrdersPage />} />
                <Route path="/dashboard/admin/service-orders/:id" element={<ServiceOrderDetailPage />} />
                <Route path="/admin/support" element={<AdminSupportPage />} />
                <Route path="/admin/reports" element={<AdminReportsPage />} />
                <Route path="/dashboard/influencer" element={<InfluencerDashboard />} />
                <Route path="/dashboard/business" element={<BusinessDashboard />} />
                
                <Route path="/account/business" element={<BusinessProfile />} />
                <Route path="/account/influencer" element={<InfluencerProfile />} />
                <Route path="/account/admin" element={<AdminProfile />} />
                <Route path="/account/influencerprofile" element={<Navigate to={`/account/${localStorage.getItem("userType") || "business"}`} replace />} />
                <Route path="/account/settings" element={<SettingsPage />} />
                <Route path="/billing" element={<BillingPage />} />
                <Route path="/onboard" element={<OnboardPage />} />
                
                <Route path="/account" element={
                  <Navigate to={`/account/${localStorage.getItem("userType") || "business"}`} replace />
                } />
                
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                
                <Route path="/profile/:userid" element={<PublicProfilePage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              </DashboardProvider>
            </BrowserRouter>
          </ErrorBoundary>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
