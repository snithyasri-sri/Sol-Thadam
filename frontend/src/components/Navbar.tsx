import React, { useState } from 'react';
import { BookOpen, Search, Library, Award, Info, Menu, X } from 'lucide-react';
import type { ActivePage } from '../types';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as ActivePage, label: 'முகப்பு', icon: BookOpen },
    { id: 'analyze' as ActivePage, label: 'பொருள் கண்டறிதல்', icon: Search },
    { id: 'words' as ActivePage, label: 'சொல் தொகுப்பு', icon: Library },
    { id: 'quiz' as ActivePage, label: 'பயிற்சி & வினாடி வினா', icon: Award },
    { id: 'about' as ActivePage, label: 'திட்ட விளக்கம்', icon: Info },
  ];

  const handleNavClick = (page: ActivePage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E7E1D7] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo & Title */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left cursor-pointer"
            aria-label="சொல் தடம் முகப்புப் பக்கம்"
          >
            <div className="w-11 h-11 rounded-xl bg-[#163828] text-[#FDFBF7] flex items-center justify-center font-bold text-2xl shadow-sm group-hover:bg-[#2A7F62] transition-colors border border-[#C28B38]">
              சொ
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-[#163828] group-hover:text-[#2A7F62] transition-colors">
                சொல் தடம்
              </span>
              <span className="text-[11px] text-[#2A7F62] font-medium tracking-wide">
                Sol Thadam • சூழல் சொல் பொருள் ஆய்வி
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="முதன்மை வழிசெலுத்தல்">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#163828] text-[#FDFBF7] shadow-sm'
                      : 'text-[#1F2E24] hover:bg-[#EFE9DF] hover:text-[#163828]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#C28B38]' : 'text-[#2A7F62]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#163828] hover:bg-[#EFE9DF] transition-colors"
              aria-label={mobileMenuOpen ? 'பட்டியலை மூடு' : 'பட்டியலைத் திற'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E7E1D7] bg-[#FAF8F5] px-4 pt-2 pb-4 space-y-1 shadow-lg animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#163828] text-white'
                    : 'text-[#1F2E24] hover:bg-[#EFE9DF]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#C28B38]' : 'text-[#2A7F62]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
