import React, { useState, useEffect } from "react";
import axios from "axios";
import AddProject from "../modal/AddProject";

const Projects = props => {
  const [project, setProject] = useState([]);

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    axios
      .get(
        `https://api-blitz-build-dev.herokuapp.com/api/auth/${uid}/projects`,
        project
      )
      .then(res => {
        console.log(res);
        const projectArray = Object.values(res.data.projects);
        console.log(projectArray);
        setProject(projectArray);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <h1> HERE ARE THE PROJECTS </h1>
      {project.map(project => (
        <div
          key={project.projectID}
          onClick={() => {
            props.history.push(`/project/${project.projectID}`);
          }}
        >
          <p>{project.project_name}</p>
        </div>
      ))}

      <AddProject />
    </div>
  );
};

export default Projects;
