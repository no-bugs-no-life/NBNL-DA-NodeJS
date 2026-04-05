import ProfileLibrary from "@/components/profile/ProfileLibrary";
import { mockLibrary } from "@/components/profile/data";

export default function LibraryPage() {
  return <ProfileLibrary items={mockLibrary} />;
}
