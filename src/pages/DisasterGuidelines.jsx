import { useState } from 'react';
import { Header } from '../components/Header';
import { BookOpen, ChevronDown, ChevronUp, Waves, Mountain, CloudLightning, Wind, Flame, Sun, HeartPulse } from 'lucide-react';

const disasters = [
  {
    id: 'storm-surge',
    title: 'Storm Surge & Tsunami',
    icon: Waves,
    gradient: 'from-blue-500 to-cyan-500',
    before: [
      "Know your zone: Is your home, work, or school in a designated evacuation zone?",
      'Plan multiple evacuation routes inland and to higher ground.',
      "Learn the natural warning signs: for a tsunami, a strong, long earthquake, a sudden rise or fall in the ocean, a loud 'roaring' sound.",
      'Heed official warnings immediately. Do not wait.',
      'Prepare your Go-Bag and have it ready.',
    ],
    during: [
      'IMMEDIATELY move inland and to high ground. Do not stay to watch.',
      'Go as far inland and as high up as possible. Even a few stories in a sturdy concrete building can make a difference.',
      'If you are in a boat and time allows, move out to deep water (tsunami waves are less destructive in deep ocean).',
      'Do not return to the evacuation zone until authorities declare it safe.',
    ],
    after: [
      'Stay away from the coast. Dangerous waves can continue for hours.',
      'Stay away from damaged buildings, bridges, and infrastructure.',
      'Be cautious of floodwaters, which may be contaminated or hide debris.',
      'Listen to official sources for information about safe return and water safety.',
    ],
  },
  {
    id: 'landslide',
    title: 'Landslide',
    icon: Mountain,
    gradient: 'from-amber-500 to-orange-500',
    before: [
      'Learn if your area is prone to landslides.',
      'Watch for signs like new cracks in foundations, soil moving away from foundations, tilting trees or fences.',
      'Consult a professional for land-use guidance (e.g., building retaining walls).',
      'Plan an evacuation route to a safer area, not in the path of potential flow.',
    ],
    during: [
      'If you are in a building, get to the highest level.',
      'If you are outside and near the path of a landslide, run to the nearest high ground or shelter. Do not try to outrun it.',
      'If escape is not possible, curl into a tight ball and protect your head.',
    ],
    after: [
      'Stay away from the slide area. There may be a risk of additional slides.',
      'Check for injured or trapped people near the slide, but do not enter the direct area. Call for professional help.',
      'Be aware of potential flooding, as landslides can block waterways.',
      'Report broken utility lines to the authorities.',
    ],
  },
  {
    id: 'thunderstorm',
    title: 'Thunderstorm',
    icon: CloudLightning,
    gradient: 'from-gray-500 to-slate-600',
    before: [
      'Secure or bring inside outdoor objects that could be blown away.',
      'Unplug sensitive electronic appliances to protect from power surges.',
      'Listen to weather forecasts for Severe Thunderstorm Warnings.',
    ],
    during: [
      'When Thunder Roars, Go Indoors! There is no safe place outside.',
      'Avoid corded phones, plumbing, and electrical appliances as lightning can travel through wiring and pipes.',
      'Stay away from windows and doors.',
      'If you are in a vehicle, it is a safe alternative. Avoid touching the metal frame.',
      'If you are caught outside with no shelter, avoid isolated trees, hilltops, and open fields. Crouch low in a ravine or valley.',
    ],
    after: [
      'Stay indoors for at least 30 minutes after the last clap of thunder.',
      'Watch for downed power lines and report them immediately.',
      'Check for property damage.',
    ],
  },
  {
    id: 'typhoon',
    title: 'Typhoon / Hurricane',
    icon: Wind,
    gradient: 'from-blue-600 to-indigo-700',
    before: [
      "Know your home's vulnerability to wind and flooding.",
      'Install storm shutters or pre-cut plywood for windows.',
      'Secure or bring indoors all outdoor furniture, decorations, trash cans, etc.',
      'Trim trees and shrubs to make them more wind-resistant.',
      "Fill your vehicle's gas tank and withdraw some cash.",
    ],
    during: [
      'Stay indoors, away from windows and skylights.',
      'Take refuge in a small interior room, closet, or hallway on the lowest level that is not prone to flooding.',
      'Lie on the floor under a sturdy table or other object.',
      "Do not go outside during the 'eye' of the storm; the worst winds will resume shortly from the opposite direction.",
    ],
    after: [
      'Listen to official reports to ensure the storm has passed.',
      'Watch for fallen objects, downed power lines, and damaged structures.',
      'Do not walk or drive through floodwaters.',
      'Use flashlights, not candles, due to the risk of gas leaks.',
      'Check on your neighbors, especially the elderly or those with disabilities.',
    ],
  },
  {
    id: 'flood',
    title: 'Flood',
    icon: Waves,
    gradient: 'from-cyan-500 to-teal-500',
    before: [
      'Know if you are in a floodplain.',
      'Consider purchasing flood insurance.',
      'Elevate critical utilities (furnace, water heater, electrical panel).',
      'Have a plan to move to higher floors if needed.',
    ],
    during: [
      "Turn Around, Don't Drown! Do not walk, swim, or drive through floodwaters. Six inches of moving water can knock you down; one foot can sweep a vehicle away.",
      'Evacuate if told to do so.',
      'If trapped in a building, go to its highest level. Do not enter a closed attic.',
      'If trapped in a vehicle, stay inside. If water is rising inside the vehicle, seek refuge on the roof.',
    ],
    after: [
      'Return home only when authorities say it is safe.',
      'Avoid standing water, which may be electrically charged or contaminated.',
      'Wear heavy gloves and boots during cleanup.',
      'Photograph damage for insurance claims.',
      'Be aware that floodwater can weaken roads and structures.',
    ],
  },
  {
    id: 'earthquake',
    title: 'Earthquake',
    icon: Mountain,
    gradient: 'from-stone-500 to-gray-600',
    before: [
      "'Drop, Cover, and Hold On' is the single most important preparedness action.",
      'Secure heavy furniture, appliances, and water heaters to walls.',
      'Know how to turn off your gas (if you smell a leak) and water.',
      'Store heavy and breakable objects on low shelves.',
    ],
    during: [
      'DROP onto your hands and knees.',
      'COVER your head and neck under a sturdy table or desk. If no shelter is nearby, get down near an interior wall and cover your head and neck with your arms.',
      'HOLD ON to your shelter until the shaking stops.',
      'If in bed, stay there and cover your head with a pillow.',
      'Do not run outside. The danger is from falling debris and glass.',
    ],
    after: [
      'Expect aftershocks. Drop, Cover, and Hold On when they occur.',
      'Check yourself and others for injuries.',
      'If you are in a damaged building, get out and move to an open space.',
      'If you smell gas, evacuate immediately and report it.',
      'Avoid using phones except for life-threatening emergencies.',
    ],
  },
  {
    id: 'fire',
    title: 'Fire (Wildfire / Structure)',
    icon: Flame,
    gradient: 'from-red-500 to-orange-500',
    before: [
      "Create a 'defensible space' by clearing flammable vegetation around your home.",
      'Have an evacuation plan for your family and pets.',
      'Keep gutters clean and remove debris from your roof.',
      'Install and test smoke alarms.',
      'Have fire extinguishers and know how to use them.',
      'Plan and practice a family escape route with two ways out of every room.',
    ],
    during: [
      'Evacuate immediately if told to do so.',
      'If trapped, call 911. Stay in a building or vehicle with windows closed. It is safer than being outside.',
      'If outside, seek shelter in a low-lying area or body of water. Cover yourself with wet clothing or a blanket.',
      'GET OUT, STAY OUT. Do not stop for belongings.',
      "Feel closed doors with the back of your hand before opening. If it's warm, use your second way out.",
      'Stay low to the floor where the air is less toxic.',
      'Call the fire department from outside.',
    ],
    after: [
      'Do not re-enter until firefighters say it is safe.',
      'Be aware of hot embers, smoldering debris, and structural damage.',
      'Wear a mask to avoid breathing ash.',
      'Watch for flare-ups.',
    ],
  },
  {
    id: 'heat',
    title: 'Extreme Heat',
    icon: Sun,
    gradient: 'from-orange-400 to-amber-500',
    before: [
      'Ensure you have a way to stay cool (air conditioning, public cooling centers).',
      'Cover windows with drapes or shades to block direct sun.',
      'Have a plan for those at high risk (infants, elderly, people with chronic illnesses).',
    ],
    during: [
      'Stay indoors in air conditioning as much as possible.',
      "Drink plenty of water, even if you don't feel thirsty. Avoid alcohol and caffeine.",
      'Wear lightweight, light-colored, loose-fitting clothing.',
      'Take cool showers or baths.',
      'Never leave children or pets in a closed vehicle.',
      'Limit strenuous outdoor activity to the coolest parts of the day (early morning/evening).',
    ],
    after: [
      'Continue to hydrate.',
      'Check on neighbors, family, and friends who may be vulnerable.',
      'Be aware of signs of heat illness (dizziness, nausea, headache, confusion) and seek medical help if necessary.',
    ],
  },
];

