import { Box } from "@mui/material";
import MuiAlert, { AlertColor, AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import * as React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { AppHome } from "./components/AppHome";
import { AppMenu } from "./components/AppMenu";
import { AllEmployees } from "./components/employees/AllEmployees";
import { EmployeeAdd } from "./components/employees/EmployeeAdd";
import { EmployeeDelete } from "./components/employees/EmployeeDelete";
import { EmployeeDetails } from "./components/employees/EmployeeDetails";
import { EmployeeFilter } from "./components/employees/EmployeeFilter";
import { EmployeeShiftAdd } from "./components/employees/EmployeeShiftAdd";
import { EmployeeUpdate } from "./components/employees/EmployeeUpdate";
import { Chat } from "./components/experience/Chat";
import { NotFound } from "./components/NotFound";
import { ShowStoreHeadcountReport } from "./components/reports/ShowStoreHeadcountReport";
import { ShowStoreSalaryReport } from "./components/reports/ShowStoreSalaryReport";
import { AllRoles } from "./components/roles/AllRoles";
import { RoleAdd } from "./components/roles/RoleAdd";
import { RoleDelete } from "./components/roles/RoleDelete";
import { RoleDetails } from "./components/roles/RoleDetails";
import { RoleUpdate } from "./components/roles/RoleUpdate";
import { AllShifts } from "./components/shifts/AllShifts";
import { ShiftAdd } from "./components/shifts/ShiftAdd";
import { ShiftDelete } from "./components/shifts/ShiftDelete";
import { ShiftDetails } from "./components/shifts/ShiftDetails";
import { ShiftUpdate } from "./components/shifts/ShiftUpdate";
import { AllStores } from "./components/stores/AllStores";
import { StoreAdd } from "./components/stores/StoreAdd";
import { StoreDelete } from "./components/stores/StoreDelete";
import { StoreDetails } from "./components/stores/StoreDetails";
import { StoreShiftAdd } from "./components/stores/StoreShiftAdd";
import { StoreUpdate } from "./components/stores/StoreUpdate";
import { AdminPanel } from "./components/users/AdminPanel";
import { AllUsers } from "./components/users/AllUsers";
import { UserAdd } from "./components/users/UserAdd";
import { UserConfirm } from "./components/users/UserConfirm";
import { UserDelete } from "./components/users/UserDelete";
import { UserDetails } from "./components/users/UserDetails";
import { UserLogin } from "./components/users/UserLogin";
import { UserRegister } from "./components/users/UserRegister";
import { UserUpdate } from "./components/users/UserUpdate";
import { SnackbarContext } from "./contexts/SnackbarContext";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  const [open, setOpen] = useState<boolean>(false);
  const [duration] = useState<number>(6000); // 6 seconds

  const [severity, setSeverity] = useState<AlertColor>("success");
  const [message, setMessage] = useState<string>("placeholder");

  const openSnackbar = (severity: AlertColor, message: string) => {
    handleClose();

    setTimeout(() => {
      setSeverity(severity);
      setMessage(message);

      setOpen(true);
    }, 250);
  };

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <Snackbar open={open} autoHideDuration={duration} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={severity}
          sx={{ width: "100%", whiteSpace: "pre-wrap" }}
        >
          {message}
        </Alert>
      </Snackbar>

      <SnackbarContext.Provider value={openSnackbar}>
        <Router>
          <AppMenu />

          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<AppHome />} />
            <Route path="/chat" element={<Chat />} />

            <Route path="/users/register" element={<UserRegister />} />
            <Route
              path="/users/register/confirm/:code"
              element={<UserConfirm />}
            />
            <Route path="/users/login" element={<UserLogin />} />
            <Route path="/users/adminpanel" element={<AdminPanel />} />

            <Route path="/users" element={<AllUsers />} />
            <Route path="/users/:userId/details" element={<UserDetails />} />
            <Route path="/users/add" element={<UserAdd />} />
            <Route path="/users/:userId/delete" element={<UserDelete />} />
            <Route path="/users/:userId/edit" element={<UserUpdate />} />

            <Route path="/filteremployees" element={<EmployeeFilter />} />
            <Route path="/employees" element={<AllEmployees />} />
            <Route path="/roles" element={<AllRoles />} />
            <Route path="/stores" element={<AllStores />} />
            <Route path="/shifts" element={<AllShifts />} />

            <Route path="/salaryreport" element={<ShowStoreSalaryReport />} />
            <Route
              path="/headcountreport"
              element={<ShowStoreHeadcountReport />}
            />

            <Route path="/employees/add" element={<EmployeeAdd />} />
            <Route
              path="/employees/:employeeId/details"
              element={<EmployeeDetails />}
            />
            <Route
              path="/employees/:employeeId/delete"
              element={<EmployeeDelete />}
            />
            <Route
              path="/employees/:employeeId/edit"
              element={<EmployeeUpdate />}
            />
            <Route
              path="/employees/:employeeId/addshift"
              element={<EmployeeShiftAdd />}
            />

            <Route path="/roles/add" element={<RoleAdd />} />
            <Route path="/roles/:roleId/details" element={<RoleDetails />} />
            <Route path="/roles/:roleId/delete" element={<RoleDelete />} />
            <Route path="/roles/:roleId/edit" element={<RoleUpdate />} />

            <Route path="/stores/add" element={<StoreAdd />} />
            <Route path="/stores/:storeId/details" element={<StoreDetails />} />
            <Route path="/stores/:storeId/delete" element={<StoreDelete />} />
            <Route path="/stores/:storeId/edit" element={<StoreUpdate />} />
            <Route
              path="/stores/:storeId/addshift"
              element={<StoreShiftAdd />}
            />

            <Route path="/shifts/add" element={<ShiftAdd />} />
            <Route
              path="/shifts/:storeId/:employeeId/details"
              element={<ShiftDetails />}
            />
            <Route
              path="/shifts/:storeId/:employeeId/delete"
              element={<ShiftDelete />}
            />
            <Route
              path="/shifts/:storeId/:employeeId/edit"
              element={<ShiftUpdate />}
            />
          </Routes>

          <Box sx={{ mb: 4 }} />
        </Router>
      </SnackbarContext.Provider>
    </React.Fragment>
  );
}

export default App;
