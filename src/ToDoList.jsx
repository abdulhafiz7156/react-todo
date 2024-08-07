import styled from 'styled-components';
import { useState } from "react";

const Container = styled.div`
    padding: 20px;
    font-family: Arial, sans-serif;
`;

const ListItem = styled.div`
    font-size: 1.2rem;
    border: 1px solid #ccc;
    padding: 15px;
    display: flex;
    flex-direction: column;
    margin: 10px 0;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background: #f9f9f9;

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .title {
        font-size: 1.5rem;
        font-weight: bold;
        cursor: pointer;
    }

    .actions {
        display: flex;
        gap: 10px;
    }

    button {
        background-color: #007bff;
        border: none;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background-color 0.3s;

        &:hover {
            background-color: #0056b3;
        }

        &.delete-button {
            background-color: #dc3545;

            &:hover {
                background-color: #c82333;
            }
        }
    }
`;

const TaskSection = styled.div`
    margin-top: 20px;

    h3 {
        margin-bottom: 10px;
        font-size: 1.2rem;
        font-weight: bold;
    }

    .task-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .task-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: #fff;

        input {
            margin-right: 10px;
        }

        button {
            background-color: #28a745;
            
            &:hover {
                background-color: #218838;
            }
        }
    }
`;

const AddTaskSection = styled.div`
    margin-top: 20px;
    display: flex;
    gap: 10px;
    align-items: center;
`;

const Input = styled.input`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    width: 100%;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    transition: border-color 0.3s;

    &:focus {
        border-color: #007bff;
        outline: none;
    }
`;

const ToDoList = ({ tasks, handleInputChange, addTask, deleteList, saveEditedTask, newList, inputValidate, updateSubtask, deleteSubtask, addFavorites }) => {
    const [openLists, setOpenLists] = useState(Array(tasks.length).fill(false));
    const [newTask, setNewTask] = useState("");

    function toggleOpenList(index) {
        const newOpenLists = [...openLists];
        newOpenLists[index] = !newOpenLists[index];
        setOpenLists(newOpenLists);
    };

    function handleCheckboxChange(taskIndex, subtaskIndex) {
        const updatedTasks = [...tasks];
        updatedTasks[taskIndex].tasks[subtaskIndex].done = !updatedTasks[taskIndex].tasks[subtaskIndex].done;
        updateSubtask(updatedTasks);
    };

    function handleAddTask(taskIndex) {
        if (newTask.trim() !== "") {
            const updatedTasks = [...tasks];
            updatedTasks[taskIndex].tasks.push({
                id: new Date().getTime(),
                title: newTask,
                done: false,
                favorite: false,
                date: new Date()
            });
            updateSubtask(updatedTasks);
            setNewTask("");
        }
    }

    function handleDeleteSubtask(taskIndex, subtaskId) {
        const updatedTasks = [...tasks];
        updatedTasks[taskIndex].tasks = updatedTasks[taskIndex].tasks.filter(task => task.id !== subtaskId);
        updateSubtask(updatedTasks);
    }

    return (
        <Container>
            <div className="create-list-section df_jcc">
                <Input
                    type="text"
                    placeholder="Create a list"
                    value={newList}
                    onChange={handleInputChange}
                />
                <button className="add-button" onClick={addTask}>
                    Add List
                </button>
                {inputValidate && <p style={{ color: 'red', margin: 0 }}>Please enter a new list</p>}
            </div>

            <ul>
                {tasks.length ? (
                    tasks.map((task, index) => (
                        <ListItem key={task.id}>
                            <div className="header">
                                <span className="title" onClick={() => toggleOpenList(index)}>
                                    {task.title}
                                </span>
                                <div className="actions">
                                    <button className="delete-button" onClick={() => {
                                        deleteList(index);
                                        setOpenLists(openLists.filter((_, i) => i !== index));
                                    }}>Delete List</button>
                                    <button onClick={() => toggleOpenList(index)}>Toggle</button>
                                </div>
                            </div>

                            {openLists[index] && (
                                <>
                                    <TaskSection>
                                        <h3>Completed Tasks</h3>
                                        <div className="task-list">
                                            {task.tasks.filter(subtask => subtask.done).map((subtask) => (
                                                <div key={subtask.id} className="task-item">
                                                    <input
                                                        type="checkbox"
                                                        id={`checkbox-${index}-${subtask.id}`}
                                                        checked={subtask.done}
                                                        onChange={() => handleCheckboxChange(index, subtask.id)}
                                                    />
                                                    <label htmlFor={`checkbox-${index}-${subtask.id}`}>
                                                        <span className={subtask.done ? 'td_lt' : ''}>{subtask.title}</span>
                                                    </label>
                                                    <div className="actions">
                                                        <button onClick={() => handleDeleteSubtask(index, subtask.id)}>Delete</button>
                                                        <button onClick={() => addFavorites(index, subtask.id)}>Favorites</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </TaskSection>
                                    <TaskSection>
                                        <h3>Incomplete Tasks</h3>
                                        <div className="task-list">
                                            {task.tasks.filter(subtask => !subtask.done).map((subtask) => (
                                                <div key={subtask.id} className="task-item">
                                                    <input
                                                        type="checkbox"
                                                        id={`checkbox-${index}-${subtask.id}`}
                                                        checked={subtask.done}
                                                        onChange={() => handleCheckboxChange(index, subtask.id)}
                                                    />
                                                    <label htmlFor={`checkbox-${index}-${subtask.id}`}>
                                                        <span className={subtask.done ? 'td_lt' : ''}>{subtask.title}</span>
                                                    </label>
                                                    <div className="actions">
                                                        <button onClick={() => handleDeleteSubtask(index, subtask.id)}>Delete</button>
                                                        <button onClick={() => addFavorites(index, subtask.id)}>Favorites</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </TaskSection>
                                    <AddTaskSection>
                                        <Input
                                            type="text"
                                            placeholder="New Task"
                                            value={newTask}
                                            onChange={(e) => setNewTask(e.target.value)}
                                        />
                                        <button onClick={() => handleAddTask(index)}>Add Task</button>
                                    </AddTaskSection>
                                </>
                            )}
                        </ListItem>
                    ))
                ) : (
                    <p>There are no lists. Please create a new one.</p>
                )}
            </ul>
        </Container>
    );
}

export default ToDoList;
