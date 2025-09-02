'use client'
import React, { useState } from 'react';
import { ChevronRight, Mail, Phone, Calendar } from 'lucide-react';

type Official = {
  id: string;
  name: string;
  position: string;
  image: string;
  term: string;
  bio: string;
  email: string;
  phone: string;
};

const BarangayOfficials = () => {
  const [selectedOfficial, setSelectedOfficial] = useState<Official | null>(null);

  const barangayCaptain: Official = {
    id: 'captain',
    name: "Hon. Marife M. Sol",
    position: "Barangay Captain",
    image: "/assets/img/officials/BrgyCaptain.png",
    term: "2024-2028",
    bio: "Leading our community with dedication and vision for progress and unity.",
    email: "almavillagloria@gmail.com",
    phone: "+63 9355 0384 27"
  }

  const kagawads: Official[] = [
    {
      id: 'kagawad1',
      name: "Hon. Ricka S. Soverano",
      position: "Kagawad 1",
      image: "/assets/img/officials/kagawad1.png",
      term: "2024-2028",
      bio: "Passionate about community health and wellness programs.",
      email: "almavillagloria@gmail.com",
      phone: "+63 9355 0384 27"
    },
    {
      id: 'kagawad2',
      name: "Hon. Julito J. Mamitag",
      position: "Kagawad 2",
      image: "/assets/img/officials/kagawad2.png",
      term: "2024-2028",
      bio: "Dedicated to empowering youth through education programs.",
      email: "almavillagloria@gmail.com",
      phone: "+63 9355 0384 27"
    },
    {
      id: 'kagawad3',
      name: "Hon. Agustin J. Malacas",
      position: "Kagawad 3",
      image: "/assets/img/officials/kagawad3.png",
      term: "2024-2028",
      bio: "Focused on improving community infrastructure.",
      email: "almavillagloria@gmail.com",
      phone: "+63 9355 0384 27"
    },
    {
      id: 'kagawad4',
      name: "Hon. John Mark C. Manrique",
      position: "Kagawad 4",
      image: "/assets/img/officials/kagawad2.png",
      term: "2024-2028",
      bio: "Committed to maintaining community peace and safety.",
      email: "almavillagloria@gmail.com",
      phone: "+63 9355 0384 27"
    },
    {
      id: 'kagawad5',
      name: "Hon. Wody J. Fronda",
      position: "Kagawad 5",
      image: "/assets/img/officials/kagawad1.png",
      term: "2024-2028",
      bio: "Advocating for sustainable agriculture and environment.",
      email: "almavillagloria@gmail.com",
      phone: "+63 9355 0384 27"
    },
    {
      id: 'kagawad6',
      name: "Hon. Miguela M. Motol",
      position: "Kagawad 6",
      image: "/assets/img/officials/kagawad2.png",
      term: "2024-2028",
      bio: "Empowering women and strengthening family bonds.",
      email: "almavillagloria@gmail.com",
      phone: "+63 9355 0384 27"
    },
    {
      id: 'kagawad7',
      name: "Hon. Jocelyn P. Supleo",
      position: "Kagawad 7",
      image: "/assets/img/officials/kagawad3.png",
      term: "2024-2028",
      bio: "Serving senior citizens and PWD with compassion.",
      email: "almavillagloria@gmail.com",
      phone: "+63 9355 0384 27"
    }
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Barangay Officials
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Our dedicated leaders serving the community with integrity and commitment
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Officials Grid */}
          <div className="xl:col-span-2">
            {/* Barangay Captain - Featured */}
            <div className="mb-8 sm:mb-12">
              <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-4 sm:mb-6 flex items-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#23479A] rounded-lg mr-2 sm:mr-3 flex items-center justify-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-sm"></div>
                </div>
                Leadership
              </h3>
              <div 
                className="group cursor-pointer"
                onClick={() => setSelectedOfficial(selectedOfficial?.id === barangayCaptain.id ? null : barangayCaptain)}
              >
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 overflow-hidden">
                  <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                        <img
                          src={barangayCaptain.image}
                          alt={barangayCaptain.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                        <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-medium rounded-full mb-1 sm:mb-0 inline-block">
                          {barangayCaptain.position}
                        </span>
                        <span className="text-slate-500 text-sm">{barangayCaptain.term}</span>
                      </div>
                      <h4 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1 sm:mb-1">
                        {barangayCaptain.name}
                      </h4>
                      <p className="text-slate-600 text-sm line-clamp-2 sm:line-clamp-2">
                        {barangayCaptain.bio}
                      </p>
                    </div>
                    <div className="hidden sm:block">
                      <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${selectedOfficial?.id === barangayCaptain.id ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kagawads */}
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-4 sm:mb-6 flex items-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#23479A] rounded-lg mr-2 sm:mr-3 flex items-center justify-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-sm"></div>
                </div>
                Council Members
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {kagawads.map((kagawad, index) => (
                  <div 
                    key={kagawad.id}
                    className="group cursor-pointer"
                    onClick={() => setSelectedOfficial(selectedOfficial?.id === kagawad.id ? null : kagawad)}
                  >
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200 overflow-hidden">
                      <div className="p-3 sm:p-4 flex items-center space-x-3 sm:space-x-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex-shrink-0">
                          <img
                            src={kagawad.image}
                            alt={kagawad.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-md">
                              {kagawad.position}
                            </span>
                          </div>
                          <h4 className="font-medium text-slate-900 truncate text-sm sm:text-base">
                            {kagawad.name}
                          </h4>
                          <p className="text-slate-500 text-xs sm:text-sm truncate">
                            {kagawad.bio}
                          </p>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${selectedOfficial?.id === kagawad.id ? 'rotate-90' : ''}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details Panel */}
          <div className="xl:col-span-1 mt-6 xl:mt-0">
            <div className="sticky top-4 sm:top-8">
              {selectedOfficial ? (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className="relative">
                    <div className="h-24 sm:h-32 bg-[#23479A]"></div>
                    <div className="absolute -bottom-8 sm:-bottom-12 left-4 sm:left-6">
                      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-slate-100 to-slate-200">
                        <img
                          src={selectedOfficial.image}
                          alt={selectedOfficial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-10 sm:pt-16 p-4 sm:p-6">
                    <div className="mb-3 sm:mb-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-medium rounded-full">
                        {selectedOfficial.position}
                      </span>
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                      {selectedOfficial.name}
                    </h3>
                    
                    <p className="text-slate-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                      {selectedOfficial.bio}
                    </p>
                    
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Mail className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email</p>
                          <p className="text-xs sm:text-sm text-slate-900 truncate">{selectedOfficial.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Phone className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Phone</p>
                          <p className="text-xs sm:text-sm text-slate-900">{selectedOfficial.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Term</p>
                          <p className="text-xs sm:text-sm text-slate-900">{selectedOfficial.term}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-xl sm:rounded-2xl mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-slate-300 rounded-full"></div>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
                    Select an Official
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm">
                    Click on any official to view their detailed information and contact details.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Term Info */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="inline-flex items-center px-4 sm:px-6 py-3 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 mr-2 sm:mr-3" />
            <span className="text-slate-600 text-sm sm:text-base">Current Term: </span>
            <span className="font-semibold text-slate-900 ml-1 text-sm sm:text-base">2024-2028</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BarangayOfficials;