import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import { mockUser } from "@/components/profile/data";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "Hồ sơ của tôi | Horizon Store",
  description: "Trang cá nhân của người dùng trên hệ thống Horizon Store",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pt-24 pb-12 w-full bg-slate-50">
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <ProfileHeader user={mockUser} />

        <div className="flex flex-col lg:flex-row gap-8">
          <ProfileSidebar />

          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl p-6 lg:p-8 min-h-[600px]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
