import React, { useState } from 'react';
import {
  X,
  Palette,
  Sun,
  Moon,
  Check,
  Sparkles,
  CheckCircle2,
  Type,
} from 'lucide-react';
import { useTheme, PaletteId, FontPreset } from '../context/ThemeContext';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    palette,
    mode,
    fontPreset,
    setPalette,
    setMode,
    setFontPreset,
    availablePalettes,
    availableFontPresets,
  } = useTheme();

  const [activeTab, setActiveTab] = useState<'palettes' | 'typography'>('palettes');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSelectPalette = (newPaletteId: PaletteId) => {
    setPalette(newPaletteId);
    if (newPaletteId === 'luxury-atelier' || newPaletteId === 'burgundy-lavender') {
      setMode('dark');
    } else if (newPaletteId === 'pink-plum') {
      setMode('light');
    }
  };

  const handleSelectFont = (newFontId: FontPreset) => {
    setFontPreset(newFontId);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 450);
  };

  const activeFont = availableFontPresets.find((f) => f.id === fontPreset);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[var(--card-bg)] text-[var(--text-primary)] w-full max-w-3xl max-h-[88vh] overflow-hidden rounded-2xl shadow-2xl border border-[var(--card-border)] relative flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 pb-4 border-b border-[var(--card-border)] bg-[var(--card-bg)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--card-inner-bg)] text-[var(--accent-amber)] flex items-center justify-center border border-[var(--card-inner-border)] shadow-xs">
              {activeTab === 'palettes' ? <Palette className="w-4 h-4" /> : <Type className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-editorial text-[var(--text-primary)] tracking-tight">
                Studio Styling &amp; Typography
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Customize visual themes, dynamic lighting gradients, and typography independently
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--card-inner-bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 border-b border-[var(--card-border)] bg-[var(--card-inner-bg)]/40 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('palettes')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all cursor-pointer border-b-2 ${
              activeTab === 'palettes'
                ? 'border-[var(--accent-amber)] text-[var(--text-primary)] bg-[var(--card-bg)] shadow-2xs'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Color Palettes &amp; Lighting ({availablePalettes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('typography')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all cursor-pointer border-b-2 ${
              activeTab === 'typography'
                ? 'border-[var(--accent-amber)] text-[var(--text-primary)] bg-[var(--card-bg)] shadow-2xs'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Typography Presets ({availableFontPresets.length})</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] text-[var(--accent-secondary)] font-mono">
              Independent
            </span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          
          {activeTab === 'palettes' && (
            <>
              {/* Lighting Mode Selector */}
              <div className="p-4 rounded-xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                      Atmospheric Lighting Mode
                    </p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--card-bg)] border border-[var(--card-inner-border)] text-[var(--text-secondary)] font-medium">
                      Ambient Gradients Active
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Renders dynamic radial lighting and subtle studio vignettes tailored to your palette
                  </p>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-[var(--card-bg)] rounded-xl border border-[var(--card-inner-border)] self-start sm:self-auto shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setMode('light')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      mode === 'light'
                        ? 'bg-[var(--accent-amber)] text-[var(--nav-item-active-text,#181614)] shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Daylight</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('dark')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      mode === 'dark'
                        ? 'bg-[var(--accent-amber)] text-[var(--nav-item-active-text,#181614)] shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Studio Dark</span>
                  </button>
                </div>
              </div>

              {/* Palette Cards Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Editorial Palettes ({availablePalettes.length})
                  </p>
                  <span className="text-[11px] font-mono text-[var(--accent-amber)] font-semibold">
                    Current: {availablePalettes.find((p) => p.id === palette)?.name} ({mode})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {availablePalettes.map((opt) => {
                    const isSelected = palette === opt.id;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectPalette(opt.id)}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 relative ${
                          isSelected
                            ? 'border-[var(--accent-amber)] bg-[var(--card-inner-bg)] ring-2 ring-[var(--accent-amber)]/35 shadow-sm'
                            : 'border-[var(--card-inner-border)] bg-[var(--card-inner-bg)] hover:border-[var(--text-muted)]/50 opacity-90 hover:opacity-100 hover:shadow-2xs'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between w-full mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-[var(--text-primary)]">
                                {opt.name}
                              </span>
                              {opt.id === 'pink-plum' && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--card-bg)] border border-[var(--card-inner-border)] text-[var(--accent-secondary)] font-mono font-semibold">
                                  New
                                </span>
                              )}
                            </div>
                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-[var(--accent-amber)] text-[var(--nav-item-active-text,#181614)] flex items-center justify-center shrink-0">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            )}
                          </div>

                          <p className="text-[11px] text-[var(--text-secondary)] font-semibold mb-1">
                            {opt.tagline}
                          </p>

                          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed line-clamp-2">
                            {opt.description}
                          </p>
                        </div>

                        {/* 5-Color Swatch Palette Preview */}
                        <div className="pt-2.5 border-t border-[var(--card-inner-border)] flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {opt.swatches.map((hex, i) => (
                              <span
                                key={i}
                                className="w-4 h-4 rounded-sm border border-black/15 shadow-2xs"
                                style={{ backgroundColor: hex }}
                                title={hex}
                              />
                            ))}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: opt.accentColor }}
                            />
                            <span className="text-[10px] font-mono text-[var(--text-muted)]">
                              {opt.accentColor}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {activeTab === 'typography' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <p className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    Independent Typography Engine
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Toggle your headline and body fonts independently of color themes. All font options apply instantly across the whole application.
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-[var(--card-bg)] border border-[var(--card-inner-border)] text-xs font-mono text-[var(--accent-amber)] font-semibold shrink-0">
                  Active: {activeFont?.name}
                </div>
              </div>

              {/* Typography Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {availableFontPresets.map((f) => {
                  const isSelected = fontPreset === f.id;

                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => handleSelectFont(f.id)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 relative ${
                        isSelected
                          ? 'border-[var(--accent-amber)] bg-[var(--card-inner-bg)] ring-2 ring-[var(--accent-amber)]/35 shadow-sm'
                          : 'border-[var(--card-inner-border)] bg-[var(--card-inner-bg)] hover:border-[var(--text-muted)]/50 opacity-90 hover:opacity-100 hover:shadow-2xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between w-full mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[var(--text-primary)]">
                              {f.name}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--card-bg)] border border-[var(--card-inner-border)] text-[var(--accent-secondary)] font-medium">
                              {f.tag}
                            </span>
                          </div>
                          {isSelected && (
                            <div className="w-4 h-4 rounded-full bg-[var(--accent-amber)] text-[var(--nav-item-active-text,#181614)] flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          )}
                        </div>

                        {/* Live Font Headline Preview */}
                        <div className="my-2 p-2.5 rounded-lg bg-[var(--card-bg)] border border-[var(--card-inner-border)]">
                          <p className={`text-base font-bold text-[var(--text-primary)] ${f.previewClass}`}>
                            Film Production &amp; Crew
                          </p>
                          <p className="text-[11px] text-[var(--text-muted)] mt-1 line-clamp-1">
                            Body font: {f.bodyFont} • Headline: {f.headlineFont}
                          </p>
                        </div>

                        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                          {f.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[var(--card-inner-border)] flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
                        <span>{f.category}</span>
                        <span className={isSelected ? 'text-[var(--accent-amber)] font-bold' : ''}>
                          {isSelected ? '✓ Selected' : 'Click to apply'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between gap-3 p-4 border-t border-[var(--card-border)] bg-[var(--card-bg)]">
          <span className="text-[11px] text-[var(--text-muted)]">
            Changes persist across browser sessions in local storage
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-inner-bg)] transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="amber-pill-btn px-5 py-2 rounded-lg text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Applied</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Done</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
