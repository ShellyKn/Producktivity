import { useMemo, useState } from "react";
import { searchUsers } from "../lib/api.js";

export default function FollowBar({
  currentUserId,
  following = [],            // [{_id, email, name, userName}]
  loadingFollowing = false,  // boolean
  onFollow,
  onUnfollow,
  onRefresh,
}) {
  // States
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const followingIdSet = useMemo(
    () => new Set((following || []).map(u => String(u._id))),
    [following]
  );

  // Searches for user(s)
  async function runSearch() {
    const q = query.trim();
    if (!q) { setResults([]); return; }
    try {
      setLoading(true);
      setError("");
      const list = await searchUsers(q, currentUserId || "");
      setResults(list || []);
    } catch (e) {
      setError(e.message || "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(user) {
    if (!currentUserId || !user?._id) return;
    const isFollowing = followingIdSet.has(String(user._id));
    try {
      setError("");
      if (isFollowing) await onUnfollow?.(user);
      else             await onFollow?.(user);
    } catch (e) {
      setError(e.message || (isFollowing ? "Unfollow failed" : "Follow failed"));
    }
  }

  const nameOf = (u) => u.userName || u.name || u.email || "";

  return (
    <div className="border-4 border-[#2F4858] rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[32px] leading-none">add friends</h1>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-xs underline opacity-70 hover:opacity-100"
            disabled={loadingFollowing}
          >
            {loadingFollowing ? "Refreshing…" : "Refresh"}
          </button>
        )}
      </div>

      {/* Search */}
      <div className="rounded-xl border border-[#2F4858]/20 bg-[#FAFAF0] px-3 py-2 flex flex-col gap-2 mt-2">
        <div className="flex items-center justify-between gap-2">
          <input
            className="w-full bg-[#FAFAF0] p-2 border border-[#2F4858]/30 rounded"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name/email…"
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
          />
          <button
            onClick={runSearch}
            className="border-4 border-[#2F4858] rounded-xl px-4 py-1.5 text-[20px]
                       hover:bg-[#2F4858] hover:text-white transition-colors"
            disabled={loading || !currentUserId}
            aria-busy={loading ? "true" : "false"}
          >
            {loading ? "…" : "Search"}
          </button>
        </div>

        {!!error && <div className="text-red-600 text-sm">{error}</div>}

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-1 space-y-2">
            {results.map(u => {
              const isFollowing = followingIdSet.has(String(u._id));
              const display = nameOf(u);
              return (
                <div key={u._id} className="flex items-center justify-between gap-2 bg-white/70 rounded px-2 py-1 border border-[#2F4858]/20">
                  <div className="min-w-0">
                    <div className="text-sm truncate font-semibold">
                      {display || <span className="inline-block w-24 h-3 bg-[#2F4858]/10 rounded animate-pulse" />}
                    </div>
                    {!!u.email && (
                      <div className="text-xs opacity-70 truncate">{u.email}</div>
                    )}
                  </div>

                  {/* Hide button until following list is loaded to avoid wrong label for a frame */}
                  {!loadingFollowing && (
                    <button
                      onClick={() => handleToggle(u)}
                      className={`border-2 rounded-lg px-3 py-1 text-sm transition-colors
                        ${isFollowing
                          ? "border-red-600 text-red-700 hover:bg-red-600 hover:text-white"
                          : "border-[#2F4858] text-[#2F4858] hover:bg-[#2F4858] hover:text-white"}`}
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Current following */}
      <div className="mt-3">
        <p className="text-sm uppercase tracking-widest opacity-70 mb-1">you follow</p>

        {loadingFollowing ? (
          <div className="space-y-1">
            <div className="h-5 bg-[#2F4858]/10 rounded animate-pulse" />
            <div className="h-5 bg-[#2F4858]/10 rounded animate-pulse" />
          </div>
        ) : following.length === 0 ? (
          <div className="text-sm opacity-70">No friends yet — search and follow someone!</div>
        ) : (
          <ul className="space-y-1">
            {following.map(u => {
              const display = nameOf(u);
              return (
                <li
                  key={u._id}
                  className="text-sm bg-white/70 rounded px-2 py-1 border border-[#2F4858]/20 flex items-center justify-between"
                >
                  <span className="truncate">
                    {display || <span className="inline-block w-24 h-3 bg-[#2F4858]/10 rounded" />}
                  </span>
                  <button
                    onClick={() => handleToggle(u)}
                    className="text-xs border border-red-600 text-red-700 rounded px-2 py-0.5 hover:bg-red-600 hover:text-white"
                  >
                    Unfollow
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {!currentUserId && (
        <div className="text-xs opacity-70 mt-2">Log in to follow friends.</div>
      )}
    </div>
  );
}
