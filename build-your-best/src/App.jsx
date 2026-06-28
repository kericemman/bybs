import { Routes, Route } from "react-router-dom";

import Home from "./pages/public/Home";
import ProductsComponent from "./pages/public/Shop";
import About from "./pages/public/About";
import CoachingPackages from "./pages/public/Coaching";
import ContactPage from "./pages/public/Contact";
import QuizResults from "./pages/public/Discovery";

import FAQPage from "./pages/public/Faqs";
import PrivacyPolicy from "./pages/public/Privacy-Policy";
import TermsAndConditions from "./pages/public/Terms";
import Founder from "./pages/public/Founder";

import CoachingSuccess from "./pages/public/CoachingSuccess";
import FellowshipLanding from "./pages/public/Fellowship";

import FellowshipApplication from "./pages/public/FellowshipApplication";
import EmpowerHerInitiative from "./pages/public/EmpowerHer";
import CommunityOutreach from "./pages/public/Outreach";
import CohortsPage, { CohortDetailPage } from "./pages/public/CohortPage";


import PublicLayout from "./layouts/PublicLayout";

import ProtectedRoute from "./components/admin/ProtectedRoute";

import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/public/Login";
import ArticleForm from "./pages/admin/ArticleForm";
import Articles from "./pages/admin/Articles";
import Payments from "./pages/admin/Payments";
import ArticlesPage from "./pages/public/Articles";
import ArticleDetails from "./pages/public/ArticleDetails";
import AdminCohorts from "./pages/admin/AdminCohorts";
import AdminWaitlist from "./pages/admin/AdminWaitlist";
import AdminProducts from "./pages/admin/AdminProduct";
import AdminOrders from "./pages/admin/AdminOrders";
import ProductDetails from "./pages/public/ProductDetails";
import AdminSubscribers from "./pages/admin/AdminSubcribers";
import PaymentSuccess from "./pages/public/Successpage";
import CharityMerchLanding from "./pages/public/CharityMerchLanding";
import AdminCharityMerchOrders from "./pages/admin/AdminCharityMerchOrders";
import Checkout from "./pages/public/Checkout";
import AdminFellowshipApplications from "./pages/admin/AdminFellowshipApplications";


export default function AppRoutes() {
  return (
    <>
      
      

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/founder" element={<About />} />
          <Route path="/shop" element={<ProductsComponent />} />
          <Route path="/shop/:slug" element={<ProductDetails />} />
          <Route path="/coaching" element={<CoachingPackages />} />
          <Route path="/about" element={<Founder />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/discovery" element={<QuizResults />} />
          <Route path="/charity-merch" element={<CharityMerchLanding />} />
          <Route path="/checkout" element={<Checkout />} />
          
          <Route path="/faqs" element={<FAQPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          
          
          <Route path="/coaching-success" element={<CoachingSuccess />} />
          <Route path="/fellowship" element={<FellowshipLanding />} />
          {/* <Route path="/fellowship/cohort-4" element={<FellowshipCohort4 />} /> */}
          <Route path="/fellowship/apply" element={<FellowshipApplication />} />
          <Route path="/fellowship/:cohortSlug/apply" element={<FellowshipApplication />} />
         
          <Route path="/empowerher" element={<EmpowerHerInitiative />} />
          <Route path="/outreach" element={<CommunityOutreach />} />
          <Route path="/cohorts" element={<CohortsPage />} />
          <Route path="/cohorts/:cohortSlug" element={<CohortDetailPage />} />
          <Route path="/cohorts/:cohortSlug/apply" element={<FellowshipApplication />} />
          <Route path="/articles" element={<ArticlesPage />}/>
          <Route path="/articles/:slug" element={<ArticleDetails />} />
        </Route>

        {/* AUTH */}
        <Route path="/admin/login" element={<Login />} />

        {/* ADMIN (PROTECTED) */}
        <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

        <Route
            path="/admin/articles"
            element={
              <ProtectedRoute>
                <Articles />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/articles/new"
            element={
              <ProtectedRoute>
                <ArticleForm />
              </ProtectedRoute>
            }
          />

        <Route
            path="/admin/payments"
            element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/cohorts"
            element={
              <ProtectedRoute>
                <AdminCohorts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/cohorts/new"
            element={
              <ProtectedRoute>
                <AdminCohorts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/cohorts/:id/edit"
            element={
              <ProtectedRoute>
                <AdminCohorts />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin/waitlist"
            element={
              <ProtectedRoute>
                <AdminWaitlist />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <ProtectedRoute>
                <AdminProducts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute>
                <AdminOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/charity-merch"
            element={
              <ProtectedRoute>
                <AdminCharityMerchOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/fellowship-applications"
            element={
              <ProtectedRoute>
                <AdminFellowshipApplications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/subscribers"
            element={
              <ProtectedRoute>
                <AdminSubscribers />
              </ProtectedRoute>
            }
          />


          


        
      </Routes>
    </>
  );
}
