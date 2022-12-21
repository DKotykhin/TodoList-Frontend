import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@mui/material";

import { DeleteTask, UpdateTask } from "api/taskrequests";
import { fetchTasks } from "store/taskSlice";
import { useAppDispatch, useAppSelector } from "store/hook";
import { selectQuery } from "store/selectors";

import { ICompleteTask, ITask } from "types/taskTypes";

interface IFullCardButtons {
    task: ITask;
    deleteLoading: (arg0: boolean) => void;
    closeModal: () => void
}

const FullCardButtons: React.FC<IFullCardButtons> = ({ task, deleteLoading, closeModal }) => {
    const { _id, completed } = task;
    const [completeLoading, setCompleteLoading] = useState(false);

    const { query } = useAppSelector(selectQuery);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleDelete = (id: string): void => {
        deleteLoading(true);
        closeModal();
        DeleteTask({ _id: id })
            .then(response => {
                console.log(response.message);
                dispatch(fetchTasks({ limit: 6, page: query.page, key: query.key }));
            })
            .catch((error) => {
                console.log(error.message);
                alert(error.response.data.message || error.message);
            })
            .finally(() => {
                deleteLoading(false);
            });
    };

    const handleUpdate = (id: string): void => {
        navigate(`/updatetask/${id}`);
    };

    const handleComplete = (data: ITask) => {
        setCompleteLoading(true);
        closeModal();
        const newData: ICompleteTask = { completed: !data.completed, _id: data._id, title: data?.title };
        UpdateTask(newData)
            .then(response => {
                console.log(response.message);
                dispatch(fetchTasks({ limit: 6, page: query.page, key: query.key }));
            })
            .catch((error) => {
                console.log(error.message);
                alert(error.response.data.message || error.message);
            })
            .finally(() => {
                setCompleteLoading(false);
            });
    };

    return (
        <>
            <Button
                size="small"
                color="error"
                onClick={() => handleDelete(_id)}
            >
                Delete
            </Button>
            <Button
                size="small"
                color="inherit"
                onClick={() => handleUpdate(_id)}
            >
                Update
            </Button>
            <Button size="small" onClick={() => handleComplete(task)}>
                {completeLoading
                    ? "Loading..."
                    : completed
                        ? "Undo Complete"
                        : "Complete"}
            </Button>
        </>
    );
};

export default FullCardButtons;