const pandemicGuidelines = {
  id: 'pandemic',
  title: 'Pandemic/Health Emergency',
  icon: HeartPulse,
  gradient: 'from-red-500 to-pink-500',
  prevention: [
    "Hand Hygiene: Wash hands with soap and water for at least 20 seconds, especially after being in public, before eating, and after coughing/sneezing. Use alcohol-based hand sanitizer (at least 60% alcohol) when soap is unavailable.",
    "Respiratory Etiquette: Wear a well-fitting, high-quality mask (e.g., N95, KN95, or surgical mask) in crowded indoor spaces or areas of high community transmission. Cough/sneeze into your elbow or a tissue, not your hands.",
    "Environmental Measures: Improve indoor ventilation by opening windows, using HEPA filters, or meeting outdoors when possible. Regularly disinfect high-touch surfaces (doorknobs, light switches, countertops, electronics) using EPA-approved disinfectants.",
    "Vaccination: Stay current with recommended vaccines (e.g., annual flu shot, COVID-19 boosters) as they are a critical tool to reduce severity and transmission."
  ],
  preparedness: [
    "Essential Supplies: Maintain a 2-week supply of prescription medications, over-the-counter fever/pain reducers, cough/cold medicine, electrolytes, vitamins, and first-aid items. Include a working thermometer, pulse oximeter, and extra hygiene supplies (soap, sanitizer, tissues, toilet paper, menstrual products).",
    "Food & Water: Keep a 2-week supply of non-perishable food, bottled water (1 gallon per person per day), and pet supplies. Prioritize foods that require minimal preparation.",
    "Documentation: Keep digital and physical copies of critical documents: medical records (insurance cards, vaccination history, prescriptions), emergency contacts, and physician phone numbers. Store digital copies in a secure, offline drive or cloud service.",
    "Emergency Plan: Designate a specific room/bathroom for isolation if needed. Create a household communication plan, including a single point-of-contact if family members are separated. Plan for childcare, pet care, and elder care if you become ill."
  ],
  isolation: [
    "Isolation Protocol: Immediately isolate any household member showing symptoms or testing positive. They should use a separate bedroom and bathroom if possible. Meals should be delivered to their door.",
    "Caregiver & Household Safety: If caring for a sick person, wear a mask and gloves when in their room. Open windows to improve airflow. The sick person should wear a mask if others must be near them. Avoid sharing personal items.",
    "Disinfection: Clean the sick person’s room and bathroom regularly. Handle their laundry with gloves; wash with the warmest appropriate setting. Daily disinfect all shared high-touch surfaces (refrigerator handles, remote controls, faucets).",
    "Symptom Monitoring: Use trusted symptom-checker tools (e.g., CDC, NHS apps) and track fever, oxygen levels (with a pulse oximeter), and breathing difficulty. Know the specific 'danger signs' for the illness in question (e.g., shortness of breath, persistent chest pain, confusion, bluish lips) that warrant immediate medical care."
  ],
  community: [
    "Local Resource Mapping: Identify locations and procedures for local testing sites, respiratory clinics, pharmacy delivery options, and designated hospitals before an emergency. Know your local health department's website and alert system.",
    "Communication Networks: Join or establish neighborhood communication groups (e.g., WhatsApp, text chains, Nextdoor) to share reliable information, offer mutual aid (grocery runs for high-risk neighbors), and coordinate community support.",
    "Information Hygiene: Obtain information only from official, trusted sources (e.g., WHO, CDC, local public health authorities). Be aware of misinformation and verify alarming news before sharing.",
    "Support Systems: Check on vulnerable neighbors, elderly, or those living alone. Consider organizing a community 'buddy system' for regular wellness checks and resource sharing during a severe outbreak."
  ],
  mentalHealth: [
    "Stress Management: Acknowledge the stress of prolonged emergencies. Maintain routines where possible, take breaks from news/social media, and practice mindfulness or gentle exercise.",
    "Social Connection: Combat isolation through virtual check-ins, phone calls, and safe outdoor/distanced gatherings. Prioritize connection, especially if living alone.",
    "Seek Help: Recognize signs of acute distress (extreme anxiety, depression, insomnia) and utilize telemedicine, mental health hotlines, or employee assistance programs (EAP) for professional support."
  ]
};

