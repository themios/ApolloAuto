import express from "express";
import type { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// ── Admin session store ────────────────────────────────────────────────────
// Tokens are random 32-byte hex strings stored in memory with an expiry.
// They are invalidated on logout or after SESSION_TTL without activity.
const SESSION_TTL = 8 * 60 * 60 * 1000; // 8 hours
const activeSessions = new Map<string, number>(); // token → expiry timestamp

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-admin-token"] as string | undefined;
  if (!token) return void res.status(401).json({ error: "Authentication required." });
  const expiry = activeSessions.get(token);
  if (!expiry || Date.now() > expiry) {
    activeSessions.delete(token ?? "");
    return void res.status(401).json({ error: "Session expired. Please log in again." });
  }
  activeSessions.set(token, Date.now() + SESSION_TTL); // sliding window
  next();
}

// Initialize files for mock persistence
const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE        = path.join(DATA_DIR, "leads.json");
const FEED_FILE         = path.join(DATA_DIR, "feed.json");
const TESTIMONIALS_FILE = path.join(DATA_DIR, "testimonials.json");
const ARTICLES_FILE     = path.join(DATA_DIR, "articles.json");
const FAQS_FILE         = path.join(DATA_DIR, "faqs.json");
const LOCATIONS_FILE    = path.join(DATA_DIR, "locations.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function readJson(file: string): any[] {
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file, "utf-8")); } catch { return []; }
}
function writeJson(file: string, data: any) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ── Seed Feed ──────────────────────────────────────────────────────────────
if (!fs.existsSync(FEED_FILE)) {
  writeJson(FEED_FILE, [
    { id: "f-1", date: "2026-05-27", title: "Memorial Week Cash Specials!", content: "Save $500 off cash pricing on all 4-cylinder commuter sedans at both our Simi Valley and El Monte lots this week. Come see Tim for details!" },
    { id: "f-2", date: "2026-05-20", title: "New Subprime Lending Partners Approved", content: "We just qualified with two new national credit-rebuilding auto lenders. We can now finance past repossessions even faster with down payments starting at $1,000." }
  ]);
}

// ── Seed Leads ─────────────────────────────────────────────────────────────
if (!fs.existsSync(LEADS_FILE)) writeJson(LEADS_FILE, []);

// ── Seed Testimonials ──────────────────────────────────────────────────────
if (!fs.existsSync(TESTIMONIALS_FILE)) {
  writeJson(TESTIMONIALS_FILE, [
    { id: "t-1", name: "Carlos Mendoza",    location: "El Monte Lot Visitor",        carModel: "2019 Toyota Corolla SE",   rating: 5, date: "2026-04-18", initials: "CM", quote: "Tim made everything simple. No complex dealership games, no hidden prep fees. We got a reliable commuter for our daughter and rebuild our family credit score step-by-step." },
    { id: "t-2", name: "Evelyn Ramirez",    location: "Simi Valley Lot Customer",    carModel: "2018 Honda Civic LX",      rating: 5, date: "2026-05-02", initials: "ER", quote: "After our bankruptcy, we were turned away at three big high-pressure lots. Tim sat down with us, verified our paycheck paystubs directly, and got our bank approval in 20 minutes." },
    { id: "t-3", name: "David K.",          location: "Simi Valley Lot Customer",    carModel: "2020 Nissan Rogue Sport",  rating: 5, date: "2026-05-14", initials: "DK", quote: "Bought a clean daily commuter Rogue here. Smog check was already completed, plates came in our mail 2 weeks later. Extremely honest and professional Ventura County group." },
    { id: "t-4", name: "Maria S. & Family", location: "El Monte Lot Customer",       carModel: "2017 Honda Accord Hybrid", rating: 5, date: "2026-03-29", initials: "MS", quote: "Bilingual staff is incredible. Tim translated every contract page clearly into Spanish for my mother. We knew exactly what our APR, down payments, and signatures meant." }
  ]);
}

