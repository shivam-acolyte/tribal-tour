import { Pool } from "pg";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";
import { BlogPost } from "../src/lib/types";

// Load .env.local
const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx > 0) {
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set in .env.local");
  process.exit(1);
}

const useSSL =
  DATABASE_URL.includes("sslmode=require") ||
  DATABASE_URL.includes("neon.tech") ||
  DATABASE_URL.includes("supabase.co") ||
  process.env.DATABASE_SSL === "true";

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});

export const richBlogs: BlogPost[] = [
  {
    slug: "10-must-visit-places-rajasthan",
    title: "10 Must-Visit Places in Rajasthan for First-Time Travelers",
    excerpt: "From the pink walls of Jaipur to the golden sands of Jaisalmer, discover the top destinations that make Rajasthan a royal experience.",
    category: "Destinations",
    author: "Arjun Mehta",
    authorImage: "/uploads/blogs/10-must-visit-places-rajasthan-author.jpg",
    authorBio: "Arjun is a passionate travel journalist & photographer with over 8 years of experience documenting heritage trails, royal forts, and cultural festivals across India.",
    date: "Jan 15, 2025",
    readTime: "8 min read",
    image: "/uploads/blogs/10-must-visit-places-rajasthan-cover.jpg",
    seoTitle: "10 Must-Visit Places in Rajasthan | Tribal Discovery Tour",
    seoDescription: "Explore Rajasthan's top 10 iconic royal cities, forts, desert safaris, and heritage palaces. Plan your first trip to Rajasthan with our complete guide.",
    seoKeywords: "Rajasthan travel, Jaipur places to visit, Jaisalmer desert safari, Udaipur lakes, Rajasthan tourism",
    content: `
      <h2>Welcome to the Land of Kings</h2>
      <p>Rajasthan is a mesmerizing tapestry of majestic forts, opulent palaces, vibrant cultural festivals, and golden sand dunes. If you are planning your very first trip to India's most regal state, here are the top 10 destinations you simply cannot miss.</p>

      <h3>1. Jaipur — The Pink City</h3>
      <p>As the capital of Rajasthan, <strong>Jaipur</strong> serves as the gateway to the state's heritage. Explore the grand <em>Amer Fort</em> with its mirror-studded Sheesh Mahal, marvel at the intricate honeycomb facade of <em>Hawa Mahal</em>, and visit the royal residence at <em>City Palace</em>. Don't forget to shop for traditional block-print textiles and blue pottery in the bustling Johari and Bapu Bazaars.</p>

      <h3>2. Udaipur — The City of Lakes</h3>
      <p>Often hailed as the most romantic city in India, <strong>Udaipur</strong> is nestled amidst the scenic Aravalli Hills. Take a serene boat cruise on <em>Lake Pichola</em>, explore the colossal <em>City Palace complex</em>, and watch the sunset from the Monsoon Palace (Sajjangarh).</p>

      <h3>3. Jodhpur — The Blue City</h3>
      <p>Dominated by the impregnable <strong>Mehrangarh Fort</strong> towering 400 feet above the city, Jodhpur is famed for its sea of indigo-painted houses in the old quarter. Stroll through the lanes of Navchokiya and admire the cenotaphs at <em>Jaswant Thada</em>.</p>

      <h3>4. Jaisalmer — The Golden City</h3>
      <p>Rising like a golden mirage out of the Thar Desert, <strong>Jaisalmer</strong> is home to one of the world's few living forts — the <em>Sonar Qila</em>. Experience an overnight desert camp in the Sam Sand Dunes with traditional folk dance, camel safaris, and stargazing under desert skies.</p>

      <h3>5. Pushkar — Sacred Lake & Camel Fair</h3>
      <p>Surrounding a holy lake with 52 bathing ghats, <strong>Pushkar</strong> is a spiritual haven famous for housing one of the world's few temples dedicated to Lord Brahma. Visit during the annual <em>Pushkar Camel Fair</em> in November to witness a spectacle of folk music, trading, and festivities.</p>

      <h3>6. Ranthambore National Park — Royal Bengal Tigers</h3>
      <p>Once the private hunting grounds of the Maharajas of Jaipur, <strong>Ranthambore</strong> is now one of India's premier tiger reserves. Embark on early morning open-top jeep safaris to spot Bengal tigers, leopards, marsh crocodiles, and sloth bears against the backdrop of the historic 10th-century Ranthambore Fort.</p>

      <h3>7. Bikaner — Desert Forts and Savory Delights</h3>
      <p>Famous for its spicy bhujia and camel breeding farm, <strong>Bikaner</strong> boasts the majestic <em>Junagarh Fort</em>, which uniquely was never built on a hill yet remained unconquered. Visit the nearby <em>Karni Mata Temple</em> at Deshnoke, known for its revered holy rats.</p>

      <h3>8. Mount Abu — Rajasthan's Only Hill Station</h3>
      <p>Nestled at 1,220 meters elevation, <strong>Mount Abu</strong> offers cool breezes and lush green forests. It is globally renowned for the <em>Dilwara Jain Temples</em>, crafted between the 11th and 13th centuries with breathtakingly intricate marble carvings.</p>

      <h3>9. Chittorgarh — Epic Fort of Valor</h3>
      <p>The monumental <strong>Chittorgarh Fort</strong> is a UNESCO World Heritage site spanning over 700 acres. Relive stories of Rajput chivalry, Rani Padmini's courage, and the towering 9-story <em>Vijay Stambha (Tower of Victory)</em>.</p>

      <h3>10. Shekhawati — The Open-Air Art Gallery</h3>
      <p>Known as the world's largest open-air art gallery, the <strong>Shekhawati region</strong> (encompassing Mandawa, Nawalgarh, and Fatehpur) is dotted with hundreds of grand merchant havelis covered in vivid heritage frescoes depicting mythology, history, and royal life.</p>

      <h2>Best Time to Visit Rajasthan</h2>
      <p>The ideal time to visit Rajasthan is between <strong>October and March</strong>, when the winter weather is pleasantly cool and perfect for sightseeing, desert camps, and outdoor adventures.</p>
    `,
  },
  {
    slug: "ultimate-thailand-travel-guide",
    title: "Ultimate Thailand Travel Guide: Tips, Budget & Itinerary",
    excerpt: "Everything you need to know before planning your Thailand trip — from visa to street food to island hopping.",
    category: "Travel Tips",
    author: "Sneha Kapoor",
    authorImage: "/uploads/blogs/singapore-with-kids-author.jpg",
    authorBio: "Sneha is a budget travel strategist and full-time digital nomad who has explored over 25 countries across Asia and Europe.",
    date: "Dec 28, 2024",
    readTime: "10 min read",
    image: "/uploads/blogs/ultimate-thailand-travel-guide-cover.jpg",
    seoTitle: "Ultimate Thailand Travel Guide 2025 | Tribal Discovery Tour",
    seoDescription: "Complete travel guide to Thailand: Bangkok temples, Chiang Mai mountains, Phuket islands, budget tips, visas, and food guide.",
    seoKeywords: "Thailand travel guide, Bangkok itinerary, Phuket island hopping, Thailand budget trip, Thailand visa",
    content: `
      <h2>Why Thailand is Southeast Asia's Favorite Destination</h2>
      <p>From shimmering Buddhist temples and bustling floating markets to pristine turquoise islands and mouth-watering street food, Thailand delivers an unforgettable travel experience for every type of explorer.</p>

      <h3>Top Regions to Include in Your Itinerary</h3>
      <ul>
        <li><strong>Bangkok:</strong> The pulsating capital city. Visit Wat Pho (Reclining Buddha), the Grand Palace, Wat Arun, and experience night markets like Chatuchak and Jodd Fairs.</li>
        <li><strong>Chiang Mai & The North:</strong> Surrounded by misty mountains, Chiang Mai is rich in Lanna culture, ancient temples, ethical elephant sanctuaries, and cooking schools.</li>
        <li><strong>Phuket & Krabi:</strong> The gateway to Andaman Sea island hopping — explore the Phi Phi Islands, Maya Bay, Railay Beach, and emerald lagoons.</li>
        <li><strong>Koh Samui & Koh Tao:</strong> Perfect for Gulf of Thailand diving, tropical relaxation, and beachfront fire shows.</li>
      </ul>

      <h3>Daily Budget Breakdown (Approximate)</h3>
      <p>Thailand remains one of the most cost-effective travel destinations in the world:</p>
      <ul>
        <li><strong>Budget Backpackers:</strong> $30 - $45 (₹2,500 - ₹3,700) per day (hostels, street food, local buses/MRT).</li>
        <li><strong>Mid-Range Travelers:</strong> $70 - $120 (₹5,800 - ₹10,000) per day (3-star/4-star boutique hotels, sit-down dining, guided island tours).</li>
        <li><strong>Luxury:</strong> $200+ (₹16,500+) per day (5-star beachfront resorts, private speedboats, fine dining).</li>
      </ul>

      <h3>Must-Try Thai Foods</h3>
      <p>Don't leave Thailand without tasting authentic <em>Pad Thai</em>, rich <em>Tom Yum Goong</em>, fragrant <em>Green Curry (Gaeng Keow Wan)</em>, spicy <em>Som Tum (Papaya Salad)</em>, and classic <em>Mango Sticky Rice</em>.</p>
    `,
  },
  {
    slug: "best-trekking-trails-india",
    title: "Best Trekking Trails in India for Adventure Lovers",
    excerpt: "From the lush Western Ghats to the mighty Himalayas, explore India's most thrilling trekking routes.",
    category: "Adventure",
    author: "Vikram Joshi",
    authorImage: "/uploads/blogs/best-trekking-trails-india-author.jpg",
    authorBio: "Vikram is a certified mountain guide, wilderness survival expert, and trekking enthusiast based out of Himachal Pradesh.",
    date: "Dec 10, 2024",
    readTime: "7 min read",
    image: "/uploads/blogs/best-trekking-trails-india-cover.jpg",
    seoTitle: "Best Trekking Trails in India | Adventure Guide",
    seoDescription: "Discover India's top trekking trails: Dzukou Valley, Kedarkantha, Chadar Trek, Valley of Flowers, and Hampta Pass.",
    seoKeywords: "trekking in India, Dzukou Valley trek, Himalayan treks, Kedarkantha winter trek, best adventure trails",
    content: `
      <h2>The Thrill of Trekking Across India's Landscapes</h2>
      <p>With terrains ranging from the snow-clad peaks of the Himalayas to the lush biodiversity of Northeast India and the Western Ghats, India is a paradise for trekkers of all experience levels.</p>

      <h3>1. Dzukou Valley Trek (Nagaland & Manipur)</h3>
      <p>Sitting at 2,452 meters on the border of Nagaland and Manipur, <strong>Dzukou Valley</strong> is famous for its rolling emerald hills, natural caves, and the rare endemic Dzukou Lily. Best visited during monsoon and post-monsoon months (June - October).</p>

      <h3>2. Kedarkantha Trek (Uttarakhand)</h3>
      <p>The ultimate classic winter summit trek. Rising to 12,500 feet in Govind Wildlife Sanctuary, Kedarkantha offers 360-degree panoramic views of snow-covered peaks like Swargarohini, Bandarpoonch, and Black Peak.</p>

      <h3>3. Chadar Frozen River Trek (Zanskar, Ladakh)</h3>
      <p>One of the world's most unique winter expeditions. In January and February, trekkers walk directly over the frozen Zanskar River in sub-zero temperatures (-20°C to -30°C) amidst dramatic canyon gorges.</p>

      <h3>4. Valley of Flowers & Hemkund Sahib (Uttarakhand)</h3>
      <p>A UNESCO World Heritage National Park blooming with over 500 varieties of alpine wildflowers from July to September, framed by cascading streams and snow-capped peaks.</p>

      <h3>5. Hampta Pass Trek (Himachal Pradesh)</h3>
      <p>A dramatic crossover trek transitioning from the lush pine forests of Kullu Valley to the stark, barren, and breathtaking mountain desert of Spiti Valley, concluding at the pristine blue Chandratal Lake.</p>
    `,
  },
  {
    slug: "kerala-food-guide",
    title: "A Food Lover's Guide to Kerala Cuisine",
    excerpt: "Discover the rich flavors of Kerala — from appam and stew to fresh seafood on banana leaves.",
    category: "Food",
    author: "Lakshmi Nair",
    authorImage: "/uploads/blogs/kerala-food-guide-author.jpg",
    authorBio: "Lakshmi is a food historian and culinary travel writer dedicated to preserving regional Indian recipes and street food stories.",
    date: "Nov 22, 2024",
    readTime: "6 min read",
    image: "/uploads/blogs/10-must-visit-places-rajasthan-cover.jpg",
    seoTitle: "A Food Lover's Guide to Kerala Cuisine | Culinary Trails",
    seoDescription: "Explore authentic Kerala dishes: Appam, Karimeen Pollichathu, Malabar Biryani, and traditional Kerala Sadya feast.",
    seoKeywords: "Kerala food guide, authentic Kerala cuisine, Malabar biryani, Kerala sadhya, Appam stew",
    content: `
      <h2>The Symphony of Spices in God's Own Country</h2>
      <p>Kerala's culinary traditions have been shaped over millennia by historic spice trades, coastal abundance, and rich cultural heritage. Coconut, curry leaves, mustard seeds, and black pepper form the heartbeat of every dish.</p>

      <h3>Iconic Kerala Dishes You Must Try</h3>
      <ul>
        <li><strong>Appam with Vegetable or Chicken Stew:</strong> Fluffy, fermented rice batter pancakes with crispy lacy edges, paired with a fragrant coconut milk stew.</li>
        <li><strong>Kerala Sadhya:</strong> The quintessential vegetarian feast served on a fresh banana leaf, featuring up to 24 dishes including Sambar, Avial, Thoran, Olan, Payasam, and crispy banana chips.</li>
        <li><strong>Karimeen Pollichathu:</strong> Pearl spot fish marinated in fiery regional spices, wrapped in tender banana leaves, and slow-cooked over a skillet.</li>
        <li><strong>Malabar Parotta & Beef/Mutton Roast:</strong> Flaky, multi-layered flatbread paired with rich, slow-cooked dark caramelized meat roast.</li>
        <li><strong>Puttu and Kadala Curry:</strong> Steamed cylindrical rice cakes layered with grated coconut, eaten with spicy black chickpea curry.</li>
      </ul>
    `,
  },
  {
    slug: "solo-travel-safety-tips",
    title: "Solo Travel Safety Tips: A Complete Guide",
    excerpt: "Planning your first solo trip? Here are essential safety tips and tricks for a worry-free adventure.",
    category: "Travel Tips",
    author: "Riya Patel",
    authorImage: "/uploads/blogs/solo-travel-safety-tips-author.jpg",
    authorBio: "Riya is a solo female traveler, adventure enthusiast, and advocate for safe, sustainable, and empowering global travel.",
    date: "Nov 5, 2024",
    readTime: "5 min read",
    image: "/uploads/blogs/solo-travel-safety-tips-cover.jpg",
    seoTitle: "Solo Travel Safety Tips: Complete Guide 2025",
    seoDescription: "Essential safety tips for solo travelers: emergency planning, accommodation safety, navigating local transport, and staying connected.",
    seoKeywords: "solo travel tips, solo female travel safety, safe travel guide, solo trip planning",
    content: `
      <h2>Embracing the Freedom of Solo Travel Safely</h2>
      <p>Solo travel is one of life's most transformative experiences — offering unmatched independence, self-confidence, and spontaneous discovery. Here are our top practical tips to stay safe while traveling independently.</p>

      <h3>1. Research and Pre-Book First Night Stays</h3>
      <p>Always have verified accommodation booked for your arrival night. Arriving in a new city after a long flight with a confirmed pickup and hotel address prevents scams and unnecessary stress.</p>

      <h3>2. Keep Digital Backups of Documents</h3>
      <p>Store encrypted copies of your passport, travel insurance, flight tickets, and emergency contacts in cloud storage (Google Drive / iCloud) and email copies to a trusted friend or family member.</p>

      <h3>3. Share Live Location with Loved Ones</h3>
      <p>Use WhatsApp Live Location or Google Maps Location Sharing with family so they always have peace of mind regarding your whereabouts.</p>

      <h3>4. Blend in and Trust Your Intuition</h3>
      <p>Dress respectfully according to local cultural norms. If a situation, guide, or taxi driver ever feels uncomfortable or unsafe, trust your gut and exit immediately.</p>
    `,
  },
  {
    slug: "singapore-with-kids",
    title: "Singapore with Kids: Top Family-Friendly Activities",
    excerpt: "Make the most of your Singapore family vacation with these kid-approved attractions and activities.",
    category: "Destinations",
    author: "Arjun Mehta",
    authorImage: "/uploads/blogs/singapore-with-kids-author.jpg",
    authorBio: "Arjun is a passionate travel journalist & photographer with over 8 years of experience documenting heritage trails, royal forts, and cultural festivals across India.",
    date: "Oct 18, 2024",
    readTime: "7 min read",
    image: "/uploads/blogs/singapore-with-kids-cover.jpg",
    seoTitle: "Singapore with Kids: Best Family Activities | Travel Guide",
    seoDescription: "Top things to do in Singapore with kids: Gardens by the Bay, Singapore Zoo, Universal Studios, and Sentosa Island.",
    seoKeywords: "Singapore with kids, Singapore family vacation, Gardens by the Bay, Universal Studios Singapore, family travel Singapore",
    content: `
      <h2>The World's Best City for Family Travel</h2>
      <p>With its spotless streets, world-class public transportation, lush gardens, and thrilling theme parks, Singapore is arguably the easiest and most entertaining destination for traveling with children.</p>

      <h3>Top Attractions for Families</h3>
      <ul>
        <li><strong>Gardens by the Bay:</strong> Marvel at the towering Supertrees, step inside the climate-controlled Cloud Forest with its 35-meter indoor waterfall, and enjoy the evening Garden Rhapsody light show.</li>
        <li><strong>Singapore Zoo & Night Safari:</strong> Recognized among the best wildlife parks in the world with open-concept natural habitats, tram rides, and up-close animal feeding sessions.</li>
        <li><strong>Universal Studios Singapore (Sentosa):</strong> Packed with themed zones from Transformers 3D to Battlestar Galactica and Jurassic Park.</li>
        <li><strong>S.E.A. Aquarium:</strong> Home to more than 100,000 marine animals across 1,000 species, including manta rays, hammerhead sharks, and sea jellies.</li>
      </ul>
    `,
  },
];

