import React, { useId } from 'react';

/**
 * BrandLogo — Bespoke vector brand identity for PETOPIA
 * Combines a warm coral-to-amber squircle medallion, sculpted paw-heart crest,
 * golden sparkle accent, and refined two-tone wordmark.
 * Note: Always renders semantic <span> elements (never <h1>) to preserve page SEO hierarchy.
 */
export default function BrandLogo({
  size = 'md',
  variant = 'default', // 'default' | 'stacked' | 'markOnly'
  subtitle = 'SPA • THÚ Y 24/7 • PET SHOP',
  showSubtitle = true,
  className = '',
  style = {}
}) {
  const uid = useId().replace(/:/g, '');
  const bgGradId = `petopia-bg-${uid}`;
  const glossGradId = `petopia-gloss-${uid}`;
  const sparkGradId = `petopia-spark-${uid}`;

  const dimensions = {
    sm: { icon: 36, titleSize: '1.15rem', subSize: '0.58rem', gap: '0.6rem' },
    md: { icon: 44, titleSize: '1.42rem', subSize: '0.63rem', gap: '0.78rem' },
    lg: { icon: 54, titleSize: '1.72rem', subSize: '0.7rem', gap: '0.9rem' }
  }[size] || { icon: 44, titleSize: '1.42rem', subSize: '0.63rem', gap: '0.78rem' };

  const isStacked = variant === 'stacked';

  const emblemSvg = (
    <span
      aria-hidden="true"
      className="petopia-brand-emblem"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dimensions.icon,
        height: dimensions.icon,
        flexShrink: 0,
        filter: 'drop-shadow(0 8px 16px rgba(255, 90, 31, 0.28))'
      }}
    >
      <svg
        width={dimensions.icon}
        height={dimensions.icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={bgGradId} x1="6" y1="4" x2="60" y2="62" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF5722" />
            <stop offset="52%" stopColor="#FF7A38" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id={glossGradId} x1="12" y1="6" x2="42" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={sparkGradId} x1="46" y1="7" x2="57" y2="18" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>
        </defs>

        {/* Rounded Squircle Medallion */}
        <rect x="2" y="2" width="60" height="60" rx="18" fill={`url(#${bgGradId})`} />
        <rect
          x="3"
          y="3"
          width="58"
          height="58"
          rx="17"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="1.5"
        />

        {/* Soft Top-Left Specular Sheen */}
        <path
          d="M18 4H46C53.732 4 60 10.268 60 18V21C47 16 28 18 4 29V18C4 10.268 10.268 4 18 4Z"
          fill={`url(#${glossGradId})`}
        />

        {/* 4 Sculpted Pet Paw Toe Pads */}
        <ellipse
          cx="18.2"
          cy="28.6"
          rx="4.6"
          ry="6.1"
          transform="rotate(-22 18.2 28.6)"
          fill="#FFFFFF"
        />
        <ellipse
          cx="26.7"
          cy="20.4"
          rx="4.8"
          ry="6.5"
          transform="rotate(-8 26.7 20.4)"
          fill="#FFFFFF"
        />
        <ellipse
          cx="37.5"
          cy="20.4"
          rx="4.8"
          ry="6.5"
          transform="rotate(8 37.5 20.4)"
          fill="#FFFFFF"
        />
        <ellipse
          cx="45.8"
          cy="28.6"
          rx="4.6"
          ry="6.1"
          transform="rotate(22 45.8 28.6)"
          fill="#FFFFFF"
        />

        {/* Central Main Paw Pad Sculpted into a Care Heart */}
        <path
          d="M32 50.8C31.3 50.8 30.6 50.5 30 50C25.2 46 19.6 42.1 19.6 36.7C19.6 32.8 22.7 29.8 26.5 29.8C28.8 29.8 30.8 30.9 32 32.6C33.2 30.9 35.2 29.8 37.5 29.8C41.3 29.8 44.4 32.8 44.4 36.7C44.4 42.1 38.8 46 34 50C33.4 50.5 32.7 50.8 32 50.8Z"
          fill="#FFFFFF"
        />

        {/* Subtle Inner Coral Heart Dot (Signature Petopia Care Mark) */}
        <circle cx="32" cy="39.2" r="2.7" fill="#FF6B35" opacity="0.22" />

        {/* 4-Point Sparkle Star (5-Star Standard & Smart Platform) */}
        <path
          d="M51.5 8.5L52.8 11.7L56 13L52.8 14.3L51.5 17.5L50.2 14.3L47 13L50.2 11.7L51.5 8.5Z"
          fill={`url(#${sparkGradId})`}
        />
      </svg>
    </span>
  );

  if (variant === 'markOnly') {
    return (
      <span className={className} style={{ display: 'inline-flex', ...style }}>
        {emblemSvg}
      </span>
    );
  }

  return (
    <span
      className={`petopia-brand-lockup ${className}`}
      style={{
        display: 'inline-flex',
        flexDirection: isStacked ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: isStacked ? 'center' : 'flex-start',
        gap: isStacked ? '0.55rem' : dimensions.gap,
        textAlign: isStacked ? 'center' : 'left',
        userSelect: 'none',
        ...style
      }}
    >
      {emblemSvg}
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            justifyContent: isStacked ? 'center' : 'flex-start',
            fontSize: dimensions.titleSize,
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1.05
          }}
        >
          <span style={{ color: '#0f172a' }}>PET</span>
          <span
            style={{
              background: 'linear-gradient(135deg, #ff5722 0%, #ff7a38 55%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            OPIA
          </span>
          <span
            style={{
              display: 'inline-block',
              width: size === 'lg' ? 7 : 6,
              height: size === 'lg' ? 7 : 6,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff5722, #f59e0b)',
              marginLeft: '3px',
              marginBottom: '1px'
            }}
          />
        </span>

        {showSubtitle && (
          <span
            style={{
              fontSize: dimensions.subSize,
              fontWeight: 800,
              color: '#64748b',
              letterSpacing: '0.11em',
              marginTop: '3px',
              textTransform: 'uppercase'
            }}
          >
            {subtitle}
          </span>
        )}
      </span>
    </span>
  );
}
