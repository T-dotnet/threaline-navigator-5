import { motion } from "motion/react";
import { Plus, Check, ChevronRight, Palette } from "lucide-react";
import { Child } from "../types";
import { cn } from "../lib/utils";
import { useState } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Switch } from "./ui/Switch";

import { PageContainer } from "./ui/PageContainer";

import { useCurrentChild } from "../context/ChildContext";

interface SettingsPageProps {
  onPageChange: (page: any) => void;
  onAddChildRequest: () => void;
}

export default function SettingsPage({
  onPageChange,
  onAddChildRequest,
}: SettingsPageProps) {
  const { currentChild, childrenList, setChild } = useCurrentChild();
  const [nickname, setNickname] = useState("Sarah");
  const [email, setEmail] = useState("sarah@example.com");
  const [receiveNotifications, setReceiveNotifications] = useState(true);

  // Dynamic Theme States
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("thread-theme") || "energetic";
    } catch {
      return "energetic";
    }
  });
  const [font, setFont] = useState(() => {
    try {
      return localStorage.getItem("thread-font") || "modern-serif";
    } catch {
      return "modern-serif";
    }
  });
  const [heroStyle, setHeroStyle] = useState(() => {
    try {
      return localStorage.getItem("thread-hero-style") || "white";
    } catch {
      return "white";
    }
  });
  const [secondaryStyle, setSecondaryStyle] = useState(() => {
    try {
      return localStorage.getItem("thread-secondary-style") || "light";
    } catch {
      return "light";
    }
  });

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    try {
      localStorage.setItem("thread-theme", newTheme);
    } catch (e) {
      console.warn(e);
    }
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const handleFontChange = (newFont: string) => {
    setFont(newFont);
    try {
      localStorage.setItem("thread-font", newFont);
    } catch (e) {
      console.warn(e);
    }
    document.documentElement.setAttribute("data-font", newFont);
  };

  const handleHeroStyleChange = (newStyle: string) => {
    setHeroStyle(newStyle);
    try {
      localStorage.setItem("thread-hero-style", newStyle);
    } catch (e) {
      console.warn(e);
    }
    document.documentElement.setAttribute("data-hero-style", newStyle);
  };

  const handleSecondaryStyleChange = (newStyle: string) => {
    setSecondaryStyle(newStyle);
    try {
      localStorage.setItem("thread-secondary-style", newStyle);
    } catch (e) {
      console.warn(e);
    }
    document.documentElement.setAttribute("data-hero-secondary", newStyle);
  };

  const getNextReview = (child: Child) => {
    if (child.isNew) return "Assessment pending";
    const name = child.name;
    if (name === "Maya") return "12 September";
    if (name === "Liam") return "18 October";
    if (name === "Sophia") return "24 September";
    return "12 September";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="pt-16 pb-24"
    >
      <PageContainer>
        <div className="mb-24">
        <span className="text-[0.66rem] tracking-[0.2em] uppercase text-slate-500 font-medium mb-3 block">
          Account & Workspace Configs
        </span>
        <h1 className="font-medium text-[2rem] leading-tight tracking-tight mb-3">
          Settings
        </h1>
        <p className="text-[1.05rem] text-slate-500 max-w-[50ch]">
          Manage active profiles, family access settings, clinical workspace
          credentials, and UI configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 mb-16 border-b border-black/10 pb-16">
        <div>
          <h2 className="text-[1.1rem] font-medium text-slate-900 tracking-tight">
            Parent Metadata
          </h2>
          <p className="text-[0.9rem] text-slate-500 mt-2 leading-relaxed">
            Update your contact details and how you'd like to be addressed in
            the application.
          </p>
        </div>
        <div className="bg-white rounded-tr-[36px] p-8 shadow-premium-light">
          <div className="mb-6">
            <label className="text-[0.66rem] tracking-[0.16em] uppercase text-slate-500 font-medium mb-2.5 block">
              Primary Parent Nickname
            </label>
            <Input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <div className="mb-8" id="notification-settings-section">
            <label className="text-[0.66rem] tracking-[0.16em] uppercase text-slate-500 font-medium mb-2.5 block">
              Contact Notification Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
            />
            <div className="flex items-center justify-between py-2 border-t border-black/5 mt-6 mb-2">
              <span className="text-[0.85rem] text-slate-700 font-medium">
                Receive email notifications
              </span>
              <Switch
                checked={receiveNotifications}
                onCheckedChange={setReceiveNotifications}
              />
            </div>

            <div className="flex justify-start pt-2 pb-1">
              <Button variant="link" className="px-0 py-0 text-slate-500 hover:text-slate-900 border-none hover:opacity-100">
                Manage notification preferences
              </Button>
            </div>
          </div>
          <Button variant="slate">
            Save Parent Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12">
        <div>
          <h2 className="text-[1.1rem] font-medium text-slate-900 tracking-tight">
            Registered Children Profiles
          </h2>
          <p className="text-[0.9rem] text-slate-500 mt-2 leading-relaxed">
            Manage the children in your workspace. Switch between active
            profiles to view their specific timelines and resources.
          </p>
        </div>
        <div>
          <button
            onClick={onAddChildRequest}
            className="flex items-center gap-2.5 mb-6 text-slate-600 hover:text-slate-900 font-medium text-[0.9rem] transition-colors group"
          >
            <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:border-black/20 bg-white transition-colors">
              <Plus className="w-4 h-4 stroke-[2]" />
            </div>
            Add new child profile
          </button>

          <div className="space-y-4">
            {childrenList.map((child, i) => {
              const isActive = currentChild.name === child.name;
              const cornerClasses = [
                "rounded-tl-[32px]",
                "rounded-tr-[32px]",
                "rounded-br-[32px]",
                "rounded-bl-[32px]",
              ];
              const cornerClass = cornerClasses[i % cornerClasses.length];

              return (
                <div
                  key={`${child.name}-${i}`}
                  className={cn(
                    "bg-white p-6 transition-all flex items-center justify-between gap-6",
                    isActive
                      ? "shadow-sm shadow-[var(--color-thread-mid-green)]/20"
                      : "shadow-premium-light hover:shadow-md",
                    cornerClass,
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-[46px] h-[46px] rounded-full bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] flex items-center justify-center font-medium text-[1.2rem] font-serif flex-shrink-0">
                      {child.initial}
                    </div>
                    <div>
                      <h3 className="font-medium text-[1.1rem] text-slate-900 tracking-tight">
                        {child.name}
                      </h3>
                      <p className="text-[0.84rem] text-slate-500 mt-0.5">
                        Age {child.age} · {child.isNew ? "Session booked · Assessment pending" : `Next Review on ${getNextReview(child)}`}
                      </p>
                    </div>
                  </div>

                  {isActive ? (
                    <div className="flex items-center gap-2 text-[var(--color-thread-mid-green)] bg-[var(--color-thread-light-green)]/40 px-3.5 py-1.5 rounded-full">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span className="text-[0.74rem] font-medium tracking-wide uppercase">
                        Currently Active
                      </span>
                    </div>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setChild(child)}
                      className="text-[0.84rem] font-medium text-slate-600 hover:text-slate-900 bg-[var(--color-thread-off-white)] hover:bg-[var(--color-thread-light-green)] border border-black/5 px-5 py-3 rounded-full transition-colors whitespace-nowrap min-h-[44px]"
                    >
                      Switch Active
                    </motion.button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Theme & Colors Config Section */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 mt-16 border-t border-black/10 pt-16">
        <div>
          <h2 className="text-[1.1rem] font-medium text-slate-900 tracking-tight">
            Interface Theme & Colors
          </h2>
          <p className="text-[0.9rem] text-slate-500 mt-2 leading-relaxed">
            Customize the dynamic application layout, brand typography skins, and background contrasts to adapt the clinical interface to your aesthetic environment.
          </p>
        </div>
        <div className="space-y-6">
          {/* Theme Option Row */}
          <div className="bg-white p-6 rounded-tr-[36px] shadow-premium-light border border-black/5">
            <span className="text-[0.66rem] tracking-[0.16em] uppercase text-slate-400 font-medium mb-3.5 block">
              Primary Theme Mood
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleThemeChange("energetic")}
                className={cn(
                  "flex items-center justify-between p-5 rounded-2xl border text-left transition-all cursor-pointer min-h-[64px]",
                  theme === "energetic"
                    ? "border-[var(--color-thread-mid-green)] bg-[var(--color-thread-light-green)]/30 ring-2 ring-[var(--color-thread-mid-green)]/10"
                    : "border-black/5 hover:border-black/15 bg-slate-50/40 hover:bg-slate-50/90"
                )}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-[0.95rem] text-slate-900">Energetic Mint</span>
                  <span className="text-[0.74rem] text-slate-500 mt-0.5">Vibrant Emerald focus</span>
                </div>
                {theme === "energetic" && (
                  <div className="w-5 h-5 rounded-full bg-[var(--color-thread-mid-green)] flex items-center justify-center text-white">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleThemeChange("classic")}
                className={cn(
                  "flex items-center justify-between p-5 rounded-2xl border text-left transition-all cursor-pointer min-h-[64px]",
                  theme === "classic"
                    ? "border-[var(--color-thread-mid-green)] bg-[var(--color-thread-light-green)]/30 ring-2 ring-[var(--color-thread-mid-green)]/10"
                    : "border-black/5 hover:border-black/15 bg-slate-50/40 hover:bg-slate-50/90"
                )}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-[0.95rem] text-slate-900">Classic Vintage</span>
                  <span className="text-[0.74rem] text-slate-500 mt-0.5">Deep forest clinical prestige</span>
                </div>
                {theme === "classic" && (
                  <div className="w-5 h-5 rounded-full bg-[var(--color-thread-mid-green)] flex items-center justify-center text-white">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </motion.button>
            </div>
          </div>

          {/* Font Option Row */}
          <div className="bg-white p-6 rounded-tl-[36px] shadow-premium-light border border-black/5">
            <span className="text-[0.66rem] tracking-[0.16em] uppercase text-slate-400 font-medium mb-3.5 block">
              Serif Typography Style
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleFontChange("modern-serif")}
                className={cn(
                  "flex items-center justify-between p-5 rounded-2xl border text-left transition-all cursor-pointer min-h-[64px]",
                  font === "modern-serif"
                    ? "border-[var(--color-thread-mid-green)] bg-[var(--color-thread-light-green)]/30 ring-2 ring-[var(--color-thread-mid-green)]/10"
                    : "border-black/5 hover:border-black/15 bg-slate-50/40 hover:bg-slate-50/90"
                )}
              >
                <div className="flex flex-col">
                  <span className="font-serif font-medium text-[1.1rem] text-slate-900">Fraunces</span>
                  <span className="text-[0.74rem] text-slate-500 mt-0.5">Organic, warm & human</span>
                </div>
                {font === "modern-serif" && (
                  <div className="w-5 h-5 rounded-full bg-[var(--color-thread-mid-green)] flex items-center justify-center text-white">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleFontChange("classic-serif")}
                className={cn(
                  "flex items-center justify-between p-5 rounded-2xl border text-left transition-all cursor-pointer min-h-[64px]",
                  font === "classic-serif"
                    ? "border-[var(--color-thread-mid-green)] bg-[var(--color-thread-light-green)]/30 ring-2 ring-[var(--color-thread-mid-green)]/10"
                    : "border-black/5 hover:border-black/15 bg-slate-50/40 hover:bg-slate-50/90"
                )}
              >
                <div className="flex flex-col">
                  <span className="font-serif font-medium text-[1.1rem] text-slate-900" style={{ fontFamily: "Frank Ruhl Libre" }}>Frank Ruhl</span>
                  <span className="text-[0.74rem] text-slate-500 mt-0.5">Traditional clinical editorial</span>
                </div>
                {font === "classic-serif" && (
                  <div className="w-5 h-5 rounded-full bg-[var(--color-thread-mid-green)] flex items-center justify-center text-white">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </motion.button>
            </div>
          </div>

          {/* Hero & Card Styles Row */}
          <div className="bg-white p-6 rounded-br-[36px] shadow-premium-light border border-black/5">
            <span className="text-[0.66rem] tracking-[0.16em] uppercase text-slate-400 font-medium mb-3.5 block">
              Theme Accents & Contrast Pairs
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Hero Canvas Card Toggle */}
              <div className="flex flex-col gap-2">
                <span className="text-[0.7rem] font-medium text-slate-500 uppercase tracking-wider">
                  Primary Hero Cards
                </span>
                <div className="flex bg-slate-100 rounded-xl p-1.5 border border-black/5">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleHeroStyleChange("white")}
                    className={cn(
                      "flex-1 text-center py-3 text-[0.82rem] font-medium rounded-lg transition-all cursor-pointer min-h-[44px]",
                      heroStyle === "white"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    White Canvas
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleHeroStyleChange("green")}
                    className={cn(
                      "flex-1 text-center py-3 text-[0.82rem] font-medium rounded-lg transition-all cursor-pointer min-h-[44px]",
                      heroStyle === "green"
                        ? "bg-[var(--color-thread-mid-green)] text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    Solid Accent
                  </motion.button>
                </div>
              </div>

              {/* Secondary Card Toggle */}
              <div className="flex flex-col gap-2">
                <span className="text-[0.7rem] font-medium text-slate-500 uppercase tracking-wider">
                  Secondary Highlights
                </span>
                <div className="flex bg-slate-100 rounded-xl p-1.5 border border-black/5">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSecondaryStyleChange("light")}
                    className={cn(
                      "flex-1 text-center py-3 text-[0.82rem] font-medium rounded-lg transition-all cursor-pointer min-h-[44px]",
                      secondaryStyle === "light"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    Mint Soft
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSecondaryStyleChange("dark")}
                    className={cn(
                      "flex-1 text-center py-3 text-[0.82rem] font-medium rounded-lg transition-all cursor-pointer min-h-[44px]",
                      secondaryStyle === "dark"
                        ? "bg-[var(--color-thread-dark-forest)] text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    Forest Dark
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Style Guide Audit Block */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 mt-16 border-t border-black/10 pt-16">
        <div>
          <h2 className="text-[1.1rem] font-medium text-slate-900 tracking-tight">
            Design Tokens & Styles
          </h2>
          <p className="text-[0.9rem] text-slate-500 mt-2 leading-relaxed">
            Audit the fully scanned application color codes, typography hierarchy scales, 
            micro-components, and container layout rules in an interactive style guide.
          </p>
        </div>
        <div>
          <div className="bg-white p-6 rounded-tr-[36px] shadow-premium-light flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="font-medium text-[1.1rem] text-slate-900 tracking-tight">
                Scanned Style Guide
              </h3>
              <p className="text-[0.84rem] text-slate-500 mt-0.5">
                Fonts, interactive buttons, border shapes, and hex palettes.
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => onPageChange("style-guide")}
              className="text-[0.84rem] font-medium text-[var(--color-thread-mid-green)] hover:text-white bg-[var(--color-thread-light-green)] hover:bg-[var(--color-thread-mid-green)] px-6 py-3 rounded-full transition-all whitespace-nowrap inline-flex items-center gap-1.5 shadow-sm min-h-[44px]"
            >
              Open Design Guide <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
      </PageContainer>
    </motion.div>
  );
}
