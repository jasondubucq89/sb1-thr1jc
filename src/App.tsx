import React, { useState } from 'react';
import { Upload, Download, Shield, Star, ArrowUpCircle, X, Image } from 'lucide-react';
import { ImageUrls } from './components/ImageUrls';

function App() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError("Only image files are allowed (JPEG, PNG, GIF, WEBP)");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError("File size must be less than 5MB");
      return false;
    }
    return true;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setUploadedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError(null);
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setUploadedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    }
  };

  const clearUpload = () => {
    setUploadedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-orange-50">
      {/* Retro Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white tracking-tight">MEGA<span className="text-blue-100">IMAGE</span></h1>
          </div>
          <div className="flex items-center gap-4 text-white">
            <Star className="w-6 h-6" />
            <span className="font-bold">PREMIUM</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {/* Upload Box */}
        <div className="mt-8 bg-white rounded-xl shadow-xl border-2 border-orange-300 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ArrowUpCircle /> Upload Your Images
            </h2>
          </div>

          <div 
            className={`p-8 transition-all ${dragActive ? 'bg-orange-50' : 'bg-white'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {!uploadedFile ? (
              <div className="border-4 border-dashed border-orange-200 rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleChange}
                  accept="image/*"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-4"
                >
                  <Upload className="w-16 h-16 text-orange-500" />
                  <div className="space-y-2">
                    <p className="text-xl font-semibold text-gray-700">
                      Drop your image here or click to upload
                    </p>
                    <p className="text-gray-500">
                      Supported formats: JPEG, PNG, GIF, WEBP (max 5MB)
                    </p>
                  </div>
                  <button className="mt-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all">
                    SELECT IMAGE
                  </button>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-700">Preview</h3>
                  <button
                    onClick={clearUpload}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="border rounded-lg p-4 bg-gray-50">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded"
                    />
                  )}
                  <div className="mt-4 text-center">
                    <p className="text-gray-700 font-medium">{uploadedFile.name}</p>
                    <p className="text-gray-500 text-sm">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <a
                    href={previewUrl || '#'}
                    download={uploadedFile.name}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download Image
                  </a>
                </div>
                {previewUrl && (
                  <div className="mt-6">
                    <ImageUrls imageUrl={previewUrl} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-orange-200">
            <Image className="w-8 h-8 text-orange-500 mb-3" />
            <h3 className="font-bold text-lg mb-2">Image Support</h3>
            <p className="text-gray-600">Upload JPEG, PNG, GIF, and WEBP files</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-orange-200">
            <Shield className="w-8 h-8 text-orange-500 mb-3" />
            <h3 className="font-bold text-lg mb-2">Secure Storage</h3>
            <p className="text-gray-600">Your images are encrypted and protected</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-orange-200">
            <Download className="w-8 h-8 text-orange-500 mb-3" />
            <h3 className="font-bold text-lg mb-2">Instant Download</h3>
            <p className="text-gray-600">Download your images immediately</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-orange-200 bg-orange-50 py-6">
        <div className="max-w-4xl mx-auto text-center text-orange-800 text-sm">
          © 2024 MegaImage - For demonstration purposes only
        </div>
      </footer>
    </div>
  );
}

export default App;