import ChangePassword from "./ChangePassword/ChangePassword";
import ProfileInfo from "./ChangeInfo/ProfileInfo";

export default function EditProfile() {
  return (
    <div className="w-full h-screen overflow-y-auto pb-20 scrollbar-hide">
      <div className="mx-auto p-2 w-3/4 mtiny:w-4/5 pt-8">
        <h1 className="text-3xl sidebarItem font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-400">
          Edit Profile
        </h1>

        {/* Edit Profile Form */}
        <ProfileInfo />

        {/* Change Password Section */}
        <ChangePassword />
      </div>
    </div>
  );
}
