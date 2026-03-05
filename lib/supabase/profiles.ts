export type Profile = {
  id: string;
  email: string | null;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
};

export function isProfileComplete(profile: Profile | null): boolean {
  if (!profile) return false;
  return Boolean(profile.first_name?.trim() && profile.last_name?.trim());
}
