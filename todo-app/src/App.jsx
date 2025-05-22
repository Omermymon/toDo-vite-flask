import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getTodos, postTodo, editTodo, eraseTodo } from "./utils";

function App() {
  const queryClient = useQueryClient();
  const [task, setTask] = useState("");
  const [edittask, setEditTask] = useState("");
  const [editnum, setEditNum] = useState("");

  const {
    data: todos,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
    refetchInterval: 10000,
  });

  const addMutate = useMutation({
    mutationFn: postTodo,
    onSuccess: () => queryClient.invalidateQueries(["todos"]),
  });
  const editMutation = useMutation({
    mutationFn: editTodo,
    onSuccess: () => queryClient.invalidateQueries(["todos"]),
  });

  const deleteMutation = useMutation({
    mutationFn: eraseTodo,
    onSuccess: () => queryClient.invalidateQueries(["todos"]),
    onError: (error) => {
      console.error("Delete error", error);
    },
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

  function deleteTodo(id) {
    const idNum = parseInt(id);
    deleteMutation.mutate(idNum);
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
          {editnum !== todo.id ? (
            <button onClick={() => setEditNum(todo.id)}>edit task</button>
          ) : (
            <div>
              <input
                value={edittask}
                onChange={(e) => setEditTask(e.target.value)}
              ></input>
              <button onClick={() => changeTodo(todo.id, edittask)}>
                apply changes
              </button>
              <button onClick={() => setEditNum("")}>cancel changes</button>
            </div>
          )}
          <button onClick={() => deleteTodo(todo.id)}>delete</button>
        </div>
      ))}
    </>
  );
}

export default App;
