import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import { Button, Container, Typography, Box } from "@mui/material";
import { InputLabel, Checkbox } from "@mui/material";

import { LoginUser } from "api/userrequests";
import { IUserLogin } from "types/userTypes";
import { EmailField, PasswordField } from "components/userFields";
import { LoginFormValidation } from "./userFormValidation";

import "./style.scss";

interface IUserData extends IUserLogin {
    rememberMe: boolean
}

const LoginForm: React.FC = () => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);    
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm<IUserData>(LoginFormValidation);

    const onSubmit = (data: IUserData): void => {        
        const { email, password } = data;        
        setLoading(true);
        LoginUser({ email, password })
            .then((response) => {                
                console.log(response.message);                
                const { token } = response;
                if (data.rememberMe) {
                    localStorage.setItem("rememberMe", token);
                }
                sessionStorage.setItem("rememberMe", token);                
                navigate("/");
                reset();
            })
            .catch((error) => {
                console.log(error.message);
                setError(true);
                setLoading(false);
            });
    };

    return (
        <Container maxWidth="sm" className="form">
            <Typography className="title" component="h2">
                {loading ? "Loading..." : "Login Form"}
            </Typography>
            {!loading && (
                <>
                    <Box
                        onSubmit={handleSubmit(onSubmit)}
                        component="form"
                        sx={{
                            "& > :not(style)": {
                                width: "300px",
                                display: "block",
                                m: "50px auto",
                            },
                        }}
                    >
                        <EmailField disabled={false} error={errors.email} control={control} />
                        <PasswordField
                            name={"Password"}
                            error={errors.password}
                            control={control}
                        />
                        <InputLabel className="label">
                            <Controller
                                name="rememberMe"
                                control={control}
                                render={({ field }) => <Checkbox {...field} />}
                                defaultValue={false}
                            />
                            Remember me
                        </InputLabel>
                        <Button
                            disabled={!isValid}
                            className="submit_button"
                            type="submit"
                        >
                            Login
                        </Button>
                    </Box>
                    {error && (
                        <Typography className="error_title">
                            {"Incorrect data!"}
                        </Typography>
                    )}
                    <Typography className="subtitle">
                        {"Don't have account?"}
                    </Typography>
                    <Button
                        className="submit_button"
                        component={Link}
                        to="/registration"
                    >
                        Registration
                    </Button>
                </>
            )}
        </Container>
    );
};

export default LoginForm;
