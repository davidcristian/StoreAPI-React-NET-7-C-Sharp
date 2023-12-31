import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";
import { Container } from "@mui/system";
import axios, { AxiosError } from "axios";
import { useContext, useState } from "react";
import React from "react";
import { Link } from "react-router-dom";

import { SnackbarContext } from "../../contexts/SnackbarContext";
import { AccessLevel } from "../../models/User";
import {
  getAccount,
  updatePref,
  useAuthToken,
} from "../../utils/authentication";
import { BACKEND_API_URL } from "../../utils/constants";

export const AdminPanel = () => {
  const openSnackbar = useContext(SnackbarContext);
  const { getAuthToken } = useAuthToken();

  const [preferenceText, setPreferenceText] = useState<string>(
    getAccount()?.userProfile?.pagePreference?.toString() ?? ""
  );
  const defaultCount = 1_000;

  const [rolesText, setRolesText] = useState<string>(String(defaultCount));
  const [employeesText, setEmployeesText] = useState<string>(
    String(defaultCount)
  );
  const [storesText, setStoresText] = useState<string>(String(defaultCount));
  const [shiftsText, setShiftsText] = useState<string>(String(defaultCount));

  const [loadingPreference, setLoadingPreference] = useState<boolean>(false);
  const [loadingRoles, setLoadingRoles] = useState<boolean>(false);
  const [loadingEmployees, setLoadingEmployees] = useState<boolean>(false);
  const [loadingStores, setLoadingStores] = useState<boolean>(false);
  const [loadingShifts, setLoadingShifts] = useState<boolean>(false);

  const isWorking =
    loadingPreference ||
    loadingRoles ||
    loadingEmployees ||
    loadingStores ||
    loadingShifts;

  const deleteData = async (route: string, count: number) => {
    try {
      await axios
        .delete(`${BACKEND_API_URL}/users/${route}/${count}`, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        })
        .then((response) => {
          const data = response.data;
          openSnackbar("success", data);
        })
        .catch((reason: AxiosError) => {
          console.log(reason.message);
          openSnackbar(
            "error",
            "Failed to bulk delete!\n" +
              (String(reason.response?.data).length > 255
                ? reason.message
                : reason.response?.data)
          );
        });
    } catch (error) {
      console.log(error);
      openSnackbar("error", "Failed to bulk delete due to an unknown error!");
    }
  };

  const seedData = async (route: string, count: number) => {
    try {
      await axios
        .post(
          `${BACKEND_API_URL}/users/${route}/${count}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }
        )
        .then((response) => {
          const data = response.data;
          openSnackbar("success", data);
        })
        .catch((reason: AxiosError) => {
          console.log(reason.message);
          openSnackbar(
            "error",
            "Failed to generate data!\n" +
              (String(reason.response?.data).length > 255
                ? reason.message
                : reason.response?.data)
          );
        });
    } catch (error) {
      console.log(error);
      openSnackbar("error", "Failed to generate data due to an unknown error!");
    }
  };

  const savePreference = async (pref: number) => {
    try {
      await axios
        .patch(
          `${BACKEND_API_URL}/users/pagepreferences/${pref}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }
        )
        .then((response) => {
          const data = response.data;
          openSnackbar("success", data);
          updatePref(getAccount()?.id, pref);
        })
        .catch((reason: AxiosError) => {
          console.log(reason.message);
          openSnackbar(
            "error",
            "Failed to update preference!\n" +
              (String(reason.response?.data).length > 255
                ? reason.message
                : reason.response?.data)
          );
        });
    } catch (error) {
      console.log(error);
      openSnackbar(
        "error",
        "Failed to update preference due to an unknown error!"
      );
    }
  };

  async function executeOperation(
    type: string,
    operation: string,
    setLoading: (loading: boolean) => void,
    count: number
  ) {
    setLoading(true);
    try {
      if (operation === "preference") {
        await savePreference(count);
      } else if (operation === "insert") {
        await seedData(type, count);
      } else {
        await deleteData(type, count);
      }
    } finally {
      setTimeout(
        () => {
          setLoading(false);
        },
        operation === "preference" ? 500 : 0
      );
    }
  }

  function parseData(
    type: string,
    operation: string,
    setLoading: (loading: boolean) => void,
    inputValue: string
  ) {
    const value = parseInt(inputValue, 10);

    if (value > 0 && value <= 9999999) {
      executeOperation(type, operation, setLoading, value);
    } else {
      openSnackbar("error", "Please enter a valid number (0 < n <= 9999999)");
    }
  }

  function handleInputKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    const key = event.key;

    // Only allow digits (0-9) and Enter
    if (
      !["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Enter"].includes(key)
    ) {
      event.preventDefault();
    }
  }

  return (
    <Container>
      {getAccount()?.accessLevel !== AccessLevel.Admin && (
        <p style={{ marginLeft: 16 }}>
          You do not have enough privileges to view this page.
        </p>
      )}
      {getAccount()?.accessLevel === AccessLevel.Admin && (
        <Card sx={{ p: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="flex-start">
              <IconButton
                disabled={isWorking}
                component={Link}
                sx={{ mb: 2, mr: 3 }}
                to={`/`}
              >
                <ArrowBackIcon />
              </IconButton>
              <h1
                style={{
                  flex: 1,
                  textAlign: "center",
                  marginLeft: -64,
                  marginTop: -4,
                }}
              >
                Admin Panel
              </h1>
            </Box>

            <Box sx={{ ml: 1 }}>
              <div style={{ textAlign: "center" }}>
                <Button
                  component={Link}
                  to={"/users"}
                  variant="contained"
                  color="primary"
                  disabled={isWorking}
                >
                  Users List
                </Button>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: 16,
                }}
              >
                <TextField
                  disabled={isWorking}
                  value={preferenceText}
                  label="Page Preference"
                  InputLabelProps={{ shrink: true }}
                  type="text"
                  onChange={(event) => setPreferenceText(event.target.value)}
                  onKeyPress={handleInputKeyPress}
                  variant="outlined"
                  size="small"
                  style={{
                    width: 160,
                    marginRight: 16,
                  }}
                />
                <Button
                  disabled={isWorking}
                  variant="contained"
                  onClick={() =>
                    parseData(
                      "pagepreferences",
                      "preference",
                      setLoadingPreference,
                      preferenceText
                    )
                  }
                  sx={{ width: 244 }}
                >
                  Update All Users
                </Button>
                {loadingPreference && <CircularProgress sx={{ ml: 4 }} />}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: 16,
                }}
              >
                <TextField
                  disabled={isWorking}
                  value={rolesText}
                  label="Roles"
                  InputLabelProps={{ shrink: true }}
                  type="text"
                  onChange={(event) => setRolesText(event.target.value)}
                  onKeyPress={handleInputKeyPress}
                  variant="outlined"
                  size="small"
                  style={{
                    width: 160,
                    marginRight: 16,
                  }}
                />
                <Button
                  disabled={isWorking}
                  sx={{ mr: 2 }}
                  variant="contained"
                  onClick={() =>
                    parseData(
                      "storeemployeeroles",
                      "insert",
                      setLoadingRoles,
                      rolesText
                    )
                  }
                >
                  Generate
                </Button>

                <Button
                  disabled={isWorking}
                  variant="contained"
                  color="error"
                  onClick={() =>
                    parseData(
                      "storeemployeeroles",
                      "delete",
                      setLoadingRoles,
                      rolesText
                    )
                  }
                >
                  Bulk Delete
                </Button>
                {loadingRoles && <CircularProgress sx={{ ml: 4 }} />}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: 16,
                }}
              >
                <TextField
                  disabled={isWorking}
                  value={employeesText}
                  label="Employees"
                  InputLabelProps={{ shrink: true }}
                  type="text"
                  onChange={(event) => setEmployeesText(event.target.value)}
                  onKeyPress={handleInputKeyPress}
                  variant="outlined"
                  size="small"
                  style={{
                    width: 160,
                    marginRight: 16,
                  }}
                />
                <Button
                  disabled={isWorking}
                  sx={{ mr: 2 }}
                  variant="contained"
                  onClick={() =>
                    parseData(
                      "storeemployees",
                      "insert",
                      setLoadingEmployees,
                      employeesText
                    )
                  }
                >
                  Generate
                </Button>

                <Button
                  disabled={isWorking}
                  variant="contained"
                  color="error"
                  onClick={() =>
                    parseData(
                      "storeemployees",
                      "delete",
                      setLoadingEmployees,
                      employeesText
                    )
                  }
                >
                  Bulk Delete
                </Button>
                {loadingEmployees && <CircularProgress sx={{ ml: 4 }} />}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: 16,
                }}
              >
                <TextField
                  disabled={isWorking}
                  value={storesText}
                  label="Stores"
                  InputLabelProps={{ shrink: true }}
                  type="text"
                  onChange={(event) => setStoresText(event.target.value)}
                  onKeyPress={handleInputKeyPress}
                  variant="outlined"
                  size="small"
                  style={{
                    width: 160,
                    marginRight: 16,
                  }}
                />
                <Button
                  disabled={isWorking}
                  sx={{ mr: 2 }}
                  variant="contained"
                  onClick={() =>
                    parseData("stores", "insert", setLoadingStores, storesText)
                  }
                >
                  Generate
                </Button>

                <Button
                  disabled={isWorking}
                  variant="contained"
                  color="error"
                  onClick={() =>
                    parseData("stores", "delete", setLoadingStores, storesText)
                  }
                >
                  Bulk Delete
                </Button>
                {loadingStores && <CircularProgress sx={{ ml: 4 }} />}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: 16,
                }}
              >
                <TextField
                  disabled={isWorking}
                  value={shiftsText}
                  label="Shifts"
                  InputLabelProps={{ shrink: true }}
                  type="text"
                  onChange={(event) => setShiftsText(event.target.value)}
                  onKeyPress={handleInputKeyPress}
                  variant="outlined"
                  size="small"
                  style={{
                    width: 160,
                    marginRight: 16,
                  }}
                />
                <Button
                  disabled={isWorking}
                  sx={{ mr: 2 }}
                  variant="contained"
                  onClick={() =>
                    parseData(
                      "storeshifts",
                      "insert",
                      setLoadingShifts,
                      shiftsText
                    )
                  }
                >
                  Generate
                </Button>

                <Button
                  disabled={isWorking}
                  variant="contained"
                  color="error"
                  onClick={() =>
                    parseData(
                      "storeshifts",
                      "delete",
                      setLoadingShifts,
                      shiftsText
                    )
                  }
                >
                  Bulk Delete
                </Button>
                {loadingShifts && <CircularProgress sx={{ ml: 4 }} />}
              </div>
            </Box>
          </CardContent>
          <CardActions></CardActions>
        </Card>
      )}
    </Container>
  );
};
