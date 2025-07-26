import { useRef, useState } from "react";
import { MdAccountCircle } from 'react-icons/md';
import { apiService } from '../../service/api';

export default function Header({ user }) {
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [profileUrl, setProfileUrl] = useState(user?.profileUrl);

  React.useEffect(() => {
    setProfileUrl(user?.profileUrl);
  }, [user?.profileUrl]);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
        "image/gif"
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Unsupported file type. Please upload a PNG, JPG, WEBP, or GIF image.");
        setUploading(false);
        return;
      }

      const staffId = user.staff_id || user.id || user._id;

      if (!staffId) {
        alert("Staff ID is missing. Cannot upload profile image.");
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", file);
      formData.append("staff_id", staffId);
      formData.append("id", staffId);

      const res = await apiService.uploadProfileImage(formData);

      if (res.url) {
        setProfileUrl(res.url);
      } else {
        alert("Upload succeeded but no image URL returned.");
      }
    } catch (err) {
      alert("Failed to upload profile image. Please check your network, file type, and backend API field name.");
    }
    setUploading(false);
  };

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-orange-600">Admin Panel</h1>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="focus:outline-none"
            onClick={handleIconClick}
            title="Upload Profile"
          >
            {profileUrl ? (
              <img
                src={profileUrl}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-orange-600"
              />
            ) : (
              <MdAccountCircle size={30} className="text-orange-600" />
            )}
            {uploading && (
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-orange-500 animate-pulse"></span>
            )}
          </button>
        </div>
        <div className="text-sm">
          <div className="font-semibold">{user?.name || 'Staff Name'}</div>
          <div className="text-gray-500 text-xs capitalize">{user?.role || 'staff'}</div>
        </div>
      </div>
    </header>
  );
}
            