export type Role = "owner" | "finder" | "admin";

export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  full_name: string;
  role: Role;
  phone: string;
  house_no: string;
  street: string;
  area: string;
  lga: string;
  city: string;
  address: string;
}

export interface AdminUser {
  id: number;
  email: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  full_name: string;
  role: Role;
  phone: string;
  address: string;
  is_flagged: boolean;
  flag_reason: string;
  date_joined: string;
  last_login: string | null;
}

export type ItemStatus = "lost" | "found" | "claimed";

export interface Item {
  id: number;
  name: string;
  description: string;
  color: string;
  model: string;
  serial_no: string;
  location: string;
  date: string;
  status: ItemStatus;
  image_url?: string | null;
  owner_photo_url?: string | null;
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
  admin_query: string;
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
