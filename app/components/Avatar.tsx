"use client";

import Image from "next/image";

type AvatarProps = {
  src?: string | null;
  name?: string | null;
  size?: number; // optional size
};

export default function Avatar({ src, name, size = 64 }: AvatarProps) {
  const initials = name?.[0]?.toUpperCase() || "U";

  return src ? (
    <Image
      src={src}
      alt={name || "User Avatar"}
      width={size}
      height={size}
      className="rounded-full object-cover"
    />
  ) : (
    <div
      className="flex items-center justify-center rounded-full bg-gray-300 text-white font-bold"
      style={{ width: size, height: size, fontSize: size / 2 }}
    >
      {initials}
    </div>
  );
}
