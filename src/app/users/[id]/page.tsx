"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";
import { getUserById } from "@/src/services/user.service";



export default function UserDetailsPage() {
  const params =
    useParams();

  const [user, setUser] =
    useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser =
    async () => {
      const data =
        await getUserById(
          params.id as string,
        );

      setUser(data);
    };

  if (!user) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          User Details
        </h1>

        <p className="text-gray-500">
          User Information
        </p>

      </div>

      <div className="bg-white rounded-xl shadow p-8">

        <div className="space-y-5">

          <div>

            <h3 className="text-gray-500">
              Phone Number
            </h3>

            <p className="font-semibold">
              {user.phone}
            </p>

          </div>

          <div>

            <h3 className="text-gray-500">
              Status
            </h3>

            <p>
              {user.isBlocked
                ? "Blocked"
                : "Active"}
            </p>

          </div>

          <div>

            <h3 className="text-gray-500">
              Joined Date
            </h3>

            <p>
              {new Date(
                user.createdAt,
              ).toLocaleDateString()}
            </p>

          </div>

          {user.blockReason && (
            <div>

              <h3 className="text-gray-500">
                Block Reason
              </h3>

              <p>
                {user.blockReason}
              </p>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}