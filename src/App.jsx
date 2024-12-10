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

function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
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
          <Route path="/dashboard/policies" element={<Policies />} />
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
  );
}

export default App;
