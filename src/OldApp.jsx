import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import "./App.css";

function App() {
  const firstRender = useRef(true);
  // this is to check if we are mounting tje component for the first time or not
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState(
    JSON.parse(localStorage.getItem("Todos")) || []
  );
  // same as with the person example, we have to states.
  // one will contain the input value and the other will store all input values

  // function for adding a todo to the list
  const addTodo = (e) => {
    e.preventDefault();
    // prevent browsers default behavior

    // input should not be empty
    if (inputValue.trim() === "") return;

    setTodos([
      ...todos,
      {
        text: inputValue,
        id: uuidv4(),
      },
    ]);
    // update state and assign a unique id
    // in this case we really need the unique id becuase we will use that in our remove function

    setInputValue("");
    // clear input
  };

  const removeTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    // return all the elements we have but not the one
    // we click on
  };

  // get todos from local storage
  useEffect(() => {
    if (localStorage.getItem("Todo") !== null) {
      const newTodos = localStorage.getItem("Todo");
      setTodos(JSON.parse([...todos, newTodos]));
    }
  }, []);

  // save todos in local storage
  useEffect(() => {
    // if the variable firstRender is true at the beginning, is this the first time the component mounts
    if (firstRender.current) {
      console.log("true");
      firstRender.current = false;
    } else {
      localStorage.setItem("Todo", JSON.stringify([...todos]));
      console.log("not first page load");
    }
    //every time todos change this will fire
  }, [todos]);

  return (
    <div className="App">
      <div className="container">
        <form onSubmit={addTodo}>
          <input
            autoFocus
            type="text"
            placeholder="Add a ToDo"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button>Add ToDo</button>
        </form>
        {todos?.map((todo) => (
          <div key={todo.id} className="todo">
            <p>{todo.text}</p>
            <button onClick={() => removeTodo(todo.id)}>DELETE</button>
            <p>hej</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
