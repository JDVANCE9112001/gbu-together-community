/* Versioned local repository. All writes stay on this browser; no identity claim. */
(() => {
  const key = "gbu.community.v2";
  const fresh = () => ({
    version: 2,
    posts: [],
    replies: {},
    saved: [],
    liked: [],
    interests: [],
    followed: [],
    reviews: [],
    experiences: [],
    boards: [],
    profile: { name: "同行者" },
    draft: null,
  });
  let state = fresh(),
    available = true;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.version === 2) state = { ...fresh(), ...parsed };
    }
  } catch {
    available = false;
  }
  const arrays = [
    "posts",
    "saved",
    "liked",
    "interests",
    "followed",
    "reviews",
    "experiences",
    "boards",
  ];
  arrays.forEach((k) => {
    if (!Array.isArray(state[k])) state[k] = [];
  });
  if (
    !state.replies ||
    typeof state.replies !== "object" ||
    Array.isArray(state.replies)
  )
    state.replies = {};
  if (!state.profile || typeof state.profile.name !== "string")
    state.profile = { name: "同行者" };
  window.CommunityStore = {
    get: () => state,
    get available() {
      return available;
    },
    update(fn) {
      const next = structuredClone(state);
      fn(next);
      state = next;
      try {
        localStorage.setItem(key, JSON.stringify(state));
        available = true;
      } catch {
        available = false;
      }
      return available;
    },
    export() {
      return JSON.stringify(
        { exportedAt: new Date().toISOString(), ...state },
        null,
        2,
      );
    },
  };
})();
