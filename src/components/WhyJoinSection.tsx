import React from 'react';
import { motion } from 'motion/react';
import { fadeInUpItemVariants } from './AnimatedSection';
import { Sparkles, Rocket, Lightbulb, Compass, CheckCircle2, ArrowRight } from 'lucide-react';

interface WhyJoinSectionProps {
  onApplyClick?: () => void;
}

export const WhyJoinSection: React.FC<WhyJoinSectionProps> = ({ onApplyClick }) => {
  const gains = [
    {
      icon: '📸',
      title: 'Real-World Experience',
      desc: 'Cover university events, fests, workshops, sports, and cultural programs with a professional media team.',
    },
    {
      icon: '🎥',
      title: 'Learn Industry Skills',
      desc: 'Gain hands-on experience in photography, videography, video editing, graphic design, content creation, podcasting, and social media management.',
    },
    {
      icon: '🎨',
      title: 'Unleash Your Creativity',
      desc: 'Turn your ideas into impactful visual stories that inspire the university community.',
    },
    {
      icon: '🤝',
      title: 'Build Strong Connections',
      desc: 'Collaborate with talented students, faculty members, and professionals while expanding your network.',
    },
    {
      icon: '🌟',
      title: 'Develop Leadership Skills',
      desc: 'Take responsibility, lead projects, organize teams, and grow as a confident leader.',
    },
    {
      icon: '💼',
      title: 'Strengthen Your Portfolio',
      desc: 'Work on real projects that showcase your skills for internships, placements, and future career opportunities.',
    },
    {
      icon: '🎓',
      title: 'Learn by Doing',
      desc: 'Receive mentorship, constructive feedback, and practical experience with modern creative tools and workflows.',
    },
    {
      icon: '🏆',
      title: 'Earn Recognition',
      desc: 'Get opportunities to receive certificates, appreciation, and recognition for your contributions.',
    },
    {
      icon: '🎉',
      title: 'Create Unforgettable Memories',
      desc: 'Capture the most memorable moments of university life and be a part of every major event.',
    },
    {
      icon: '🌍',
      title: 'Make an Impact',
      desc: 'Help shape the digital identity and public image of The Assam Royal Global University through creative storytelling.',
    },
  ];

  const eligibility = [
    'Passionate about creativity and media',
    'Eager to learn new skills',
    'Loves teamwork and collaboration',
    'Ready to contribute to campus events',
    'Open to students from all departments and years',
    'No prior experience required—enthusiasm and dedication matter most!',
  ];

  return (
    <section id="why-join" className="py-24 relative bg-[#08080C] overflow-hidden border-t border-stone-800/60">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#F26A2E]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F26A2E]/10 border border-[#F26A2E]/30 text-[#F26A2E] font-mono text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DISCOVER YOUR POTENTIAL</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6">
            🌟 WHY JOIN THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F26A2E] via-amber-400 to-orange-500">MEDIA TEAM?</span>
          </h2>
          <p className="font-inter text-stone-300 text-base sm:text-lg leading-relaxed glass-card p-6 rounded-2xl border border-stone-800/80">
            Become part of a passionate community where creativity, innovation, and leadership come together. Whether you're a beginner or an experienced creator, the Media Team offers endless opportunities to learn, grow, and make an impact.
          </p>
        </div>

        {/* What You'll Gain Grid */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-xl bg-[#F26A2E]/15 text-[#F26A2E] border border-[#F26A2E]/30">
              <Rocket className="w-5 h-5" />
            </div>
            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
              🚀 What You'll Gain
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gains.map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUpItemVariants}
                className="glass-card p-6 rounded-2xl border border-stone-800 hover:border-[#F26A2E]/50 transition-all duration-300 hover:-translate-y-1 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h4 className="font-cinzel text-lg font-bold text-white group-hover:text-[#F26A2E] transition-colors mb-2">
                    {item.title}
                  </h4>
                  <p className="font-inter text-stone-300 text-xs sm:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Who Can Join & Journey Starts Here Split Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Who Can Join */}
          <div className="lg:col-span-7 glass-card p-8 rounded-3xl border border-stone-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h3 className="font-cinzel text-2xl font-bold text-white">
                  💡 Who Can Join?
                </h3>
              </div>

              <div className="space-y-3.5">
                {eligibility.map((point, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-stone-900/60 border border-stone-800/80">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="font-inter text-stone-200 text-sm font-medium">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Your Journey Starts Here */}
          <div className="lg:col-span-5 glass-card-gradient p-8 rounded-3xl border border-[#F26A2E]/40 flex flex-col justify-between text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#F26A2E]/10 rounded-bl-full pointer-events-none" />

            <div>
              <div className="inline-flex p-3 rounded-2xl bg-[#F26A2E]/20 text-[#F26A2E] mb-6">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="font-cinzel text-2xl font-extrabold text-white mb-4">
                🎯 Your Journey Starts Here
              </h3>
              <p className="font-playfair text-stone-200 text-base sm:text-lg italic leading-relaxed mb-8">
                "Don't just attend university events—be the one who captures them, tells their stories, and creates memories that last forever. Join the Media Team and turn your passion into purpose! 📷🎬✨"
              </p>
            </div>

            {onApplyClick && (
              <button
                onClick={onApplyClick}
                className="group w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#F26A2E] via-[#FF7A3D] to-amber-600 text-white font-extrabold text-sm shadow-[0_0_30px_rgba(242,106,46,0.5)] hover:shadow-[0_0_50px_rgba(242,106,46,0.8)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Apply for Media Team</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
