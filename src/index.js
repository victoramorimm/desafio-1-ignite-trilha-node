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

  const isUsernameAlreadyInUse = users.find((user) => user.username === username)

  if (isUsernameAlreadyInUse) {
    return response.status(400).json({ error: 'Username already in use' })
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
  const { user } = request
  const { id } = request.params
  const { title, deadline } = request.body

  const todoFoundById = user.todos.find((todo) => todo.id === id)

  if (!todoFoundById) {
    return response.status(404).json({ error: 'Todo not found!' })
  } else {
    todoFoundById.title = title ? title : todoFoundById.title;
    todoFoundById.deadline = deadline ? deadline : todoFoundById.deadline;
  }

  const updatedTodo = {
    id: uuidv4(),
    done: todoFoundById.done,
    title,
    created_at: todoFoundById.created_at,
    updated_at: new Date(),
    deadline: new Date(deadline)
  }

  return response.status(201).send(updatedTodo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request
  const { id } = request.params

  const todoFoundById = user.todos.find((todo) => todo.id === id)

  if (!todoFoundById) {
    return response.status(404).json({ error: 'Todo not found!' })
  }

  todoFoundById.done = true;

  return response.status(200).json({ message: 'Todo updated to done!' })
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;