// ── Seed Articles ──────────────────────────────────────────────────────────
if (!fs.existsSync(ARTICLES_FILE)) {
  writeJson(ARTICLES_FILE, [
    {
      slug: "what-to-bring-used-car-california",
      title: "What to Bring When Buying a Used Car in California",
      category: "Buyer Guide",
      summary: "A complete, foolproof checklist of licensing, insurance, proof of income, and residency documents required to drive off the lot with no delays.",
      keywords: ["buying used car California", "documents to buy a car", "what to bring to dealership"],
      readTime: "4 min read",
      date: "May 15, 2026",
      content: "<h2>The Practical California Used Car Buyer's Checklist</h2><p>Driving home in your new-to-you car should be an exciting moment, not a lesson in DMV paperwork delays. Bringing the right documents is key to a smooth, same-day process.</p><h3>1. Valid Driver's License</h3><p>A valid government-issued driver's license is required to drive off our lot.</p><h3>2. Up-to-Date Auto Insurance</h3><p>California law requires active auto liability insurance. We can connect you with local agents who will set up a low-cost policy at our desk.</p><h3>3. Proof of Income</h3><p>Bring your two most recent paycheck stubs, or three months of bank statements if self-employed.</p><h3>4. Residency Verification</h3><p>A utility bill or phone bill dated within the last 30 days showing your home address.</p><h3>5. Down Payment Funding</h3><p>We accept cashier's checks, major debit cards, and cash.</p>"
    },
    {
      slug: "bad-credit-used-car-financing-socal",
      title: "Bad Credit Used Car Financing in Ventura & LA Counties",
      category: "Financing",
      summary: "Struggling with past repossessions, medical bills, or bankruptcy? Learn how subprime loans work and how you can comfortably secure a reliable car.",
      keywords: ["bad credit used car financing", "credit rebuilding SoCal", "no credit auto loan"],
      readTime: "6 min read",
      date: "May 10, 2026",
      content: "<h2>Rebuilding Credit Through a Sensible Car Loan</h2><p>At Apollo Auto, we believe that credit struggles in the past should not prevent you from having a safe, reliable vehicle. Our two locations deal directly with banks specialized in second-chance lending.</p><h3>Why Credit Scores Don't Tell the Whole Story</h3><p>Traditional lots reject buyers with low scores automatically. Our lenders look at your current stability: steady income, stable residence, and a realistic down payment.</p><h3>Three Steps to Secure Approval</h3><p><strong>1. Size Up Your Down Payment</strong> — Even $1,000–$1,500 significantly lowers the bank's risk.</p><p><strong>2. Pick a Sensible Daily Driver</strong> — Lenders prefer reliable 4-cylinder vehicles like Corollas and Civics.</p><p><strong>3. Use a Strong Co-Signer</strong> — A co-signer with stable credit can unlock standard-market rates.</p>"
    },
    {
      slug: "used-car-inspection-checklist-socal",
      title: "The Used Car Inspection Checklist for Ventura & LA Buyers",
      category: "Car Education",
      summary: "What to look for during your test drive. A simple mechanical checklist written in plain English to ensure your family's safety and peace of mind.",
      keywords: ["used car inspection checklist", "inspecting used vehicle", "test drive commuter car"],
      readTime: "5 min read",
      date: "May 04, 2026",
      content: "<h2>The Human Guide to Inspecting a Used Commuter Car</h2><p>Print this checklist or pull it up on your phone during your next test drive.</p><h3>1. Under the Hood</h3><ul><li><strong>Engine Oil:</strong> Should be honey-gold or brown — not black tar or milky white.</li><li><strong>Coolant:</strong> Should be bright green, orange, or pink — not rusty or oily.</li></ul><h3>2. Tires & Braking</h3><ul><li><strong>Tread Depth:</strong> Penny test — if you see Lincoln's full head, replace the tires.</li><li><strong>Brake Test:</strong> Firm braking from 35 MPH should feel straight with no pedal pulsation.</li></ul><h3>3. Frame & History</h3><p>Verify the VIN on Carfax or AutoCheck to flag any salvage declarations or structural accidents.</p>"
    },
    {
      slug: "first-time-used-car-buyer-guide-socal",
      title: "First-Time Used Car Buyer Guide for Southern California",
      category: "Buyer Guide",
      summary: "Everything a first-time or teen driver needs to know about choosing a car, understanding insurance, and staying within budget.",
      keywords: ["first-time used car buyer", "first car SoCal", "teen driver reliable car"],
      readTime: "5 min read",
      date: "April 28, 2026",
      content: "<h2>Congratulations on Getting Your First Car!</h2><p>Buying your first car is a major milestone. At Apollo Auto, we specialize in taking the stress out of this transition for teens, college students, and parents.</p><h3>Step 1: Total Cost of Ownership</h3><p>Budget for insurance (call an agent before picking a model), fuel costs, and monthly payments together. Japanese compacts are significantly cheaper to insure.</p><h3>Step 2: Dealer vs. Private Seller</h3><p>California private-party sales are strictly as-is with zero consumer protections. Purchasing from Apollo Auto means a vehicle that has passed inspection, has a clean title, and is smog-certified.</p><h3>Step 3: Documents</h3><p>Bring your California Driver License, a recent paycheck stub, active insurance, and a co-signer to skip high interest rates.</p>"
    },
    {
      slug: "used-car-trade-in-tips-california",
      title: "Used Car Trade-In Tips in California",
      category: "Trade-In",
      summary: "How to maximize the value of your older vehicle, handle DMV release forms, and save money on sales taxes.",
      keywords: ["used car trade-in California", "trade in older sedan", "valuing my trade in"],
      readTime: "4 min read",
      date: "April 15, 2026",
      content: "<h2>Get the Most for Your Old Family Car</h2><p>Trading in at Apollo Auto is smart — it removes the stress of meeting strangers, and it acts as instant cash toward your down payment.</p><h3>1. Clean It Out</h3><p>30 minutes of vacuuming and wiping down the dashboard makes a significant difference in perceived value.</p><h3>2. Complete the California DMV NRL</h3><p>After handing us the keys, file a Notice of Transfer and Release of Liability online to protect yourself from future tickets or towing fees.</p><h3>3. Gather All Keys and Manuals</h3><p>Both keys and the factory manual can add $100–$200 of valuation weight.</p><h3>4. Bring Maintenance Records</h3><p>Receipts for recent battery replacement, tires, or transmission service prove the car was cared for and allow us to price it higher.</p>"
    }
  ]);
}

