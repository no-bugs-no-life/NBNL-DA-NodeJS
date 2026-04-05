"use client";

const FILE_TYPES = [
  "",
  "apk",
  "ipa",
  "icon",
  "banner",
  "screenshot",
  "avatar",
  "other",
];
const OWNER_TYPES = ["", "app", "user", "developer"];

interface Props {
  ownerType: string;
  fileType: string;
  onOwnerTypeChange: (v: string) => void;
  onFileTypeChange: (v: string) => void;
}

export function FileFilterBar({
  ownerType,
  fileType,
  onOwnerTypeChange,
  onFileTypeChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <select
        value={ownerType}
        onChange={(e) => onOwnerTypeChange(e.target.value)}
        className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white"
      >
        <option value="">Tat ca chu so huu</option>
        {OWNER_TYPES.filter(Boolean).map((t) => (
          <option key={t} value={t}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </option>
        ))}
      </select>
      <select
        value={fileType}
        onChange={(e) => onFileTypeChange(e.target.value)}
        className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white"
      >
        <option value="">Tat ca loai file</option>
        {FILE_TYPES.filter(Boolean).map((t) => (
          <option key={t} value={t}>
            {t.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
