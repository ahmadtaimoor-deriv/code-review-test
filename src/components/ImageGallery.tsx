import { useState, ChangeEvent } from 'react';

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
      url: 'https://source.unsplash.com/random/800x600?food',
      description: 'Delicious cuisine'
    }
  ]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newDescription, setNewDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      const newImage: Image = {
        id: Date.now(),
        url: URL.createObjectURL(selectedFile),
        description: newDescription || 'No description'
      };
      setImages([...images, newImage]);
      setSelectedFile(null);
      setNewDescription('');
    }
  };

  const handleDescriptionChange = (id: number, newDesc: string) => {
    setImages(images.map(img => 
      img.id === id ? { ...img, description: newDesc } : img
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Upload Section */}
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Upload New Image</h2>
        <div className="flex flex-col space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Image description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={handleUpload}
            disabled={!selectedFile}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            Upload Image
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div key={image.id} className="border rounded-lg overflow-hidden">
            <img
              src={image.url}
              alt={image.description}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              {editingId === image.id ? (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={image.description}
                    onChange={(e) => handleDescriptionChange(image.id, e.target.value)}
                    className="flex-1 border rounded px-2 py-1"
                  />
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <p className="text-gray-700">{image.description}</p>
                  <button
                    onClick={() => setEditingId(image.id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
