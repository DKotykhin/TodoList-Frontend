import React, { useState } from 'react';
import { useForm, FieldValues } from "react-hook-form";

import { Avatar, Box, Tooltip, IconButton } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import FileUploadIcon from '@mui/icons-material/FileUpload';

import AvatarDeleteForm from './AvatarDeleteForm';
import SnackBar from 'components/snackBar/SnackBar';

import { selectUser } from "store/selectors";
import { UploadAvatar } from "api/userrequests";
import { useAppSelector, useAppDispatch } from "store/hook";
import { addAvatar } from "store/userSlice";

const checkFileType = (type: string): boolean => {
    return (type === 'image/jpeg' || type === 'image/png' || type === 'image/webp');
};
const Base_URL = process.env.REACT_APP_BACKEND_URL;

const AvatarUploadForm: React.FC = () => {

    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState('');
    const [loadError, setLoadError] = useState('');

    const [fileName, setFileName] = useState('');
    const { userdata } = useAppSelector(selectUser);
    const dispatch = useAppDispatch();

    const { register, reset, handleSubmit } = useForm();

    const userAvatarURL = userdata.avatarURL ? Base_URL + userdata.avatarURL : "/";

    const onChange = (e: any) => {
        setFileName(e.target.files[0].name);
        const isApproved = checkFileType(e.target.files[0].type);
        if (!isApproved) setLoadError("Incorrect file type");
        if (e.target.files[0].size > 1024000) setLoadError("File shoul be less then 1Mb");
    };
    const onReset = () => {
        reset();
        setFileName("");
    };

    const onSubmit = (data: FieldValues): void => {
        const isApproved = checkFileType(data.avatar[0].type);
        if (!isApproved) {
            setLoadError("Can't upload this type of file");
        } else if (data.avatar[0].size > 1024000) {
            setLoadError("Too large file to upload!");
        } else if (data.avatar.length) {
            setLoading(true);
            const formData = new FormData();
            formData.append("avatar", data.avatar[0], data.avatar[0].name);
            UploadAvatar(formData)
                .then((response) => {
                    console.log(response.message);
                    setLoaded(response.message);
                    dispatch(addAvatar(response.avatarURL));
                    reset();
                    setFileName("");
                })
                .catch((error) => {
                    console.log(error.message);
                    setLoadError(error.response.data.message || error.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoadError("No File in Avatar Field");
        }
    }

    return (
        <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Box sx={{ cursor: 'pointer' }} component="label" onChange={onChange}>
                <Tooltip title="Change Avatar" placement="left" arrow>
                    <Avatar
                        sx={{ width: 150, height: 150, margin: '0 auto' }}
                        src={userAvatarURL}
                    />
                </Tooltip>
                <Box
                    {...register("avatar")}
                    component="input"
                    type="file"
                    hidden
                />
            </Box>
            {loading ? 'Loading...' : fileName ? (
                <>
                    {fileName}
                    <IconButton onClick={onReset}>
                        <Tooltip title="Cancel" placement="top" arrow>
                            <CloseIcon />
                        </Tooltip>
                    </IconButton>
                    <IconButton type="submit">
                        <Tooltip title="Upload" placement="top" arrow>
                            <FileUploadIcon color='primary' />
                        </Tooltip>
                    </IconButton>
                </>
            ) : <AvatarDeleteForm />}
            <SnackBar successMessage={loaded} errorMessage={loadError} />
        </Box>
    )
}

export default AvatarUploadForm