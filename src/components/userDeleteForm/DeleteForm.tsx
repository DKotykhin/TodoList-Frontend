import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Typography, Paper } from "@mui/material";

import DeleteDialog from "./DeleteDialog";
import UserMessage from "components/userMessage/UserMessage";

import { DeleteUser } from "api/userrequests";
import { removeUser } from "store/userSlice";
import { useAppDispatch } from "store/hook";

const DeleteForm: React.FC = () => {

    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleDelete = (): void => {
        setDeleteError('')
        DeleteUser()
            .then((response) => {
                console.log(response.message);
                sessionStorage.removeItem("rememberMe");
                localStorage.removeItem("rememberMe");
                dispatch(removeUser());
                navigate("/login");
            })
            .catch((error) => {
                console.log(error.message);
                setDeleteError(error.response.data.message || error.message);
            })
            .finally(() => {
                setDeleting(false);
            });
    };

    return (
        <Paper elevation={10} sx={{ border: '1px solid #ff0000' }}>
            <Typography className="profile subtitle">
                Need to delete Profile?
            </Typography>
            <UserMessage loading={deleting} loaded={''} error={deleteError} />
            <DeleteDialog
                dialogTitle={"You really want to delete user?"}
                deleteAction={handleDelete}
            />
        </Paper>
    )
}

export default DeleteForm;