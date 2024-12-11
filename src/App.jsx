import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
// import ProtectedRoute from "./components/ProtectedRoute";
import Policies from "./pages/Policies";
import DirectoratesPolicies from "./pages/DirectoratePolicies";
import Settings from "./pages/Settings";
import SubmittedPolicies from "./pages/SubmittedPolicies";
import Policy from "./pages/Policy";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Programs from "./pages/Programs";
import Directorates from "./pages/Directorates";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      // staleTime: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />} />

          {/* <Route element={<ProtectedRoute />}> */}
          <Route element={<AppLayout />}>
            <Route index element={<Navigate replace to="dashboard" />} />
            <Route path="dashboard" element={<Home />} />
            <Route
              path="dashboard/program-directorates"
              element={<DirectoratesPolicies />}
            />
            <Route
              path="dashboard/program-directorates/programs"
              element={<Programs />}
            />
            <Route
              path="dashboard/program-directorates/directorates"
              element={<Directorates />}
            />
            <Route path="/dashboard/policies" element={<Policy />} />
            <Route
              path="/dashboard/policies/all-policies"
              element={<Policies />}
            />
            <Route
              path="/dashboard/policies/submitted-policies"
              element={<SubmittedPolicies />}
            />

            <Route path="dashboard/settings" element={<Settings />} />
          </Route>
          {/* </Route> */}
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
