import React, { useRef } from "react";
import { gql, useMutation } from "@apollo/client";
import { TODO_FRAGMENT } from "./Todo";
import "./AddTodoInput.css";

type Props = {};

const AddTodoInput: React.FC<Props> = () => {
  const [mutate, { loading, error }] = useMutation(AddTodoMutation, {
    update(cache, { data: { addTodo } }) {
      cache.modify({
        fields: {
          todos(existingTodos = []) {
            return [...existingTodos, cache.writeFragment({
              data: addTodo.todo,
              fragment: TODO_FRAGMENT
            })];
          }
        }
      });
    }
  });
  const ref = useRef<HTMLInputElement | null>(null);

  const handleAdd = async () => {
    const value = ref.current?.value;
    if (!value) return;
    await mutate({ variables: { input: { content: value } } });
  };

  console.log(error)
  return (
    <>
      <div className="input-container">
        <input ref={ref}/>
        <button onClick={handleAdd} disabled={loading}>
          {loading ? "Loading..." : "Add Todo"}{" "}
        </button>
      </div>
      {error && <span>{JSON.stringify(error)}</span>}
    </>
  );
};

const AddTodoMutation = gql`
    ${TODO_FRAGMENT}
    mutation AddTodoMutation($input: AddTodoMutationInput!) {
        addTodo(input: $input) {
            error
            todo {
                ...TodoFragment
            }
        }
    }
`;

export default AddTodoInput;
