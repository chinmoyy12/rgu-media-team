import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { startSmoothScroll } from './lib/smoothScroll';
import { startFx } from './lib/fx';
import { subscribe, getVersion, siteText, siteSettings, isDraft } from './content/store';
import { AdminPanel } from './components/AdminPanel';
import { VelocityMarquee, Manifesto } from './components/KineticSections';
import { CustomCursor } from './components/CustomCursor';
import { MotionRibbonSection } from './components/MotionRibbonSection';
import { AnimatePresence, motion } from 'motion/react';
import { LoadingScreen } from './components/LoadingScreen';
import { ScrollProgress } from './components/ScrollProgress';
import { ScrollIndicator } from './components/ScrollIndicator';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { DepartmentsSection } from './components/DepartmentsSection';
import { MembersPage } from './components/MembersPage';
import { MediaTeamWorksPage } from './components/MediaTeamWorksPage';
import { MediaTeamFamilySection } from './components/MediaTeamFamilySection';
import { WhyJoinSection } from './components/WhyJoinSection';
import { JoinUsSection } from './components/JoinUsSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { AnimatedSection } from './components/AnimatedSection';
import { SectionDivider } from './components/SectionDivider';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { GoogleFormModal } from './components/GoogleFormModal';
import { ShowreelModal } from './components/ShowreelModal';
import { SearchModal } from './components/SearchModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'members' | 'works'>('home');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isShowreelModalOpen, setIsShowreelModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  // bumps whenever admin-edited content is applied, so the page re-renders with it
  const contentVersion = useSyncExternalStore(subscribe, getVersion);

  const sec = siteSettings.sections;
  const look = siteSettings.appearance;

  useEffect(() => (look.smoothScroll ? startSmoothScroll() : undefined), [look.smoothScroll]);
  useEffect(() => startFx(), []);
  useEffect(() => {
    // Ctrl/⌘ + Shift + A opens the admin panel
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleOpenApplyModal = () => setIsFormModalOpen(true);
  const handleCloseApplyModal = () => setIsFormModalOpen(false);

  const handleOpenShowreelModal = () => setIsShowreelModalOpen(true);
  const handleCloseShowreelModal = () => setIsShowreelModalOpen(false);

  const handleOpenSearchModal = () => setIsSearchModalOpen(true);
  const handleCloseSearchModal = () => setIsSearchModalOpen(false);

  const handleNavigateToMembers = () => {
    setCurrentPage('members');
    window.scrollTo(0, 0);
  };

  const handleNavigateToWorks = () => {
    setCurrentPage('works');
    window.scrollTo(0, 0);
  };

  const handleNavigateToHome = () => {
    setCurrentPage('home');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-stone-100 font-inter selection:bg-[#F26A2E] selection:text-white relative">
      {/* Ultra-Premium Loading Screen */}
      <LoadingScreen />

      {/* Global film grain + custom magnetic cursor */}
      <div className="fx-grain" aria-hidden="true" />
      {look.cursor && <CustomCursor />}

      {/* Scroll Progress Bar at top */}
      <ScrollProgress />

      {/* Vertical Fixed Right Navigation Indicator (Only on Home Page) */}
      {currentPage === 'home' && <ScrollIndicator />}

      {/* Top Announcement Bar */}
      <AnnouncementBanner key={`ab-${contentVersion}`} onApplyClick={handleOpenApplyModal} />

      {/* Glass Header Navigation */}
      <Navbar
        onAdminClick={() => setIsAdminOpen(true)}
        isDraft={isDraft()}
        onApplyClick={handleOpenApplyModal}
        onSearchOpen={handleOpenSearchModal}
        onMembersClick={handleNavigateToMembers}
        onWorksClick={handleNavigateToWorks}
        onHomeClick={handleNavigateToHome}
        currentPage={currentPage}
      />

      {/* Main Content View Switcher with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          data-content-version={contentVersion}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {currentPage === 'members' ? (
            <MembersPage
              onBackToHome={handleNavigateToHome}
              onApplyClick={handleOpenApplyModal}
            />
          ) : currentPage === 'works' ? (
            <MediaTeamWorksPage
              onBackToHome={handleNavigateToHome}
              onApplyClick={handleOpenApplyModal}
            />
          ) : (
            <main>
              {/* Cinematic Full-screen Hero */}
              <HeroSection
                onApplyClick={handleOpenApplyModal}
                onMembersClick={handleNavigateToMembers}
              />

              {/* Scroll-driven 3D ribbon of the team's work */}
              {sec.ribbon && <MotionRibbonSection onWorksClick={handleNavigateToWorks} onApplyClick={handleOpenApplyModal} />}

              {/* Kinetic type band + scroll-lit manifesto */}
              {sec.marquee && <VelocityMarquee words={siteText.marquee} />}
              {sec.manifesto && (
                <Manifesto label={siteText.manifestoLabel} text={siteText.manifesto} accent={siteText.manifestoAccent} />
              )}

              {/* Content sections — each can be switched off in Admin → Sections */}
              {(
                [
                  ['about', <AboutSection />, 'line'],
                  ['departments', <DepartmentsSection onApplyClick={handleOpenApplyModal} />, 'wave'],
                  ['family', <MediaTeamFamilySection />, 'wave'],
                  ['whyJoin', <WhyJoinSection onApplyClick={handleOpenApplyModal} />, 'wave'],
                  ['joinUs', <JoinUsSection onApplyClick={handleOpenApplyModal} />, 'line'],
                  ['faq', <FAQSection />, 'wave'],
                  ['contact', <ContactSection />, 'line'],
                ] as const
              )
                .filter(([k]) => sec[k])
                .map(([k, node, divider]) => (
                  <React.Fragment key={k}>
                    <SectionDivider variant={divider === 'wave' ? 'wave' : undefined} />
                    <AnimatedSection>{node}</AnimatedSection>
                  </React.Fragment>
                ))}
            </main>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <Footer onApplyClick={handleOpenApplyModal} />

      {/* Floating Back to Top Button */}
      <BackToTop />

      {/* Google Form Application Modal */}
      <GoogleFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseApplyModal}
        onHomeClick={currentPage !== 'home' ? handleNavigateToHome : undefined}
      />

      {/* Video Showreel Modal */}
      <ShowreelModal
        isOpen={isShowreelModalOpen}
        onClose={handleCloseShowreelModal}
      />

      {/* Global Site Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={handleCloseSearchModal}
        onApplyClick={handleOpenApplyModal}
      />

      {/* Admin settings (links, members, text) */}
      <AdminPanel open={isAdminOpen} onClose={() => setIsAdminOpen(false)} onOpenRequest={() => setIsAdminOpen(true)} />

      {/* Keyboard Shortcuts (?) */}
      <KeyboardShortcutsModal />
    </div>
  );
}

