// src/components/shared/HologramButton.tsx
'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './HologramButton.module.css';

interface HologramButtonProps {
  href: string;
  text: string;
  icon?: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function HologramButton({ href, text, icon, className, ariaLabel }: HologramButtonProps) {
  return (
    <Link href={href} passHref legacyBehavior>
      <a className={`${styles.btn} ${styles.hologram} ${className || ''}`} aria-label={ariaLabel || text}>
        {icon && <span className={styles.iconWrapper}>{icon}</span>}
        <span data-text={text} className={styles.textElement}>{text}</span>
        <div className={styles.scanLine}></div>
      </a>
    </Link>
  );
}
