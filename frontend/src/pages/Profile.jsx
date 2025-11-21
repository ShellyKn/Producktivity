import { useMemo, useState, useEffect, useCallback } from "react";
import TaskLoader from "../components/TaskLoader.jsx";
import FollowBar from "../components/FollowBar.jsx";
import {
  getFriendsLeaderboard,
  getFollowing,
  followUser,
  unfollowUser,
  getUserProfile,
} from "../lib/api.js";

function startOfDay(d) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function isSameDay(a,b){ return startOfDay(a).getTime()===startOfDay(b).getTime(); }
const today = startOfDay(new Date());
const filters = Object.freeze({ PRIORITY:"Priority", DATE:"Date" });

export default function Profile({
  tasks,
  quote,
  streakDays = 10,
  setModalOpen,
  setPageIndex,
  onToggle,
  onEdit,
  onDelete,
}) {
  // Get the current user
  const currentUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); }
    catch { return {}; }
  }, []);
  const myId = currentUser?._id;

  // Local UI state
  const [filter, setFilter] = useState(filters.PRIORITY);
  const [leaders, setLeaders] = useState([]);            // leaderboard rows
  const [following, setFollowing] = useState([]);        // [{_id,email,name,userName}]
  const [loadingFollowing, setLoadingFollowing] = useState(false);

  // Derived: tasks done today
  const numTasks = tasks.filter((t) => {
    if (t.status !== "completed") return false;
    if (!t.completedAt)
      return isSameDay(new Date(t.updatedAt || t.dueDate || Date.now()), today);
    return isSameDay(new Date(t.completedAt), today);
  }).length;

  // --- Data loaders (stable via useCallback) ---
  const loadFollowing = useCallback(async () => {
    if (!myId) return;
    setLoadingFollowing(true);
    try {
      const raw = await getFollowing(myId);
      let list = raw || [];

      // If API returns only IDs, hydrate to { _id, email, name, userName }
      if (list.length && !("email" in list[0]) && !("name" in list[0]) && !("userName" in list[0])) {
        const ids = list
          .map(r => r.followeeId || r._id || r.userId)
          .filter(Boolean)
          .map(String);
        const uniq = Array.from(new Set(ids));
        const hydrated = await Promise.all(
          uniq.map(async (id) => {
            try { return await getUserProfile(id); }
            catch { return { _id: id }; }
          })
        );
        list = hydrated;
      }

      setFollowing(list);
    } catch (e) {
      console.error("loadFollowing failed:", e);
      setFollowing([]);
    } finally {
      setLoadingFollowing(false);
    }
  }, [myId]);

  const refreshLeaders = useCallback(async () => {
    if (!myId) return;
    try {
      const data = await getFriendsLeaderboard(myId);
      setLeaders(data || []);
    } catch (e) {
      console.error(e);
      setLeaders([]);
    }
  }, [myId]);

  // Load following + leaderboard on mount / when myId changes
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!myId) return;
      await loadFollowing();
      if (!cancelled) await refreshLeaders();
    }
    load();
    return () => { cancelled = true; };
  }, [myId, loadFollowing, refreshLeaders]);

  // Follow / unfollow actions
  async function handleFollow(user) {
    if (!myId || !user?._id) return;
    // optimistic add
    setFollowing(prev => {
      const exists = prev.some(u => String(u._id) === String(user._id));
      return exists ? prev : [{ ...user }, ...prev];
    });
    try {
      await followUser(myId, user._id);
    } catch (e) {
      // revert on error
      setFollowing(prev => prev.filter(u => String(u._id) !== String(user._id)));
    } finally {
      await loadFollowing();
      await refreshLeaders();
    }
  }

  async function handleUnfollow(user) {
    if (!myId || !user?._id) return;
    // optimistic remove
    setFollowing(prev => prev.filter(u => String(u._id) !== String(user._id)));
    try {
      await unfollowUser(myId, user._id);
    } catch (e) {
      // revert on error
      setFollowing(prev => [{ ...user }, ...prev]);
    } finally {
      await loadFollowing();
      await refreshLeaders();
    }
  }

  // ------- tasks sorting -------
  function toggleFilter() {
    setFilter((p) => (p === filters.PRIORITY ? filters.DATE : filters.PRIORITY));
  }
  const sortedTasks = useMemo(() => {
    const arr = [...tasks];
    if (filter === filters.DATE) {
      arr.sort((a,b) => new Date(a.dueDate||0) - new Date(b.dueDate||0));
    } else {
      arr.sort((a,b) => (b.priority||0) - (a.priority||0));
    }
    return arr;
  }, [tasks, filter]);

  return (
    <div className="font-jua w-full flex-1 flex text-[#2F4858] bg-[#FAFAF0] px-8 py-6 gap-8">
      {/* LEFT PANEL */}
      <div className="w-[28%] flex flex-col gap-6">
        <div className="relative border-4 border-[#2F4858] rounded-2xl p-5 bg-gradient-to-br from-[#FFF9E6] via-[#FAFAF0] to-[#F3F7FB] overflow-hidden">
          <div className="relative flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-[#2F4858] flex items-center justify-center text-3xl shadow-lg">🦆</div>
              <div>
                <p className="text-sm uppercase tracking-widest opacity-70">Duckling profile</p>
                <h1 className="text-3xl leading-tight">
                  {currentUser?.userName || currentUser?.name || currentUser?.email || "You, the overachiever"}
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-1">
              <div className="rounded-xl border-2 border-[#2F4858]/40 bg-white/70 px-3 py-2 flex flex-col items-center">
                <span className="text-xs uppercase opacity-70">Tasks done</span>
                <span className="text-3xl leading-none mt-1">{numTasks}</span>
                <span className="text-xs opacity-70 mt-1">today</span>
              </div>
              <div className="rounded-xl border-2 border-[#2F4858]/40 bg-white/70 px-3 py-2 flex flex-col items-center">
                <span className="text-xs uppercase opacity-70">Streak</span>
                <span className="text-3xl leading-none mt-1">
                  {streakDays}<span className="text-base ml-1">days</span>
                </span>
                <span className="text-xs opacity-70 mt-1">keep it going!</span>
              </div>
            </div>

            <button
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#2F4858] px-4 py-2 text-lg bg-white/80 hover:bg-[#2F4858] hover:text-white transition-colors"
              onClick={() => setPageIndex(1)}
            >
              See more stats <span className="inline-block">↗</span>
            </button>
          </div>
        </div>

        <div className="border-4 border-[#2F4858] rounded-2xl p-4 bg-white/80 relative overflow-hidden">
          <div className="absolute -top-3 -left-3 text-5xl opacity-10 select-none">“</div>
          <p className="text-sm uppercase tracking-widest opacity-70 mb-1">Daily quack</p>
          <p className="text-xl leading-snug">{quote}</p>
        </div>

        <div className="flex justify-center">
          <img src="art/duck.png" className="w-1/2 max-w-[140px]" alt="A cute blue duck head"/>
        </div>
      </div>

      {/* MIDDLE PANEL */}
      <div className="w-[44%] flex flex-col gap-4 py-2">
        <div className="w-full flex justify-between items-center mb-1">
          <div>
            <h1 className="text-[38px] leading-none">To-do:</h1>
            <p className="text-sm opacity-70 mt-1">Tackle your ducklist one task at a time.</p>
          </div>
          <div className="flex gap-2">
            <button
              className="border-4 border-[#2F4858] rounded-xl px-4 py-1.5 text-[20px] hover:bg-[#2F4858] hover:text-white transition-colors"
              onClick={toggleFilter}
            >
              Filtered by: {filter}
            </button>
            <button
              className="border-4 border-[#2F4858] rounded-xl px-4 py-1.5 text-[20px] hover:bg-[#2F4858] hover:text-white transition-colors"
              onClick={() => setModalOpen(true)}
            >
              + add task
            </button>
          </div>
        </div>

        <div className="flex-1 gap-1 overflow-y-auto">
          <TaskLoader tasks={sortedTasks} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-[28%] flex flex-col gap-4 py-2">
        <div className="border-4 border-[#2F4858] rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[32px] leading-none">leaderboard</h1>
              <p className="text-xs uppercase tracking-widest opacity-70 mt-1">your top friends this week</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[#2F4858] flex items-center justify-center text-xl text-white">🏆</div>
          </div>

          <div className="mt-2 space-y-2">
            {leaders.length === 0 ? (
              <div className="text-sm opacity-70">No data yet — follow friends to see rankings</div>
            ) : (
              leaders.map((l) => (
                <LeaderboardRow
                  key={`${l.userId}-${l.rank}`}
                  rank={l.rank}
                  name={l.username}
                  points={l.points}
                  accent={l.rank === 1 ? "gold" : l.rank === 2 ? "silver" : l.rank === 3 ? "bronze" : undefined}
                />
              ))
            )}
          </div>

          <p className="text-xs opacity-70 mt-2">Points = completed tasks in the last 7 days</p>
        </div>

        {/* Follow bar to search for friends and display */}
        <FollowBar
          currentUserId={myId}
          following={following}
          loadingFollowing={loadingFollowing}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
          onRefresh={async () => {
            await loadFollowing();
            await refreshLeaders();
          }}
        />
      </div>
    </div>
  );
}

function LeaderboardRow({ rank, name, points, accent }) {
  let badgeBg = "bg-[#2F4858]";
  if (accent === "gold") badgeBg = "bg-yellow-200";
  if (accent === "silver") badgeBg = "bg-slate-200";
  if (accent === "bronze") badgeBg = "bg-amber-500";
  const width = Math.max(10, Math.min(points, 100));
  return (
    <div className="rounded-xl border border-[#2F4858]/20 bg-[#FAFAF0] px-3 py-2 flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs text-white ${badgeBg}`}>
            {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`}
          </div>
          <span className="truncate text-sm">{name}</span>
        </div>
        <span className="text-xs opacity-70">{points} pts</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-[#2F4858]/10 overflow-hidden">
        <div className="h-full bg-[#2F4858] rounded-full" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