async function main() {
  const client = await pool.connect();
  try {
    console.log("🔄 Updating blogs with full in-depth articles...");

    for (const b of richBlogs) {
      await client.query(
        `UPDATE blogs SET
          title = $1, excerpt = $2, content = $3, image = $4,
          category = $5, author = $6, author_image = $7, author_bio = $8,
          date = $9, read_time = $10, seo_title = $11,
          seo_description = $12, seo_keywords = $13, updated_at = NOW()
        WHERE slug = $14`,
        [
          b.title,
          b.excerpt,
          b.content,
          b.image,
          b.category,
          b.author,
          b.authorImage,
          b.authorBio,
          b.date,
          b.readTime,
          b.seoTitle,
          b.seoDescription,
          b.seoKeywords,
          b.slug,
        ]
      );
      console.log(`  ✅ Updated: ${b.title}`);
    }

    // Also update src/lib/data/blogs.ts
    const blogsTsCode = `import { BlogPost } from "../types";\n\nexport const blogs: BlogPost[] = ${JSON.stringify(richBlogs, null, 2)};\n`;
    writeFileSync(resolve(process.cwd(), "src/lib/data/blogs.ts"), blogsTsCode, "utf-8");
    console.log("✅ Updated src/lib/data/blogs.ts with rich article content!");

    console.log("\n🎉 All blogs now contain full, rich, formatted travel articles!");
  } catch (err) {
    console.error("❌ Update error:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
