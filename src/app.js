const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next(); 

  console.timeEnd(logLabel);
}

function validateRepositorieId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({ error: "Invalid repositorie ID." });
  }

  return next();
}

app.use(logRequests);
app.use('/repositories/:id' , validateRepositorieId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const likes = 0;

  const repositorie = { id: uuid(), title, url, techs, likes }

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
  
  if(repositorieIndex < 0) {
    return response.status(400).json({ "error": "repositorie not found" });
  }

  const likes = repositories[repositorieIndex].likes;

  const repositorie = {
    id, 
    title, 
    url, 
    techs,
    likes
  };

  repositories[repositorieIndex] = repositorie

  return response.json(repositorie);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
  
  if(repositorieIndex < 0) {
    return response.status(400).json({ "error": "repositorie not found" });
  }

  repositories.splice(repositorieIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
  
  console.log(repositories[repositorieIndex]);
  const like = repositories[repositorieIndex].likes;
  const likes = like + 1;
  console.log(likes);
  repositories[repositorieIndex].likes = likes;

  return response.json(repositories[repositorieIndex]);
});

module.exports = app;
