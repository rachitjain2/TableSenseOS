// TableSense OS Design Tokens
// Single source of truth for color scales, typography, elevation, geometry, and motion

export const TOKENS = {
  colors: {
    // 12-Step Neutrals for Dark & Light
    neutrals: {
      dark: {
        bg: '#0B0D11',
        surface1: '#12151C',
        surface2: '#1A1E28',
        surface3: '#242936',
        border: '#2E3545',
        borderMuted: '#1E2330',
        textMuted: '#717B94',
        textSecondary: '#9CA3AF',
        textPrimary: '#F3F4F6',
        textHeading: '#FFFFFF',
      },
      light: {
        bg: '#F8FAF9',
        surface1: '#FFFFFF',
        surface2: '#F1F4F2',
        surface3: '#E2E8E4',
        border: '#D1DCD6',
        borderMuted: '#E5EDE8',
        textMuted: '#64746B',
        textSecondary: '#4B5563',
        textPrimary: '#111827',
        textHeading: '#030712',
      },
    },

    // AI Brand Primary: Electric Indigo-to-Cyan Gradient & Accents
    ai: {
      gradient: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
      primary: '#6366F1',
      secondary: '#06B6D4',
      glow: 'rgba(99, 102, 241, 0.25)',
      softBg: 'rgba(99, 102, 241, 0.08)',
      borderGlow: 'rgba(6, 182, 212, 0.3)',
    },

    // Semantics
    semantic: {
      success: '#10B981',
      successGlow: 'rgba(16, 185, 129, 0.2)',
      warning: '#F59E0B',
      warningGlow: 'rgba(245, 158, 11, 0.2)',
      critical: '#EF4444',
      criticalGlow: 'rgba(239, 68, 68, 0.25)',
      info: '#3B82F6',
      infoGlow: 'rgba(59, 130, 246, 0.2)',
    },

    // Data Viz Categorical Scale
    dataViz: [
      '#6366F1', // Indigo
      '#06B6D4', // Cyan
      '#10B981', // Emerald
      '#F59E0B', // Amber
      '#EC4899', // Pink
      '#8B5CF6', // Purple
      '#3B82F6', // Blue
      '#14B8A6', // Teal
    ],
  },

  radii: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },

  motion: {
    fast: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
    normal: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
    slow: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    aiPulse: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
  },

  typography: {
    fontSans: 'Inter, system-ui, -apple-system, sans-serif',
    fontDisplay: '"Plus Jakarta Sans", system-ui, sans-serif',
    fontMono: '"JetBrains Mono", monospace',
  },
};
