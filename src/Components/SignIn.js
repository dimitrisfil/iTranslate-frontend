import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import logo from "../logo.jpg";
import {signInWithEmailAndPassword, signOut} from "firebase/auth";
import {auth} from "../firebase-config";
import {Alert} from "@mui/material";
import {useState} from "react";

const theme = createTheme();

export default function SignIn() {

    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage(null);
        const data = new FormData(event.currentTarget);
        const user = await signInWithEmailAndPassword(auth, data.get("email"), data.get("password")).catch((error) => {
            setErrorMessage(<Alert severity="error">Wrong credentials</Alert>);
            console.log(error);
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <img src={logo} className="App-logo" alt="logo"/>
                    <Typography component="h1" variant="h5">
                        iTranslate Dashboard
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{mt: 1}}
                    >
                        <TextField
                            margin="normal"
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs align="center">
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                        </Grid>
                        <br/>
                        {errorMessage}
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
