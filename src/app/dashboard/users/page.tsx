"use client";

import { getUsers,
  blockUser,
  unblockUser, } from "@/src/services/user.service";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function UsersPage() {
  const [users, setUsers] =
    useState<any[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers =
    async () => {
      const data =
        await getUsers();

      setUsers(data);
    };

  const handleAction =
    async (
      phone: string,
      blocked: boolean,
    ) => {
      if (blocked) {
        await unblockUser(phone);
      } else {
        await blockUser(
          phone,
          "Blocked By Admin",
        );
      }

      loadUsers();
    };

  return (
    <div className="space-y-6">

      <div className="flex justify-between">

        <h1 className="text-3xl font-bold">
          Users
        </h1>

        <div className="bg-blue-100 px-4 py-2 rounded-xl">
          Total: {users.length}
        </div>

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">
                Phone
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Joined
              </th>

              <th className="p-4 text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {users.map(
              (user) => (
                <tr
                  key={user._id}
                  className="border-t"
                >

                  <td className="p-4">
                    {user.phone}
                  </td>

                  <td className="p-4">

                    {user.isBlocked ? (
                      <span className="text-red-500">
                        Blocked
                      </span>
                    ) : (
                      <span className="text-green-500">
                        Active
                      </span>
                    )}

                  </td>

                  <td className="p-4">
                    {new Date(
                      user.createdAt,
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-4 flex gap-2">

                    <Link
                      href={`/dashboard/users/${user._id}`}
                    >
                      <button className="bg-blue-500 text-white px-3 py-2 rounded-lg">
                        View
                      </button>
                    </Link>

                    <button
                      onClick={() =>
                        handleAction(
                          user.phone,
                          user.isBlocked,
                        )
                      }
                      className={`px-3 py-2 rounded-lg text-white ${
                        user.isBlocked
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {user.isBlocked
                        ? "Unblock"
                        : "Block"}
                    </button>

                  </td>

                </tr>
              ),
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}