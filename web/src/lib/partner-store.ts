import type { AuthUser } from "./api";

export type PartnerRole = "RESTAURANT_ADMIN" | "RIDER";

export type PartnerProfile = {
  email: string;
  role: PartnerRole;
  displayName: string;
  phone?: string;
  city?: string;
  specialty?: string;
  address?: string;
  googleMapsUrl?: string;
  notes?: string;
  verificationStatus: "pending" | "verified";
  createdAt: string;
  verifiedAt?: string;
};

const partnerProfilesKey = "hashfood_partner_profiles";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function readProfiles(): Record<string, PartnerProfile> {
  try {
    const saved = localStorage.getItem(partnerProfilesKey);
    const parsed = saved ? (JSON.parse(saved) as Record<string, PartnerProfile>) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeProfiles(profiles: Record<string, PartnerProfile>) {
  localStorage.setItem(partnerProfilesKey, JSON.stringify(profiles));
  window.dispatchEvent(new Event("hashfood-partner-updated"));
}

export function getPartnerProfile(email?: string | null) {
  if (!email) return null;
  return readProfiles()[normalizeEmail(email)] ?? null;
}

export function upsertPartnerProfile(
  profile: Omit<PartnerProfile, "email" | "createdAt" | "verificationStatus"> & {
    email: string;
    verificationStatus?: PartnerProfile["verificationStatus"];
  },
) {
  const profiles = readProfiles();
  const email = normalizeEmail(profile.email);
  const existing = profiles[email];
  const next: PartnerProfile = {
    ...existing,
    ...profile,
    email,
    displayName: profile.displayName || existing?.displayName || email,
    verificationStatus: profile.verificationStatus ?? existing?.verificationStatus ?? "pending",
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };

  profiles[email] = next;
  writeProfiles(profiles);
  return next;
}

export function markPartnerVerified(email: string) {
  const existing = getPartnerProfile(email);
  if (!existing) return null;
  return upsertPartnerProfile({
    ...existing,
    verificationStatus: "verified",
    verifiedAt: new Date().toISOString(),
  });
}

export function isPartnerRole(role?: AuthUser["role"]): role is PartnerRole {
  return role === "RESTAURANT_ADMIN" || role === "RIDER";
}

export function partnerDashboardPath(role: AuthUser["role"]) {
  if (role === "RESTAURANT_ADMIN") return "/partner/restaurant/dashboard";
  if (role === "RIDER") return "/partner/rider/dashboard";
  if (role === "ADMIN") return "/admin";
  return "/customer";
}
