import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import "./style.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import OneStory from "./pages/oneStory/OneStory";
import { useIsTokenExpired } from "./cookie/expCookie";



function App() {
  

  const { darkMode } = useContext(DarkModeContext);
  const {currentUser} = useContext(AuthContext);

  const queryClient = new QueryClient()


  const Layout = () => {
    return (
      //when we need to use useQuery we must to use <QueryClientProvider client={queryClient}>
      <QueryClientProvider client={queryClient}>
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <Navbar />
        <div style={{ display: "flex" }}>
          <LeftBar />
          <div style={{ flex: 6 }}>
            <Outlet />
          </div>
          <RightBar />
        </div>
      </div>
      </QueryClientProvider>
    );
  };


  const ProtectedRoute = ({ children }) => {
    const isExpired = useIsTokenExpired();
    const location = useLocation();
    const navigate = useNavigate();
    
    if (!currentUser || isExpired) {
      navigate(`/login`, { state: { from: location } });
      return null;
    }
    
    return children;
  };
    
    

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element:  <ProtectedRoute>
              <Home />
            </ProtectedRoute>,
        },
        {
          path: "/profile/:id",
          element: <ProtectedRoute>
              <Profile />
            </ProtectedRoute>,
        },
        {
          path: "/story/:id",
          element: <ProtectedRoute>
              <OneStory />
            </ProtectedRoute>,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
