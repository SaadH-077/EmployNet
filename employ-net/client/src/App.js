import "./App.css";
import { Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EmployeeHomePage from "./pages/EmployeeHomepage";
import UserProvider from "./context/UserContext";
import ProtectedLayout from "./layouts/ProtectedLayout";
import EmployeeUpdate from "./pages/EmployeeUpdateInfo";
import EmployeePersonalInfo from "./pages/EmployeeViewInfo";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ViewAttendance from "./pages/ViewAttendance";
import BenefitsClaim from "./pages/BenefitsClaim";
import ManagerDashboard from "./pages/ManagerDashboard";
import RoomBookings from "./pages/RoomBookings";
import MangerUpdate from "./pages/ManagerUpdateInfo";
import ManagerPersonalInfo from "./pages/ManagerViewInfo";
import ManagerSignup from "./pages/ManagerSignup";
import EmployeeSignup from "./pages/EmployeeSignup";
import ManagerTeamView from "./pages/ManagerTeamView";
import ManagerTeamViewInfo from "./pages/ManagerTeamViewInfo";
import EmployeeManager from "./pages/EmlpoyeeManagerInfo";
import EmployeeSettings from "./pages/EmployeeSettings";
import ManagerSettings from "./pages/ManagerSettings";
import RequestLeave from "./pages/RequestLeave";
import ViewLeaveRequests from "./pages/ViewLeaveRequests";
import ResetPassword from "./pages/ResetPassword";
import OtpVerification from "./pages/OtpVerification";
import ViewRoomBookings from "./pages/ViewRoomBookings";
import ViewApprovedLeaves from "./pages/ViewApprovedLeaves";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { themeOptions } from "./themes/themeOptions";
import EmployeeLayout from "./layouts/EmployeeLayout";
import ManagerLayout from "./layouts/ManagerLayout";
// This is the main entry point of our React application.
// The App component handles routing using react-router-dom and wraps the entire application with the UserProvider context provider to manage user authentication state.
// It defines routes for different pages/components such as Login, Signup, EmployeeHomepage, EmployeeUpdateInfo, EmployeeViewInfo, EmployeeDashboard, and ViewAttendance.
// Additionally, it utilizes a ProtectedLayout to restrict access to certain routes based on user authentication status.

const theme = createTheme(themeOptions);

function App() {
    return (
        // <ThemeProvider theme={theme}>
        <UserProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />

                    <Route path="/signup" element={<Signup />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    <Route path="/signup/manager" element={<ManagerSignup />} />
                    <Route
                        path="/signup/employee"
                        element={<EmployeeSignup />}
                    />

                    <Route element={<ProtectedLayout />}>
                        <Route path="/otp" element={<OtpVerification />} />

                        <Route element={<EmployeeLayout />}>
                            <Route
                                path="/employee-update"
                                element={<EmployeeUpdate />}
                            />
                            <Route
                                path="/employee-dashboard"
                                element={<EmployeeDashboard />}
                            />
                            <Route
                                path="/employee-manager"
                                element={<EmployeeManager />}
                            />
                            <Route
                                path="/employee-info"
                                element={<EmployeePersonalInfo />}
                            />
                            <Route
                                path="/benefits-claim"
                                element={<BenefitsClaim />}
                            />
                            <Route
                                path="/room-bookings"
                                element={<RoomBookings />}
                            />
                            <Route
                                path="/emp-settings"
                                element={<EmployeeSettings />}
                            />
                            <Route
                                path="/request-leave"
                                element={<RequestLeave />}
                            />
                            <Route
                                path="/view-attendance"
                                element={<ViewAttendance />}
                            />
                            <Route
                                path="/view-bookings"
                                element={<ViewRoomBookings />}
                            />
                            <Route
                                path="/view-approved-leaves"
                                element={<ViewApprovedLeaves />}
                            />
                        </Route>

                        <Route element={<ManagerLayout />}>
                            <Route
                                path="/manager-dashboard"
                                element={<ManagerDashboard />}
                            />

                            <Route
                                path="/manager-update"
                                element={<MangerUpdate />}
                            />
                            <Route
                                path="/manager-info"
                                element={<ManagerPersonalInfo />}
                            />

                            <Route
                                path="/manager-team"
                                element={<ManagerTeamView />}
                            />
                            <Route
                                path="/manager-team-info/:id"
                                element={<ManagerTeamViewInfo />}
                            />

                            <Route
                                path="/manager-settings"
                                element={<ManagerSettings />}
                            />

                            <Route
                                path="/view-leave-requests"
                                element={<ViewLeaveRequests />}
                            />
                        </Route>
                    </Route>

                    {/* <Route path="/employee-update" element={<EmployeeUpdate/>} /> */}
                </Routes>
            </BrowserRouter>
        </UserProvider>
        // </ThemeProvider>
    );
}

export default App;
