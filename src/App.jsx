import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Home,
  Correspondence,
  Staffs,
  Settings,
  Account,
  Login,
} from "./pages/index";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate replace to="dashboard" />} />
            <Route path="dashboard" element={<Home />} />
            <Route path="dashboard/program-directorates" element={<Staffs />} />
            <Route path="dashboard/policies" element={<Correspondence />} />
            <Route path="dashboard/settings" element={<Settings />} />
            <Route path="dashboard/account" element={<Account />} />
            {/* <Route
              path="dashboard/correspondences/details/:id"
              element={<Details />}
            /> */}
          </Route>
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
