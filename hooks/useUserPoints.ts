"use client";

import { useEffect, useState } from "react";

export function useUserPoints() {
  const [points, setPoints] = useState<number>(0);

  const fetchPoints = async () => {
    const res = await fetch("/api/users/me");
    const data = await res.json();
    setPoints(data?.points ?? 0);
  };

  useEffect(() => {
    fetchPoints();
    const interval = setInterval(fetchPoints, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, []);

  return points;
}
