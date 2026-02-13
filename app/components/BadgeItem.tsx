"use client";

import Image from "next/image";

export default function BadgeItem({ name, icon }: { name: string; icon: string }) {
  // If icon is emoji, render as text. If URL, use next/image
  const isEmoji = icon.length <= 2; // crude emoji check
  return (
    <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
      {isEmoji ? (
        <span className="text-lg">{icon}</span>
      ) : (
        <Image src={icon} alt={name} width={16} height={16} />
      )}
      <span>{name}</span>
    </div>
  );
}
