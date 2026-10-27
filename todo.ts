export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export function addTodo(todos: Todo[], text: string): void {
  const trimmed = text.trim();
  if (trimmed === "") return;
  const id = todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1;
  todos.push({ id, text: trimmed, completed: false });
}

export function toggleTodo(todos: Todo[], id: number): void {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return; // 不存在的 ID：安静返回，不崩溃
  todo.completed = !todo.completed;
}

// ---- DOM 脏数据入口：dataset.id 永远是 string ----
export function onToggle(e: Event, todos: Todo[]): void {
  // 红线：先 instanceof 收窄，不用非空断言 !
  if (!(e.target instanceof Element)) return;

  // 脏数据入口 1：dataset.id 是 string | undefined
  const raw = (e.target as HTMLElement).dataset.id;

  // 红线：先 Number() 转换，再 isSafeInteger 校验，不用 as 硬转
  const id = Number(raw);
  if (!Number.isSafeInteger(id)) return;

  toggleTodo(todos, id);
}

// ---- DOM 脏数据入口 2：localStorage 解析结果不受控 ----
export function loadTodos(): Todo[] {
  const raw = localStorage.getItem("todos");
  if (!raw) return [];

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }

  if (!Array.isArray(data)) return [];

  const result: Todo[] = [];
  for (const item of data) {
    if (typeof item !== "object" || item === null) continue;
    const obj = item as Record<string, unknown>;

    const id = Number(obj.id);
    if (!Number.isSafeInteger(id)) continue;
    if (typeof obj.text !== "string") continue;
    if (typeof obj.completed !== "boolean") continue;

    result.push({ id, text: obj.text, completed: obj.completed });
  }
  return result;
}