export default function GoBagChecklist() {
  const [expanded, setExpanded] = useState({});
  const [activeTab, setActiveTab] = useState('disaster');

  const toggle = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-slate-100" data-testid="disaster-guidelines-page">
      <Header title="DISASTER GUIDELINES" showBack icon={BookOpen} />

      <main className="px-4 py-6 max-w-2xl mx-auto space-y-3">
        {/* Tab Navigation */}
        <div className="flex bg-white rounded-xl shadow-md overflow-hidden">
          <button
            onClick={() => setActiveTab('disaster')}
            className={`flex-1 py-3 px-4 text-center font-semibold transition-colors ${
              activeTab === 'disaster' 
                ? 'bg-yellow-500 text-blue-950' 
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Disaster Guidelines
          </button>
          <button
            onClick={() => setActiveTab('pandemic')}
            className={`flex-1 py-3 px-4 text-center font-semibold transition-colors ${
              activeTab === 'pandemic' 
                ? 'bg-yellow-500 text-blue-950' 
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Pandemic Guidelines
          </button>
        </div>

        {/* Disaster Guidelines Tab */}
        {activeTab === 'disaster' && (
          <div className="space-y-3">
            {disasters.map((d) => {
              const Icon = d.icon;
              const isOpen = !!expanded[d.id];
              return (
                <div key={d.id} className="bg-white rounded-xl shadow-md overflow-hidden" data-testid={`disaster-${d.id}`}>
                  <button
                    onClick={() => toggle(d.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                    data-testid={`disaster-toggle-${d.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${d.gradient}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-slate-900 font-semibold text-left">{d.title}</h3>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 space-y-4 animate-fadeIn" data-testid={`disaster-content-${d.id}`}>
                      {/* Before */}
                      <div className="bg-blue-50 rounded-xl p-4">
                        <h4 className="text-blue-900 font-bold mb-3 flex items-center gap-2">
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">BEFORE</span>
                        </h4>
                        <ul className="space-y-2">
                          {d.before.map((item, idx) => (
                            <li key={idx} className="text-slate-700 text-sm flex gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* During */}
                      <div className="bg-red-50 rounded-xl p-4">
                        <h4 className="text-red-900 font-bold mb-3 flex items-center gap-2">
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">DURING</span>
                        </h4>
                        <ul className="space-y-2">
                          {d.during.map((item, idx) => (
                            <li key={idx} className="text-slate-700 text-sm flex gap-2">
                              <span className="text-red-500 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* After */}
                      <div className="bg-green-50 rounded-xl p-4">
                        <h4 className="text-green-900 font-bold mb-3 flex items-center gap-2">
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">AFTER</span>
                        </h4>
                        <ul className="space-y-2">
                          {d.after.map((item, idx) => (
                            <li key={idx} className="text-slate-700 text-sm flex gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pandemic Guidelines Tab */}
        {activeTab === 'pandemic' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${pandemicGuidelines.gradient}`}>
                  <HeartPulse className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-slate-900 font-semibold text-left">{pandemicGuidelines.title}</h3>
              </div>
            </div>

            <div className="px-4 pb-4 space-y-4">
              {/* Prevention */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="text-blue-900 font-bold mb-3 flex items-center gap-2">
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">PREVENTION</span>
                </h4>
                <ul className="space-y-2">
                  {pandemicGuidelines.prevention.map((item, idx) => (
                    <li key={idx} className="text-slate-700 text-sm flex gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Preparedness */}
              <div className="bg-amber-50 rounded-xl p-4">
                <h4 className="text-amber-900 font-bold mb-3 flex items-center gap-2">
                  <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">PREPAREDNESS</span>
                </h4>
                <ul className="space-y-2">
                  {pandemicGuidelines.preparedness.map((item, idx) => (
                    <li key={idx} className="text-slate-700 text-sm flex gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Isolation */}
              <div className="bg-red-50 rounded-xl p-4">
                <h4 className="text-red-900 font-bold mb-3 flex items-center gap-2">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">ISOLATION</span>
                </h4>
                <ul className="space-y-2">
                  {pandemicGuidelines.isolation.map((item, idx) => (
                    <li key={idx} className="text-slate-700 text-sm flex gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Community */}
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="text-green-900 font-bold mb-3 flex items-center gap-2">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">COMMUNITY</span>
                </h4>
                <ul className="space-y-2">
                  {pandemicGuidelines.community.map((item, idx) => (
                    <li key={idx} className="text-slate-700 text-sm flex gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mental Health */}
              <div className="bg-purple-50 rounded-xl p-4">
                <h4 className="text-purple-900 font-bold mb-3 flex items-center gap-2">
                  <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">MENTAL HEALTH</span>
                </h4>
                <ul className="space-y-2">
                  {pandemicGuidelines.mentalHealth.map((item, idx) => (
                    <li key={idx} className="text-slate-700 text-sm flex gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}