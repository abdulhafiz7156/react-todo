import './App.css';
import ToDoList from "./ToDoList";
import { useState } from "react";
import Favorites from "./Favorites";
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

const Tabs = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 50px;
    
    div {
        cursor: pointer;
        margin: 0 10px;
        border: none;
        padding: 10px 20px;
    }
`;

function App() {
    const [tasks, setTasks] = useState([
        { id: uuidv4(), data: new Date(), title: "first list 1",
            tasks: [
                { id: uuidv4(), data: new Date(), title: "Eat breakfast", done: false, favorite: true },
                { id: uuidv4(), data: new Date(), title: "Eat breakfast 2", done: true, favorite: true },
            ]
        },
        { id: uuidv4(), data: new Date(), title: "first list 2",
            tasks: [
                { id: uuidv4(), data: new Date(), title: "second task of second list", done: false, favorite: true },
                { id: uuidv4(), data: new Date(), title: "second task of second list 2", done: true, favorite: true },
            ]
        },
    ]);

    const [newList, setNewList] = useState("");
    const [editingTask, setEditingTask] = useState("");
    const [inputValidate, setInputValidate] = useState(false);
    const [tab, setTab] = useState(true);

    function handleInputChange(event) {
        setNewList(event.target.value);
    }

    function addTask() {
        if (newList.trim() !== "") {
            setTasks(t => [...t, { id: uuidv4(), data: new Date(), title: newList, tasks: [] }]);
            setNewList("");
        } else {
            setInputValidate(true);
        }
    }

    function deleteList(index) {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    }

    function editTask(index) {
        const updatedTasks = tasks.map((task, i) =>
            i === index ? { ...task, editingTask: true } : task
        );
        setTasks(updatedTasks);
    }

    const saveEditedTask = (taskIndex, subtaskIndex, newTitle, done) => {
        const updatedTasks = tasks.map((task, i) => {
            if (i === taskIndex) {
                const updatedTasks = task.tasks.map((subtask, j) =>
                    j === subtaskIndex ? { ...subtask, title: newTitle, done } : subtask
                );
                return { ...task, tasks: updatedTasks };
            }
            return task;
        });
        setTasks(updatedTasks);
    };

    function updateSubtask(updatedTasks) {
        setTasks(updatedTasks);
    }

    function deleteSubtask(taskIndex, subtaskIndex) {
        // console.log(taskIndex, subtaskIndex)
        // Create a copy of the tasks array
        const updatedTasks = [...tasks];

        // Remove the subtask from the correct list
        updatedTasks[taskIndex].tasks = updatedTasks[taskIndex].tasks.filter((_, index) => {
            console.log(index)
            return index !== subtaskIndex
        });
        // Update the state with the modified tasks array
        updateSubtask(updatedTasks);
    }



    function addFavorites(taskIndex, subtaskIndex) {
        const updatedTasks = tasks.map((task, i) => {
            if (i === taskIndex) {
                const updatedTasks = task.tasks.map((subtask, j) =>
                    j === subtaskIndex ? { ...subtask, favorite: !subtask.favorite } : subtask
                );
                return { ...task, tasks: updatedTasks };
            }
            return task;
        });
        setTasks(updatedTasks);
    }

    return (
        <div className="App">
            <Tabs>
                <div className={tab ? 'active_tab' : 'deactive_tab'} onClick={() => setTab(true)}>All list</div>
                <div className={!tab ? 'active_tab' : 'deactive_tab'} onClick={() => setTab(false)}>Favorites</div>
            </Tabs>
            {tab ? (
                <ToDoList
                    tasks={tasks}
                    handleInputChange={handleInputChange}
                    addTask={addTask}
                    deleteList={deleteList}
                    editTask={editTask}
                    saveEditedTask={saveEditedTask}
                    editingTask={editingTask}
                    newList={newList}
                    inputValidate={inputValidate}
                    updateSubtask={updateSubtask}
                    deleteSubtask={deleteSubtask}
                    addFavorites={addFavorites}
                />
            ) : (
                <Favorites
                    tasks={tasks}
                    saveEditedTask={saveEditedTask}
                    updateSubtask={updateSubtask}
                />
            )}
        </div>
    );
}

export default App;
