import React, { useEffect, useState, useContext } from "react";
// import DatePicker from "react-datepicker";

//styles
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import { XButton } from "../../styles/Tasks/tasks";
import TaskContext from '../../contexts/tasks/TaskContext'
import {
  StyledForm,
  StyledFormHeader,
  StyledLabel,
  StyledInput,
  StyledSelect,
  StyledBtn,

} from "../../styles/Form/FormStyles";

//hooks
import { useInput } from "../../customHooks/useInput";

//axios
import { axiosWithAuth } from "../../utils/auth/axiosWithAuth";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    width: "75%"
  },
  textField: {
    width: "75%",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
}));

export default function TaskForm({
  closeModal,
  handleFunction,
  editFields,
  text
}) {
  const [projects, setProjects] = useState([]);
  const {getTasks, tasks, setTasks, TaskModalStatus, setTaskModalStatus, getProjectTasks} = useContext(TaskContext);
  const [task, setTask, handleChanges] = useInput({
    task_name: "",
    task_description: "",
    due_date: "",
    project_name: ""
  });

  useEffect(() => {
    getTasks();
    axiosWithAuth()
      .get(`/projects`)
      .then(res => {
        console.log('from taskForm',res)
        setProjects(res.data);
      })
      .catch(err => console.log(err));
    if (editFields) {
      console.log('editFields', editFields)
      setTask(editFields);
      console.log('project_name', )
    }
  },[]);

  //sets the fields if the editFields prop is passed down
  //else they are empty

  const handleSubmit = e => {
    e.preventDefault();
  
    //finds the the project that the user picked
    const chosenProject = projects.filter(project => {
      return project.project_name === task.project_name;
    });
    // console.log("from handleSubmit in TaskForm", chosenProject);

    //asigns the project id to the new task
    const newTask = {
      project_name: chosenProject[0].project_name,
      id: task.id,
      task_name: task.task_name,
      task_description: task.task_description,
      due_date: task.due_date,
      project_id: chosenProject[0].id
    };
    console.log("from taskform submit", task);
    handleFunction(newTask);
    setTask({
      task_name: "",
      task_description: "",
      due_date: "",
      project_name: ""
    });
    closeModal();
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledFormHeader>
        <h1
          style={{
            fontSize: "2rem",
            margin: 0
          }}
        >
          {text}
        </h1>
        <XButton onClick={closeModal}> Close X</XButton>
      </StyledFormHeader>
      <StyledLabel>Task Name</StyledLabel>
      <StyledInput
        
        type="text"
        name="task_name"
        value={task.task_name}
        onChange={handleChanges}
      />

      <StyledLabel>Task Decription</StyledLabel>
      <StyledInput
       
        type="text"
        name="task_description"
        value={task.task_description}
        onChange={handleChanges}
      />

      {/* <StyledLabel>Due Date</StyledLabel>
      <DatePicker selected={dueDate} onChange={date => setDueDate(date)} /> */}

      <StyledLabel>Assign Project</StyledLabel>
      <StyledSelect
        style={{
          
          background: "#E9E9E9",
          border: "none",
          paddingLeft: "10px"
        }}
        name="project_name"
        onChange={handleChanges}
        value={task.project_name}
      >
        <option>Choose Project</option>

        {projects.map(project => {
          return (
            <option key={project.id} value={project.project_name}>
              {project.project_name}
            </option>
          );
        })}
      </StyledSelect>

      <StyledLabel>Due Date</StyledLabel>
      <StyledInput
       
        id="date"
        label=""
        type="date"
        name="due_date"
        onChange={handleChanges}
        value={task.due_date}
        InputLabelProps={{
          shrink: true
        }}
      />

      {/* <StyledLabel>Due Date</StyledLabel>
      <input
        type="text"
        name="dueDate"
        value={task.dueDate}
        onChange={handleChanges}
      /> */}

      <StyledBtn style={{ marginBottom: "50px" }}>Add Task</StyledBtn>
    </StyledForm>
  );
}
