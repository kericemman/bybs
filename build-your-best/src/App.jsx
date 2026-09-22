import { Navigate, Routes, Route, useParams } from "react-router-dom";
import { lazy, Suspense } from "react";
import PublicLayout from "./layouts/PublicLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import BrandLoader from "./components/public/BrandLoader";
import { PERMISSIONS } from "./utils/adminPermissions";

const Home = lazy(() => import("./pages/public/Home"));
const ProductsComponent = lazy(() => import("./pages/public/Shop"));
const ProductDetails = lazy(() => import("./pages/public/ProductDetails"));
const About = lazy(() => import("./pages/public/About"));
const CoachingPackages = lazy(() => import("./pages/public/Coaching"));
const ContactPage = lazy(() => import("./pages/public/Contact"));
const QuizResults = lazy(() => import("./pages/public/Discovery"));
const FAQPage = lazy(() => import("./pages/public/Faqs"));
const PrivacyPolicy = lazy(() => import("./pages/public/Privacy-Policy"));
const TermsAndConditions = lazy(() => import("./pages/public/Terms"));
const FellowshipLanding = lazy(() => import("./pages/public/Fellowship"));
const FellowshipApplication = lazy(() => import("./pages/public/FellowshipApplication"));
const EmpowerHerInitiative = lazy(() => import("./pages/public/EmpowerHer"));
const CommunityOutreach = lazy(() => import("./pages/public/Outreach"));
const CohortsPage = lazy(() => import("./pages/public/CohortPage"));
const CohortDetailPage = lazy(() =>
  import("./pages/public/CohortPage").then((module) => ({ default: module.CohortDetailPage }))
);
const Login = lazy(() => import("./pages/public/Login"));
const ArticlesPage = lazy(() => import("./pages/public/Articles"));
const ArticleDetails = lazy(() => import("./pages/public/ArticleDetails"));
const Checkout = lazy(() => import("./pages/public/Checkout"));
const Programs = lazy(() => import("./pages/public/Programs"));
const CommunityPage = lazy(() => import("./pages/public/Community"));
const CommunityComingSoon = lazy(() => import("./pages/public/CommunityComingSoon"));
const Impact = lazy(() => import("./pages/public/Impact"));
const ImpactDetails = lazy(() => import("./pages/public/ImpactDetails"));
const GetInvolved = lazy(() => import("./pages/public/GetInvolved"));
const ParticipationPage = lazy(() => import("./pages/public/ParticipationPage"));
const Support = lazy(() => import("./pages/public/Support"));
const Reflections = lazy(() => import("./pages/public/Reflections"));
const ReflectionDetails = lazy(() => import("./pages/public/ReflectionDetails"));
const ReflectionSubmit = lazy(() => import("./pages/public/ReflectionSubmit"));
const NotFound = lazy(() => import("./pages/public/NotFound"));
const TestimonialSubmit = lazy(() => import("./pages/public/TestimonialSubmit"));

