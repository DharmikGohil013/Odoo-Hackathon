import React from 'react';
import { Star, MapPin, Heart, Filter } from 'lucide-react';

const RecommendationPage = () => {
  const recommendations = [
    {
      id: 1,
      title: "MacBook Pro 2021",
      category: "Electronics",
      distance: "2.5 miles",
      rating: 4.8,
      price: "$1,200",
      image: "/api/placeholder/300/200",
      user: "John Doe"
    },
    {
      id: 2,
      title: "Designer Handbag",
      category: "Fashion",
      distance: "1.8 miles",
      rating: 4.9,
      price: "$450",
      image: "/api/placeholder/300/200",
      user: "Sarah Wilson"
    },
    {
      id: 3,
      title: "Gaming Console",
      category: "Gaming",
      distance: "3.2 miles",
      rating: 4.7,
      price: "$400",
      image: "/api/placeholder/300/200",
      user: "Mike Johnson"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                <Star className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Recommendations</h1>
                <p className="text-gray-600">Items curated just for you based on your interests</p>
              </div>
            </div>
            <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">
              <Filter className="h-5 w-5" />
              <span>Filter</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                <div className="aspect-w-16 aspect-h-10 bg-gray-200 relative">
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Image Placeholder</span>
                  </div>
                  <button className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full transition-colors">
                    <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-600">{item.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-3">{item.category}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{item.distance}</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">{item.price}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-600">by {item.user}</span>
                  </div>
                  
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-500 mb-4">AI-powered recommendations based on your preferences and swap history</p>
            <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-6 py-2 rounded-lg font-medium">
              Load More Recommendations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationPage;