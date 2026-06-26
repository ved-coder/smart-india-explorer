import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Helper database of activities for the generator
const regionalActivities = {
  delhi: [
    {
      theme: "Ancient Old Delhi Heritage",
      activities: [
        { time: "09:00 AM", activity: "Explore Red Fort (Lal Qila)", description: "Marvel at the red sandstone walls and Mughal architecture built by Emperor Shah Jahan.", costBase: 600, tags: ["History", "Culture"] },
        { time: "11:30 AM", activity: "Visit Jama Masjid", description: "One of the largest mosques in India, offering spectacular views of Old Delhi from its minaret.", costBase: 100, tags: ["Culture", "Spiritual"] },
        { time: "01:00 PM", activity: "Old Delhi Rickshaw Ride & Spice Bazaar", description: "Ride through the narrow lanes of Chandni Chowk and experience the scents of Khari Baoli, Asia's largest spice market.", costBase: 250, tags: ["Culture", "Culinary"] }
      ],
      food: "Mouth-watering Chole Bhature or a traditional Mughlai lunch at Karim's near Jama Masjid.",
      safety: "Beware of pickpockets in crowded Chandni Chowk lanes. Carry your backpack on your front."
    },
    {
      theme: "New Delhi Icons & Colonial Landmarks",
      activities: [
        { time: "09:30 AM", activity: "Walk around India Gate & Rajpath", description: "A solemn war memorial arch representing modern India, flanked by lush green lawns.", costBase: 0, tags: ["History"] },
        { time: "11:00 AM", activity: "Visit Humayun's Tomb", description: "A magnificent garden tomb, predecessor of the Taj Mahal, surrounded by pristine Persian-style gardens.", costBase: 600, tags: ["History", "Nature"] },
        { time: "02:30 PM", activity: "Explore Qutub Minar Complex", description: "A UNESCO Heritage site containing the tallest brick minaret in the world, dating back to 1192 AD.", costBase: 600, tags: ["History", "Culture"] }
      ],
      food: "Modern Indian dining at Connaught Place (CP) or rich butter chicken at Pandara Road.",
      safety: "Buy monument entry tickets online via the ASI website to skip long queues and avoid ticket touts."
    },
    {
      theme: "Spiritual Oasis & Modern Crafts",
      activities: [
        { time: "10:00 AM", activity: "Peaceful morning at Gurudwara Bangla Sahib", description: "A beautiful Sikh temple known for its holy pool (Sarovar) and community kitchen feeding thousands daily.", costBase: 0, tags: ["Spiritual", "Culture"] },
        { time: "01:00 PM", activity: "Shop & Dine at Dilli Haat INA", description: "An open-air food plaza and craft bazaar showcasing artisans from every state in India.", costBase: 100, tags: ["Culture", "Culinary"] },
        { time: "04:30 PM", activity: "Visit Lotus Temple (Bahai House of Worship)", description: "An architectural marvel shaped like a blooming white lotus, dedicated to silent meditation and unity.", costBase: 0, tags: ["Spiritual", "Nature"] }
      ],
      food: "Regional specialties from food stalls representing different states in Dilli Haat (try Momos or fish fry).",
      safety: "Ensure to cover your head and remove shoes before entering the Gurudwara premises."
    },
    {
      theme: "Akshardham Temple & Cultural Exhibition",
      activities: [
        { time: "09:30 AM", activity: "Visit Swaminarayan Akshardham", description: "A massive Hindu temple complex displaying centuries of traditional Indian culture, spirituality, and art.", costBase: 250, tags: ["Spiritual", "Culture"] },
        { time: "03:00 PM", activity: "Stroll in Lodhi Gardens", description: "A quiet urban park filled with tombs of the Sayyid and Lodi dynasties, popular for sunset walks.", costBase: 0, tags: ["Nature", "History"] },
        { time: "06:00 PM", activity: "Sunset view at Safdarjung Tomb", description: "The last monumental garden tomb of the Mughal Empire, featuring high-domed chambers.", costBase: 300, tags: ["History"] }
      ],
      food: "Pure vegetarian delicacies inside the Akshardham Premise Food Court.",
      safety: "Electronic items, bags, and cameras are strictly prohibited inside Akshardham. Use the free, secure cloakroom."
    }
  ],
  rajasthan: [
    {
      theme: "Jaipur - Pink City Heritage",
      activities: [
        { time: "09:00 AM", activity: "Visit Hawa Mahal (Palace of Winds)", description: "Observe the stunning honeycomb facade with 953 small windows designed for royal women to watch street festivals unseen.", costBase: 200, tags: ["History", "Culture"] },
        { time: "10:30 AM", activity: "Explore City Palace & Museum", description: "The residence of the royal family of Jaipur, exhibiting royal costumes, weapons, and beautiful courtyards.", costBase: 700, tags: ["History", "Culture"] },
        { time: "02:00 PM", activity: "See Jantar Mantar Observatory", description: "A UNESCO site containing the world's largest stone sundial, measuring time with astronomical precision.", costBase: 200, tags: ["History", "Culture"] }
      ],
      food: "Traditional Rajasthani Thali with Gatte ki Sabzi and Ker Sangri at LMB in the walled city.",
      safety: "Local vendors near Hawa Mahal can be very pushy. Negotiate prices to at least 50% of the initial quote."
    },
    {
      theme: "Fortresses & Panoramic Sunsets",
      activities: [
        { time: "09:00 AM", activity: "Explore Amer Fort (Amber Fort)", description: "A massive hilltop palace fort combining Hindu and Mughal elements, featuring the glittering Sheesh Mahal (Mirror Palace).", costBase: 550, tags: ["History", "Culture"] },
        { time: "01:00 PM", activity: "See the Floating Jal Mahal", description: "A beautiful palace submerged in the center of Man Sagar Lake. Great for photos from the lakeside bank.", costBase: 0, tags: ["Nature"] },
        { time: "04:30 PM", activity: "Sunset at Nahargarh Fort", description: "Stand on the edge of the Aravalli hills for a panoramic golden-hour view overlooking the entire pink city.", costBase: 200, tags: ["History", "Nature"] }
      ],
      food: "Try Pyaz Kachori (savory onion pastry) and hot sweet Lassi served in clay cups.",
      safety: "Avoid taking elephant rides up to Amer Fort due to animal welfare concerns; opt for authorized golf carts or local cabs instead."
    },
    {
      theme: "Holy Lake & Desert Spirituality",
      activities: [
        { time: "10:00 AM", activity: "Travel to Pushkar & Holy Lake", description: "A sacred town built around a holy lake, featuring one of the world's very few Brahma temples.", costBase: 0, tags: ["Spiritual", "Culture"] },
        { time: "03:00 PM", activity: "Ghats exploration", description: "Stroll along the 52 bathing ghats surrounding the lake where pilgrims take holy dips.", costBase: 0, tags: ["Spiritual", "Culture"] },
        { time: "05:30 PM", activity: "Camel ride in the Thar Desert dunes", description: "Experience a peaceful desert sunset riding a camel across the soft sand dunes near Pushkar.", costBase: 500, tags: ["Adventure", "Nature"] }
      ],
      food: "Delicious Malpua (sweet pancakes) and vegetarian wood-fired pizzas at Pushkar lakeside cafes.",
      safety: "Do not accept 'free flowers' from priests on the ghats. They will demand heavy 'donations' later. Respectfully say no."
    },
    {
      theme: "Jodhpur - The Blue City Fortress",
      activities: [
        { time: "09:30 AM", activity: "Conquer Mehrangarh Fort", description: "One of the largest, best-preserved forts in India, rising 400 feet above Jodhpur with museum galleries.", costBase: 600, tags: ["History", "Culture"] },
        { time: "02:00 PM", activity: "Explore Blue City Streets", description: "Walk through the historic indigo-colored houses of the old town around Brahmapuri.", costBase: 0, tags: ["Culture", "Nature"] },
        { time: "04:30 PM", activity: "Visit Jaswant Thada", description: "A peaceful marble cenotaph built in memory of Maharaja Jaswant Singh II, sitting next to a quiet lake.", costBase: 50, tags: ["History"] }
      ],
      food: "Rich Mawa Kachori (sweet nut pastry) and spicy Mirchi Bada at local Jodhpur bazaars.",
      safety: "Streets in the blue city are narrow and labyrinthine; carry a fully charged phone with offline maps."
    }
  ],
  maharashtra: [
    {
      theme: "Mumbai Heritage & Colonial Charm",
      activities: [
        { time: "09:00 AM", activity: "Visit Gateway of India & Taj Mahal Palace Hotel", description: "Stand by the Arabian sea to witness the landmark arch built to welcome King George V, next to the iconic Victorian hotel.", costBase: 0, tags: ["History"] },
        { time: "10:30 AM", activity: "Ferry to Elephanta Caves", description: "Take a scenic boat ride to Elephanta Island to explore UNESCO rock-cut cave temples dedicated to Lord Shiva dating to the 5th century.", costBase: 300, tags: ["History", "Spiritual"] },
        { time: "04:00 PM", activity: "Stroll on Marine Drive at Sunset", description: "Walk along the curved seaside boulevard, affectionately known as the 'Queen's Necklace' as streetlights turn on.", costBase: 0, tags: ["Nature"] }
      ],
      food: "Classic Pav Bhaji at Sardar Refreshments or draft beers and continental snacks at Leopold Cafe.",
      safety: "Elephanta Island has many wild monkeys. Do not carry visible food bags, plastic bottles, or attempt to feed them."
    },
    {
      theme: "Mumbai's Lifeline & Bazaar Chaos",
      activities: [
        { time: "09:00 AM", activity: "See Chhatrapati Shivaji Maharaj Terminus (CSMT)", description: "A gorgeous Gothic Revival train terminal and UNESCO site featuring ornate stone arches and animal carvings.", costBase: 0, tags: ["History"] },
        { time: "11:00 AM", activity: "Visit Dhobi Ghat (Mahalaxmi)", description: "Observe the massive, open-air municipal laundry where hundreds of washmen clean clothes in stone tubs.", costBase: 100, tags: ["Culture"] },
        { time: "02:00 PM", activity: "Crawford Market & Colaba Shopping", description: "Lose yourself in historic indoor markets filled with spices, fruits, clothing, and vintage collectibles.", costBase: 0, tags: ["Culture"] }
      ],
      food: "Enjoy street snacks like Vada Pav or Keema Pav at the bustling stalls of Fort district.",
      safety: "Ensure to keep a close eye on your phone and wallet in crowded markets. Only hire metered black-and-yellow cabs."
    }
  ],
  kerala: [
    {
      theme: "Fort Kochi - Colonial History & Art",
      activities: [
        { time: "09:30 AM", activity: "Walk around Fort Kochi & Chinese Fishing Nets", description: "See the massive cantilevered wooden fishing structures introduced by Chinese traders in the 14th century.", costBase: 0, tags: ["History", "Nature"] },
        { time: "11:30 AM", activity: "Visit St. Francis Church & Mattancherry Palace", description: "The oldest European church in India (where Vasco da Gama was buried) and the Dutch Palace housing royal murals.", costBase: 50, tags: ["History", "Culture"] },
        { time: "06:00 PM", activity: "Watch Kathakali Dance Performance", description: "Experience traditional Keralan classical dance-drama featuring elaborate makeup, masks, and dramatic eye movements.", costBase: 300, tags: ["Culture"] }
      ],
      food: "Freshly caught local fish cooked in coconut ginger curry at a beachside cafe in Fort Kochi.",
      safety: "When taking photos of Chinese fishing nets, fishermen may ask you to help pull the nets and then demand money. Agree on tips beforehand."
    },
    {
      theme: "Alleppey - Backwater Tranquility",
      activities: [
        { time: "10:30 AM", activity: "Board a traditional Kettuvallam (Houseboat)", description: "Glide past peaceful green banks, coconut groves, and rural villages on a boat made of wood and coir.", costBase: 3000, tags: ["Nature", "Culture"] },
        { time: "02:00 PM", activity: "Village Walk & Toddy Shop Visit", description: "Step ashore to walk through tiny paddy farms and sample local palm wine (toddy) at a local shack.", costBase: 150, tags: ["Culture", "Culinary"] }
      ],
      food: "Traditional Keralan lunch (Sadya) served on a banana leaf with pearl spot fish fry.",
      safety: "Ensure your houseboat has a government license. Check if life jackets are available on board before departure."
    }
  ],
  tamilnadu: [
    {
      theme: "Chennai Heritage & Beach Breezes",
      activities: [
        { time: "09:00 AM", activity: "Visit Kapaleeshwarar Temple", description: "A majestic 7th-century temple in Mylapore showcasing colorful towering sculptured gateways (Gopurams).", costBase: 0, tags: ["Spiritual", "Culture"] },
        { time: "11:30 AM", activity: "Explore Fort St. George & Museum", description: "The first English fortress in India established in 1640, now hosting a rich museum of British colonial relics.", costBase: 300, tags: ["History"] },
        { time: "04:30 PM", activity: "Stroll on Marina Beach", description: "The longest natural urban beach in the country, buzzing with local snack vendors, kite flyers, and families.", costBase: 0, tags: ["Nature"] }
      ],
      food: "Hot, pillowy Idlis and crispy Ghee Roast Dosa at Saravana Bhavan, washed down with frothy Filter Coffee.",
      safety: "Marina beach has strong undercurrents; swimming is prohibited. Avoid entering the water."
    },
    {
      theme: "Mahabalipuram - UNESCO Stone Wonders",
      activities: [
        { time: "09:00 AM", activity: "Travel to Mahabalipuram (Mamallapuram)", description: "A historic coastal town famous for rock temples carved out of single granite boulders in the 7th century.", costBase: 600, tags: ["History", "Culture"] },
        { time: "10:30 AM", activity: "Marvel at the Shore Temple & Five Rathas", description: "UNESCO-protected sea-facing temple shrines, and monolithic structures shaped like royal chariots.", costBase: 600, tags: ["History", "Nature"] },
        { time: "03:00 PM", activity: "Visit Krishna's Butterball", description: "A gigantic, gravity-defying natural granite boulder resting balanced on a steep, smooth hill slope.", costBase: 0, tags: ["Nature"] }
      ],
      food: "Freshly caught grilled prawns and local fish curries at beachside shacks.",
      safety: "The sun gets very intense; carry an umbrella, wear sunscreen, and bring plenty of bottled water."
    }
  ],
  westbengal: [
    {
      theme: "Kolkata - Colonial Capital",
      activities: [
        { time: "09:00 AM", activity: "Visit Victoria Memorial", description: "A grand white-marble palace monument dedicated to Queen Victoria, showcasing colonial paintings and royal artifacts.", costBase: 500, tags: ["History"] },
        { time: "11:30 AM", activity: "Ride the Historic Kolkata Tram & Metro", description: "Take a slow, nostalgic ride on Asia's oldest operating tram system, or travel on India's first underground metro.", costBase: 20, tags: ["Culture"] },
        { time: "04:00 PM", activity: "Cross the Howrah Bridge & Flower Market", description: "Walk near the iconic steel cantilever bridge and see the vibrant Mullick Ghat Flower Market along the Hooghly River.", costBase: 0, tags: ["Nature", "Culture"] }
      ],
      food: "Spicy chicken or egg Kathi Rolls at Park Street, followed by soft, sweet Rosogolla at a local sweet shop.",
      safety: "Traffic in Kolkata can be unpredictable. Use pedestrian underpasses and crosswalks when available."
    },
    {
      theme: "Spiritual Centers & Artistic Hubs",
      activities: [
        { time: "09:00 AM", activity: "Ferry to Dakshineswar Kali Temple & Belur Math", description: "Visit the grand Kali temple on the river bank, then cruise to Belur Math, headquarters of the Ramakrishna Mission.", costBase: 100, tags: ["Spiritual", "Culture"] },
        { time: "02:00 PM", activity: "Explore Kumartuli Clay Artist Colony", description: "Stroll through a unique maze of workshops where artisans sculpt gigantic clay idols of Hindu deities by hand.", costBase: 0, tags: ["Culture", "History"] }
      ],
      food: "Traditional Bengali fish curry (Maacher Jhol) with steamed rice, followed by sweet yogurt (Mishti Doi).",
      safety: "Photography inside temple sanctuaries is strictly banned. Observe and follow temple signs."
    }
  ]
};

