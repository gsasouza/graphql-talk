import React, { useRef } from "react";
import { gql, useMutation } from "@apollo/client";
import { TODO_FRAGMENT } from "./Todo";
import "./AddTodoInput.css";

type Props = {
  onAdd: () => void;
};

const AddTodoInput: React.FC<Props> = (props) => {
  const [mutate, { loading, error }] = useMutation(AddTodoMutation);
  const ref = useRef<HTMLInputElement | null>(null);

  const handleAdd = async () => {
    const value = ref.current?.value;
    if (!value) return;
    await mutate({ variables: { input: { title: value, content: value } } });
    props.onAdd();
  };

  return (
    <>
      <div className="input-container">
        <input ref={ref} />
        <button onClick={handleAdd} disabled={loading}>
          {loading ? "Loading..." : "Add Todo"}{" "}
        </button>
      </div>
      {error && <span>{error}</span>}
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
