import { ApolloServer, gql } from "apollo-server";
import { BaseEntry, MemoryDatabase } from "./MemoryDatabase";

interface Todo extends BaseEntry {
  id: string;
  title: string;
  content: string;
  createdAt?: Date;
}

interface MutationInput<T> {
  input: T;
}

const database = new MemoryDatabase<Todo>();

// This can be a .graphql file.
const typeDefs = gql`
  scalar Date

  type Todo {
    id: ID!
    content: String!
    createdAt: Date
  }

  type Query {
    todos: [Todo!]!
    todo(id: ID!): Todo
  }

  input AddTodoMutationInput {
    content: String!
  }

  type AddTodoMutationResponse {
    error: String
    todo: Todo
  }

  input RemoveTodoMutationInput {
    id: ID!
  }

  type RemoveTodoMutationResponse {
    error: String
  }

  type Mutation {
    addTodo(input: AddTodoMutationInput!): AddTodoMutationResponse
    removeTodo(input: RemoveTodoMutationInput!): RemoveTodoMutationResponse
  }
`;

const resolvers = {
  Query: {
    todos: () => database.getAll(),
    todo: (id: string) => database.getById(id),
  },
  Mutation: {
    addTodo: (_: unknown, { input }: MutationInput<Todo>) => {
      return {
        error: null,
        todo: database.insert(input),
      };
    },
    removeTodo: (_: unknown, { input }: MutationInput<{ id: Todo["id"] }>) => {
      database.remove(input.id);
      return {
        error: null,
      };
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => console.log(`🚀  Server ready at ${url}`));
