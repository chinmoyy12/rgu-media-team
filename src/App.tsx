import React, { useState } from 'react';
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

      {/* Scroll Progress Bar at top */}
      <ScrollProgress />

      {/* Vertical Fixed Right Navigation Indicator (Only on Home Page) */}
      {currentPage === 'home' && <ScrollIndicator />}

      {/* Top Announcement Bar */}
      <AnnouncementBanner onApplyClick={handleOpenApplyModal} />

      {/* Glass Header Navigation */}
      <Navbar
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

              <SectionDivider />

              {/* Two-Column About Section & Animated Statistics */}
              <AnimatedSection>
                <AboutSection />
              </AnimatedSection>

              <SectionDivider variant="wave" />

              {/* Specialized Creative Wings / Departments */}
              <AnimatedSection>
                <DepartmentsSection onApplyClick={handleOpenApplyModal} />
              </AnimatedSection>

              <SectionDivider variant="wave" />

              {/* Media Team Family Showcase */}
              <AnimatedSection>
                <MediaTeamFamilySection />
              </AnimatedSection>

              <SectionDivider variant="wave" />

              {/* Why Join the Media Team Section */}
              <AnimatedSection>
                <WhyJoinSection onApplyClick={handleOpenApplyModal} />
              </AnimatedSection>

              <SectionDivider />

              {/* Join the Media Team Recruitment Hub */}
              <AnimatedSection>
                <JoinUsSection onApplyClick={handleOpenApplyModal} />
              </AnimatedSection>

              <SectionDivider variant="wave" />

              {/* FAQ Accordion */}
              <AnimatedSection>
                <FAQSection />
              </AnimatedSection>

              <SectionDivider />

              {/* Split Contact Form & Map */}
              <AnimatedSection>
                <ContactSection />
              </AnimatedSection>
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

      {/* Keyboard Shortcuts (?) */}
      <KeyboardShortcutsModal />
    </div>
  );
}

