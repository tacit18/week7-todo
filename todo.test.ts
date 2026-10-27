import { test, expect } from 'vitest';
import { addTodo, toggleTodo, Todo } from './todo';

// 1. 正常添加
test('正常添加：文本内容正确', () => {
  const todos: Todo[] = [];
  addTodo(todos, '学习 TS');
  expect(todos.length).toBe(1);
  expect(todos[0].text).toBe('学习 TS');
  expect(todos[0].completed).toBe(false);
});

// 2. 纯空格：拦截
test('纯空格：拦截', () => {
  const todos: Todo[] = [];
  addTodo(todos, '   ');
  expect(todos.length).toBe(0);
});

// 3. 空字符串：拦截
test('空字符串：拦截', () => {
  const todos: Todo[] = [];
  addTodo(todos, '');
  expect(todos.length).toBe(0);
});

// 4. toggleTodo 正常切换
test('切换完成状态', () => {
  const todos: Todo[] = [{ id: 1, text: '学习 TS', completed: false }];
  toggleTodo(todos, 1);
  expect(todos[0].completed).toBe(true);
});

// 5. toggleTodo 不存在的 ID 不崩溃
test('不存在的 ID 不崩溃', () => {
  const todos: Todo[] = [];
  toggleTodo(todos, 999);
  expect(todos.length).toBe(0);
});