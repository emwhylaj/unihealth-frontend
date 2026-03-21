import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

interface PlatformStats {
  totalHospitals: number;
  statesCovered: number;
  totalPatients: number;
}

async function getPlatformStats(): Promise<PlatformStats | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const res = await fetch(`${apiUrl}/api/v1/stats`, {
      headers: { "X-Skip-Encryption": "true" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

const hospitalCategories = [
  {
    category: "Major General Hospitals",
    color: "from-[#0d2010] to-[#0a1a0a]",
    accentColor: "#4ade80",
    hospitals: [
      {
        name: "Lagos University Teaching Hospital (LUTH)",
        location: "Idi-Araba, Lagos",
        type: "Teaching Hospital",
        beds: 760,
      },
      {
        name: "National Hospital Abuja",
        location: "Central Business District, Abuja",
        type: "Federal Hospital",
        beds: 500,
      },
      {
        name: "University College Hospital (UCH)",
        location: "Ibadan, Oyo State",
        type: "Teaching Hospital",
        beds: 800,
      },
      {
        name: "Aminu Kano Teaching Hospital",
        location: "Kano, Kano State",
        type: "Teaching Hospital",
        beds: 500,
      },
    ],
  },
  {
    category: "Private Hospitals",
    color: "from-[#1a1a0a] to-[#0a0f0a]",
    accentColor: "#fbbf24",
    hospitals: [
      {
        name: "Eko Hospital",
        location: "Ikeja, Lagos",
        type: "Private",
        beds: 150,
      },
      {
        name: "Reddington Hospital",
        location: "Victoria Island, Lagos",
        type: "Private",
        beds: 100,
      },
      {
        name: "St. Nicholas Hospital",
        location: "Lagos Island, Lagos",
        type: "Private",
        beds: 120,
      },
      {
        name: "Evercare Hospital",
        location: "Lekki, Lagos",
        type: "Private",
        beds: 170,
      },
    ],
  },
  {
    category: "Teaching Hospitals",
    color: "from-[#0a0d1a] to-[#0a0f0a]",
    accentColor: "#60a5fa",
    hospitals: [
      {
        name: "Obafemi Awolowo University Teaching Hospital",
        location: "Ile-Ife, Osun State",
        type: "Teaching Hospital",
        beds: 600,
      },
      {
        name: "University of Nigeria Teaching Hospital",
        location: "Enugu, Enugu State",
        type: "Teaching Hospital",
        beds: 550,
      },
      {
        name: "Jos University Teaching Hospital",
        location: "Jos, Plateau State",
        type: "Teaching Hospital",
        beds: 500,
      },
      {
        name: "University of Benin Teaching Hospital",
        location: "Benin City, Edo State",
        type: "Teaching Hospital",
        beds: 450,
      },
    ],
  },
];

export default async function HospitalsPage() {
  const stats = await getPlatformStats();

  const hospitalStats = [
    {
      value: stats ? stats.totalHospitals.toLocaleString() : "5,000+",
      label: "Partner Hospitals",
    },
    {
      value: stats ? stats.statesCovered.toString() : "36",
      label: "States Covered",
    },
    { value: "24/7", label: "Record Access" },
  ];

  return (
    <main className="min-h-screen bg-[#0a0f0a] relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #166534 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-8"
          style={{
            background: "radial-gradient(circle, #15803d 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <Navbar />

      <div className="relative z-10 pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Find a <span className="text-[#4ade80]">Hospital</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Browse our network of trusted healthcare facilities across Nigeria.
              Present your UniHealth access code at any of these hospitals.
            </p>
          </div>

          {/* Stats banner */}
          <div className="grid grid-cols-3 gap-4 mb-14 max-w-2xl mx-auto">
            {hospitalStats.map((stat) => (
              <div
                key={stat.label}
                className="bg-[#1a2a1a] border border-[#2d4a2d] rounded-2xl p-4 text-center"
              >
                <p className="text-2xl font-bold text-[#4ade80]">{stat.value}</p>
                <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Hospital Categories */}
          <div className="space-y-12">
            {hospitalCategories.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-1 h-6 rounded-full"
                    style={{ backgroundColor: cat.accentColor }}
                  />
                  <h2 className="text-xl font-bold text-white">
                    {cat.category}
                  </h2>
                  <div className="flex-1 h-px bg-[#1a2a1a]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cat.hospitals.map((hospital) => (
                    <div
                      key={hospital.name}
                      className={`bg-gradient-to-br ${cat.color} border border-[#2d4a2d] rounded-2xl p-5 hover:border-opacity-60 transition-all duration-200 group`}
                      style={{
                        borderColor: `${cat.accentColor}22`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className="mt-1 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: `${cat.accentColor}15`,
                              border: `1px solid ${cat.accentColor}30`,
                            }}
                          >
                            <svg
                              className="w-5 h-5"
                              style={{ color: cat.accentColor }}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-sm leading-tight">
                              {hospital.name}
                            </h3>
                            <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              {hospital.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              backgroundColor: `${cat.accentColor}15`,
                              color: cat.accentColor,
                              border: `1px solid ${cat.accentColor}30`,
                            }}
                          >
                            {hospital.type}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {hospital.beds} beds
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <div className="bg-[#1a2a1a] border border-[#2d4a2d] rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-white font-bold text-xl mb-2">
                Is your hospital not listed?
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                We&apos;re constantly expanding our network. Contact us to get
                your hospital onboarded.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#4ade80] hover:bg-[#22c55e] text-[#0a0f0a] font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200"
              >
                Contact Us
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
