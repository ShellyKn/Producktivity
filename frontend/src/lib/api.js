export const API_BASE = 'http://localhost:4000/api';

const getUser = () => JSON.parse(localStorage.getItem('user'));

export async function getTasks() {
  const user = getUser();
  if (!user?._id) throw new Error('No user in localStorage');
  const res = await fetch(`${API_BASE}/tasks/user/${user._id}`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  const data = await res.json();
  return data.tasks;
}

export async function createTask(payload) {
  const user = getUser();
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ ...payload, ownerId: user._id }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create task');
  return data.task;
}

export async function updateTask(taskId, payload) {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update task');
  return true;
}

export async function deleteTask(taskId) {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete task');
  return true;
}
