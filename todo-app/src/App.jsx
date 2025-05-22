import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTodos, postTodo, editTodo } from "./utils";

function App() {
  const quryClient = useQueryClient();
  const [task, setTask] = useState("");
  const [edittask, setEditTask] = useState("");
  const [editnum, setEditNum] = useState("");

  const {
    data: todos,
    isError,
    isLoading,
    error,
  } = useQuery({ queryKey: ["todos"], queryFn: getTodos });
  const addMutate = useMutation({
    mutationFn: postTodo,
    onSuccess: () => quryClient.invalidateQueries(["todos"]),
  });
  const editMutation = useMutation({
    mutationFn: editTodo,
    onSuccess: () => quryClient.invalidateQueries(["todos"]),
  });
  function addTodos() {
    addMutate.mutate({ task: task });
    setTask("");
  }
  function changeTodo(id, task) {
    const idNum = parseInt(id);
    editMutation.mutate({ id: idNum, task });
    setEditTask("");
  }

  if (isLoading) return <p>Loading todos...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button onClick={addTodos}>add todos</button>
      {todos.map((todo) => (
        <div key={todo.id} className="divv">
          <p>{todo.task}</p>
          {editnum!==todo.id?
          <button onClick={() => setEditNum(todo.id)}>edit task</button>:
          <div>
          <input value={edittask} onChange={(e) => setEditTask(e.target.value)}></input>
          <button onClick={() => changeTodo(todo.id, edittask)}>
            apply changes
          </button>
          <button onClick={() => setEditNum("")}>
            cancel changes
          </button>
          </div>}
        </div>
      ))}
    </>
  );
}

export default App;

