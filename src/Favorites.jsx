import React, { useState } from 'react';
import styled from 'styled-components';

const ListItem = styled.div`
    font-size: 1.5rem;
    border: 1px solid #ccc;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background: #f9f9f9;
    border-radius: 8px;
    
    button {
        margin: 0 10px;
        background-color: green;
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        color: #fff;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
            background-color: darkgreen;
        }
    }

    input[type="text"] {
        font-size: 1.5rem;
        padding: 5px;
        margin-right: 10px;
        flex: 1;
    }

    .task-info {
        display: flex;
        align-items: center;
        flex: 1;
    }

    .task-title {
        margin-left: 10px;
        flex: 1;
    }

    .td_lt {
        text-decoration: line-through;
        color: gray;
    }
`;

const Container = styled.div`
    padding: 20px;
    max-width: 800px;
    margin: auto;
`;

const Header = styled.h2`
    text-align: center;
    margin-bottom: 20px;
`;

const ListHeader = styled.h3`
    margin: 20px 0 10px;
    font-size: 1.8rem;
`;

function Favorites({ tasks = [], saveEditedTask }) {
    const [editTaskId, setEditTaskId] = useState(null);
    const [editedTaskTitle, setEditedTaskTitle] = useState('');

    const favoriteTasksGroupedByList = tasks
        .map((task, taskIndex) => ({
            ...task,
            taskIndex,
            favoriteSubtasks: task.tasks?.filter(subtask => subtask.favorite)
                .map(subtask => ({
                    ...subtask,
                    parentTaskIndex: taskIndex,
                    subtaskIndex: task.tasks.indexOf(subtask)
                })) || []
        }))
        .filter(task => task.favoriteSubtasks.length > 0);

    const handleEditClick = (subtask) => {
        const id = `${subtask.parentTaskIndex}-${subtask.subtaskIndex}`;
        setEditTaskId(id);
        setEditedTaskTitle(subtask.title);
    };

    const handleSaveClick = (subtask) => {
        saveEditedTask(subtask.parentTaskIndex, subtask.subtaskIndex, editedTaskTitle, subtask.done);
        setEditTaskId(null);
        setEditedTaskTitle('');
    };

    const handleCheckboxChange = (subtask, taskIndex, subtaskIndex, done) => {
        saveEditedTask(taskIndex, subtaskIndex, subtask.title, done);
    };

    return (
        <Container>
            <Header>Favorites</Header>
            {favoriteTasksGroupedByList.length > 0 ? (
                favoriteTasksGroupedByList.map((task) => (
                    <div key={task.taskIndex}>
                        <ListHeader>{task.title}</ListHeader>
                        {task.favoriteSubtasks.map((subtask) => {
                            const id = `${subtask.parentTaskIndex}-${subtask.subtaskIndex}`;
                            return (
                                <ListItem key={id}>
                                    <span className="task-info">
                                        {editTaskId === id ? (
                                            <input
                                                type="text"
                                                value={editedTaskTitle}
                                                onChange={(e) => setEditedTaskTitle(e.target.value)}
                                            />
                                        ) : (
                                            <span className={`task-title ${subtask.done ? 'td_lt' : ''}`}>
                                                {subtask.title}
                                            </span>
                                        )}
                                    </span>
                                    {editTaskId === id ? (
                                        <button onClick={() => handleSaveClick(subtask)}>Save</button>
                                    ) : (
                                        <button onClick={() => handleEditClick(subtask)}>Edit</button>
                                    )}
                                    <input
                                        type="checkbox"
                                        checked={subtask.done}
                                        onChange={(e) => handleCheckboxChange(subtask, subtask.parentTaskIndex, subtask.subtaskIndex, e.target.checked)}
                                    />
                                </ListItem>
                            );
                        })}
                    </div>
                ))
            ) : (
                <p>No favorite tasks.</p>
            )}
        </Container>
    );
}

export default Favorites;
