/**
 * Used Car Dealership Landing Page & Hub Data Types
 */

export interface LocationInfo {
  id: 'simi-valley' | 'el-monte';
  city: string;
  county: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  address: string;
  suite?: string;
  zip: string;
  mapEmbedUrl: string;
  inventoryUrl: string;
  hours: string[];
  areasServed: string[];
}

export interface FAQItem {
  id: string;
  category: 'buying' | 'financing' | 'visiting';
  question: string;
  answer: string;
}

export interface BlogArticle {
  slug: string;
  title: string;
  category: string;
  summary: string;
  content: string; // Markdown or simple HTML
  keywords: string[];
  readTime: string;
  date: string;
}

export interface ContractSection {
  id: string;
  title: string;
  documentName: string;
  description: string;
  realText: string;
  plainEnglish: string;
  safeguardNote: string;
}

export interface GlossaryItem {
  term: string;
  definition: string;
  context: string;
}

export const LOCATIONS: Record<string, LocationInfo> = {
  'simi-valley': {
    id: 'simi-valley',
    city: 'Simi Valley',
    county: 'Ventura County',
    phone: '8054043873',
    phoneDisplay: '(805) 404-3873',
    email: 'apolloautous@gmail.com',
    address: '1555 Simi Town Center Way, Suite 420',
    zip: '93065',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3294.2858694852924!2d-118.73602562427092!3d34.28042457307223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f131!3m3!1m2!1s0x80c2621ad70cf273%3A0xe67db5cf8cde81cf!2s1555%20Simi%20Town%20Center%20Way%2C%20Simi%20Valley%2C%20CA%2093065!5e0!3m2!1sen!2sus!4v1716800000000!5m2!1sen!2sus',
    inventoryUrl: 'https://apolloauto-to.com',
    hours: [
      'Monday - Saturday: 9:00 AM - 6:00 PM',
      'Sunday: Closed'
    ],
    areasServed: ['Simi Valley', 'Thousand Oaks', 'Moorpark', 'Camarillo', 'Ventura', 'Oxnard', 'Chatsworth', 'West Hills', 'Porter Ranch', 'San Fernando Valley']
  },
  'el-monte': {
    id: 'el-monte',
    city: 'El Monte',
    county: 'Los Angeles County',
    phone: '6262150440',
    phoneDisplay: '(626) 215-0440',
    email: 'apolloautous@gmail.com',
    address: '10915 Garvey Ave',
    zip: '91733',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.6599298492212!2d-118.041695!3d34.052673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f131!3m3!1m2!1s0x80c2d0f0aaaaaaab%3A0x7b5871f28b492b49!2s10915%20Garvey%20Ave%2C%20El%20Monte%2C%20CA%2091733!5e0!3m2!1sen!2sus!4v1716800000000!5m2!1sen!2sus',
    inventoryUrl: 'https://apolloauto-em.com',
    hours: [
      'Monday - Saturday: 9:00 AM - 6:00 PM',
      'Sunday: Closed'
    ],
    areasServed: ['El Monte', 'West Covina', 'Baldwin Park', 'Monterey Park', 'Temple City', 'Arcadia', 'Rosemead', 'Alhambra', 'Los Angeles', 'San Gabriel Valley']
  }
};

