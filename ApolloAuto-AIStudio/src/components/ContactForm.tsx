import { useState, type FormEvent } from 'react';
import { Landmark, MessageSquare, Phone, User, Mail, Sparkles, MapPin, CheckCircle, Car, FileText } from 'lucide-react';

interface ContactFormProps {
  initialLocation?: 'simi-valley' | 'el-monte';
  onLeadSubmitted?: (lead: any) => void;
}

export default function ContactForm({ initialLocation, onLeadSubmitted }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: initialLocation || 'simi-valley',
    carInterest: 'safe-daily',
    creditStatus: 'rebuilding',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccesful, setIsSuccessful] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const carInterests = [
    { value: 'safe-daily', label: 'Safe Daily Commuter (Sedan/Hatch)' },
    { value: 'family-suv', label: 'Spacious Family SUV' },
    { value: 'first-car', label: 'First Car / Teen Driver Safety' },
    { value: 'bad-budget', label: 'Budget Fuel-Saver Under $12k' },
    { value: 'unsure', label: 'Unsure (Need Consultation)' }
  ];

  const creditTiers = [
    { value: 'rebuilding', label: 'Rebuilding Credit / Past Repossession' },
    { value: 'no-history', label: 'First-Time Buyer / No Credit History' },
    { value: 'bankruptcy', label: 'Active Bankruptcy / Recovery' },
    { value: 'fair-credit', label: 'Fair Credit (580 - 660)' },
    { value: 'good-credit', label: 'Good Credit (660+)' }
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setErrorMsg('Name and phone are required so Tim can reach you.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          location: formData.location === 'simi-valley' ? 'Simi Valley Lot' : 'El Monte Lot',
          message: formData.message || `Interested in ${formData.carInterest} options`,
          carInterest: carInterests.find(c => c.value === formData.carInterest)?.label,
          creditStatus: creditTiers.find(c => c.value === formData.creditStatus)?.label
        })
      });

      const resData = await response.json();
      if (resData.success) {
        setIsSuccessful(true);
        if (onLeadSubmitted) {
          onLeadSubmitted(resData.lead);
        }
      } else {
        throw new Error(resData.error || 'Failed to submit form');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not register submission. Please call Tim directly at (805) 404-3873.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccesful) {
    return (
      <div id="contact-success-panel" className="bg-white p-6 sm:p-8 rounded-3xl border border-success/15 shadow-sm text-center space-y-5 max-w-xl mx-auto reveal-entry">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center text-success mx-auto">
          <CheckCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-navy">Got it, thanks!</h3>
          <p className="text-base text-gray-600 leading-relaxed">
            Thanks, <span className="font-bold text-navy">{formData.name}</span>. Tim got your message. We noted your interest in a <span className="font-semibold text-gold">{carInterests.find(c => c.value === formData.carInterest)?.label}</span> at our <span className="font-semibold text-navy-soft">{formData.location === 'simi-valley' ? 'Simi Valley' : 'El Monte'}</span> lot.
          </p>
        </div>

        <div className="p-4 bg-success/5 border border-success/10 rounded-2xl text-sm space-y-3 text-center">
          <p className="font-extrabold text-navy leading-none">Want to move faster?</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            While Tim looks over your message, you can fill out the secure online credit application:
          </p>
          <a
            href="https://secure.carsforsale.com/ssfinance.aspx?jesxel=725123"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-success hover:bg-success/90 text-white font-bold rounded-xl shadow-md transition-all touch-target min-h-[3rem]"
          >
            <FileText className="w-4 h-4 text-white" />
            <span>Start credit application</span>
          </a>
        </div>

        <div className="bg-paper p-4 rounded-2xl border border-gray-100 text-sm text-gray-600">
          <p className="font-semibold text-navy mb-1 leading-none">Tim usually responds fast</p>
          Most days he texts or calls back within <strong>15 to 30 minutes</strong> during lot hours.
        </div>
        <button
          onClick={() => {
            setIsSuccessful(false);
            setFormData({
              name: '',
              phone: '',
              email: '',
              location: initialLocation || 'simi-valley',
              carInterest: 'safe-daily',
              creditStatus: 'rebuilding',
              message: ''
            });
          }}
          className="text-sm text-gold hover:text-navy underline font-bold cursor-pointer touch-target px-2"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <div id="contact-lead-panel" className="bg-white rounded-3xl border-2 border-sky-light shadow-xl overflow-hidden reveal-entry">
      {/* Triune Brain Header: Reptilian (Safety/Urgency) & Limbic (Trust/Warmth) */}
      <div className="bg-sky-deep p-6 sm:p-7 text-white border-b-4 border-sun space-y-2.5">
        <div className="flex items-center space-x-2">
          <Sparkles className="text-gold w-5 h-5" />
          <span className="eyebrow text-gold-light">No pressure consultation</span>
        </div>
        <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight">
          Find a reliable daily driver
        </h3>
        {/* Neocortex: Simple, logical facts */}
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
          Tim reads every submission himself. Straight answers on pre-approval, with no dealer games.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-150 rounded-xl text-sm text-red-600 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Reptilian Survival Bullet Points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pb-3 border-b border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-navy font-bold">
            <span className="w-2 h-2 rounded-full bg-success shrink-0"></span>
            <span>No Credit Score Ding</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-navy font-bold">
            <span className="w-2 h-2 rounded-full bg-success shrink-0"></span>
            <span>California Smog Certified</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-navy font-bold sm:col-span-2">
            <span className="w-2 h-2 rounded-full bg-gold shrink-0"></span>
            <span>Hand-picked for reliability</span>
          </div>
        </div>

        {/* Name Input */}
        <div className="space-y-2">
          <label className="form-label text-gray-600 uppercase flex items-center">
            <User className="w-4 h-4 mr-1.5 text-gold" />
            <span>Full Name *</span>
          </label>
          <input
            type="text"
            required
            placeholder="John Doe"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="form-field w-full bg-paper/20 border border-gray-100 focus:border-gold focus:outline-none focus:bg-white transition-all text-navy"
          />
        </div>

        {/* Phone & Email Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="form-label text-gray-600 uppercase flex items-center">
              <Phone className="w-4 h-4 mr-1.5 text-gold" />
              <span>Mobile Phone *</span>
            </label>
            <input
              type="tel"
              required
              placeholder="(805) 555-0123"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="form-field w-full bg-paper/20 border border-gray-100 focus:border-gold focus:outline-none focus:bg-white transition-all text-navy"
            />
          </div>

          <div className="space-y-2">
            <label className="form-label text-gray-600 uppercase flex items-center">
              <Mail className="w-4 h-4 mr-1.5 text-gold" />
              <span>Email (Optional)</span>
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="form-field w-full bg-paper/20 border border-gray-100 focus:border-gold focus:outline-none focus:bg-white transition-all text-navy"
            />
          </div>
        </div>

        {/* Location Lot Selector */}
        <div className="space-y-2">
          <label className="form-label text-gray-600 uppercase flex items-center">
            <MapPin className="w-4 h-4 mr-1.5 text-gold" />
            <span>Preferred Lot Location</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className={`flex items-center justify-center p-3.5 rounded-xl border cursor-pointer text-sm sm:text-base text-center transition-all touch-target min-h-[3rem] ${
              formData.location === 'simi-valley'
                ? 'bg-navy border-navy text-white font-semibold'
                : 'bg-paper/30 border-gray-100 text-navy hover:bg-paper/50'
            }`}>
              <input
                type="radio"
                name="location"
                value="simi-valley"
                checked={formData.location === 'simi-valley'}
                onChange={() => setFormData({ ...formData, location: 'simi-valley' })}
                className="hidden"
              />
              <span>Simi Valley (Ventura)</span>
            </label>
            <label className={`flex items-center justify-center p-3.5 rounded-xl border cursor-pointer text-sm sm:text-base text-center transition-all touch-target min-h-[3rem] ${
              formData.location === 'el-monte'
                ? 'bg-navy border-navy text-white font-semibold'
                : 'bg-paper/30 border-gray-100 text-navy hover:bg-paper/50'
            }`}>
              <input
                type="radio"
                name="location"
                value="el-monte"
                checked={formData.location === 'el-monte'}
                onChange={() => setFormData({ ...formData, location: 'el-monte' })}
                className="hidden"
              />
              <span>El Monte (LA County)</span>
            </label>
          </div>
        </div>

        {/* Car Interest */}
        <div className="space-y-2">
          <label className="form-label text-gray-600 uppercase flex items-center">
            <Car className="w-4 h-4 mr-1.5 text-gold" />
            <span>What type of car fits your drive?</span>
          </label>
          <select
            value={formData.carInterest}
            onChange={e => setFormData({ ...formData, carInterest: e.target.value })}
            className="form-field w-full bg-paper/20 border border-gray-100 focus:border-gold focus:outline-none focus:bg-white transition-all text-navy"
          >
            {carInterests.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Credit History Select */}
        <div className="space-y-2">
          <label className="form-label text-gray-600 uppercase flex items-center">
            <Landmark className="w-4 h-4 mr-1.5 text-gold" />
            <span>Credit History Tier</span>
          </label>
          <select
            value={formData.creditStatus}
            onChange={e => setFormData({ ...formData, creditStatus: e.target.value })}
            className="form-field w-full bg-paper/20 border border-gray-100 focus:border-gold focus:outline-none focus:bg-white transition-all text-navy"
          >
            {creditTiers.map(tier => (
              <option key={tier.value} value={tier.value}>{tier.label}</option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label className="form-label text-gray-600 uppercase flex items-center">
            <MessageSquare className="w-4 h-4 mr-1.5 text-gold" />
            <span>Message to Tim (Optional)</span>
          </label>
          <textarea
            placeholder="e.g. My budget is $1,500 down, what is open in Civic or Corolla hatchbacks?"
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
            className="form-field w-full bg-paper/20 border border-gray-100 focus:border-gold focus:outline-none focus:bg-white transition-all text-navy min-h-[6rem] py-3"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl bg-gold hover:bg-gold-light text-navy font-extrabold text-base sm:text-lg transition-all duration-200 cursor-pointer shadow-md shadow-gold/10 flex items-center justify-center min-h-[3.25rem] uppercase tracking-wide"
        >
          {isSubmitting ? (
            <span>Sending to Tim's desk...</span>
          ) : (
            <span>Get pre-approved today</span>
          )}
        </button>

        {/* Reptilian Reassurance under Button */}
        <p className="form-caption text-gray-500 text-center font-medium">
          Your info stays private. We never sell your details.
        </p>
      </form>
    </div>
  );
}
