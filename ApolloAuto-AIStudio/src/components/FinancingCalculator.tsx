import React, { useState, useEffect } from 'react';
import { Landmark, DollarSign, Calendar, Percent, Compass, Info, FileText, ShieldAlert, Check, HeartHandshake } from 'lucide-react';

export default function FinancingCalculator() {
  const [vehiclePrice, setVehiclePrice] = useState<number>(14500);
  const [downPayment, setDownPayment] = useState<number>(2000);
  const [loanTerm, setLoanTerm] = useState<number>(48);
  const [interestRate, setInterestRate] = useState<number>(9.9);

  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalFinancedAmount, setTotalFinancedAmount] = useState<number>(0);

  const [salesTaxRate, setSalesTaxRate] = useState<number>(8.25);
  const [includeFeesInLoan, setIncludeFeesInLoan] = useState<boolean>(true);
  const dmvFees = 400;

  const salesTaxAmount = Math.round(vehiclePrice * (salesTaxRate / 100));
  const totalPurchasePrice = vehiclePrice + salesTaxAmount + dmvFees;

  // Re-calculate the payment details whenever state variables tweak
  useEffect(() => {
    const basePrice = includeFeesInLoan ? totalPurchasePrice : vehiclePrice;
    const principal = Math.max(0, basePrice - downPayment);
    setTotalFinancedAmount(principal);

    if (principal === 0) {
      setMonthlyPayment(0);
      setTotalInterest(0);
      return;
    }

    if (interestRate === 0) {
      setMonthlyPayment(Math.round(principal / loanTerm));
      setTotalInterest(0);
      return;
    }

    const monthlyRate = (interestRate / 100) / 12;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
    
    if (isNaN(payment) || !isFinite(payment)) {
      setMonthlyPayment(0);
      setTotalInterest(0);
    } else {
      setMonthlyPayment(Math.round(payment));
      const totalCost = payment * loanTerm;
      setTotalInterest(Math.round(Math.max(0, totalCost - principal)));
    }
  }, [vehiclePrice, downPayment, loanTerm, interestRate, salesTaxRate, includeFeesInLoan, totalPurchasePrice]);

  // Handy helpers to quickly adjust configurations to fit subprime profiles
  const applyPresetProfile = (tier: 'good' | 'rebuilding' | 'teen') => {
    switch (tier) {
      case 'good':
        setInterestRate(5.9);
        setDownPayment(2500);
        break;
      case 'rebuilding':
        setInterestRate(14.9);
        setDownPayment(1500);
        break;
      case 'teen':
        setInterestRate(8.9);
        setDownPayment(1000);
        setVehiclePrice(9500);
        break;
    }
  };

  return (
    <div id="apollo-finance-calculator" className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
      
      {/* Left Column: Form Controls */}
      <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
        <div>
          {/* Triune Brain Trigger: Reptilian Survival & Relief */}
          <div className="flex items-center space-x-1.5 mb-2">
            <span className="px-2.5 py-0.5 bg-success/15 text-success rounded-full text-sm font-bold uppercase tracking-wider flex items-center">
              <Check className="w-3 h-3 mr-1" />
              Secure Daily Transport
            </span>
            <span className="px-2.5 py-0.5 bg-gold/15 text-gold rounded-full text-sm font-bold uppercase tracking-wider flex items-center">
              No Obligation
            </span>
          </div>
          
          <h3 className="font-display font-extrabold text-2xl text-navy">Apollo Budget Estimator</h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Rough estimate only. Tap a profile below to load typical numbers for your situation.
          </p>
        </div>

        {/* Dynamic profiles simulator shortcuts */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => applyPresetProfile('rebuilding')}
            className="px-3 py-1.5 bg-gold/10 text-gold hover:bg-gold hover:text-white border border-gold/15 transition-all text-sm font-bold rounded-lg cursor-pointer"
          >
            📉 Rebuilding Credit Profile (14.9% rate)
          </button>
          <button
            type="button"
            onClick={() => applyPresetProfile('good')}
            className="px-3 py-1.5 bg-navy/5 text-navy hover:bg-navy hover:text-white border border-navy/10 transition-all text-sm font-bold rounded-lg cursor-pointer"
          >
            📈 Established Credit Profile (5.9% rate)
          </button>
          <button
            type="button"
            onClick={() => applyPresetProfile('teen')}
            className="px-3 py-1.5 bg-success/5 text-success hover:bg-success hover:text-white border border-success/10 transition-all text-sm font-bold rounded-lg cursor-pointer"
          >
            🚗 First-Time Commuter Budget ($9,500 car)
          </button>
        </div>

        <div className="space-y-4 pt-2">
          {/* Input 1 & 2: Vehicle Price & Down Payment Side by Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Input 1: Vehicle Price */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wider flex items-center">
                <DollarSign className="w-3.5 h-3.5 mr-1 text-gold" />
                <span>Vehicle Price</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-bold text-gray-400">$</span>
                <input
                  type="number"
                  min="2000"
                  max="100000"
                  value={vehiclePrice || ''}
                  onChange={(e) => setVehiclePrice(Number(e.target.value))}
                  className="w-full text-xs pl-7 pr-3 py-2 bg-paper/30 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-navy font-mono font-bold"
                  placeholder="e.g. 14500"
                />
              </div>
              <div className="flex justify-between text-sm font-mono text-gray-400 px-1">
                <span>Min: $4,000</span>
                <span>Max: $45,000</span>
              </div>
            </div>

            {/* Input 2: Down Payment */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wider flex items-center">
                <DollarSign className="w-3.5 h-3.5 mr-1 text-gold" />
                <span>Down Payment</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-bold text-gray-400">$</span>
                <input
                  type="number"
                  min="0"
                  max={vehiclePrice}
                  value={downPayment || ''}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full text-xs pl-7 pr-3 py-2 bg-paper/30 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-navy font-mono font-bold"
                  placeholder="e.g. 2000"
                />
              </div>
              <div className="flex justify-between text-sm font-mono text-gray-400 px-1">
                <span>$0 down eligible</span>
                <span>Rec: 20%</span>
              </div>
            </div>
          </div>

          {/* Input 3: Loan Term & Estimated Rate Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Term Select */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wider flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-gold" />
                <span>Desired Loan Term</span>
              </label>
              <select
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 bg-paper/30 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-navy font-bold"
              >
                <option value="24">24 Months (2 years)</option>
                <option value="36">36 Months (3 years)</option>
                <option value="48">48 Months (4 years - Standard)</option>
                <option value="60">60 Months (5 years)</option>
                <option value="72">72 Months (6 years)</option>
              </select>
            </div>

            {/* Interest rate input */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wider flex items-center">
                <Percent className="w-3.5 h-3.5 mr-1 text-gold" />
                <span>Estimated Interest Rate (APR)</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  min="1"
                  max="35"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Math.min(35, Math.max(0, Number(e.target.value))))}
                  className="w-full text-xs px-3 py-2 bg-paper/30 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-navy font-mono font-bold pr-8"
                />
                <span className="absolute right-3 text-xs font-bold text-gray-400 font-mono">%</span>
              </div>
            </div>

          </div>

          {/* Input 4: Taxes & DMV Fees (Prompt-centric additions) */}
          <div className="bg-paper/40 p-4 rounded-2xl border border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center">
                <Landmark className="w-3.5 h-3.5 mr-1.5 text-gold" />
                <span>Sales Tax & Government Fees</span>
              </h4>
              <span className="text-sm bg-gold/10 text-gold px-2 py-0.5 rounded font-mono font-bold">DMV average standard</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Sales Tax Rate */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Sales Tax Rate</span>
                  <span className="font-mono text-navy font-bold">{salesTaxRate}%</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="15"
                    step="0.01"
                    value={salesTaxRate}
                    onChange={(e) => setSalesTaxRate(Math.min(15, Math.max(0, Number(e.target.value))))}
                    className="w-full text-xs px-3 py-2 bg-white border border-gray-150 rounded-xl focus:border-gold focus:outline-none text-navy font-mono font-bold pr-8"
                  />
                  <span className="absolute right-3 text-xs font-bold text-gray-400 font-mono">%</span>
                </div>
                <div className="text-sm text-gray-400 font-mono pl-1">
                  Est. Tax Amt: ${salesTaxAmount.toLocaleString()}
                </div>
              </div>

              {/* Fixed DMV Fees */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-wider block">
                  California DMV Fees
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    disabled
                    value="$400"
                    className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-150 rounded-xl text-gray-500 font-mono font-bold"
                  />
                </div>
                <div className="text-sm text-gray-400 leading-normal pl-1">
                  Average registration & transfer charge
                </div>
              </div>
            </div>

            {/* Checkbox to include taxes + DMV fees in formatting */}
            <div className="flex items-center space-x-2 pt-1 border-t border-gray-100">
              <input
                type="checkbox"
                id="roll-in-fees"
                checked={includeFeesInLoan}
                onChange={(e) => setIncludeFeesInLoan(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-gray-300 text-gold focus:ring-gold accent-gold cursor-pointer"
              />
              <label htmlFor="roll-in-fees" className="text-sm text-gray-600 font-medium cursor-pointer select-none">
                Finance sales tax and DMV fees in monthly loan payment
              </label>
            </div>
          </div>

          {/* Limbic Trigger: Empathetic explanation of rebuilding credit */}
          <div className="mt-4 p-3 bg-paper/50 rounded-xl border border-gray-100 flex items-start space-x-2.5">
            <HeartHandshake className="w-4 h-4 text-gold shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600 leading-normal">
              <strong>Tim's note:</strong> Bad credit is not a dead end. We focus on solid daily drivers that fit your budget, with terms that help you rebuild over time.
            </p>
          </div>

        </div>
      </div>

      {/* Right Column: Display Outcome Area */}
      <div className="lg:col-span-5 bg-sky-deep text-white p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/15">
        
        {/* Output values */}
        <div className="space-y-6">
          <div>
            <span className="text-sm uppercase font-bold text-lemon tracking-widest font-mono">Estimated Payment</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-5xl font-extrabold tracking-tight font-display text-white">${monthlyPayment}</span>
              <span className="text-sm text-white/85 font-mono font-medium">/ month</span>
            </div>
          </div>

          <div className="border-t border-white/20 pt-4 space-y-2 text-xs">
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/90">Vehicle Base Price:</span>
              <span className="font-mono text-white font-medium">${vehiclePrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/90">Sales Tax ({salesTaxRate}%):</span>
              <span className="font-mono text-white">+${salesTaxAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/90">DMV Registration Fees:</span>
              <span className="font-mono text-white">+$400</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold border-t border-white/15 pt-1.5 pb-1">
              <span className="text-white">Total Purchase Price:</span>
              <span className="font-mono text-white">${totalPurchasePrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/90">Subtract Down Payment:</span>
              <span className="font-mono text-lemon">-${downPayment.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold border-t border-white/15 pt-1.5 pb-1">
              <span className="text-lemon">Estimated Loan Principal:</span>
              <span className="font-mono text-lemon font-bold">${totalFinancedAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/90">Estimated Finance Interest:</span>
              <span className="font-mono text-rose-200">+${totalInterest.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/20 font-bold text-sm">
              <span className="text-white">Grand Total Cost:</span>
              <span className="font-mono text-white">${(totalPurchasePrice + totalInterest).toLocaleString()}</span>
            </div>
          </div>
          
          <div className="pt-2">
            <a
              href="https://secure.carsforsale.com/ssfinance.aspx?jesxel=725123"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 w-full py-3 px-4 rounded-xl bg-success hover:bg-success/90 text-white font-extrabold text-xs transition-all duration-200 shadow-md shadow-success/10 hover:scale-[1.01]"
            >
              <FileText className="w-4 h-4 text-white" />
              <span>Submit Secure Credit Application</span>
            </a>
            <p className="text-sm text-white/85 text-center mt-1.5 leading-normal">
              Pre-qualify securely on SSL-encrypted CarsForSale servers.
            </p>
          </div>
        </div>

        {/* Regulatory disclaimer notes & Clear estimate-only warning with requested layout */}
        <div className="mt-8 bg-white/10 p-4 rounded-xl border border-white/20 space-y-1.5">
          <div className="flex items-center space-x-1.5 text-lemon text-sm font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5 text-lemon" />
            <span>⚠️ Crucial Estimation Notice</span>
          </div>
          <p className="text-sm text-white/90 leading-normal">
            <strong className="text-white">Please Note:</strong> This is only an estimate and the actual payment details can only be accurate once a credit application has been submitted, verified, and approved by our underwriting network. This dynamic calculator does not constitute a guaranteed offer, pre-approval, or final financing contract.
          </p>
        </div>

      </div>
    </div>
  );
}
