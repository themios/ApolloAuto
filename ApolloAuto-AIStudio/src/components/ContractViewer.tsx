import { useState } from 'react';
import { CONTRACT_SECTIONS, GLOSSARY_ITEMS, ContractSection } from '../types';
import { FileText, Shield, AlertCircle, Sparkles, BookOpen, Search, Info } from 'lucide-react';

export default function ContractViewer() {
  const [selectedSection, setSelectedSection] = useState<ContractSection>(CONTRACT_SECTIONS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGlossary = GLOSSARY_ITEMS.filter(
    item =>
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="contract-viewer" className="space-y-12">
      {/* Intro block */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gold/10 text-gold rounded-full text-xs font-semibold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          <span>Plain English contracts</span>
        </div>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-navy tracking-tight">
          Read the contract before you sign
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          We publish sections from real California purchase agreements used at our lots, with Tim's explanation of what each part means.
        </p>
      </div>

      {/* Main interactive segment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation panel */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select a contract clause</p>
          <div className="space-y-2">
            {CONTRACT_SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 border flex items-center space-x-3 ${
                  selectedSection.id === section.id
                    ? 'bg-navy border-navy text-white shadow-md'
                    : 'bg-paper/30 border-gray-100 hover:border-navy-soft/30 text-navy hover:bg-paper/50'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  selectedSection.id === section.id ? 'bg-navy-soft text-gold' : 'bg-white text-navy shadow-sm'
                }`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold truncate leading-tight">{section.title}</p>
                  <p className={`text-sm truncate ${selectedSection.id === section.id ? 'text-gray-300' : 'text-gray-400'}`}>
                    {section.documentName}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-navy-soft/10 p-4 rounded-xl border border-navy-soft/10">
            <h4 className="text-xs font-bold text-navy flex items-center space-x-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Tim’s Guarantee</span>
            </h4>
            <p className="text-sm text-gray-600 leading-normal">
              “Every paper you sign at my dealership is standard, state-approved, and can be reviewed with any representative or your personal attorney before writing a check.”
            </p>
          </div>
        </div>

        {/* View screen */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-navy p-6 text-white border-b border-navy-soft/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-sm uppercase font-bold tracking-widest text-gold">Active Clause Spotlight</span>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-white tracking-tight">
                  {selectedSection.title}
                </h3>
                <p className="text-xs text-gray-300 font-mono mt-1 flex items-center">
                  <Info className="w-3 h-3 text-gold-light mr-1.5" />
                  Source: {selectedSection.documentName}
                </p>
              </div>
            </div>

            {/* Content Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {/* Actual wording */}
              <div className="p-6 space-y-4 bg-paper/10">
                <div className="flex items-center space-x-2 text-navy">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Exact Contract Text</h4>
                </div>
                <div className="bg-navy/5 p-4 rounded-xl border border-navy/10 font-mono text-xs text-navy-soft leading-relaxed max-h-[180px] overflow-y-auto">
                  “{selectedSection.realText}”
                </div>
                <p className="text-sm text-gray-400">
                  {selectedSection.description}
                </p>
              </div>

              {/* Plain English explanation */}
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-2 text-success">
                  <span className="inline-block w-2 h-2 bg-success rounded-full"></span>
                  <h4 className="text-xs font-bold uppercase tracking-wider">What it Means in Human Speech</h4>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed bg-success/5 p-4 rounded-xl border border-success/10">
                  {selectedSection.plainEnglish}
                </p>

                {/* Safeguard block */}
                <div className="flex items-start space-x-3 bg-gold/5 border border-gold/20 p-4 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-navy leading-none">Security Shield</h5>
                    <p className="text-sm text-gray-600 leading-normal">
                      {selectedSection.safeguardNote}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Glossary */}
      <div className="bg-paper/30 p-8 rounded-3xl border border-gray-100 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-display font-extrabold text-xl text-navy tracking-tight flex items-center">
              <BookOpen className="w-5 h-5 text-gold mr-2" />
              <span>SoCal Used Car Glossary</span>
            </h3>
            <p className="text-xs text-gray-600">
              Clear definitions of regulatory, financial, and DMV terms you will encounter in California.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-sm w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-4 h-4 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search terms (e.g. As-Is, Smog)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-xs pl-9 pr-4 py-2 border border-gray-100 rounded-xl focus:border-gold focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Dynamic dictionary lists */}
        {filteredGlossary.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGlossary.map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-navy uppercase tracking-wide bg-paper px-2 py-1 rounded">
                    {item.term}
                  </h4>
                </div>
                <p className="text-xs text-gray-700 leading-normal">{item.definition}</p>
                <div className="pt-2 border-t border-gray-50 text-sm text-gray-500 font-mono">
                  <span className="text-gold font-semibold">At Apollo:</span> {item.context}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-white rounded-xl border border-gray-100">
            <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-500">No glossary term matches your search. Ask Tim directly!</p>
          </div>
        )}
      </div>
    </div>
  );
}
