import { render, screen, fireEvent } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";
import App from "./App";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("test that App component renders Task", () => {
  render(<App />);
  const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole("button", { name: /Add/i });
  const dueDate = "05/30/2023";
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(element);

  const check = screen.getByText(/History Test/i);
  const checkDate = screen.getByText(new RegExp(dueDate, "i"));

  expect(check).toBeInTheDocument();
  expect(checkDate).toBeInTheDocument();
});

test("test that App component doesn't add a task without task name", () => {
  render(<App />);
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const dueDate = "06/25/2024";
  fireEvent.change(inputDate, { target: { value: dueDate } });

  const element = screen.getByRole("button", { name: /Add/i });
  fireEvent.click(element);

  const checkDate = screen.queryByText(new RegExp(dueDate, "i"));
  expect(checkDate).toBeNull();
});

test("test that App component doesn't add a task without due date", () => {
  render(<App />);
  const input = screen.getByRole("textbox", { name: /Add New Item/i });
  fireEvent.change(input, { target: { value: "Do Dishes" } });

  const element = screen.getByRole("button", { name: /Add/i });
  fireEvent.click(element);

  const newItem = screen.queryByText(/Do Dishes/i);
  expect(newItem).toBeNull();
});

test("test that App component can be deleted thru checkbox", () => {
  render(<App />);

  // Creating a task
  const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole("button", { name: /Add/i });
  const dueDate = "05/30/2023";
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(element);

  // Deleting a Task
  const checkBox = screen.getByRole("checkbox");
  fireEvent.click(checkBox);

  const check = screen.queryByText(/History Test/i);
  const checkDate = screen.queryByText(new RegExp(dueDate, "i"));

  expect(check).toBeNull();
  expect(checkDate).toBeNull();
});

test("test that App component renders different colors for past due events", () => {
  render(<App />);

  // Creating a task
  const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole("button", { name: /Add/i });
  const dueDate = "05/30/2023";
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(element);

  const backgroundColor = screen.getByTestId(/History Test/i).style.background;

  expect(backgroundColor).toBe("orange");
});