// ── Seed FAQs ──────────────────────────────────────────────────────────────
if (!fs.existsSync(FAQS_FILE)) {
  writeJson(FAQS_FILE, [
    { id: "faq-1",  category: "buying",    question: "How often is the inventory updated, and where can I view the actual cars in stock?",                    answer: "Our inventory is hosted on dedicated websites for each lot. Browse live stock at apolloauto-to.com (Simi Valley) and apolloauto-em.com (El Monte). New arrivals are listed almost every day." },
    { id: "faq-2",  category: "buying",    question: "Can I purchase a vehicle from the El Monte lot if I live in Simi Valley (or vice-versa)?",              answer: "Absolutely! We operate both lots as a single family. If you see a vehicle at either branch, give Tim a call and we will coordinate everything." },
    { id: "faq-3",  category: "buying",    question: "Do your used cars go through any safety and reliability checks?",                                        answer: "Yes. Every vehicle goes through a rigorous safety inspection covering brakes, tires, steering, transmission, and all vital mechanical parts." },
    { id: "faq-4",  category: "buying",    question: "Are there any hidden fees or unrequested dealer add-ons added to the price?",                           answer: "No. You pay the agreed vehicle price, actual DMV fees, local sales tax, and the standard $85 document processing fee. No forced add-ons." },
    { id: "faq-5",  category: "financing", question: "I have bad credit, no credit, or a past repossession. Can I still get financed?",                      answer: "Yes! We work with specialized subprime lenders who focus on your current ability to pay, not just your credit score." },
    { id: "faq-6",  category: "financing", question: "What documents do I need to bring to secure a bad-credit loan approval?",                              answer: "Bring: (1) California Driver's License, (2) two recent pay stubs or 3 months of bank statements, (3) utility bill for residency, (4) proof of insurance, (5) a list of 5 references." },
    { id: "faq-7",  category: "financing", question: "How much of a down payment will I need?",                                                              answer: "Many reliable commuter cars can be financed with $1,000–$2,000 down. A larger down payment lowers your monthly payment and improves your approval odds." },
    { id: "faq-8",  category: "financing", question: "Can I use a co-signer to get a lower interest rate?",                                                  answer: "Yes! A co-signer with stable credit or income is an excellent way to get approved instantly and lower your APR." },
    { id: "faq-9",  category: "financing", question: "Do you accept trade-ins, and how is the value determined?",                                            answer: "We love trade-ins! We evaluate your vehicle based on real-time KBB market data and its mechanical condition, then credit its full value toward your new purchase." },
    { id: "faq-10", category: "financing", question: "Can I trade in a car that I still owe money on?",                                                      answer: "Yes. We contact your lender for the payoff amount. If your car is worth more than you owe, the equity goes toward your new purchase. If not, we can often roll the difference into your new loan." },
    { id: "faq-11", category: "financing", question: "Will applying for financing hurt my credit score?",                                                    answer: "We sit down with you first, review your profile, and submit only to 1–2 lenders most likely to approve you at the best rate, minimizing unnecessary inquiries." },
    { id: "faq-12", category: "visiting",  question: "Do I need to make an appointment to take a test drive?",                                               answer: "Walk-ins are welcome (Mon–Sat, 9AM–6PM), but texting Tim ahead ensures the specific car you want is ready for you at the front." },
    { id: "faq-13", category: "visiting",  question: "Where exactly are your lots located, and is parking available?",                                       answer: "Simi Valley: 1555 Simi Town Center Way, Suite 420 (free retail parking). El Monte: 10915 Garvey Ave (easy front parking zone)." },
    { id: "faq-14", category: "visiting",  question: "Can we complete most of the buying process over the phone or text?",                                   answer: "Yes! Tim works through call or text to estimate payments, submit pre-approvals, and value trade-ins. When you visit, you just verify the car, test drive, sign, and drive home." },
    { id: "faq-15", category: "visiting",  question: "What is your response time for texts and form messages?",                                              answer: "Tim usually replies within 15–30 minutes during business hours, and by early next morning for late-night inquiries." },
    { id: "faq-16", category: "visiting",  question: "Is your dealership bilingual?",                                                                        answer: "Yes. We have friendly Spanish-speaking staff ready to translate every detail, explain financing, and make sure you feel completely comfortable." }
  ]);
}

