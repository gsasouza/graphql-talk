import React from "react";
import "./App.css";
import { gql, useQuery } from "@apollo/client";
import Todo, { TODO_FRAGMENT } from "./Todo";
import AddTodoInput from "./AddTodoInput";

import { AppQuery } from "./__generated__/AppQuery";

function App() {
  const { loading, error, data } = useQuery<AppQuery>(query);

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error :(</p>;

  const { todos } = data;

  return (
    <main className="main-content">
      <header>
        <h1>To-Do List</h1>
      </header>
      <section className="card">
        <AddTodoInput />
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <Todo todo={todo} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

const query = gql`
  ${TODO_FRAGMENT}
  query AppQuery {
    todos {
      ...TodoFragment
    }
  }
`;

export default App;
