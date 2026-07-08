"use client";

import {
  useEffect,
  useState,
} from "react";

export default function CountdownTimer({
  endTime,
}: {
  endTime: string;
}) {
  const [timeLeft,
    setTimeLeft] =
    useState("");

  useEffect(() => {

    const interval =
      setInterval(() => {

        const now =
          new Date().getTime();

        const end =
          new Date(
            endTime,
          ).getTime();

        const distance =
          end - now;

        if (
          distance <= 0
        ) {
          setTimeLeft(
            "Expired",
          );

          clearInterval(
            interval,
          );

          return;
        }

        const days =
          Math.floor(
            distance /
              (1000 *
                60 *
                60 *
                24),
          );

        const hours =
          Math.floor(
            (distance %
              (1000 *
                60 *
                60 *
                24)) /
              (1000 *
                60 *
                60),
          );

        const minutes =
          Math.floor(
            (distance %
              (1000 *
                60 *
                60)) /
              (1000 * 60),
          );

        const seconds =
          Math.floor(
            (distance %
              (1000 * 60)) /
              1000,
          );

        setTimeLeft(
          `${days}d ${hours}h ${minutes}m ${seconds}s`,
        );
      }, 1000);

    return () =>
      clearInterval(
        interval,
      );
  }, [endTime]);

  return (
    <div className="font-bold text-red-600">
      {timeLeft}
    </div>
  );
}