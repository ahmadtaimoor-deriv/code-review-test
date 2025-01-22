import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ImageGallery from './components/ImageGallery';

const App = () => {
  return (
    <Router>
      <div data-testid="app-container" className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-4">Welcome to Image Gallery</h1>
                <p className="text-xl text-gray-600 mb-8">
                  Upload, share, and explore beautiful images from around the world
                </p>
                <ImageGallery />
              </div>
            } />
            
            <Route path="/gallery" element={<ImageGallery />} />
            
            <Route path="/upload" element={
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Upload New Image</h1>
                <ImageGallery />
              </div>
            } />
            
            <Route path="/about" element={
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">About Us</h1>
                <div className="prose lg:prose-xl">
                  <p>
                    Welcome to Image Gallery, a platform for photographers and art enthusiasts
                    to share and discover amazing images from around the world.
                  </p>
                  <p>
                    Our mission is to create a vibrant community where creativity flourishes
                    and visual stories come to life.
                  </p>
                  <h2>Features</h2>
                  <ul>
                    <li>Upload and share your images</li>
                    <li>Add descriptions to tell your story</li>
                    <li>Explore a diverse collection of photographs</li>
                    <li>Connect with other photographers</li>
                  </ul>
                </div>
              </div>
            } />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
