const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers

  if (!username) {
    return response.status(400).json({ error: 'Username not provided!' });
  }

  const userFoundByUsername = users.find((user) => user.username === username)

  if (!userFoundByUsername) {
    return response.status(400).json({ error: 'User not found by username!' });
  }

  request.user = userFoundByUsername;

  next();
}

app.post('/users', (request, response) => {
  const { username, name } = request.body

  const newUser = {
    id: uuidv4(), 
    username,
    name,
    todos: []
  }

  users.push(newUser)

  return response.status(201).json(newUser)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request

  const todos = user.todos;

  return response.status(200).send(todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request
  const { title, deadline } = request.body

  const newTodo = {
    id: uuidv4(),
    done: false,
    title,
    created_at: new Date(),
    deadline: new Date(deadline)
  }

  user.todos.push(newTodo)

  return response.status(201).json(newTodo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;