// ── Seed Locations ─────────────────────────────────────────────────────────
if (!fs.existsSync(LOCATIONS_FILE)) {
  writeJson(LOCATIONS_FILE, [
    {
      id: "simi-valley",
      city: "Simi Valley", county: "Ventura County",
      phone: "8054043873", phoneDisplay: "(805) 404-3873",
      email: "apolloautous@gmail.com",
      address: "1555 Simi Town Center Way, Suite 420", zip: "93065",
      inventoryUrl: "https://apolloauto-to.com",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3294.2858694852924!2d-118.73602562427092!3d34.28042457307223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f131!3m3!1m2!1s0x80c2621ad70cf273%3A0xe67db5cf8cde81cf!2s1555%20Simi%20Town%20Center%20Way%2C%20Simi%20Valley%2C%20CA%2093065!5e0!3m2!1sen!2sus!4v1716800000000!5m2!1sen!2sus",
      hours: ["Monday - Saturday: 9:00 AM - 6:00 PM", "Sunday: Closed"],
      areasServed: ["Simi Valley", "Thousand Oaks", "Moorpark", "Camarillo", "Ventura", "Oxnard", "Chatsworth", "West Hills", "Porter Ranch", "San Fernando Valley"]
    },
    {
      id: "el-monte",
      city: "El Monte", county: "Los Angeles County",
      phone: "6262150440", phoneDisplay: "(626) 215-0440",
      email: "apolloautous@gmail.com",
      address: "10915 Garvey Ave", zip: "91733",
      inventoryUrl: "https://apolloauto-em.com",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.6599298492212!2d-118.041695!3d34.052673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f131!3m3!1m2!1s0x80c2d0f0aaaaaaab%3A0x7b5871f28b492b49!2s10915%20Garvey%20Ave%2C%20El%20Monte%2C%20CA%2091733!5e0!3m2!1sen!2sus!4v1716800000000!5m2!1sen!2sus",
      hours: ["Monday - Saturday: 9:00 AM - 6:00 PM", "Sunday: Closed"],
      areasServed: ["El Monte", "West Covina", "Baldwin Park", "Monterey Park", "Temple City", "Arcadia", "Rosemead", "Alhambra", "Los Angeles", "San Gabriel Valley"]
    }
  ]);
}

