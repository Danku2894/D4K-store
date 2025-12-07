import { useState } from 'react';
import { FiUploadCloud, FiImage, FiCopy, FiCheck } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AdminLayout from '@components/admin/AdminLayout';
import uploadService from '@services/upload-service';

/**
 * AdminMedia Component - Street Style
 * Upload và quản lý file media
 */
const AdminMedia = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('ONLY IMAGE FILES ARE ALLOWED');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('FILE SIZE MUST BE LESS THAN 5MB');
      return;
    }

    try {
      setUploading(true);
      const response = await uploadService.uploadFile(file);
      
      if (response.success && response.data) {
        setUploadedFile(response.data);
        toast.success('UPLOAD SUCCESSFUL!');
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('UPLOAD FAILED');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('COPIED TO CLIPBOARD!');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-dark-950 mb-2 glitch-street">
            MEDIA LIBRARY
          </h1>
          <p className="text-gray-600 font-bold uppercase tracking-wide">
            UPLOAD & MANAGE ASSETS
          </p>
        </div>

        {/* Upload Area */}
        <div 
          className={`
            border-4 border-dashed rounded-none p-12 text-center transition-all
            ${dragActive 
              ? 'border-street-neon bg-light-100 scale-[1.02]' 
              : 'border-dark-950 bg-light-50'}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleChange}
            accept="image/*"
          />
          
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className={`p-6 rounded-full ${uploading ? 'animate-bounce' : ''} bg-dark-950 text-light-50`}>
              <FiUploadCloud size={48} />
            </div>
            
            <div>
              <p className="text-xl font-black uppercase tracking-tight text-dark-950 mb-2">
                {uploading ? 'UPLOADING...' : 'DRAG & DROP OR CLICK TO UPLOAD'}
              </p>
              <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
                SUPPORTS: JPG, PNG, WEBP (MAX 5MB)
              </p>
            </div>

            <label
              htmlFor="file-upload"
              className={`
                px-8 py-3 border-2 border-dark-950 bg-street-red text-light-50
                font-black uppercase tracking-wider cursor-pointer
                hover:bg-dark-950 hover:border-dark-950 transition-all
                ${uploading ? 'opacity-50 pointer-events-none' : ''}
              `}
            >
              BROWSE FILES
            </label>
          </div>
        </div>

        {/* Upload Result */}
        {uploadedFile && (
          <div className="border-4 border-dark-950 bg-light-50 p-6 animate-fade-in">
            <h3 className="text-xl font-black uppercase tracking-tight text-dark-950 mb-4 flex items-center space-x-2">
              <FiCheck className="text-street-neon" />
              <span>UPLOAD COMPLETE</span>
            </h3>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 aspect-square bg-gray-100 border-2 border-dark-950 flex items-center justify-center overflow-hidden">
                <img 
                  src={uploadedFile.url} 
                  alt="Uploaded" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
                    FILE NAME
                  </label>
                  <div className="p-3 bg-light-100 border-2 border-dark-950 font-bold text-sm break-all">
                    {uploadedFile.filename}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
                    PUBLIC URL
                  </label>
                  <div className="flex">
                    <div className="flex-1 p-3 bg-light-100 border-2 border-dark-950 border-r-0 font-bold text-sm break-all">
                      {uploadedFile.url}
                    </div>
                    <button
                      onClick={() => copyToClipboard(uploadedFile.url)}
                      className="px-4 border-2 border-dark-950 bg-dark-950 text-light-50 hover:bg-street-neon hover:text-dark-950 transition-colors"
                      title="Copy URL"
                    >
                      <FiCopy />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMedia;
