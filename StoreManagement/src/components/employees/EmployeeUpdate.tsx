import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import { debounce } from "lodash";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { SnackbarContext } from "../../contexts/SnackbarContext";
import { Employee, Gender } from "../../models/Employee";
import { EmployeeRole } from "../../models/EmployeeRole";
import { useAuthToken } from "../../utils/authentication";
import { BACKEND_API_URL, getEnumValues } from "../../utils/constants";

export const EmployeeUpdate = () => {
  const navigate = useNavigate();
  const openSnackbar = useContext(SnackbarContext);
  const { getAuthToken } = useAuthToken();

  const { employeeId } = useParams<{ employeeId: string }>();
  const [loading, setLoading] = useState<boolean>(true);

  const [roles, setRoles] = useState<EmployeeRole[]>([]);
  const [employee, setEmployee] = useState<Employee>({
    firstName: "",
    lastName: "",

    gender: 0,

    employmentDate: "",
    terminationDate: "",
    salary: 0,

    storeEmployeeRoleId: -1,
  });

  const employeeRole = useRef<EmployeeRole>({
    name: "",
    description: "",

    roleLevel: 0,
  });

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      await axios
        .get<Employee>(`${BACKEND_API_URL}/storeemployees/${employeeId}`, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        })
        .then((response) => {
          const employee = response.data;
          const fetchedEmployeeRole = {
            id: employee.storeEmployeeRole?.id ?? 0,
            name: employee.storeEmployeeRole?.name ?? "",
            description: employee.storeEmployeeRole?.description ?? "",
            roleLevel: employee.storeEmployeeRole?.roleLevel ?? 0,
          };
          employeeRole.current = fetchedEmployeeRole;
          setRoles([employeeRole.current]);

          setEmployee(employee);
          setLoading(false);
        })
        .catch((reason: AxiosError) => {
          console.log(reason.message);
          openSnackbar(
            "error",
            "Failed to fetch employee details!\n" +
              (String(reason.response?.data).length > 255
                ? reason.message
                : reason.response?.data)
          );
        });
    } catch (error) {
      console.log(error);
      openSnackbar(
        "error",
        "Failed to fetch employee details due to an unknown error!"
      );
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [employeeId]);

  const handleUpdate = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      await axios
        .put(`${BACKEND_API_URL}/storeemployees/${employeeId}`, employee, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        })
        .then(() => {
          openSnackbar("success", "Employee updated successfully!");
          navigate("/employees");
        })
        .catch((reason: AxiosError) => {
          console.log(reason.message);
          openSnackbar(
            "error",
            "Failed to update employee!\n" +
              (String(reason.response?.data).length > 255
                ? reason.message
                : reason.response?.data)
          );
        });
    } catch (error) {
      console.log(error);
      openSnackbar(
        "error",
        "Failed to update employee due to an unknown error!"
      );
    }
  };

  const fetchSuggestions = async (query: string) => {
    try {
      await axios
        .get<EmployeeRole[]>(
          `${BACKEND_API_URL}/storeemployeeroles/search?query=${query}`,
          {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }
        )
        .then((response) => {
          const data = response.data;
          data.unshift(employeeRole.current);
          const removedDupes = data.filter(
            (v, i, a) => a.findIndex((v2) => v2.name === v.name) === i
          );

          setRoles(removedDupes);
        })
        .catch((reason: AxiosError) => {
          console.log(reason.message);
          openSnackbar(
            "error",
            "Failed to fetch employee suggestions!\n" +
              (String(reason.response?.data).length > 255
                ? reason.message
                : reason.response?.data)
          );
        });
    } catch (error) {
      console.log(error);
      openSnackbar(
        "error",
        "Failed to fetch employee suggestions due to an unknown error!"
      );
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 250),
    []
  );

  useEffect(() => {
    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, [debouncedFetchSuggestions]);

  const handleInputChange = (
    _event: React.SyntheticEvent,
    value: string,
    reason: string
  ) => {
    if (value.length < 3) return;
    console.log("input", value, reason);

    if (reason === "input") {
      debouncedFetchSuggestions(value);
    }
  };

  const handleCancel = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    navigate("/employees");
  };

  const convertToInputFormat = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const localDateString = date.toISOString().slice(0, 16);
    return localDateString;
  };

  return (
    <Container>
      {loading && <CircularProgress />}
      {!loading && (
        <Card sx={{ p: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="flex-start" sx={{ mb: 4 }}>
              <IconButton
                component={Link}
                sx={{ mb: 2, mr: 3 }}
                to={`/employees`}
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
                Edit Employee
              </h1>
            </Box>

            <form>
              <TextField
                id="firstName"
                label="First Name"
                value={employee.firstName}
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                onChange={(event) =>
                  setEmployee({
                    ...employee,
                    firstName: event.target.value,
                  })
                }
              />
              <TextField
                id="lastName"
                label="Last Name"
                value={employee.lastName}
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                onChange={(event) =>
                  setEmployee({
                    ...employee,
                    lastName: event.target.value,
                  })
                }
              />

              <FormControl fullWidth>
                <InputLabel id="genderLabel">Gender</InputLabel>
                <Select
                  labelId="genderLabel"
                  id="gender"
                  label="Gender"
                  value={employee.gender}
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                  onChange={(event) =>
                    setEmployee({
                      ...employee,
                      gender: event.target.value as Gender,
                    })
                  }
                >
                  {getEnumValues(Gender).map((genderValue) => (
                    <MenuItem key={genderValue} value={genderValue}>
                      {Gender[genderValue]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                id="employmentDate"
                label="Employment Date"
                value={convertToInputFormat(employee.employmentDate)}
                InputLabelProps={{ shrink: true }}
                type="datetime-local"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                onChange={(event) => {
                  setEmployee({
                    ...employee,
                    employmentDate: new Date(event.target.value).toISOString(),
                  });
                }}
              />

              <TextField
                id="terminationDate"
                label="Termination Date"
                value={convertToInputFormat(employee.terminationDate)}
                InputLabelProps={{ shrink: true }}
                type="datetime-local"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                onChange={(event) => {
                  setEmployee({
                    ...employee,
                    terminationDate: new Date(event.target.value).toISOString(),
                  });
                }}
              />

              <TextField
                id="salary"
                label="Salary"
                value={employee.salary}
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                onChange={(event) =>
                  setEmployee({
                    ...employee,
                    salary: Number(event.target.value),
                  })
                }
              />

              <Autocomplete
                id="storeEmployeeRoleId"
                sx={{ mb: 2 }}
                options={roles}
                value={employeeRole.current}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option.id}>
                      {option.name}
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Role" variant="outlined" />
                )}
                filterOptions={(x) => x}
                onInputChange={handleInputChange}
                onChange={(_event, value) => {
                  if (value) {
                    console.log(value);
                    employeeRole.current = value;

                    setEmployee({
                      ...employee,
                      storeEmployeeRoleId: value.id,
                      storeEmployeeRole: value,
                    });
                  }
                }}
              />
            </form>
          </CardContent>
          <CardActions sx={{ mb: 1, ml: 1, mt: 1 }}>
            <Button
              onClick={handleUpdate}
              variant="contained"
              sx={{ width: 100, mr: 2 }}
            >
              Save
            </Button>
            <Button
              onClick={handleCancel}
              variant="contained"
              color="error"
              sx={{ width: 100 }}
            >
              Cancel
            </Button>
          </CardActions>
        </Card>
      )}
    </Container>
  );
};
