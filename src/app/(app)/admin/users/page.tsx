"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { AdminUser } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input, Select, Field, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageLoader, EmptyState } from "@/components/ui/spinner";
import { Search } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selected, setSelected] = useState<AdminUser | null>(null);

  async function load(q?: string, role?: string) {
    setLoading(true);
    try {
      const res = await api.users.list({ search: q || undefined, role: role || undefined });
      setUsers(res.results);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    load(search, roleFilter);
  }

  function onChanged(updated: AdminUser | null, removedId?: number) {
    setSelected(null);
    if (removedId != null) {
      setUsers((prev) => prev.filter((u) => u.id !== removedId));
    } else if (updated) {
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    }
  }

  const flaggedCount = users.filter((u) => u.is_flagged).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline-lg text-headline-lg font-semibold text-on-surface">Users</h1>
        <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
          Admin can search and manage users — view profiles and login sessions, flag suspicious
          accounts, or remove them. Admin cannot search items.
        </p>
      </div>

      {flaggedCount > 0 && (
        <div className="flex items-center gap-2 rounded-xl bg-error-container/60 px-4 py-3">
          <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>flag</span>
          <p className="font-label-md text-label-md text-on-error-container">
            {flaggedCount} flagged user{flaggedCount > 1 ? "s" : ""} need attention.
          </p>
        </div>
      )}

      {/* Search users */}
      <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-outline" />
          <Input
            placeholder="Search users by name, email, phone, or city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11"
          />
        </div>
        <Select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); load(search, e.target.value); }}
          className="w-40"
        >
          <option value="">All roles</option>
          <option value="owner">Owner</option>
          <option value="finder">Finder</option>
          <option value="admin">Admin</option>
        </Select>
        <Button type="submit" variant="outline">Search</Button>
      </form>

      {loading ? (
        <PageLoader />
      ) : users.length === 0 ? (
        <EmptyState
          icon={<span className="material-symbols-outlined text-5xl">group_off</span>}
          title="No users found"
          description="No users match your search."
        />
      ) : (
        <div className="overflow-hidden rounded-lg bg-surface-container-lowest ring-1 ring-outline-variant/40 shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-surface-container">
              <tr>
                <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant">User</th>
                <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant hidden sm:table-cell">Role</th>
                <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant hidden lg:table-cell">Last login</th>
                <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant hidden md:table-cell">Joined</th>
                <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-surface-container-low transition-colors cursor-pointer"
                  onClick={() => setSelected(u)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-body-md text-body-md font-semibold text-on-surface">
                          {u.full_name || u.email}
                        </p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">{u.email}</p>
                      </div>
                      {u.is_flagged && (
                        <span className="material-symbols-outlined text-base text-error" style={{ fontVariationSettings: "'FILL' 1" }}>flag</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge tone={u.role === "admin" ? "info" : "neutral"}>{u.role}</Badge>
                  </td>
                  <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant hidden lg:table-cell">
                    {u.last_login ? formatDate(u.last_login) : "Never"}
                  </td>
                  <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant hidden md:table-cell">
                    {formatDate(u.date_joined)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="material-symbols-outlined text-outline text-base">chevron_right</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <UserDetailModal user={selected} onClose={() => setSelected(null)} onChanged={onChanged} />
      )}
    </div>
  );
}

function UserDetailModal({
  user,
  onClose,
  onChanged,
}: {
  user: AdminUser;
  onClose: () => void;
  onChanged: (updated: AdminUser | null, removedId?: number) => void;
}) {
  const [flagReason, setFlagReason] = useState(user.flag_reason);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function toggleFlag() {
    setBusy(true);
    try {
      const updated = await api.users.update(user.id, {
        is_flagged: !user.is_flagged,
        flag_reason: !user.is_flagged ? flagReason : "",
      });
      toast.success(updated.is_flagged ? "User flagged" : "Flag removed");
      onChanged(updated);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update user");
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    try {
      await api.users.remove(user.id);
      toast.success("User account deleted");
      onChanged(null, user.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user");
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-surface-container-lowest p-6 shadow-xl ring-1 ring-outline-variant/40 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">
              {user.full_name || user.email}
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <Badge tone={user.role === "admin" ? "info" : "neutral"}>{user.role}</Badge>
              {user.is_flagged && <Badge tone="danger">Flagged</Badge>}
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Profile */}
        <div className="mb-4 space-y-2 rounded-xl bg-surface-container-low p-4">
          <Detail icon="mail" label="Email" value={user.email} />
          <Detail icon="call" label="Mobile" value={user.phone || "—"} />
          <Detail icon="home" label="Address" value={user.address || "—"} />
        </div>

        {/* Login sessions */}
        <div className="mb-4 space-y-2 rounded-xl bg-surface-container-low p-4">
          <p className="font-label-md text-label-md font-semibold text-on-surface">Login session</p>
          <Detail icon="login" label="Last login" value={user.last_login ? formatDate(user.last_login) : "Never signed in"} />
          <Detail icon="person_add" label="Joined" value={formatDate(user.date_joined)} />
        </div>

        {user.role !== "admin" && (
          <>
            {/* Flag */}
            <Field label="Flag reason (if flagging)">
              <Textarea
                placeholder="Describe the ulterior motive or suspicious behaviour…"
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                className="min-h-[72px]"
              />
            </Field>

            <div className="mt-4 flex flex-col gap-2">
              <Button
                variant={user.is_flagged ? "outline" : "subtle"}
                onClick={toggleFlag}
                disabled={busy}
                className="w-full"
              >
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>flag</span>
                {user.is_flagged ? "Remove flag" : "Flag user"}
              </Button>

              {confirmDelete ? (
                <div className="rounded-xl bg-error-container/40 p-3">
                  <p className="mb-2 font-label-sm text-label-sm text-on-error-container">
                    Delete this account? This removes the user but does not otherwise harm them.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="destructive" onClick={remove} disabled={busy} className="flex-1">
                      {busy ? "Deleting…" : "Confirm delete"}
                    </Button>
                    <Button variant="outline" onClick={() => setConfirmDelete(false)} disabled={busy}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button variant="ghost" onClick={() => setConfirmDelete(true)} className="w-full text-error">
                  <span className="material-symbols-outlined text-base">delete</span>
                  Delete user
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Detail({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="material-symbols-outlined text-[20px] text-secondary">{icon}</span>
      <div className="min-w-0">
        <p className="font-label-sm text-label-sm text-on-surface-variant">{label}</p>
        <p className="font-body-md text-body-md text-on-surface break-words">{value}</p>
      </div>
    </div>
  );
}
