import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize files for mock persistence
const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");
const FEED_FILE = path.join(DATA_DIR, "feed.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Seed Feed Data if missing
if (!fs.existsSync(FEED_FILE)) {
  const initialFeed = [
    {
      id: "f-1",
      date: "2026-05-27",
      title: "Memorial Week Cash Specials!",
      content: "Save $500 off cash pricing on all 4-cylinder commuter sedans at both our Simi Valley and El Monte lots this week. Come see Tim for details!"
    },
    {
      id: "f-2",
      date: "2026-05-20",
      title: "New Subprime Lending Partners Approved",
      content: "We just qualified with two new national credit-rebuilding auto lenders. We can now finance past repossessions even faster with down payments starting at $1,000."
    }
  ];
  fs.writeFileSync(FEED_FILE, JSON.stringify(initialFeed, null, 2));
}

// Seed empty Leads file if missing
if (!fs.existsSync(LEADS_FILE)) {
  fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2));
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

// Live Feed Endpoint (Get)
app.get("/api/feed", (req, res) => {
  try {
    if (fs.existsSync(FEED_FILE)) {
      const data = fs.readFileSync(FEED_FILE, "utf-8");
      res.json(JSON.parse(data));
    } else {
      res.json([]);
    }
  } catch (err) {
    res.status(500).json({ error: "Could not read feed." });
  }
});

// Live Feed Endpoint (Post / Admin)
app.post("/api/feed", (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and Content are required." });
    }
    
    let feed = [];
    if (fs.existsSync(FEED_FILE)) {
      feed = JSON.parse(fs.readFileSync(FEED_FILE, "utf-8"));
    }
    
    const newPost = {
      id: "f-" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      title,
      content
    };
    
    feed.unshift(newPost); // Add to beginning
    fs.writeFileSync(FEED_FILE, JSON.stringify(feed, null, 2));
    res.json(newPost);
  } catch (err) {
    res.status(500).json({ error: "Could not save announcement." });
  }
});

// Leads Endpoint (Post Lead Form)
app.post("/api/leads", (req, res) => {
  try {
    const { name, phone, email, location, message, carInterest, creditStatus } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: "Name and phone number are required." });
    }

    let leads = [];
    if (fs.existsSync(LEADS_FILE)) {
      leads = JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8"));
    }

    const newLead = {
      id: "lead-" + Date.now(),
      date: new Date().toISOString(),
      name,
      phone,
      email: email || "N/A",
      location: location || "All locations",
      message: message || "Interested in used cars / financing",
      carInterest: carInterest || "General Commuter",
      creditStatus: creditStatus || "Needs Consultation"
    };

    leads.unshift(newLead);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));

    // FormSubmit.co placeholder log or message
    console.log("LEAD CAPTURED FOR TIM:", newLead);

    res.json({ success: true, lead: newLead });
  } catch (err) {
    res.status(500).json({ error: "Could not record lead." });
  }
});

// Leads Endpoint (Get / Admin)
app.get("/api/leads", (req, res) => {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, "utf-8");
      res.json(JSON.parse(data));
    } else {
      res.json([]);
    }
  } catch (err) {
    res.status(500).json({ error: "Could not read leads." });
  }
});

// Admin Authentication (Simple seed or local simulation)
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || "admin@apolloauto.us";
  const adminPassword = process.env.ADMIN_PASSWORD || "Apollo.1343";

  if (
    (username === "tim" || username === adminEmail) && 
    password === adminPassword
  ) {
    res.json({ success: true, token: "apollo-cms-auth-session" });
  } else {
    res.status(401).json({ error: "Invalid username or password. Please try again." });
  }
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
