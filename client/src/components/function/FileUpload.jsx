import { useState, useRef } from 'react';
import { apiService } from '../../service/api';
export default function LargeFileUploader() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Ready to upload');
  const [cloudinaryUrl, setCloudinaryUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setStatus(`File selected: ${file.name}`);
      setProgress(0);
      setCloudinaryUrl('');
    } else {
      setSelectedFile(null);
      setStatus('Ready to upload');
    }
  };

  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    const callbacks = {
      onProgress: setProgress,
      onStatusChange: setStatus,
      onSuccess: (url) => {
        setCloudinaryUrl(url);
      },
      onError: (error) => {
        console.error("Upload failed in component:", error);
      },
    };

    await apiService.uploadFileInChunksService(selectedFile, callbacks);
  }, [selectedFile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpload();
  };

  const renderUploadResult = () => {
    if (!cloudinaryUrl) return null;
    const isVideo = cloudinaryUrl.includes('/video/');
    const isImage = cloudinaryUrl.includes('/image/');

    if (isVideo) {
      return <video controls src={cloudinaryUrl} className="mt-4 rounded-lg shadow-lg max-w-sm"></video>;
    } else if (isImage) {
      return <img src={cloudinaryUrl} alt="Uploaded asset" className="mt-4 rounded-lg shadow-lg max-w-sm" />;
    }
    return null;
  };

  return (
    <div className="p-8 max-w-2xl mx-auto font-sans bg-gray-50 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Large File Uploader</h1>
        <form onSubmit={handleSubmit}>
            <div className="flex items-center space-x-4">
                <button type="button" className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" onClick={handleSelectFileClick}>
                    Select File
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                <button className="px-4 py-2 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed" type="submit" disabled={!selectedFile || (progress > 0 && progress < 100)}>
                    Upload File
                </button>
            </div>
            <div className="mt-4">
                <div className="text-lg text-gray-700">{status}</div>
                {progress > 0 && (
                    <div className="w-full bg-gray-200 rounded-full mt-2">
                        <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${progress}%` }}>
                            {Math.round(progress)}%
                        </div>
                    </div>
                )}
            </div>
        </form>
        {cloudinaryUrl && (
            <div className="mt-6">
                <h2 className="w-full text-xl font-bold text-gray-800">Uploaded Asset</h2>
                {renderUploadResult()}
            </div>
        )}
    </div>
  );
}