export const FAQ_ITEMS: FAQItem[] = [
  // Buying & Inventory
  {
    id: 'faq-1',
    category: 'buying',
    question: 'How often is the inventory updated, and where can I view the actual cars in stock?',
    answer: 'Our inventory is hosted on dedicated websites for each of our lots. You can browse live stock at apolloauto-to.com for our Simi Valley/Ventura County vehicles, and apolloauto-em.com for our El Monte/Los Angeles County vehicles. New arrivals are processed and listed almost every day.'
  },
  {
    id: 'faq-2',
    category: 'buying',
    question: 'Can I purchase a vehicle from the El Monte lot if I live in Simi Valley (or vice-versa)?',
    answer: 'Absolutely! We operate both lots as a single family and we can easily assist you in completing paperwork for a vehicle located at either branch. If you see a vehicle you love on our El Monte inventory site but want to negotiate or sign with us in Simi Valley, just give Tim a call or text and we will coordinate.'
  },
  {
    id: 'faq-3',
    category: 'buying',
    question: 'Do your used cars go through any safety and reliability checks?',
    answer: 'Yes. Every single vehicle we sell goes through a rigorous safety inspection to ensure brakes, tire tread, steering, transmission components, and all vital mechanical parts are solid. We focus on stocking sensible, highly reliable daily drivers suitable for families and first-time drivers.'
  },
  {
    id: 'faq-4',
    category: 'buying',
    question: 'Are there any hidden fees or unrequested dealer add-ons added to the price?',
    answer: 'No. Our business is built on transparency and respect. Unlike big franchise dealers or aggressive used car lots, we do not sneak in mandatory "interior protection packages," "anti-theft window etching," or other high-markup add-ons. You pay the agreed vehicle price, actual state DMV fees, local sales tax, and the standard document processing fee ($85 in California).'
  },
  // Financing & Trade-ins
  {
    id: 'faq-5',
    category: 'financing',
    question: 'I have bad credit, no credit, or a past repossession. Can I still get financed?',
    answer: 'Yes! We work with specialized subprime lenders who look past your credit score. They focus on your current ability to pay (proof of stable income or employment). We have helped hundreds of Southern California buyers with bankruptcy, repossession, first-time credit, or cash-paid jobs get into reliable transport.'
  },
  {
    id: 'faq-6',
    category: 'financing',
    question: 'What documents do I need to bring to secure a bad-credit loan approval?',
    answer: 'To guarantee a same-day approval from our lenders, please bring: 1) Your California Driver’s License or ID, 2) Your two most recent paycheck stubs (or 3 months of bank statements if self-employed), 3) A recent utility bill or phone bill under your name to prove residency, 4) Proof of auto insurance, and 5) A list of 5 references (names, addresses, and phone numbers).'
  },
  {
    id: 'faq-7',
    category: 'financing',
    question: 'How much of a down payment will I need?',
    answer: 'Down payments vary based on the vehicle selected and your credit profile. Many of our reliable commuter cars can be financed with a reasonable down payment ($1,000 to $2,000). Providing a larger down payment always lowers your monthly payment and increases your chances of getting highly favorable bank terms.'
  },
  {
    id: 'faq-8',
    category: 'financing',
    question: 'Can I use a co-signer to get a lower interest rate?',
    answer: 'Yes! Having a co-signer with established credit or a solid income is an excellent way to get approved instantly, lower your APR, and keep your monthly payments minimal. We will walk you and your co-signer through the joint application clearly.'
  },
  {
    id: 'faq-9',
    category: 'financing',
    question: 'Do you accept trade-ins, and how is the value determined?',
    answer: 'We love trade-ins! We accept older sedans, SUVs, trucks, and family cars in almost any state. We evaluate your vehicle based on real-time market data matching Kelly Blue Book (KBB) guidelines and test its mechanical condition, and credit its full value directly toward your new purchase or down payment.'
  },
  {
    id: 'faq-10',
    category: 'financing',
    question: 'Can I trade in a car that I still owe money on?',
    answer: 'Yes, we can help pay off your existing loan balance. We will contact your current lender to get the exact payoff amount. If your car is worth more than you owe, that active equity goes toward your new purchase. If you owe more than it’s worth, we can often roll the difference into your new, highly sensible loan.'
  },
  {
    id: 'faq-11',
    category: 'financing',
    question: 'Will applying for financing hurt my credit score?',
    answer: 'When we submit your application to our lending partners, they make a standard credit inquiry. While this is normal when purchasing a car, we always sit down with you first, review your profile, and selectively submit only to the 1-2 lenders most likely to approve you at the absolute lowest rate, avoiding unnecessary inquiries.'
  },
  // Visiting & Lots
  {
    id: 'faq-12',
    category: 'visiting',
    question: 'Do I need to make an appointment to take a test drive?',
    answer: 'While walk-ins are completely welcome during our operating hours (Monday - Saturday, 9:00 AM - 6:00 PM), calling or texting Tim ahead of time is highly recommended! This guarantees the specific car you want to see is right at the front, washed, and ready for you to take out immediately.'
  },
  {
    id: 'faq-13',
    category: 'visiting',
    question: 'Where exactly are your lots located, and is parking available?',
    answer: 'Our Simi Valley branch is located in Ventura County at 1555 Simi Town Center Way, Suite 420. There is free retail and visitor parking directly outside. Our El Monte branch lies in the heart of the San Gabriel Valley at 10915 Garvey Ave, with an easily accessible front parking zone for guest arrivals.'
  },
  {
    id: 'faq-14',
    category: 'visiting',
    question: 'Can we complete most of the buying process over the phone or text?',
    answer: 'Yes! Tim works directly with customers through call or text to estimate monthly payments, submit financing pre-approvals, and value trade-ins. You can complete almost the entire pre-visit phase on your mobile phone, meaning when you visit the lot, you only need to verify the car in person, test drive, sign, and drive home!'
  },
  {
    id: 'faq-15',
    category: 'visiting',
    question: 'What is your responsive time for texts and form messages?',
    answer: 'We pride ourselves on responsive, family-style communication. Tim usually replies to all direct text messages and website form submissions within 15 to 30 minutes during business hours, and by early next morning for late-night inquiries.'
  },
  {
    id: 'faq-16',
    category: 'visiting',
    question: 'Is your dealership bilingual?',
    answer: 'Yes, our El Monte and Simi Valley teams serve the diverse, wonderful communities of Southern California. We have friendly Spanish-speaking staff ready to translate every single detail, explain financing, look over paperwork, and make sure you feel completely comfortable.'
  }
];

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: 'what-to-bring-used-car-california',
    title: 'What to Bring When Buying a Used Car in California',
    category: 'Buyer Guide',
    summary: 'A complete, foolproof checklist of licensing, insurance, proof of income, and residency documents required to drive off the lot with no delays.',
    keywords: ['buying used car California', 'documents to buy a car', 'what to bring to dealership'],
    readTime: '4 min read',
    date: 'May 15, 2026',
    content: `
      <h2>The Practical California Used Car Buyer’s Checklist</h2>
      <p>Driving home in your new-to-you car should be an exciting moment, not a lesson in DMV paperwork delays. Whether you have perfect credit or are working with our subprime lenders in Ventura or Los Angeles County to rebuild it, bringing the right folder of documents is key to a smooth, same-day process.</p>
      
      <p>Here is what you need to organize before you hand the keys over to Tim for your trade-in and sit down to sign:</p>

      <h3>1. A Valid Drivers license</h3>
      <p>This is standard but essential. To drive any car off our lot, you must possess a valid, active government-issued driver’s license. If you have an out-of-state license, we can still process your purchase, but have your secondary photo ID handy just in case.</p>

      <h3>2. Up-to-Date Auto Insurance</h3>
      <p>California law requires all drivers to carry active auto liability insurance. If you already have a policy, bring your proof card or digital app binder, as most insurance companies automatically extend coverage to your newly purchased vehicle for a grace period of 7 to 30 days. If you do not have active insurance, don’t stress! We can put you in touch with local Southern California agents who will set up a solid, low-cost policy right there at our desk before you sign.</p>

      <h3>3. Proof of Income (The Paystub Rule)</h3>
      <p>If you are applying for subprime or credit-rebuilding financing, banks want to verify that you can comfortably pay the monthly note. Please bring:
        <ul>
          <li><strong>W2 Employees:</strong> Your two most recent official paycheck stubs showing Year-To-Date (YTD) earnings.</li>
          <li><strong>Cash/Self-Employed:</strong> The last three months of personal or business bank statements (showing steady deposits).</li>
          <li><strong>Alternative Income:</strong> Award letters for SSI, disability, child support, or pension payouts.</li>
        </ul>
      </p>

      <h3>4. Residency Verification</h3>
      <p>Lenders want to confirm your address to comply with federal identity rules and coordinate plates. Bring a physical or digital copy of a utility bill (gas, electric, solid waste, water) or home internet/phone bill dated within the last 30 days showing your exact home address under your legal name.</p>

      <h3>5. Down Payment Funding</h3>
      <p>We accept cashier’s checks, major debit cards, and cash. If you plan to make your down payment with a debit card, make sure to call your bank beforehand to verify or temporarily raise your daily transaction limit, as most banks default to a $1,000 threshold for card swipes.</p>
    `
  },
  {
    slug: 'bad-credit-used-car-financing-socal',
    title: 'Bad Credit Used Car Financing in Ventura & LA Counties',
    category: 'Financing',
    summary: 'Struggling with past repossessions, medical bills, or bankruptcy? Learn how subprime loans work and how you can comfortably secure a reliable car.',
    keywords: ['bad credit used car financing', 'credit rebuilding SoCal', 'no credit auto loan'],
    readTime: '6 min read',
    date: 'May 10, 2026',
    content: `
      <h2>Rebuilding Credit Through a Sensible Car Loan</h2>
      <p>At Apollo Auto, we strongly believe that credit struggles in the past should not prevent you from possessing a safe, highly reliable vehicle to commute to work, drop your kids off at school, and live a peaceful life. Our two locations in Simi Valley and El Monte deal directly with banks specialized in "second chance" lending.</p>

      <h3>Why Credit Scores Don’t Tell the Whole Story</h3>
      <p>Traditional big franchise car lots use automatic computer algorithms that instantly reject buyers with credit scores under 580, past foreclosures, or repossessions. Our specialized subprime lenders do things differently. They look at your *current stability*:
        <ul>
          <li>Are you currently gainfully employed or have a steady flow of monthly deposits?</li>
          <li>Have you lived at your current Southern California residence for more than a few months?</li>
          <li>Do you have a realistic down payment or a trade-in to equity-balance the risk?</li>
        </ul>
      </p>

      <h3>Three Critical Steps to Secure Instant Bank Approvals</h3>
      <p>If you have been turned down elsewhere, don’t lose hope. Following these three guidelines will maximize your likelihood of a fast approval with affordable rates:</p>
      
      <h4>1. Size Up Your Down Payment</h4>
      <p>A down payment acts as your investment in the loan. Even modest down payments ($1,000 to $1,500) significantly lower the bank’s risk. It proves commitment and instantly lowers your monthly bills and overall interest charge.</p>

      <h4>2. Pick a Sensible Daily Driver</h4>
      <p>Lenders are much more eager to approve subprime loans on highly reliable, practical vehicles (like 4-cylinder Toyota Corolla, Honda Civic, or Nissan Rogue) rather than high-mileage sports cars or luxury SUVs. Focus on fuel economy and mechanical durability to ensure your pocketbook is never strained.</p>

      <h4>3. Use a Strong Co-Signer</h4>
      <p>If you have an active repossession that occurred in the last year, adding a relative or trusted friend with stable history as a co-signer is a powerful way to override bad marks and unlock standard-market interest rates.</p>

      <p>Remember, successfully paying off an auto loan on time is the single fastest way to raise your credit score. Every on-time monthly payment is fed directly into the major credit bureaus, proving you are a highly reliable borrower!</p>
    `
  },
  {
    slug: 'used-car-inspection-checklist-socal',
    title: 'The Used Car Inspection Checklist for Ventura & LA Buyers',
    category: 'Car Education',
    summary: 'What to look for during your test drive. A simple mechanical checklist written in plain English to ensure your family’s safety and peace of mind.',
    keywords: ['used car inspection checklist', 'inspecting used vehicle', 'test drive commuter car'],
    readTime: '5 min read',
    date: 'May 04, 2026',
    content: `
      <h2>The Human Guide to Inspecting a Used Commuter Car</h2>
      <p>If you are shopping around Southern California for a reliable commuter, you want to make sure you are getting an honest car free from hidden defects. While we perform extensive mechanical trials on every vehicle at Apollo Auto before listing, we want you to feel fully empowered to examine any car on any lot.</p>

      <p>Print this checklist or pull it up on your phone during your next test drive:</p>

      <h3>1. Under the Hood (Engine & Fluids)</h3>
      <ul>
        <li><strong>Engine Oil:</strong> Pull the dipstick, wipe it, reinsert, and check. The oil should be honey-gold or brown. If it resembles thick black tar, the car has missed vital servicing. If it looks milky or white, run! (This indicates a leaking head gasket).</li>
        <li><strong>Coolant:</strong> Peek at the plastic expansion reservoir. The fluid should be bright green, orange, or pink. Gritty, rusty, or oily coolant means cooling system neglect.</li>
        <li><strong>Belts & Hoses:</strong> Squeeze the main black cooling hoses when the engine is *cold*. They should feel firm but pliable, free from cracks, bulges, or dry-rot.</li>
      </ul>

      <h3>2. Tires & Braking</h3>
      <ul>
        <li><strong>Tread Depth:</strong> Place a standard penny upside down into several tread grooves. If you can see the top of Lincoln’s head, the tires have less than 2/32" of tread and must be replaced immediately.</li>
        <li><strong>Even Wear:</strong> Look across the tire face. If the inner edge is bald but the outer edge has deep tread, the car has a faulty wheel alignment or worn suspension parts.</li>
        <li><strong>Brake Test:</strong> During your test drive, find a quiet side street, ensure no one is behind you, and brake firmly from 35 MPH. The vehicle should brake in a straight, confident line. If you feel a shaking pulsation through the pedal, the brake rotors are warped.</li>
      </ul>

      <h3>3. Frame, Rust, & History</h3>
      <p>Southern California is famous for preserving steel since we don’t salt our roads, but always check underneath for rust if the car originally came from a snowy state. Most importantly, verify the VIN (Vehicle Identification Number) against a trusted history provider like Carfax or AutoCheck. These tools will flag previous fleet usage, severe salvage declarations, or structural accidents instantly.</p>
    `
  },
  {
    slug: 'first-time-used-car-buyer-guide-socal',
    title: 'First-Time Used Car Buyer Guide for Southern California',
    category: 'Buyer Guide',
    summary: 'Everything a first-time or teen driver needs to know about choosing a car, understanding insurance, and staying within budget.',
    keywords: ['first-time used car buyer', 'first car SoCal', 'teen driver reliable car'],
    readTime: '5 min read',
    date: 'April 28, 2026',
    content: `
      <h2>Congratulations on Getting Your First Car!</h2>
      <p>Buying your very first car is an unforgettable milestone. It represents freedom, career mobility, and independence. However, the dealership world can be incredibly intimidating for new drivers. At Apollo Auto, we specializes in taking the mystery and stress out of this transition, especially for teens, college students, and parents searching for a safe ride.</p>

      <p>Here is our plain-English guide to getting behind the wheel with total confidence:</p>

      <h3>Step 1: Focus on Total Cost of Ownership (not just the payment)</h3>
      <p>When budgeting for your first vehicle, make sure to consider:
        <ul>
          <li><strong>Auto Insurance:</strong> First-time and younger drivers naturally pay higher premiums in SoCal. Call an agent to estimate your insurance before deciding on a vehicle model. Solid, sensible Japanese compacts (Corollas, Civics, Sentras) are significantly cheaper to insure than sporty coupes or heavy SUVs.</li>
          <li><strong>Fuel Commutes:</strong> If you commute from Simi Valley to LA, choose a fuel-efficient 4-cylinder engine that gets over 30 MPG to avoid spending your hard-earned cash at the pump.</li>
        </ul>
      </p>

      <h3>Step 2: Understand Dealership vs Private Sellers</h3>
      <p>While buying a car off a random online listing service might seem cheaper, California private-party sales offer zero consumer protections. They are strictly "as-is" and if it breaks down the next day, you have no recourse. Purchasing from a family dealer like Apollo Auto means you get a vehicle that has passed inspection, has a clean legal title, is smog-certified by state law, and is supported by friendly humans you can contact whenever you have questions.</p>

      <h3>Step 3: What Documents Must You Prepare?</h3>
      <p>As a first-time buyer with sparse credit, bring your California Driver License or active Permit, a reliable paycheck stub showing steady work, active insurance binder, and a co-signer if you want to skip high interest rates and build your score the right way.</p>
    `
  },
  {
    slug: 'used-car-trade-in-tips-california',
    title: 'Used Car Trade-In Tips in California',
    category: 'Trade-In',
    summary: 'How to maximize the value of your older vehicle, handle DMV release forms, and save money on sales taxes.',
    keywords: ['used car trade-in California', 'trade in older sedan', 'valuing my trade in'],
    readTime: '4 min read',
    date: 'April 15, 2026',
    content: `
      <h2>Get the Absolute Most for Your Old Family Car</h2>
      <p>If you are upgrading to a safer, more reliable commuter, trading in your older car at Apollo Auto is an incredibly smart financial move. It simplifies your life by removing the stress of meeting strangers from online classifieds, and it acts as instant cash toward your down payment.</p>

      <p>Here are our expert tips for getting the maximum value for your trade-in:</p>

      <h3>1. Clean It Out (First Impressions Matter)</h3>
      <p>You do not need to spend hundreds of dollars on a professional dealer-grade detailing job, but spending 30 minutes removing personal clutter, throwing away trash, vacuuming the carpets, and wiping down the dashboard makes an enormous difference. A clean car signals to a dealer that the vehicle was well-maintained and respected by its owner.</p>

      <h3>2. Complete the California DMV Release of Liability (Crucial!)</h3>
      <p>When you trade or sell your car to us, we handle all DMV title registration forms for you. However, *always* complete a <strong>Notice of Transfer and Release of Liability (NRL)</strong> online immediately after handing us the keys. This legally registers with the Sacramento DMV that you no longer own the vehicle, protecting you from future parking tickets, toll violations, or towing fees incurred by the next buyer.</p>

      <h3>3. Gather All Keys and Manuals</h3>
      <p>Does your older car have a spare key hidden in a drawer, or the original factory owner’s manual in the glovebox? Bringing these along significantly boosts the usability and value of the car. Proving you have both keys can actually add $100 to $200 of valuation weight!</p>

      <h3>4. Keep Honest Maintenance Records</h3>
      <p>If you have folder receipts for a recent battery replacement, new tires, or transmission service, bring them in! It proves the car has been loved and allows us to comfortably price your trade-in higher since we won’t need to repeat those expensive fixes.</p>
    `
  }
];

