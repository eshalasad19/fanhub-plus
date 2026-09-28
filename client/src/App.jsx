import { Suspense, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Chatbot from "./chatbot/Chatbot.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PageLoader from "./components/PageLoader.jsx";
import WebsiteFeedbackModal from "./components/WebsiteFeedbackModal.jsx";


import ContentExplorer      from "./pages/ContentExplorer.jsx";
import CategoryPage         from "./pages/CategoryPage.jsx";
import ContentDetail        from "./pages/ContentDetail.jsx";
import CharacterList        from "./pages/Characters.jsx";
import CharacterDetail      from "./pages/CharacterDetail.jsx";
import ArticleList          from "./pages/ArticleList.jsx";
import ArticleDetail        from "./pages/ArticleDetail.jsx";
import MultimediaCenter     from "./pages/MultimediaCenter.jsx";
import MerchandiseShowcase  from "./pages/MerchandiseShowcase.jsx";
import MerchandiseDetail    from "./pages/MerchandiseDetail.jsx";
import UpcomingReleases     from "./pages/UpcomingReleases.jsx";
import Events               from "./pages/Events.jsx";
import EventDetail          from "./pages/EventDetail.jsx";


import Login          from "./auth/Login.jsx";
import Register       from "./auth/Register.jsx";
import ForgotPassword from "./auth/ForgotPassword.jsx";
import ResetPassword  from "./auth/ResetPassword.jsx";
import VerifyEmail    from "./auth/VerifyEmail.jsx";
import Dashboard       from "./user/Dashboard.jsx";
import Profile         from "./user/Profile.jsx";
import Bookmarks       from "./user/Bookmarks.jsx";
import Notes           from "./user/Notes.jsx";
import Feedback         from "./user/Feedback.jsx";
import SubmitFanContent from "./user/SubmitFanContent.jsx";
import Favourites       from "./user/Favourites.jsx";
import Community        from "./user/Community.jsx";
import ContributorProfile from "./user/ContributorProfile.jsx";
import ContentAnalytics from "./user/ContentAnalytics.jsx";
import TagsPage          from "./pages/TagsPage.jsx";


import AdminLayout          from "./admin/AdminLayout.jsx";
import AdminDashboard       from "./admin/AdminDashboard.jsx";
import AdminUsers           from "./admin/users/AdminUsers.jsx";
import AdminCategories      from "./admin/categories/AdminCategories.jsx";
import AdminContent         from "./admin/content/AdminContent.jsx";
import AdminCharacters      from "./admin/characters/AdminCharacters.jsx";
import AdminArticles        from "./admin/articles/AdminArticles.jsx";
import AdminMultimedia      from "./admin/multimedia/AdminMultimedia.jsx";
import AdminMerchandise     from "./admin/merchandise/AdminMerchandise.jsx";
import AdminEvents          from "./admin/events/AdminEvents.jsx";
import AdminSubmissions     from "./admin/submissions/AdminSubmissions.jsx";
import AdminFeedback        from "./admin/feedback/AdminFeedback.jsx";
import AdminChatbot         from "./admin/chatbot/AdminChatbot.jsx";
import AdminTags            from "./admin/tags/AdminTags.jsx";
import AdminReleases        from "./admin/releases/AdminReleases.jsx";
import AdminAnalytics       from "./admin/analytics/AdminAnalytics.jsx";


const ROUTE_LABELS = {
  "/":            "Loading Home",
  "/explore":     "Loading Explorer",
  "/characters":  "Loading Characters",
  "/articles":    "Loading Articles",
  "/multimedia":  "Loading Multimedia",
  "/merchandise": "Loading Merchandise",
  "/releases":    "Loading Releases",
  "/events":      "Loading Events",
  "/dashboard":   "Loading Dashboard",
  "/profile":     "Loading Profile",
  "/bookmarks":   "Loading Bookmarks",
  "/notes":       "Loading Notes",
  "/favourites":  "Loading Favourites",
  "/tags":        "Loading Tags",
  "/community":   "Loading Contributors",
  "/analytics":   "Loading Analytics",
  "/login":       "Loading",
  "/register":    "Loading",
  "/admin":       "Loading Admin Panel",
};

const getRouteLabel = (pathname) => {
  if (pathname.startsWith("/admin"))       return "Loading Admin Panel";
  if (pathname.startsWith("/category/"))  return "Loading Category";
  if (pathname.startsWith("/content/"))   return "Loading Content";
  if (pathname.startsWith("/characters/")) return "Loading Character";
  if (pathname.startsWith("/articles/"))  return "Loading Article";
  if (pathname.startsWith("/events/"))    return "Loading Event";
  if (pathname.startsWith("/merchandise/")) return "Loading Item";
  if (pathname.startsWith("/community/"))  return "Loading Contributor";
  return ROUTE_LABELS[pathname] || "Loading";
};



const RouteLoader = () => {
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(false);
  const [loaderText, setLoaderText] = useState("Loading");
  const prevPath = useState(location.pathname)[0];

  useEffect(() => {
    
    setLoaderText(getRouteLabel(location.pathname));
    setShowLoader(true);
    const t = setTimeout(() => setShowLoader(false), 700);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return <PageLoader show={showLoader} text={loaderText} />;
};

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <RouteLoader />

      <Routes>
        <Route path="/"                    element={<><Navbar /><Home /></>} />
        <Route path="/explore"             element={<><Navbar /><ContentExplorer /></>} />
        <Route path="/category/:name"      element={<><Navbar /><CategoryPage /></>} />
        <Route path="/content/:id"         element={<><Navbar /><ProtectedRoute><ContentDetail /></ProtectedRoute></>} />
        <Route path="/characters"          element={<><Navbar /><CharacterList /></>} />
        <Route path="/characters/:id"      element={<><Navbar /><ProtectedRoute><CharacterDetail /></ProtectedRoute></>} />
        <Route path="/articles"            element={<><Navbar /><ArticleList /></>} />
        <Route path="/articles/:id"        element={<><Navbar /><ProtectedRoute><ArticleDetail /></ProtectedRoute></>} />
        <Route path="/multimedia"          element={<><Navbar /><MultimediaCenter /></>} />
        <Route path="/merchandise"         element={<><Navbar /><MerchandiseShowcase /></>} />
        <Route path="/merchandise/:id"     element={<><Navbar /><ProtectedRoute><MerchandiseDetail /></ProtectedRoute></>} />
        <Route path="/releases"            element={<><Navbar /><UpcomingReleases /></>} />
        <Route path="/events"              element={<><Navbar /><Events /></>} />
        <Route path="/events/:id"          element={<><Navbar /><ProtectedRoute><EventDetail /></ProtectedRoute></>} />

        <Route path="/login"                     element={<><Navbar /><Login /></>} />
        <Route path="/register"                  element={<><Navbar /><Register /></>} />
        <Route path="/forgot-password"           element={<><Navbar /><ForgotPassword /></>} />
        <Route path="/reset-password/:token"     element={<><Navbar /><ResetPassword /></>} />
        <Route path="/verify-email/:token"       element={<><Navbar /><VerifyEmail /></>} />

        <Route path="/dashboard" element={<><Navbar /><ProtectedRoute><Dashboard /></ProtectedRoute></>} />
        <Route path="/profile"   element={<><Navbar /><ProtectedRoute><Profile /></ProtectedRoute></>} />
        <Route path="/bookmarks" element={<><Navbar /><ProtectedRoute><Bookmarks /></ProtectedRoute></>} />
        <Route path="/notes"     element={<><Navbar /><ProtectedRoute><Notes /></ProtectedRoute></>} />
        <Route path="/feedback"  element={<><Navbar /><ProtectedRoute><Feedback /></ProtectedRoute></>} />
        <Route path="/submit"    element={<><Navbar /><ProtectedRoute><SubmitFanContent /></ProtectedRoute></>} />
        <Route path="/favourites" element={<><Navbar /><ProtectedRoute><Favourites /></ProtectedRoute></>} />
        <Route path="/tags"       element={<><Navbar /><ProtectedRoute><TagsPage /></ProtectedRoute></>} />
        <Route path="/community"     element={<><Navbar /><ProtectedRoute><Community /></ProtectedRoute></>} />
        <Route path="/community/:id" element={<><Navbar /><ProtectedRoute><ContributorProfile /></ProtectedRoute></>} />
        <Route path="/analytics" element={<><Navbar /><ProtectedRoute><ContentAnalytics /></ProtectedRoute></>} />

        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
          <Route index             element={<AdminDashboard />} />
          <Route path="users"      element={<AdminUsers />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="content"    element={<AdminContent />} />
          <Route path="characters" element={<AdminCharacters />} />
          <Route path="articles"   element={<AdminArticles />} />
          <Route path="multimedia" element={<AdminMultimedia />} />
          <Route path="merchandise" element={<AdminMerchandise />} />
          <Route path="releases"   element={<AdminReleases />} />
          <Route path="events"     element={<AdminEvents />} />
          <Route path="submissions" element={<AdminSubmissions />} />
          <Route path="feedback"   element={<AdminFeedback />} />
          <Route path="chatbot"    element={<AdminChatbot />} />
          <Route path="tags"       element={<AdminTags />} />
          <Route path="analytics"  element={<AdminAnalytics />} />
        </Route>
      </Routes>

      {!isAdminRoute && <Chatbot />}
      {!isAdminRoute && <WebsiteFeedbackModal />}
    </>
  );
}

export default App;
