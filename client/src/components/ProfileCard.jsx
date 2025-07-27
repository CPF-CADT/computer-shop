import React, { useState, useRef, useCallback } from "react";
import { MdEdit, MdPhone } from "react-icons/md";
import toast from "react-hot-toast";
import { apiService } from "../service/api";

const ProfileCard = ({ customerProfile, authUser, onProfileImageUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(
    customerProfile?.profile_img_path || authUser?.profile_img_path || ""
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const displayName = customerProfile?.name || authUser?.name || "User";
  const displayPhone =
    customerProfile?.phone_number || authUser?.phone_number || "N/A";

  const imageUrl = customerProfile.profile_img_path ||uploadedImageUrl || `https://ui-avatars.com/api/?name=${displayName}&background=6366f1&color=fff`;

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      handleUpload(file);
    }
  };

  const handleUpload = useCallback(
    async (file) => {
      if (!file) {
        toast.error("No file selected");
        return;
      }

      setIsUploading(true);

      const uploadPromise = apiService.uploadImageToCloudinary(file);

      toast.promise(uploadPromise, {
        loading: "Uploading image...",
        success: (url) => {
          setUploadedImageUrl(url);
          setSelectedFile(null);
          setIsUploading(false);

          if (onProfileImageUpdate) {
            onProfileImageUpdate(url);
          }

          return "✅ Image uploaded!";
        },
        error: (err) => {
          setIsUploading(false);
          return `❌ Upload failed: ${err.message || "Try again."}`;
        },
      });

      await uploadPromise;
    },
    [onProfileImageUpdate]
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="relative">
          <img
            src={imageUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <button
            onClick={handleEditClick}
            className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
            disabled={isUploading}
          >
            <MdEdit className="text-sm" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
            disabled={isUploading}
          />
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
          <div className="flex items-center gap-2 text-gray-600 mt-1">
            <MdPhone className="text-lg" />
            <span>{displayPhone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
