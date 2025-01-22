import Navbar from './components/Navbar';
import ImageGallery from './components/ImageGallery';
import Footer from './components/Footer';
import "./App.css";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8">Welcome to Image Gallery</h1>
          <p className="text-gray-600 text-center mb-12">
            Upload, share, and explore beautiful images from around the world
          </p>
          <ImageGallery />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
