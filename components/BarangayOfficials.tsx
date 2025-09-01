'use client'
import React, { useState } from 'react';
import { Users, ChevronDown, ChevronUp } from 'lucide-react';
import { useScrollAnimation } from "@/lib/useScrollAnimation";

const BarangayOfficials = () => {
  const [expandedCaptain, setExpandedCaptain] = useState(false);
  const [expandedKagawad, setExpandedKagawad] = useState<number | null>(null);

  const barangayCaptain = {
    name: "Hon. Marife M. Sol",
    position: "Barangay Captain",
    image: "/assets/img/officials/BrgyCaptain.png",
    term: "2024-2028",
    bio: "Leading our community with dedication and vision for progress and unity.",
    email: "almavillagloria@gmail.com",
    phone: "+63 9355 0384 27"
  }

  const kagawads = [
    {
      name: "Hon. Ricka S. Soverano",
      position: "Kagawad 1",
      image: "/assets/img/officials/kagawad1.png",
      term: "2024-2028",
      bio: "Passionate about community health and wellness programs.",
      email: "almavillagloria@gmail.com",
      phone: "+63 9355 0384 27"
    },
    {
      name: "Hon. Julito J. Mamitag",
      position: "Kagawad 2",
      image: "/assets/img/officials/kagawad2.png",
      term: "2024-2028",
      bio: "Dedicated to empowering youth through education programs.",
      email: "almavillagloria@gmail.com",
      phone: "+63 9355 0384 27"
    },
    {
      name: "Hon. Agustin J. Malacas",
      position: "Kagawad 3",
      image: "/assets/img/officials/kagawad3.png",
      term: "2024-2028",
      bio: "Focused on improving community infrastructure.",
      email: "almavillagloria@gmail.com",
      phone: "+63 9355 0384 27"
    },
    {
      name: "Hon. John Mark C. Manrique",
      position: "Kagawad 4",
      image: "/assets/img/officials/kagawad2.png",
      term: "2024-2028",
      bio: "Committed to maintaining community peace and safety.",
      email: "almavillagloria@gmail.com",
      phone: "+63 9355 0384 27"
    },
    {
      name: "Hon. Wody J. Fronda",
      position: "Kagawad 5",
      image: "/assets/img/officials/kagawad1.png",
      term: "2024-2028",
      bio: "Advocating for sustainable agriculture and environment.",
      email: "almavillagloria@gmail.com",
      phone: "+63 9355 0384 27"
    },
    {
      name: "Hon. Miguela M. Motol",
      position: "Kagawad 6",
      image: "/assets/img/officials/kagawad2.png",
      term: "2024-2028",
      bio: "Empowering women and strengthening family bonds.",
      email: "almavillagloria@gmail.com",
      phone: "+63 9355 0384 27"
    },
    {
      name: "Hon. Jocelyn P. Supleo",
      position: "Kagawad 7",
      image: "/assets/img/officials/kagawad3.png",
      term: "2024-2028",
      bio: "Serving senior citizens and PWD with compassion.",
      email: "almavillagloria@gmail.com",
      phone: "+63 9355 0384 27"
    }
  ]

  // Split kagawads into rows of 3
  const getKagawadRows = () => {
    const rows = [];
    for (let i = 0; i < kagawads.length; i += 3) {
      rows.push(kagawads.slice(i, i + 3));
    }
    return rows;
  };

  const toggleCaptain = () => {
    setExpandedCaptain(!expandedCaptain);
  };

  const toggleKagawad = (index: number) => {
    setExpandedKagawad(expandedKagawad === index ? null : index);
  };

  const { elementRef: sectionRef, isVisible: sectionVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.05 });
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  const { elementRef: captainRef, isVisible: captainVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section ref={sectionRef} className="pt-34 pb-24 sm:pt-32 sm:pb-32 bg-[#23479A] relative">
      {/* Background Pattern */}
      <div
        className="absolute inset-x-0 bottom-0 h-[420px]"
        style={{
          backgroundImage: 'url(/assets/img/herosection.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'bottom',
          backgroundRepeat: 'repeat-x',
          opacity: '0.15'
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div 
          ref={headerRef}
          className={`text-center mb-16 sm:mb-20 transition-all duration-800 ease-out ${
            headerVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-6 opacity-0'
          }`}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Barangay Officials
          </h2>
          <p className="text-blue-100 text-lg sm:text-xl pb-20 max-w-2xl mx-auto">
            Our dedicated leaders serving the community
          </p>
        </div>

        {/* Barangay Captain - Top Center */}
        <div 
          ref={captainRef}
          className={`flex justify-center mb-20 sm:mb-24 transition-all duration-1000 ease-out delay-300 ${
            captainVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-8 opacity-0'
          }`}
        >
          <div 
            className={`bg-white/10 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 cursor-pointer transition-all duration-500 ease-in-out relative ${
              expandedCaptain ? 'max-w-4xl' : 'max-w-2xl'
            } hover:shadow-2xl shadow-white/10`}
            onClick={toggleCaptain}
          >
            {/* Floating Circular Profile Image */}
            <div className="absolute -top-24 sm:-top-28 left-1/2 transform -translate-x-1/2 z-10">
              <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-white bg-white shadow-xl group">
                <img
                  src={barangayCaptain.image}
                  alt={barangayCaptain.name}
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
              </div>
            </div>

            {/* Blue Background Section */}
            <div className="pt-36 sm:pt-40 pb-8 px-6 sm:px-8">
              <div className="text-center">
                <div className="bg-white text-[#23479A] px-4 sm:px-6 py-2 rounded-full text-sm sm:text-lg font-bold mb-6 shadow-lg inline-block">
                  {barangayCaptain.position}
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  {barangayCaptain.name}
                </h3>
                
                <p className="text-blue-100 text-base sm:text-lg mb-4">
                  Term: {barangayCaptain.term}
                </p>

                {/* Expand/Collapse Indicator */}
                <div className="flex items-center justify-center gap-2 text-white text-sm font-medium">
                  {expandedCaptain ? 'Show Less' : 'Click to Expand'}
                  {expandedCaptain ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                {/* Expanded Content */}
                {expandedCaptain && (
                  <div className="mt-6 pt-6 border-t border-white/20 space-y-4 animate-fadeIn">
                    <p className="text-blue-100 text-base sm:text-lg italic">
                      {barangayCaptain.bio}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                        <p className="font-semibold text-white">Email</p>
                        <p className="text-blue-100">{barangayCaptain.email}</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                        <p className="font-semibold text-white">Phone</p>
                        <p className="text-blue-100">{barangayCaptain.phone}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Kagawads in Rows of 3 */}
        <div className="space-y-8 sm:space-y-12 pt-12">
          {getKagawadRows().map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 justify-items-center">
              {row.map((kagawad, index) => {
                const globalIndex = rowIndex * 3 + index;
                return (
                  <div 
                    key={kagawad.position} 
                    className={`bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out border border-white/20 cursor-pointer relative w-full max-w-sm mt-12 sm:mt-16 shadow-white/10 ${
                      expandedKagawad === globalIndex ? 'max-w-sm' : ''
                    } transition-all duration-700 ease-out ${
                      sectionVisible 
                        ? 'translate-y-0 opacity-100' 
                        : 'translate-y-8 opacity-0'
                    }`}
                    style={{ transitionDelay: `${globalIndex * 150}ms` }}
                    onClick={() => toggleKagawad(globalIndex)}
                  >
                    {/* Floating Circular Profile Image */}
                    <div className="absolute -top-20 sm:-top-22 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden border-3 border-white bg-white shadow-lg group">
                        <img
                          src={kagawad.image}
                          alt={kagawad.name}
                          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                        />
                      </div>
                    </div>
                    
                    {/* Blue Background Section */}
                    <div className="pt-28 sm:pt-32 pb-6 px-4 sm:px-6">
                      <div className="text-center">
                        <div className="bg-white text-[#23479A] px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold mb-4 inline-block">
                          {kagawad.position}
                        </div>
                        
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                          {kagawad.name}
                        </h3>
                        
                        <p className="text-blue-100 text-xs sm:text-sm mb-3">
                          Term: {kagawad.term}
                        </p>

                        {/* Expand/Collapse Indicator */}
                        <div className="flex items-center justify-center gap-1 text-white text-xs font-medium">
                          {expandedKagawad === globalIndex ? 'Show Less' : 'Click to Expand'}
                          {expandedKagawad === globalIndex ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </div>

                        {/* Expanded Content */}
                        {expandedKagawad === globalIndex && (
                          <div className="mt-4 pt-4 border-t border-white/20 space-y-3 animate-fadeIn">
                            <p className="text-blue-100 text-xs sm:text-sm italic">
                              {kagawad.bio}
                            </p>
                            <div className="space-y-2 text-xs">
                              <div className="bg-white/10 backdrop-blur-sm p-3 rounded border border-white/20">
                                <p className="font-semibold text-white">Email</p>
                                <p className="text-blue-100">{kagawad.email}</p>
                              </div>
                              <div className="bg-white/10 backdrop-blur-sm p-3 rounded border border-white/20">
                                <p className="font-semibold text-white">Phone</p>
                                <p className="text-blue-100">{kagawad.phone}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Term Information */}
        <div 
          className={`text-center mt-20 sm:mt-24 transition-all duration-800 ease-out delay-500 ${
            sectionVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-6 opacity-0'
          }`}
        >
          <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Current Term
            </h3>
            <p className="text-gray-600">
              All officials are serving from <span className="font-semibold text-[#23479A]">2024-2028</span>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default BarangayOfficials;