// Lazy load Gemini AI
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      console.warn("WARNING: GEMINI_API_KEY environment variable is missing or placeholder.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// API Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Apollo AI advisor endpoint
app.post("/api/ai/advisor", async (req, res) => {
  try {
    const { message, history, context } = req.body;
    const key = process.env.GEMINI_API_KEY;

    if (!key || key === "MY_GEMINI_API_KEY") {
      return res.json({
        text: "Hi there! I'm Tim's Virtual Advisor or Apollo Auto. We would love to help you find your next reliable family ride or daily commuter! **Please note: We happily share inventory between our locations. Make sure to contact Tim first to confirm that the specific car you want is available at your preferred location before visiting!**\n\nCheck out our live inventory choices right now to see what's currently in stock:\n\n* [Browse Simi Valley (Ventura County) Live Inventory](https://apolloauto-to.com)\n* [Browse El Monte (LA County / SGV) Live Inventory](https://apolloauto-em.com)\n\nWhether you need a gas-saver, a safe ride for a teen driver, or credit-rebuilding financing with a steady income, we have beautiful commuter cars with down payments starting near $1,000. Give Tim a call or text at (805) 404-3873 (Simi Valley) or (626) 215-0440 (El Monte), or submit our contact form, and we will get you on the road!"
      });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a warm, honest, family-owned used car digital advisor representing Tim, the owner of Apollo Auto.
Your tone is transparent, objective, reassuring, and direct. You never use sleazy car salesperson jargon ("Best deal!", "Act now!"), nor promise "guaranteed approval". Say "most customers who apply get approved based on steady income."

CRITICAL DIRECTIVE ON SHARED INVENTORY & PRE-VISIT CONTACT: Always inform the customer that we share inventory between our two locations (Simi Valley and El Monte). Tell them that to ensure a specific car is available and ready for them at their preferred lot when they arrive, they must contact Tim first (call or text) before making the drive.

CRITICAL DIRECTIVE ON SEARCH & INVENTORY LINKS: You must always proactively direct the customer to browse our live inventory choices to see what's in stock. Provide direct, highly visible markdown links so they can click and explore immediately:
* To browse our Ventura County stock, tell them to visit or click: [Browse Simi Valley Live Inventory](https://apolloauto-to.com)
* To browse our Los Angeles County / SGV stock, tell them to visit or click: [Browse El Monte Live Inventory](https://apolloauto-em.com)

You advocate for daily drivers, families, and first-time drivers looking for reliable transport in Southern California.
Our two locations are:
- Simi Valley (Ventura county) - (805) 404-3873. Inventory: [Browse Simi Valley Live Inventory](https://apolloauto-to.com)
- El Monte (Los Angeles county/SGV) - (626) 215-0440. Inventory: [Browse El Monte Live Inventory](https://apolloauto-em.com)

You help users:
1. Direct them to browse available inventory choices first, recommending they check live listings at apolloauto-to.com or apolloauto-em.com depending on where they live (LA vs Ventura), while keeping our shared inventory policy in mind.
2. Choose clean types of vehicles (e.g. reliable Japanese 4-cylinders like Corollas, Civics, Rogues, RAV4s) depending on family size, work commutes, or teen driver safety.
3. Direct them on financing checklists. Reassure bad-credit/repo buyers that subprime lenders evaluate income stability (proof of work like paystubs/bank statements), residency bills, and references, rather than credit scores alone.
4. Plainly explain contracts, DMV Release of Liability (NRL), and trade-ins based on KBB.

Keep your replies concise and easy to read using markdown bullets. Always ensure you include at least one relevant inventory markdown link in your response, and reiterate that they should call or text Tim first to confirm which lot the vehicle is on. Keep answers to around 3 paragraphs max. Do not exceed 200 words if possible. Do not output JSON.`;

    const contents = [];
    if (history && Array.isArray(history)) {
      for (const turn of history) {
        contents.push({
          role: turn.sender === 'user' ? 'user' : 'model',
          parts: [{ text: turn.text }]
        });
      }
    }
    
    // Add context to the message if present
    let finalPrompt = message;
    if (context) {
      finalPrompt = `[Context of user's search: ${JSON.stringify(context)}]\n\nUser Question: ${message}`;
    }
    
    contents.push({
      role: 'user',
      parts: [{ text: finalPrompt }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Advisor Error:", error);
    res.status(500).json({ error: "Failed to generate advice. Tim is always reachable directly by call." });
  }
});

// ── Feed ───────────────────────────────────────────────────────────────────
app.get("/api/feed", (_req, res) => {
  try { res.json(readJson(FEED_FILE)); } catch { res.status(500).json({ error: "Could not read feed." }); }
});

app.post("/api/feed", requireAuth, (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ error: "Title and Content are required." });
    const feed = readJson(FEED_FILE);
    const item = { id: "f-" + Date.now(), date: new Date().toISOString().split("T")[0], title, content };
    feed.unshift(item);
    writeJson(FEED_FILE, feed);
    res.json(item);
  } catch { res.status(500).json({ error: "Could not save announcement." }); }
});

app.delete("/api/feed/:id", requireAuth, (req, res) => {
  try {
    const feed = readJson(FEED_FILE).filter((f: any) => f.id !== req.params.id);
    writeJson(FEED_FILE, feed);
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Could not delete feed item." }); }
});

// ── Leads ──────────────────────────────────────────────────────────────────
app.get("/api/leads", requireAuth, (_req, res) => {
  try { res.json(readJson(LEADS_FILE)); } catch { res.status(500).json({ error: "Could not read leads." }); }
});

app.post("/api/leads", (req, res) => {
  try {
    const { name, phone, email, location, message, carInterest, creditStatus } = req.body;
    if (!name || !phone) return res.status(400).json({ error: "Name and phone number are required." });
    const leads = readJson(LEADS_FILE);
    const newLead = {
      id: "lead-" + Date.now(), date: new Date().toISOString(),
      name, phone, email: email || "N/A",
      location: location || "All locations",
      message: message || "Interested in used cars / financing",
      carInterest: carInterest || "General Commuter",
      creditStatus: creditStatus || "Needs Consultation"
    };
    leads.unshift(newLead);
    writeJson(LEADS_FILE, leads);
    console.log("LEAD CAPTURED FOR TIM:", newLead);
    res.json({ success: true, lead: newLead });
  } catch { res.status(500).json({ error: "Could not record lead." }); }
});

app.delete("/api/leads/:id", requireAuth, (req, res) => {
  try {
    const leads = readJson(LEADS_FILE).filter((l: any) => l.id !== req.params.id);
    writeJson(LEADS_FILE, leads);
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Could not delete lead." }); }
});

// ── Testimonials ───────────────────────────────────────────────────────────
app.get("/api/testimonials", (_req, res) => {
  try { res.json(readJson(TESTIMONIALS_FILE)); } catch { res.status(500).json({ error: "Could not read testimonials." }); }
});

app.post("/api/testimonials", requireAuth, (req, res) => {
  try {
    const { name, location, carModel, rating, date, initials, quote } = req.body;
    if (!name || !quote) return res.status(400).json({ error: "Name and quote are required." });
    const list = readJson(TESTIMONIALS_FILE);
    const item = { id: "t-" + Date.now(), name, location: location || "", carModel: carModel || "", rating: Number(rating) || 5, date: date || new Date().toISOString().split("T")[0], initials: initials || name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2), quote };
    list.unshift(item);
    writeJson(TESTIMONIALS_FILE, list);
    res.json(item);
  } catch { res.status(500).json({ error: "Could not save testimonial." }); }
});

app.put("/api/testimonials/:id", requireAuth, (req, res) => {
  try {
    const list = readJson(TESTIMONIALS_FILE).map((t: any) => t.id === req.params.id ? { ...t, ...req.body, id: t.id } : t);
    writeJson(TESTIMONIALS_FILE, list);
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Could not update testimonial." }); }
});

app.delete("/api/testimonials/:id", requireAuth, (req, res) => {
  try {
    writeJson(TESTIMONIALS_FILE, readJson(TESTIMONIALS_FILE).filter((t: any) => t.id !== req.params.id));
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Could not delete testimonial." }); }
});

// ── Articles ───────────────────────────────────────────────────────────────
app.get("/api/articles", (_req, res) => {
  try { res.json(readJson(ARTICLES_FILE)); } catch { res.status(500).json({ error: "Could not read articles." }); }
});

app.post("/api/articles", requireAuth, (req, res) => {
  try {
    const { title, category, summary, content, keywords, readTime, date } = req.body;
    if (!title || !content) return res.status(400).json({ error: "Title and content are required." });
    const list = readJson(ARTICLES_FILE);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now();
    const item = { slug, title, category: category || "Buyer Guide", summary: summary || "", content, keywords: Array.isArray(keywords) ? keywords : (keywords || "").split(",").map((k: string) => k.trim()).filter(Boolean), readTime: readTime || "5 min read", date: date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) };
    list.unshift(item);
    writeJson(ARTICLES_FILE, list);
    res.json(item);
  } catch { res.status(500).json({ error: "Could not save article." }); }
});

app.put("/api/articles/:slug", requireAuth, (req, res) => {
  try {
    const list = readJson(ARTICLES_FILE).map((a: any) => a.slug === req.params.slug ? { ...a, ...req.body, slug: a.slug } : a);
    writeJson(ARTICLES_FILE, list);
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Could not update article." }); }
});

app.delete("/api/articles/:slug", requireAuth, (req, res) => {
  try {
    writeJson(ARTICLES_FILE, readJson(ARTICLES_FILE).filter((a: any) => a.slug !== req.params.slug));
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Could not delete article." }); }
});

// ── FAQs ───────────────────────────────────────────────────────────────────
app.get("/api/faqs", (_req, res) => {
  try { res.json(readJson(FAQS_FILE)); } catch { res.status(500).json({ error: "Could not read FAQs." }); }
});

app.post("/api/faqs", requireAuth, (req, res) => {
  try {
    const { category, question, answer } = req.body;
    if (!question || !answer) return res.status(400).json({ error: "Question and answer are required." });
    const list = readJson(FAQS_FILE);
    const item = { id: "faq-" + Date.now(), category: category || "buying", question, answer };
    list.push(item);
    writeJson(FAQS_FILE, list);
    res.json(item);
  } catch { res.status(500).json({ error: "Could not save FAQ." }); }
});

app.put("/api/faqs/:id", requireAuth, (req, res) => {
  try {
    const list = readJson(FAQS_FILE).map((f: any) => f.id === req.params.id ? { ...f, ...req.body, id: f.id } : f);
    writeJson(FAQS_FILE, list);
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Could not update FAQ." }); }
});

app.delete("/api/faqs/:id", requireAuth, (req, res) => {
  try {
    writeJson(FAQS_FILE, readJson(FAQS_FILE).filter((f: any) => f.id !== req.params.id));
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Could not delete FAQ." }); }
});

// ── Locations ──────────────────────────────────────────────────────────────
app.get("/api/locations", (_req, res) => {
  try { res.json(readJson(LOCATIONS_FILE)); } catch { res.status(500).json({ error: "Could not read locations." }); }
});

app.put("/api/locations/:id", requireAuth, (req, res) => {
  try {
    const list = readJson(LOCATIONS_FILE).map((l: any) => l.id === req.params.id ? { ...l, ...req.body, id: l.id } : l);
    writeJson(LOCATIONS_FILE, list);
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Could not update location." }); }
});

// ── Admin Auth ─────────────────────────────────────────────────────────────
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  const adminEmail    = process.env.ADMIN_EMAIL    || "admin@apolloauto.us";
  const adminPassword = process.env.ADMIN_PASSWORD || "Apollo.1343";

  const validUser = username === "tim" || username === adminEmail;
  const validPass = password === adminPassword;

  if (validUser && validPass) {
    const token    = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + SESSION_TTL;
    activeSessions.set(token, expiresAt);
    res.json({ success: true, token, expiresAt });
  } else {
    res.status(401).json({ error: "Invalid username or password." });
  }
});

app.post("/api/admin/logout", (req, res) => {
  const token = req.headers["x-admin-token"] as string | undefined;
  if (token) activeSessions.delete(token);
  res.json({ success: true });
});

// Start server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Apollo Auto Web App running on http://localhost:${PORT}`);
  });
}

startServer();
