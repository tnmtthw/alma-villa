'use client'
import React, { useState } from 'react';
import { Phone, Mail, Calendar, Users, Award, ChevronDown, ChevronUp } from 'lucide-react';

const BarangayOfficials = () => {
  const [expandedKagawad, setExpandedKagawad] = useState<number | null>(null);

  const barangayCaptain = {
    name: "Hon. Marife M. Sol",
    position: "Barangay Captain",
    image: "/assets/img/officials/BrgyCaptain.png",
    email: "captain@barangay.gov.ph",
    phone: "+63 912 345 6789",
    officeHours: "Monday - Friday, 8:00 AM - 5:00 PM",
    bio: "Leading our community with dedication and vision for progress and unity.",
    achievements: ["Community Development Award 2023", "Excellence in Public Service 2022"]
  }

  const kagawads = [
    {
      name: "Hon. Ricka S. Soverano",
      position: "Kagawad 1",
      committee: "Health & Sanitation",
      image: "/assets/img/officials/kagawad1.png",
      email: "ricka.soverano@barangay.gov.ph",
      phone: "+63 912 345 6790",
      bio: "Passionate about community health and wellness programs.",
      achievements: ["Clean & Green Champion 2023"],
      projects: ["Community Health Center Upgrade", "Waste Segregation Program"],
      officeHours: "Tuesday & Thursday, 2:00 PM - 6:00 PM"
    },
    {
      name: "Hon. Julito J. Mamitag",
      position: "Kagawad 2",
      committee: "Education & Youth",
      image: "/assets/img/officials/kagawad2.png",
      email: "julito.mamitag@barangay.gov.ph",
      phone: "+63 912 345 6791",
      bio: "Dedicated to empowering youth through education programs.",
      achievements: ["Youth Leadership Award 2023"],
      projects: ["Scholarship Program", "Youth Skills Training Center"],
      officeHours: "Monday & Wednesday, 1:00 PM - 5:00 PM"
    },
    {
      name: "Hon. Agustin J. Malacas",
      position: "Kagawad 3",
      committee: "Infrastructure & Public Works",
      image: "/assets/img/officials/kagawad3.png",
      email: "agustin.malacas@barangay.gov.ph",
      phone: "+63 912 345 6792",
      bio: "Focused on improving community infrastructure.",
      achievements: ["Infrastructure Excellence Award 2022"],
      projects: ["Road Improvement Program", "Drainage System Upgrade"],
      officeHours: "Wednesday & Friday, 9:00 AM - 1:00 PM"
    },
    {
      name: "Hon. John Mark C. Manrique",
      position: "Kagawad 4",
      committee: "Peace & Order",
      image: "/assets/img/officials/kagawad2.png",
      email: "johnmark.manrique@barangay.gov.ph",
      phone: "+63 912 345 6793",
      bio: "Committed to maintaining community peace and safety.",
      achievements: ["Community Safety Award 2023"],
      projects: ["CCTV Installation Program", "Barangay Patrol Enhancement"],
      officeHours: "Monday & Friday, 10:00 AM - 2:00 PM"
    },
    {
      name: "Hon. Wody J. Fronda",
      position: "Kagawad 5",
      committee: "Agriculture & Environment",
      image: "/assets/img/officials/kagawad1.png",
      email: "wody.fronda@barangay.gov.ph",
      phone: "+63 912 345 6794",
      bio: "Advocating for sustainable agriculture and environment.",
      achievements: ["Environmental Stewardship Award 2023"],
      projects: ["Urban Farming Initiative", "Tree Planting Program"],
      officeHours: "Tuesday & Thursday, 8:00 AM - 12:00 PM"
    },
    {
      name: "Hon. Miguela M. Motol",
      position: "Kagawad 6",
      committee: "Women & Family Affairs",
      image: "/assets/img/officials/kagawad2.png",
      email: "miguela.motol@barangay.gov.ph",
      phone: "+63 912 345 6795",
      bio: "Empowering women and strengthening family bonds.",
      achievements: ["Women's Leadership Award 2022"],
      projects: ["Women's Livelihood Program", "Family Counseling Services"],
      officeHours: "Monday & Wednesday, 3:00 PM - 7:00 PM"
    },
    {
      name: "Hon. Jocelyn P. Supleo",
      position: "Kagawad 7",
      committee: "Senior Citizens & PWD",
      image: "/assets/img/officials/kagawad3.png",
      email: "jocelyn.supleo@barangay.gov.ph",
      phone: "+63 912 345 6796",
      bio: "Serving senior citizens and PWD with compassion.",
      achievements: ["Compassionate Service Award 2023"],
      projects: ["Senior Citizens Center", "PWD Assistance Program"],
      officeHours: "Tuesday & Friday, 1:00 PM - 5:00 PM"
    }
  ]

  const toggleExpand = (index: number) => {
    setExpandedKagawad(expandedKagawad === index ? null : index);
  };

  // Split kagawads into rows of 3
  const getKagawadRows = (): typeof kagawads[] => {
    const rows: typeof kagawads[] = [];
    for (let i = 0; i < kagawads.length; i += 3) {
      rows.push(kagawads.slice(i, i + 3));
    }
    return rows;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-[#23479A] to-[#23479A]/80 bg-clip-text text-transparent mb-6">
            Barangay Officials
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Meet our dedicated leaders serving the community with passion and commitment
          </p>
        </div>

        {/* Barangay Captain - Top Center */}
        <div className="flex justify-center mb-16">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-48 h-48 mb-6 rounded-full overflow-hidden ring-4 ring-[#23479A] ring-offset-4">
                <img
                  src={barangayCaptain.image}
                  alt={barangayCaptain.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="bg-[#23479A] text-white px-6 py-3 rounded-full text-sm font-bold mb-4 shadow-lg">
                {barangayCaptain.position}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {barangayCaptain.name}
              </h3>
              
              <p className="text-gray-600 mb-6 italic text-lg">
                {barangayCaptain.bio}
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6 w-full">
                <div className="flex items-center justify-center gap-3 text-gray-600">
                  <Mail size={18} />
                  <span>{barangayCaptain.email}</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-gray-600">
                  <Phone size={18} />
                  <span>{barangayCaptain.phone}</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-gray-600">
                  <Calendar size={18} />
                  <span>{barangayCaptain.officeHours}</span>
                </div>
              </div>

              {/* Achievements */}
              <div className="w-full">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center justify-center gap-2">
                  <Award size={18} />
                  Recent Achievements
                </h4>
                <div className="space-y-2">
                  {barangayCaptain.achievements.map((achievement: string, idx: number) => (
                    <div key={idx} className="bg-yellow-50 text-yellow-800 px-4 py-2 rounded-full text-sm">
                      {achievement}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kagawads in Rows of 3 */}
        <div className="space-y-12">
          {getKagawadRows().map((row, rowIndex: number) => (
            <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {row.map((kagawad, index: number) => {
                const globalIndex = rowIndex * 3 + index;
                return (
                  <div key={kagawad.position} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden w-full max-w-sm">
                    {/* Card Header */}
                    <div className="p-6 pb-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden ring-3 ring-[#23479A] ring-offset-2">
                          <img
                            src={kagawad.image}
                            alt={kagawad.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="bg-[#23479A] text-white px-4 py-2 rounded-full text-sm font-bold mb-3 shadow-md">
                          {kagawad.position}
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          {kagawad.name}
                        </h3>
                        
                        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium mb-3 flex items-center gap-1">
                          <Users size={12} />
                          {kagawad.committee}
                        </div>

                        <p className="text-gray-600 text-sm leading-relaxed">
                          {kagawad.bio}
                        </p>
                      </div>
                    </div>

                    {/* Expandable Section */}
                    <div className="px-6 pb-2">
                      <button
                        onClick={() => toggleExpand(globalIndex)}
                        className="w-full flex items-center justify-center gap-2 py-2 text-[#23479A] hover:bg-blue-50 rounded-lg transition-colors duration-200 text-sm font-medium"
                      >
                        {expandedKagawad === globalIndex ? 'Show Less' : 'More Info'}
                        {expandedKagawad === globalIndex ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>

                    {/* Expanded Content */}
                    {expandedKagawad === globalIndex && (
                      <div className="px-6 pb-6 space-y-4 border-t border-gray-100 pt-4">
                        {/* Contact Info */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-800 text-sm">Contact Information</h4>
                          <div className="space-y-1 text-xs text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail size={12} />
                              <span>{kagawad.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone size={12} />
                              <span>{kagawad.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar size={12} />
                              <span>{kagawad.officeHours}</span>
                            </div>
                          </div>
                        </div>

                        {/* Current Projects */}
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm mb-2">Current Projects</h4>
                          <div className="space-y-1">
                            {kagawad.projects.map((project: string, idx: number) => (
                              <div key={idx} className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">
                                {project}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Achievements */}
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-1">
                            <Award size={12} />
                            Achievements
                          </h4>
                          <div className="space-y-1">
                            {kagawad.achievements.map((achievement: string, idx: number) => (
                              <div key={idx} className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs">
                                {achievement}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Committee Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Committee Structure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from(new Set(kagawads.map(k => k.committee))).map((committee, index: number) => {
              const kagawad = kagawads.find(k => k.committee === committee);
              if (!kagawad) return null;
              
              return (
                <div key={committee} className="text-center p-4 bg-gradient-to-b from-blue-50 to-blue-100 rounded-xl">
                  <div className="w-12 h-12 bg-[#23479A] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="text-white" size={20} />
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">{committee}</h4>
                  <p className="text-xs text-gray-600">{kagawad.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BarangayOfficials;