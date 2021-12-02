import React from "react";
import { gql, useMutation } from "@apollo/client";
import "./Todo.css";

import { TodoFragment } from "./__generated__/TodoFragment";

type Props = {
  todo: TodoFragment;
  onRemove: () => void;
};

const Todo: React.FC<Props> = ({ todo, onRemove }) => {
  const [mutate] = useMutation(RemoveTodoMutation);
  const { content, id } = todo;

  const handleRemove = async () => {
    await mutate({ variables: { input: { id } } });
    onRemove();
  };

  return (
    <div className="todo-container">
      <span>{content}</span>
      <button onClick={handleRemove}>Remove</button>
    </div>
  );
};

export const TODO_FRAGMENT = gql`
  fragment TodoFragment on Todo {
    id
    createdAt
    content
  }
`;

const RemoveTodoMutation = gql`
  mutation RemoveTodoMutation($input: RemoveTodoMutationInput!) {
    removeTodo(input: $input) {
      error
    }
  }
`;
export default Todo;