const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ArticleForm = lazy(() => import("./pages/admin/ArticleForm"));
const Articles = lazy(() => import("./pages/admin/Articles"));
const AdminCohorts = lazy(() => import("./pages/admin/AdminCohorts"));
const AdminWaitlist = lazy(() => import("./pages/admin/AdminWaitlist"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProduct"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminSubscribers = lazy(() => import("./pages/admin/AdminSubcribers"));
const AdminFellowshipApplications = lazy(() => import("./pages/admin/AdminFellowshipApplications"));
const AdminManagers = lazy(() => import("./pages/admin/AdminManagers"));
const AdminChangePassword = lazy(() => import("./pages/admin/AdminChangePassword"));
const AdminImpact = lazy(() => import("./pages/admin/AdminImpact"));
const AdminReflections = lazy(() => import("./pages/admin/AdminReflections"));
const AdminParticipation = lazy(() => import("./pages/admin/AdminParticipation"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials"));

function RouteLoading() {
  return <BrandLoader label="Loading BYBS" size="lg" minHeight="min-h-[50vh]" />;
}

function LegacyInsightRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/insights/${slug}`} replace />;
}

function LegacyCohortRedirect({ apply = false }) {
  const { cohortSlug } = useParams();
  return (
    <Navigate to={`/programs/fellowship/cohorts/${cohortSlug}${apply ? "/apply" : ""}`} replace />
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/founder" element={<Navigate to="/about" replace />} />
          <Route path="/shop" element={<ProductsComponent />} />
          <Route path="/shop/:slug" element={<ProductDetails />} />
          <Route path="/coaching" element={<Navigate to="/programs/mentorship" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/discovery" element={<QuizResults />} />
          <Route path="/order-request" element={<Checkout />} />
          <Route path="/checkout" element={<Navigate to="/shop" replace />} />

          <Route path="/faqs" element={<FAQPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/payment/success" element={<Navigate to="/shop" replace />} />
          <Route
            path="/coaching-success"
            element={<Navigate to="/programs/mentorship" replace />}
          />
          <Route path="/fellowship" element={<Navigate to="/programs/fellowship" replace />} />
          {/* <Route path="/fellowship/cohort-4" element={<FellowshipCohort4 />} /> */}
          <Route
            path="/fellowship/apply"
            element={<Navigate to="/programs/fellowship" replace />}
          />
          <Route path="/fellowship/:cohortSlug/apply" element={<FellowshipApplication />} />

          <Route path="/empowerher" element={<Navigate to="/programs/empowerher" replace />} />
          <Route path="/outreach" element={<Navigate to="/programs/outreach" replace />} />
          <Route path="/cohorts" element={<Navigate to="/programs/fellowship/cohorts" replace />} />
          <Route path="/cohorts/:cohortSlug" element={<LegacyCohortRedirect />} />
          <Route path="/cohorts/:cohortSlug/apply" element={<LegacyCohortRedirect apply />} />
          <Route path="/articles" element={<Navigate to="/insights" replace />} />
          <Route path="/articles/:slug" element={<LegacyInsightRedirect />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/fellowship" element={<FellowshipLanding />} />
          <Route path="/programs/fellowship/cohorts" element={<CohortsPage />} />
          <Route path="/programs/fellowship/cohorts/:cohortSlug" element={<CohortDetailPage />} />
          <Route
            path="/programs/fellowship/cohorts/:cohortSlug/apply"
            element={<FellowshipApplication />}
          />
          <Route path="/programs/mentorship" element={<CoachingPackages />} />
          <Route path="/programs/empowerher" element={<EmpowerHerInitiative />} />
          <Route path="/programs/outreach" element={<CommunityOutreach />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/reflections" element={<Reflections />} />
          <Route path="/community/reflections/submit" element={<ReflectionSubmit />} />
          <Route path="/community/reflections/:slug" element={<ReflectionDetails />} />
          <Route path="/community/testimonials/submit" element={<TestimonialSubmit />} />
          <Route path="/community/stories" element={<CommunityComingSoon type="stories" />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/impact/:slug" element={<ImpactDetails />} />
          <Route path="/insights" element={<ArticlesPage />} />
          <Route path="/insights/:slug" element={<ArticleDetails />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/get-involved/volunteer" element={<ParticipationPage type="volunteer" />} />
          <Route path="/get-involved/mentor" element={<ParticipationPage type="mentor" />} />
          <Route path="/get-involved/partner" element={<ParticipationPage type="partner" />} />
          <Route path="/support" element={<Support />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* AUTH */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin/change-password"
          element={
            <ProtectedRoute>
              <AdminChangePassword />
            </ProtectedRoute>
          }
        />

        {/* ADMIN (PROTECTED) */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/articles"
          element={
            <ProtectedRoute permission={PERMISSIONS.ARTICLES_MANAGE}>
              <Articles />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/articles/new"
          element={
            <ProtectedRoute permission={PERMISSIONS.ARTICLES_MANAGE}>
              <ArticleForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/cohorts"
          element={
            <ProtectedRoute adminOnly>
              <AdminCohorts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/community-actions"
          element={
            <ProtectedRoute adminOnly>
              <AdminImpact />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/impact"
          element={
            <ProtectedRoute adminOnly>
              <AdminImpact />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reflections"
          element={
            <ProtectedRoute adminOnly>
              <AdminReflections />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/participation"
          element={
            <ProtectedRoute adminOnly>
              <AdminParticipation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/testimonials"
          element={
            <ProtectedRoute adminOnly>
              <AdminTestimonials />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/cohorts/new"
          element={
            <ProtectedRoute adminOnly>
              <AdminCohorts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/cohorts/:id/edit"
          element={
            <ProtectedRoute adminOnly>
              <AdminCohorts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/waitlist"
          element={
            <ProtectedRoute adminOnly>
              <AdminWaitlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute adminOnly>
              <AdminProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute adminOnly>
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/fellowship-applications"
          element={
            <ProtectedRoute permission={PERMISSIONS.APPLICATIONS_SCREEN}>
              <AdminFellowshipApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/subscribers"
          element={
            <ProtectedRoute adminOnly>
              <AdminSubscribers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/managers"
          element={
            <ProtectedRoute adminOnly>
              <AdminManagers />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}
