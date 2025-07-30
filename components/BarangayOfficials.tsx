import Image from "next/image"
import ScrollToTop from "./ScrollToTop"

const BarangayOfficials = () => {
  const barangayCaptain = {
    name: "Hon. Marife M. Sol",
    position: "Barangay Captain",
    image: "/assets/img/officials/captain.png"
  }

  const kagawads = [
    {
      name: "Hon. Ricky S. Soverano",
      position: "Kagawad 1",
      image: "/assets/img/officials/kagawad.png"
    },
    {
      name: "Hon. Julito J. Mamitag",
      position: "Kagawad 2", 
      image: "/assets/img/officials/kagawad.png"
    },
    {
      name: "Hon. Agustin J. Malacas",
      position: "Kagawad 3",
      image: "/assets/img/officials/kagawad.png"
    },
    {
      name: "Hon. John Mark C. Manrique",
      position: "Kagawad 4",
      image: "/assets/img/officials/kagawad.png"
    },
    {
      name: "Hon. Wody J. Fronda",
      position: "Kagawad 5",
      image: "/assets/img/officials/kagawad.png"
    },
    {
      name: "Hon. Miguela M. Motol",
      position: "Kagawad 6",
      image: "/assets/img/officials/kagawad.png"
    },
    {
      name: "Hon. Jocelyn P. Supleo",
      position: "Kagawad 7",
      image: "/assets/img/officials/kagawad.png"
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <ScrollToTop />
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-[#23479A] to-[#23479A]/80 bg-clip-text text-transparent mb-6">
            Barangay Officials
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Meet our dedicated leaders serving the community with passion and commitment
          </p>
        </div>

        {/* Barangay Captain - Modern Circular Design */}
        <div className="flex justify-center mb-20">
          <div className="relative group cursor-pointer">
            {/* Main content without white background */}
            <div className="relative p-8 transition-all duration-300 transform group-hover:scale-105">
              <div className="flex flex-col items-center">
                {/* Profile image with border */}
                <div className="relative w-56 h-56 mb-6 rounded-full overflow-hidden">
                  <Image
                    src={barangayCaptain.image}
                    alt={barangayCaptain.name}
                    fill
                    className="object-cover border-4 border-[#23479A] rounded-full shadow-lg"
                    style={{ borderRadius: '50%', clipPath: 'circle(50%)' }}
                  />
                </div>
                
                {/* Captain badge */}
                <div className="bg-[#23479A] text-white px-6 py-2 rounded-full text-sm font-bold mb-3 shadow-lg">
                  {barangayCaptain.position}
                </div>
                
                {/* Name */}
                <h3 className="text-2xl font-bold text-gray-800 text-center max-w-xs">
                  {barangayCaptain.name}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Kagawads Grid Layout - Modern Circular Cards */}
        <div className="space-y-16">
          {/* First Row - Kagawads 1, 2, 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {kagawads.slice(0, 3).map((kagawad, index) => (
              <div key={kagawad.position} className="relative group cursor-pointer">
                {/* Main content without white background */}
                <div className="relative p-6 transition-all duration-300 transform group-hover:scale-105">
                  <div className="flex flex-col items-center">
                    {/* Profile image */}
                    <div className="relative w-40 h-40 mb-4 rounded-full overflow-hidden">
                      <Image
                        src={kagawad.image}
                        alt={kagawad.name}
                        fill
                        className="object-cover border-3 border-[#23479A] rounded-full shadow-lg"
                        style={{ borderRadius: '50%', clipPath: 'circle(50%)' }}
                      />
                    </div>
                    
                    {/* Position badge */}
                    <div className="bg-[#23479A] text-white px-4 py-1.5 rounded-full text-xs font-bold mb-2 shadow-md">
                      {kagawad.position}
                    </div>
                    
                    {/* Name */}
                    <h3 className="text-lg font-bold text-gray-800 text-center leading-tight">
                      {kagawad.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Second Row - Kagawads 4, 5, 6 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {kagawads.slice(3, 6).map((kagawad, index) => (
              <div key={kagawad.position} className="relative group cursor-pointer">
                {/* Main content without white background */}
                <div className="relative p-6 transition-all duration-300 transform group-hover:scale-105">
                  <div className="flex flex-col items-center">
                    {/* Profile image */}
                    <div className="relative w-40 h-40 mb-4 rounded-full overflow-hidden">
                      <Image
                        src={kagawad.image}
                        alt={kagawad.name}
                        fill
                        className="object-cover border-3 border-[#23479A] rounded-full shadow-lg"
                        style={{ borderRadius: '50%', clipPath: 'circle(50%)' }}
                      />
                    </div>
                    
                    {/* Position badge */}
                    <div className="bg-[#23479A] text-white px-4 py-1.5 rounded-full text-xs font-bold mb-2 shadow-md">
                      {kagawad.position}
                    </div>
                    
                    {/* Name */}
                    <h3 className="text-lg font-bold text-gray-800 text-center leading-tight">
                      {kagawad.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Third Row - Kagawad 7 (Centered) */}
          <div className="flex justify-center">
            <div className="relative group cursor-pointer">
              {/* Main content without white background */}
              <div className="relative p-6 transition-all duration-300 transform group-hover:scale-105">
                <div className="flex flex-col items-center">
                  {/* Profile image */}
                  <div className="relative w-40 h-40 mb-4 rounded-full overflow-hidden">
                    <Image
                      src={kagawads[6].image}
                      alt={kagawads[6].name}
                      fill
                      className="object-cover border-3 border-[#23479A] rounded-full shadow-lg"
                      style={{ borderRadius: '50%', clipPath: 'circle(50%)' }}
                    />
                  </div>
                  
                  {/* Position badge */}
                  <div className="bg-[#23479A] text-white px-4 py-1.5 rounded-full text-xs font-bold mb-2 shadow-md">
                    {kagawads[6].position}
                  </div>
                  
                  {/* Name */}
                  <h3 className="text-lg font-bold text-gray-800 text-center leading-tight">
                    {kagawads[6].name}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Single Column */}
        <div className="md:hidden space-y-8 mt-12">
          {kagawads.map((kagawad, index) => (
            <div key={kagawad.position} className="relative group cursor-pointer">
              {/* Main content without white background */}
              <div className="relative p-6 transition-all duration-300 transform group-hover:scale-105 max-w-xs mx-auto">
                <div className="flex flex-col items-center">
                  {/* Profile image */}
                  <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden">
                    <Image
                      src={kagawad.image}
                      alt={kagawad.name}
                      fill
                      className="object-cover border-2 border-[#23479A] rounded-full shadow-lg"
                      style={{ borderRadius: '50%', clipPath: 'circle(50%)' }}
                    />
                  </div>
                  
                  {/* Position badge */}
                  <div className="bg-[#23479A] text-white px-3 py-1 rounded-full text-xs font-bold mb-2 shadow-md">
                    {kagawad.position}
                  </div>
                  
                  {/* Name */}
                  <h3 className="text-base font-bold text-gray-800 text-center leading-tight">
                    {kagawad.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BarangayOfficials