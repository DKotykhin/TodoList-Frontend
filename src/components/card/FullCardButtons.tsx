import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@mui/material";

import { DeleteTask, UpdateTask } from "api/taskrequests";
import { removeTask, updateTaskCompleted } from "store/taskSlice";
import { useAppDispatch } from "store/hook";
import { ICompleteTask, ITask } from "types/taskTypes";

interface IFullCardButtons {
    task: ITask;
    deleteLoading: (arg0: boolean) => void;
    closeModal: () => void
}

const FullCardButtons: React.FC<IFullCardButtons> = ({ task, deleteLoading, closeModal }) => {
    const { _id, completed } = task;
    const [completeLoading, setCompleteLoading] = useState(false);
  
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleDelete = (id: string): void => {
        deleteLoading(true);
        closeModal();
        DeleteTask({ _id: id })
            .then(response => {
                console.log(response.message);
                dispatch(removeTask(id));
                deleteLoading(false);
            })
            .catch(error => {
                console.warn(error.message);
                alert("Delete Error");
                deleteLoading(false);
            });
    };

    const handleUpdate = (id: string): void => {
        navigate(`/updatetask/${id}`);
    };

    const handleComplete = (data: ITask) => {
        setCompleteLoading(true);
        const newData: ICompleteTask = { completed: !data.completed, _id: data._id };
        UpdateTask(newData)
            .then(response => {
                console.log(response.message);
                dispatch(updateTaskCompleted(data._id));
                setCompleteLoading(false);
            })
            .catch(error => {
                console.warn(error.message);
                alert("Complete Error");
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
