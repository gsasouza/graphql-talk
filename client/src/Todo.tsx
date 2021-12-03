import React from "react";
import { gql, Reference, useMutation } from "@apollo/client";
import "./Todo.css";

import { TodoFragment } from "./__generated__/TodoFragment";

type Props = {
  todo: TodoFragment;
};

const Todo: React.FC<Props> = ({ todo }) => {
  const [mutate] = useMutation(RemoveTodoMutation, {
    update(cache) {
      cache.modify({
        fields: {
          todos(existingTodos = [], { readField }) {
            return existingTodos.filter((ref: Reference) => todo.id !== readField('id', ref))
          }
        }
      });
    }
  });
  const { content, id } = todo;

  const handleRemove = async () => {
    await mutate({ variables: { input: { id } } });
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
