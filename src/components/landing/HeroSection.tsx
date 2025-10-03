import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-20">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4">Discover & Book Unforgettable Events</h1>
        <p className="text-xl mb-8">Your one-stop platform for concerts, festivals, and more!</p>
        <button className="bg-white text-indigo-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300">
          Explore Events
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
