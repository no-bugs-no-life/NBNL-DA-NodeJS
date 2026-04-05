import Image from "next/image";
import { UserProfile } from "./data";
import { Mail, CalendarDays } from "lucide-react";

interface ProfileHeaderProps {
  user: UserProfile;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const joinDate = new Date(user.joinDate).toLocaleDateString("vi-VN", {
    dateStyle: "long",
  });

  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden mt-2 mb-8 relative">
      {/* Cover Image */}
      <div className="h-48 md:h-64 lg:h-80 relative w-full bg-slate-100">
        <Image
          src={user.coverUrl}
          alt="Cover"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
      </div>

      {/* Info Section */}
      <div className="relative px-6 md:px-12 pb-8">
        {/* Avatar */}
        <div className="absolute -top-16 md:-top-24 left-6 md:left-12">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white overflow-hidden shadow-md bg-slate-100">
            <Image
              src={user.avatarUrl}
              alt={user.displayName}
              fill
              className="object-cover"
            />
          </div>
          {/* Level Badge */}
          <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 bg-blue-600 border-2 border-white text-white font-bold rounded-full w-10 h-10 flex items-center justify-center text-sm shadow-md">
            {user.level}
          </div>
        </div>

        {/* Text details */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pt-20 md:pt-4 md:ml-48 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-1">
              {user.displayName}
            </h1>
            <p className="text-blue-600 font-medium mb-4">@{user.username}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
                <Mail className="w-4 h-4 text-slate-500" /> {user.email}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
                <CalendarDays className="w-4 h-4 text-slate-500" /> Tham gia{" "}
                {joinDate}
              </span>
            </div>

            <p className="mt-4 text-slate-600 max-w-2xl leading-relaxed">
              {user.bio}
            </p>
          </div>

          <div className="flex flex-col gap-2 md:items-end w-full md:w-64">
            <div className="flex justify-between w-full text-sm font-medium text-slate-600">
              <span>Cấp {user.level}</span>
              <span>{Math.round((user.xp / user.maxXp) * 100)}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden inset-ring-1 inset-ring-slate-900/10">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(user.xp / user.maxXp) * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-400">
              {user.xp} / {user.maxXp} XP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
