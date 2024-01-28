import ChangePassword from "./ChangePassword";
import ProfileInfo from "./ProfileInfo";

export default function EditProfile() {
  return (
    <div className="w-full overflow-y-scroll">
      <div className="mx-auto p-2 w-3/4 mtiny:w-4/5 overflow-y-scroll">
        <h1 className="text-3xl sidebarItem font-semibold mb-3">
          EDIT PROFILE
        </h1>

        {/* Edit Profile Form */}
        <ProfileInfo />

        {/* Change Password Section */}
        <ChangePassword />
      </div>
    </div>
  );
}
