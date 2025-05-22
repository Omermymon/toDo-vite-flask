const GET_URL = "http://127.0.0.1:5000/todos";
const SET_URL = "http://127.0.0.1:5000/todos";
const EDIT_URL = "http://127.0.0.1:5000/todos";
const DELETE_URL = "http://127.0.0.1:5000/todos";

async function getTodos() {
  const response = await fetch(GET_URL);
  if (!response.ok) {
    throw new Error("bad fetch");
  }
  return response.json();
}

async function postTodo(todo) {
  const response = await fetch(SET_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });
  if (!response.ok) {
    throw new Error("bad Post");
  }
  return response.json();
}

async function editTodo({ id, task }) {
  const response = await fetch(EDIT_URL + `/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ task: task }),
  });
  if (!response.ok) {
    throw new Error("bad Post");
  }
  return response.json();
}

async function eraseTodo(id) {
  const response = await fetch(DELETE_URL + `/${id}`, { method: "DELETE" });
  if (!response.ok) {
    return new Error("failed deleting");
  }
  return true;
}

export { postTodo, editTodo, getTodos, eraseTodo };