// Simple rule-based itinerary generator
function generateItineraryData(regionId, regionName, duration, budget, interests) {
  const activitiesPool = regionalActivities[regionId] || [];
  
  if (activitiesPool.length === 0) {
    // Return a default mock structure if region has no specific pool
    return {
      title: `Explorer Tour of ${regionName}`,
      regionId,
      regionName,
      duration,
      budget,
      interests,
      days: Array.from({ length: duration }, (_, i) => ({
        dayNumber: i + 1,
        theme: `Exploring Highlights of ${regionName} - Part ${i + 1}`,
        activities: [
          { time: "09:00 AM", activity: `Visit landmark tourist spots in ${regionName}`, description: `A beautiful day experiencing local heritage and sights.`, costEstimate: budget === 'Luxury' ? 'INR 1500' : (budget === 'Mid-range' ? 'INR 500' : 'INR 150'), tip: "Check local opening hours." }
        ],
        foodRecommendation: `Local traditional foods of ${regionName}`,
        safetyTip: "Always drink bottled water and hire authorized guides.",
        transportSuggestion: "Local cabs or auto-rickshaws."
      }))
    };
  }

  // Adjust cost multiplier depending on budget tier
  // Backpacker: low-cost entry, public transport
  // Mid-range: normal entry, autos/cabs, average tips
  // Luxury: private guides, premium entry, luxury cabs, high comfort
  let costMultiplier = 1.0;
  if (budget === 'Backpacker') costMultiplier = 0.8;
  if (budget === 'Luxury') costMultiplier = 2.5;

  const days = [];
  const daysToGenerate = parseInt(duration, 10) || 3;

  for (let i = 0; i < daysToGenerate; i++) {
    // Cycle through activities pool to populate days
    const poolIndex = i % activitiesPool.length;
    const dayTemplate = activitiesPool[poolIndex];

    // Filter or adjust activities inside dayTemplate based on user interests if possible
    const formattedActivities = dayTemplate.activities.map(act => {
      let costVal = act.costBase;
      if (budget === 'Backpacker' && act.costBase > 100) {
        costVal = act.costBase * 0.9; // minor backpacker discount representation
      }
      if (budget === 'Luxury') {
        costVal = act.costBase + 1200; // includes private English guide fee
      }

      let costStr = `INR ${Math.round(costVal)}`;
      if (act.costBase === 0) {
        costStr = "Free Entry";
      } else if (budget === 'Luxury') {
        costStr += " (Includes VIP access & Guide)";
      }

      let actTip = act.tip || "Hire an official guide at the counter to learn more.";
      if (budget === 'Backpacker') {
        actTip = "Use a free audio-guide app or read historical plaques to save cost.";
      }

      return {
        time: act.time,
        activity: act.activity,
        description: act.description,
        costEstimate: costStr,
        tip: actTip
      };
    });

    // Determine transport advice for this day based on budget
    let transportAdv = "Take an auto-rickshaw (negotiate first!) or local metro.";
    if (budget === 'Backpacker') {
      transportAdv = "Walk or use the metro/local buses (extremely cheap: under INR 30).";
    } else if (budget === 'Luxury') {
      transportAdv = "Your private air-conditioned chauffeured vehicle will handle all transit.";
    }

    days.push({
      dayNumber: i + 1,
      theme: dayTemplate.theme + (i >= activitiesPool.length ? " (Deep Dive)" : ""),
      activities: formattedActivities,
      foodRecommendation: dayTemplate.food,
      safetyTip: dayTemplate.safety,
      transportSuggestion: transportAdv
    });
  }

  // Create a stunning title
  let titlePrefix = "An Authentic Journey through";
  if (budget === 'Backpacker') titlePrefix = "Budget Backpacker's Guide to";
  if (budget === 'Luxury') titlePrefix = "A Royal Luxury Tour of";

  return {
    title: `${titlePrefix} ${regionName} (${daysToGenerate} Days)`,
    regionId,
    regionName,
    duration: daysToGenerate,
    budget,
    interests,
    days
  };
}

// GET saved itineraries for a user
router.get('/', (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId parameter' });
    }
    const itineraries = db.getItineraries(userId);
    res.json(itineraries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve saved itineraries: ' + error.message });
  }
});

// POST to create and save a new itinerary for a user
router.post('/', (req, res) => {
  try {
    const { regionId, duration, budget, interests, userId } = req.body;
    
    if (!regionId || !duration || !budget || !userId) {
      return res.status(400).json({ error: 'Missing required parameters: regionId, duration, budget, or userId' });
    }

    const region = db.getRegionById(regionId);
    if (!region) {
      return res.status(404).json({ error: 'Region not found' });
    }

    const itineraryDetails = generateItineraryData(
      regionId,
      region.name,
      duration,
      budget,
      interests || []
    );

    // Attach userId to saved itinerary
    itineraryDetails.userId = userId;

    const saved = db.saveItinerary(itineraryDetails);
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate itinerary: ' + error.message });
  }
});

// DELETE an itinerary
router.delete('/:id', (req, res) => {
  try {
    const success = db.deleteItinerary(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }
    res.json({ message: 'Itinerary deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete itinerary: ' + error.message });
  }
});

export default router;
