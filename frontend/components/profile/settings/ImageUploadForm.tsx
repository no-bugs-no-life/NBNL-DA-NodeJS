"use client";
import { useState } from "react";
import { User } from "@/store/useAuthStore";
import { uploadFileByChunks } from "@/lib/chunkUpload";

export function ImageUploadForm({
  user,
  onSave,
  loading,
}: {
  user: User;
  onSave: (data: Partial<User>) => void;
  loading: boolean;
}) {
  const defaultAvatar = "https://i.sstatic.net/l60Hf.png";
  const defaultCover =
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop";

  const initialAvatar =
    user.avatar && typeof user.avatar === "object"
      ? user.avatar.url
      : user.avatar || user.avatarUrl || defaultAvatar;
  const initialCover =
    user.cover && typeof user.cover === "object"
      ? user.cover.url
      : user.cover || user.coverUrl || defaultCover;

  const [avatarUrl, setAvatarUrl] = useState(initialAvatar);
  const [coverUrl, setCoverUrl] = useState(initialCover);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (type === "avatar") {
        setAvatarFile(file);
        setAvatarUrl(previewUrl);
      } else {
        setCoverFile(file);
        setCoverUrl(previewUrl);
      }
    }
  };

  const uploadFile = async (file: File, fileType: string) => {
    const uploaded = await uploadFileByChunks({
      file,
      ownerType: "user",
      ownerId: user._id,
      fileType,
    });
    return uploaded._id;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const updateData: Partial<User> = {};
      if (avatarFile)
        updateData.avatar = await uploadFile(avatarFile, "avatar");
      if (coverFile) updateData.cover = await uploadFile(coverFile, "banner");

      if (Object.keys(updateData).length > 0) {
        onSave(updateData);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
      setAvatarFile(null);
      setCoverFile(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-2xl mb-6"
    >
      <h3 className="text-lg font-bold text-slate-800 mb-2">
        Hình ảnh cá nhân
      </h3>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Ảnh đại diện (Avatar)
        </label>
        <div className="flex items-center gap-5">
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md bg-slate-100"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "avatar")}
            className="text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Ảnh bìa (Cover)
        </label>
        <div className="flex flex-col gap-4">
          <img
            src={coverUrl}
            alt="Cover"
            className="w-full h-32 rounded-2xl object-cover border-4 border-white shadow-md bg-slate-100"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "cover")}
            className="text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer transition-colors"
          />
        </div>
      </div>

      <button
        disabled={loading || uploading || (!avatarFile && !coverFile)}
        type="submit"
        className="px-5 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 disabled:opacity-50 text-sm mt-4 transition-all"
      >
        {uploading ? "Đang tải lên..." : "Lưu hình ảnh"}
      </button>
    </form>
  );
}
