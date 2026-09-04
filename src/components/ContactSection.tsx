import React, { useState } from 'react';
import { Phone, MapPin, ExternalLink, MessageSquare, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Users, FileText, Send } from 'lucide-react';
import { config } from '../config';

export const ContactSection: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('Photography');
  const [isHovered, setIsHovered] = useState(false);

  const roles = [
    { name: 'Photography', icon: '📸', desc: 'Event coverage & photojournalism' },
    { name: 'Videography', icon: '🎥', desc: 'Cinematic shoots & reel creation' },
    { name: 'Video Editing', icon: '🎬', desc: 'Premiere Pro & DaVinci editing' },
    { name: 'Graphic Design', icon: '🎨', desc: 'Poster design, branding & UI' },
    { name: 'Content Writing', icon: '✍️', desc: 'Blogs, scripts & press releases' },
    { name: 'Podcasting', icon: '🎙️', desc: 'Podcast hosting & audio tech' },
    { name: 'Social Media', icon: '📱', desc: 'Handles & community management' },
  ];

  const handleApplyClick = () => {
    window.open(config.googleFormUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contact" className="py-24 relative bg-[#050505] overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#F26A2E]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F26A2E]/10 border border-[#F26A2E]/30 text-[#F26A2E] font-mono text-xs font-semibold mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>CONNECT & APPLY</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            OFFICIAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F26A2E] to-amber-400">MEDIA CELL & APPLICATION</span>
          </h2>
          <p className="font-inter text-stone-300 text-sm sm:text-base">
            Reach out to our helpline, join our official assist group, or complete your application directly via Google Forms.
          </p>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Contact Details, Assist Group & Google Map */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="glass-card p-6 md:p-8 rounded-3xl border border-stone-800 space-y-6">
              <h3 className="font-cinzel text-2xl font-bold text-white mb-2">
                Royal Media Office
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-stone-300 font-inter">
                {/* Campus Location */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#F26A2E]/10 text-[#F26A2E] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-stone-400 block text-xs font-semibold">CAMPUS LOCATION</span>
                    <strong className="text-white">{config.universityName}</strong>
                    <p className="text-stone-400 text-xs mt-0.5">{config.universityLocation}</p>
                  </div>
                </div>

                {/* Media Helpline Phone Number */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#F26A2E]/10 text-[#F26A2E] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-stone-400 block text-xs font-semibold">MEDIA HELPLINE</span>
                    <a href={`tel:${config.recruitment.contactPhone}`} className="text-white font-semibold hover:text-[#F26A2E] transition-colors">
                      {config.recruitment.contactPhone}
                    </a>
                  </div>
                </div>

                {/* Official Media Assist Group (WhatsApp Link) */}
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                    <MessageSquare className="w-4 h-4" />
                    <span>OFFICIAL MEDIA ASSIST GROUP</span>
                  </div>
                  <p className="text-stone-300 text-xs leading-relaxed">
                    Need instant support or clarification regarding your recruitment form? Join our WhatsApp Assist Group.
                  </p>
                  <a
                    href={config.recruitment.whatsappAssistGroup}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md"
                  >
                    <span>Join Official WhatsApp Group</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Official WhatsApp Assist Group Direct Banner */}
            <div className="glass-card-gradient p-6 sm:p-8 rounded-3xl border border-emerald-500/40 relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.2)] group hover:border-emerald-500/80 transition-all duration-300">
              <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-bl-full pointer-events-none" />

              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-2xl shadow-lg">
                  💬
                </div>

                <div>
                  <h4 className="font-cinzel text-xl font-bold text-white mb-1">
                    Official RGU Media WhatsApp Group
                  </h4>
                  <p className="font-inter text-stone-300 text-xs sm:text-sm max-w-sm mx-auto">
                    Get instant assistance, form updates, and directly connect with the Media Cell coordinators.
                  </p>
                </div>

                <a
                  href={config.recruitment.whatsappAssistGroup}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:shadow-[0_0_40px_rgba(16,185,129,0.8)] hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer border border-emerald-300/30"
                >
                  <MessageSquare className="w-5 h-5 text-emerald-100" />
                  <span className="tracking-wider uppercase">CLICK TO JOIN THE WHATSAPP GROUP</span>
                  <ExternalLink className="w-4 h-4 text-emerald-100" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Reactive "Apply Here" Section */}
          <div className="lg:col-span-7">
            <div className="glass-card-gradient p-6 md:p-10 rounded-3xl border border-[#F26A2E]/40 relative overflow-hidden h-full flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#F26A2E]/10 rounded-bl-full pointer-events-none" />

              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>RECRUITMENT OPEN • DEADLINE: AUG 5, 2026</span>
                  </div>
                  <span className="text-xs text-stone-400 font-mono">Academic Session 2026-27</span>
                </div>

                <h3 className="font-cinzel text-2xl sm:text-3xl font-black text-white mb-3">
                  APPLY HERE TO JOIN <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F26A2E] to-amber-400">RGU MEDIA TEAM</span>
                </h3>
                <p className="font-inter text-stone-300 text-xs sm:text-sm leading-relaxed mb-6">
                  Select your primary area of interest below to review requirement details, then click to launch the official Google Form application.
                </p>

                {/* Interactive Wing Selector */}
                <div className="mb-6">
                  <label className="block text-xs font-mono font-semibold text-stone-400 uppercase tracking-wider mb-2">
                    Select Your Desired Role:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {roles.map((role) => (
                      <button
                        key={role.name}
                        onClick={() => setSelectedRole(role.name)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                          selectedRole === role.name
                            ? 'bg-[#F26A2E] text-white shadow-[0_0_15px_rgba(242,106,46,0.6)] scale-105'
                            : 'bg-stone-900/80 text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-800'
                        }`}
                      >
                        <span>{role.icon}</span>
                        <span>{role.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Selected Role Preview Card */}
                <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 mb-8 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#F26A2E]" />
                      Selected Focus: <span className="text-[#F26A2E]">{selectedRole}</span>
                    </h4>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-stone-800 text-stone-300">
                      Form Ready
                    </span>
                  </div>
                  <p className="font-inter text-stone-300 text-xs">
                    {roles.find((r) => r.name === selectedRole)?.desc}
                  </p>
                  <div className="flex items-center gap-4 text-[11px] text-stone-400 font-inter pt-2 border-t border-stone-800/80">
                    <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /> Open to All Years</span>
                    <span className="flex items-center gap-1 text-amber-400"><ShieldCheck className="w-3.5 h-3.5" /> Mentorship Provided</span>
                  </div>
                </div>
              </div>

              {/* Prominent Direct Apply Button */}
              <div>
                <button
                  onClick={handleApplyClick}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="group w-full py-5 px-8 rounded-2xl bg-gradient-to-r from-[#F26A2E] via-[#FF7A3D] to-amber-500 text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(242,106,46,0.6)] hover:shadow-[0_0_60px_rgba(242,106,46,0.9)] hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                >
                  <FileText className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  <span>APPLY HERE VIA GOOGLE FORM</span>
                  <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''}`} />
                </button>
                <p className="text-center font-inter text-xs text-stone-400 mt-3">
                  Clicking opens the official Google Form application in a new tab.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
