export const BROWSE_PROFILE_STORAGE_KEY = "manga_match_browse_profile";

export const DEFAULT_BROWSE_PROFILE = {
  gender: "",
  age: "",
  frequency: "",
  genres: [],
  dislikes: [],
  moods: [],
  updatedAt: "",
};

export function normalizeBrowseProfile(profile) {
  if (!profile || typeof profile !== "object") return null;

  return {
    gender: profile.gender || "",
    age: profile.age || "",
    frequency: profile.frequency || "",
    genres: Array.isArray(profile.genres) ? profile.genres : [],
    dislikes: Array.isArray(profile.dislikes) ? profile.dislikes : [],
    moods: Array.isArray(profile.moods) ? profile.moods : [],
    updatedAt: profile.updatedAt || "",
  };
}