export const CONTRACT_SECTIONS: ContractSection[] = [
  {
    id: 'contract-apr',
    title: 'Truth in Lending: The Fed Box',
    documentName: 'California Standard Retail Installment Contract (Form 553-CA-ARB)',
    description: 'This is the federally-mandated box displaying your precise, binding lending rates in plain text.',
    realText: 'FEDERAL TRUTH IN LENDING DISCLOSURES: ANNUAL PERCENTAGE RATE (The cost of your credit as a yearly rate), FINANCE CHARGE (The dollar amount the credit will cost you), AMOUNT FINANCED (The amount of credit provided to you on your behalf), TOTAL OF PAYMENTS (The amount you will have paid after you have made all payments as scheduled).',
    plainEnglish: 'We sit down and point out these four figures before you sign. This box summarizes exactly what the loan costs in simple dollar bills: what you borrow, the total interest to be paid over the life of the loan (assuming you do not pay it off early), and your steady monthly installment amount.',
    safeguardNote: 'No surprises here. There are no prepayment penalties in California, meaning if you pay off your loan early, you instantly save on the remaining finance charges.'
  },
  {
    id: 'contract-warranty',
    title: 'As-Is / Dealer Warranty Disclaimer',
    documentName: 'Buyers Guide (Federal Trade Commission mandated sticker)',
    description: 'Defines the exact warranty coverage or lack thereof on a pre-owned vehicle.',
    realText: 'AS IS - NO DEALER WARRANTY. THE DEALER DOES NOT PROVIDE ANY WARRANTY FOR REPAIRS AFTER SALE. YOU MUST PAY FOR ANY REPAIRS NEEDED TO THE VEHICLE.',
    plainEnglish: 'Standard state law means used vehicles are sold "As-Is". This means future wear-and-tear repairs are your responsibility once you drive off the lot. However, we provide optional, high-quality, third-party service contracts (auto warranties) that cover drivetrain, engine, and electronic parts for up to 3 years.',
    safeguardNote: 'Tim always checks the car over first. We also welcome you to bring your own personal mechanic to inspect any car on our lots because we believe in complete honesty.'
  },
  {
    id: 'contract-insurance',
    title: 'Agreement to Provide Physical Damage Insurance',
    documentName: 'California Contract Section 4 - Insurance Coverages',
    description: 'Requires the buyer to maintain active collision and comprehensive insurance.',
    realText: 'YOU AGREE TO KEEP VEHICLE INSURED AGAINST LOSS OR DAMAGE TO THE VEHICLE in an amount sufficient to cover the unpaid balance. You may choose the person through whom the insurance is written. If you do not have insurance, we may (but are not required to) obtain it at your expense.',
    plainEnglish: 'Since the bank has a financial stake in your car until it is paid off, they require full-coverage insurance (not just basic liability). This protects you in case of a major accident, theft, or fire.',
    safeguardNote: 'We assist you in comparing rates on the spot to make sure your insurance premium is affordable and fits snugly into your overall driving budget.'
  },
  {
    id: 'contract-cosigner',
    title: 'Notice to Co-Signer / Joint Buyers',
    documentName: 'California Civil Code Section 1799.91',
    description: 'Explains the legal commitment taken on by a co-signer helping a family member get approved.',
    realText: 'NOTICE TO CO-SIGNER: You are being asked to guarantee this debt. As a co-signer, you will have to pay the debt if the buyer does not. You may have to pay up to the full amount of the debt, plus late fees or collection costs.',
    plainEnglish: 'If you co-sign to help a family member or first-time driver secure their car, you are equally responsible for the loan. Every on-time payment benefits BOTH of your credit scores, helping your family member build their credit history step-by-step.',
    safeguardNote: 'We walk both joint applicants through the payment schedule to set up auto-pay, ensuring your credit is fully insulated and protected.'
  }
];

