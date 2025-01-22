import { useState } from 'react';

interface Image {
  id: number;
  url: string;
  description: string;
}

const ImageGallery = () => {
  const [images, setImages] = useState<Image[]>([
    {
      id: 1,
      url: 'https://source.unsplash.com/random/800x600?nature',
      description: 'Beautiful nature landscape'
    },
    {
      id: 2,
      url: 'https://source.unsplash.com/random/800x600?city',
      description: 'Urban cityscape'
    },
    {
      id: 3,
      url: 'https://source.unsplash.com/random/800x600?architecture',
      description: 'Modern architecture'
    }
  ]);

  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [newDescription, setNewDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageClick = (image: Image) => {
    setSelectedImage(image);
    setNewDescription(image.description);
  };

  const handleDescriptionUpdate = () => {
    if (selectedImage && newDescription.trim()) {
      setImages(images.map(img =>
        img.id === selectedImage.id
          ? { ...img, description: newDescription }
          : img
      ));
      setSelectedImage(null);
      setNewDescription('');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (uploadedFile && previewUrl) {
      const newImage: Image = {
        id: Date.now(),
        url: previewUrl,
        description: 'New uploaded image'
      };
      setImages([...images, newImage]);
      setUploadedFile(null);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Upload Section */}
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Upload New Image</h2>
        <div className="flex flex-col space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 rounded"
          />
          {previewUrl && (
            <div>
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-xs h-auto mb-2"
              />
              <button
                onClick={handleUpload}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Upload Image
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map(image => (
          <div
            key={image.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={image.url}
              alt={image.description}
              className="w-full h-48 object-cover cursor-pointer"
              onClick={() => handleImageClick(image)}
            />
            <div className="p-4">
              <p className="text-gray-700">{image.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Description Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-bold mb-4">Edit Description</h3>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full h-32 border rounded p-2 mb-4"
              placeholder="Enter image description..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedImage(null)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDescriptionUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
