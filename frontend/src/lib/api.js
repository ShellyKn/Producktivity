// ONE base for the REST API
export const API_ROOT = 'http://localhost:4000';
export const API_BASE = `${API_ROOT}/api`;

const getUser = () => {
  try { return JSON.parse(localStorage.getItem('user') || '{}'); }
  catch { return {}; }
};

export async function getUserProfile(userId) {
  const res = await fetch(`${API_BASE}/users/${userId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "get user failed");
  return data; // {_id, email, name, userName, ...}
}

/** ---- FRIENDS / FOLLOWING ---- **/

// /api/users/search?q=...&excludeSelf=<id>
export async function searchUsers(q, excludeSelfId) {
  const url = new URL(`${API_BASE}/users/search`);
  url.searchParams.set('q', q);
  if (excludeSelfId) url.searchParams.set('excludeSelf', excludeSelfId);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('search failed');
  const data = await res.json();
  return data.users || [];
}

// POST /api/follow/follow  { followerId, followeeId }
export async function followUser(followerId, followeeId) {
  const res = await fetch(`${API_BASE}/follow/follow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ followerId, followeeId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'follow failed');
  return data;
}

// DELETE /api/follow/follow  { followerId, followeeId }
export async function unfollowUser(followerId, followeeId) {
  const res = await fetch(`${API_BASE}/follow/follow`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ followerId, followeeId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'unfollow failed');
  return data;
}

// GET /api/follow/users/:userId/following
export async function getFollowing(userId) {
  const res = await fetch(`${API_BASE}/follow/users/${userId}/following`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'get following failed');
  return data.following || [];
}

// GET /api/follow/users/:userId/leaderboard
export async function getFriendsLeaderboard(userId) {
  const res = await fetch(`${API_BASE}/follow/users/${userId}/leaderboard`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'leaderboard failed');
  return data.leaders || [];
}

/** ---- TASKS (unchanged) ---- **/

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

export async function updateUserStreak(streak) {
  const user = getUser();
  if (!user?._id) throw new Error("No user in localStorage");

  const res = await fetch(`${API_BASE}/users/${user._id}/streak`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(streak),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update streak");
  return data;
}
