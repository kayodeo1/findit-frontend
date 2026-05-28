export type Role = "owner" | "finder" | "admin";

export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: Role;
  phone: string;
}

export type ItemStatus = "lost" | "found" | "claimed";

export interface Item {
  id: number;
  name: string;
  description: string;
  color: string;
  location: string;
  date: string;
  status: ItemStatus;
  image_url?: string | null;
  reported_by: number;
  reported_by_name: string;
  reported_by_role: string;
  created_at: string;
  updated_at: string;
}

export type ClaimStatus = "pending" | "approved" | "rejected";

export interface Claim {
  id: number;
  item: number;
  item_name: string;
  item_status: string;
  owner: number;
  owner_name: string;
  proof: string;
  status: ClaimStatus;
  rejection_reason: string;
  created_at: string;
  updated_at: string;
}

export interface StatusHistory {
  id: number;
  old_status: string;
  new_status: string;
  changed_by: number;
  changed_by_name: string;
  timestamp: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