export const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    term: 'APR (Annual Percentage Rate)',
    definition: 'The annual cost of borrowing money, expressed as a percentage of the total loan amount. It includes the interest rate plus any mandatory fees.',
    context: 'At Apollo Auto, we explain the APR transparently and match you with lenders who offer the lowest rate your income and history allow.'
  },
  {
    term: 'As-Is',
    definition: 'A legal status indicating that the used car is sold in its current state, and the dealer is not legally bound to fix unexpected wear-and-tear after purchase.',
    context: 'While standard for Southern California used cars, we SMOG-certify and exhaustively inspect all daily drivers to prevent early repairs.'
  },
  {
    term: 'Form 553-CA-ARB',
    definition: 'The standard California car purchase contract. It is highly regulated, standard across almost all franchised and independent SoCal dealerships, and includes all finance and safety disclosures in a single long yellow sheet.',
    context: 'Tim uses this exact standard form with zero modifications, protecting you from weird, custom lot contracts.'
  },
  {
    term: 'Smog Certification',
    definition: 'A state-mandated exhaust and emission system check. In California, used car dealers are legally obligated to Smog-test and pass every retail vehicle before presenting it to the buyer.',
    context: 'Every vehicle sold at our Simi Valley and El Monte lots is fully smogged and officially reported to the DMV before your pick-up.'
  },
  {
    term: 'Title (Pink Slip)',
    definition: 'The official state document proving ownership of a vehicle. When you finance, the bank holds the title as a lienholder. When you trade in, you must sign your title over to us.',
    context: 'If you have lost your pink slip for a trade-in, Tim can print and file a "Duplicate Title" form with the DMV on-site to save you a trip.'
  }
];
