import {
    Grid,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
  } from "@mui/material";
  import { useFormik } from "formik";
  import { paperStyle } from "./Verify/AuthStyles";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  
  export const ForgetPasswordPage = () => {
    const navigate = useNavigate();
    //use Formik
    const { handleSubmit, handleChange, touched, values, errors } = useFormik({
      initialValues: {
        email: "",
      },
      onSubmit:async ({ email }, bag) => {
        const data = {
          email: email,
        };
        try {
           await axios
            .post("api/auth/forgetpassword", data)
            navigate("/login");
        } catch (error) {
             bag.setErrors({ general: error.response.data });
        }
        
      },
    });
    return (
      <Grid>
        <Paper elevation={20} style={paperStyle}>
          <Grid textAlign="center" marginBottom={2}>
            <Typography variant="h5" fontWeight="bold">
            Forgot Password
            </Typography>
            <Typography variant="caption">
              Please fill this from to create an account!
            </Typography>
          </Grid>
          <Grid>
            {errors.general && <Alert severity="error">{errors.general}</Alert>}
          </Grid>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="email"
              label="Email"
              variant="standard"
              placeholder="Enter you email"
              onChange={handleChange}
              value={values.email}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
            />
            <Grid marginTop={3}>
              <Button
                fullWidth
                textAlign="center"
                type="submit"
                variant="contained"
                color="primary"
              >
               Submit
              </Button>
            </Grid>
          </form>
        </Paper>
      </Grid>
    );
  };
  
