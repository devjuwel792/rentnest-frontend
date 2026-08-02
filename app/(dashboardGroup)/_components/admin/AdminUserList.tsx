"use client";

import { useMemo, useState } from "react";
import type { AdminUser } from "@/lib/types";
import {
  getErrorMessage,
  updateUserStatus,
  useGetAdminUsersQuery,
} from "@/lib/api";
import { formatDate } from "@/lib/format";
import Pagination from "./Pagination";

const PAGE_SIZE = 8;

const ROLE_STYLES: Record<string, string> = {
  ADMIN: "bg-purple-50 text-purple-700",
  LANDLORD: "bg-blue-50 text-blue-700",
  TENANT: "bg-teal-50 text-teal-700",
};

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700",
  BANNED: "bg-red-50 text-red-700",
};

const RoleBadge = ({ role }: { role: string }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
      ROLE_STYLES[role] ?? "bg-gray-100 text-gray-600"
    }`}
  >
    {role}
  </span>
);

const StatusBadge = ({ status }: { status?: string }) => {
  const normalized = status?.toUpperCase() === "BANNED" ? "BANNED" : "ACTIVE";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        STATUS_STYLES[normalized] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {normalized}
    </span>
  );
};

const AdminUserList = () => {
  const { data, isLoading, isError, error, refetch } = useGetAdminUsersQuery();
  const [roleFilter, setRoleFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => {
    const list = data ?? [];
    const term = search.trim().toLowerCase();
    return list.filter((user: AdminUser) => {
      if (roleFilter && user.role !== roleFilter) return false;
      if (!term) return true;
      return (
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term)
      );
    });
  }, [data, roleFilter, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const isBanned = (user: AdminUser) =>
    user.status?.toUpperCase() === "BANNED";

  const handleToggle = async (user: AdminUser) => {
    const nextStatus: "ACTIVE" | "BANNED" = isBanned(user)
      ? "ACTIVE"
      : "BANNED";
    setBusyId(user.id);
    setMessage("");
    try {
      await updateUserStatus(user.id, nextStatus);
      refetch();
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : `Could not ${nextStatus.toLowerCase()} the user.`
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Search users, filter by role and ban or unban accounts.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="🔍 Search by name or email..."
          className="w-full max-w-sm rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <select
          value={roleFilter}
          onChange={(event) => {
            setRoleFilter(event.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All roles</option>
          <option value="TENANT">Tenants</option>
          <option value="LANDLORD">Landlords</option>
          <option value="ADMIN">Admins</option>
        </select>
        <span className="text-sm text-gray-500">
          {filtered.length} user{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {message && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {message}
        </p>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-2xl border border-gray-200 bg-white"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center">
          <p className="text-4xl">😕</p>
          <p className="mt-3 text-sm font-medium text-gray-900">
            Couldn&apos;t load users
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {getErrorMessage(error) || "Please try again."}
          </p>
          <button
            onClick={refetch}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Try again
          </button>
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center">
          <p className="text-4xl">👥</p>
          <p className="mt-3 text-sm font-medium text-gray-900">
            No users match your filters
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting the search or role filter.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase text-gray-400">
                <th className="px-5 py-3 font-semibold">User</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="hidden px-5 py-3 font-semibold sm:table-cell">
                  Status
                </th>
                <th className="hidden px-5 py-3 font-semibold md:table-cell">
                  Joined
                </th>
                <th className="px-5 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((user) => {
                const busy = busyId === user.id;
                return (
                  <tr
                    key={user.id}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="hidden px-5 py-4 sm:table-cell">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="hidden px-5 py-4 text-gray-500 md:table-cell">
                      {user.createdAt ? formatDate(user.createdAt) : "—"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleToggle(user)}
                        disabled={busy}
                        className={`rounded-lg px-3 py-1.5 text-sm font-semibold disabled:opacity-50 ${
                          isBanned(user)
                            ? "bg-emerald-600 text-white hover:bg-emerald-500"
                            : "border border-red-200 text-red-600 hover:bg-red-50"
                        }`}
                      >
                        {busy
                          ? "Saving..."
                          : isBanned(user)
                            ? "Unban"
                            : "Ban"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        page={safePage}
        pageCount={pageCount}
        onPageChange={setPage}
      />
    </div>
  );
};

export default AdminUserList;
