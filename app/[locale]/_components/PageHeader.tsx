'use client';

import { useTranslations } from 'next-intl';

export function PageHeader() {
  const t = useTranslations();

  return (
    <header className="header">
      <span className="brand-mark">{t('header.brand')}</span>
      <h1 className="title">
        <span className="title-accent">{t('header.titleAccent')}</span> {t('header.titleSuffix')}
      </h1>
      <p className="subtitle">{t('header.subtitle')}</p>
      <div className="decorative-line">
        <span className="line"></span>
        <span className="ornament">✦</span>
        <span className="line"></span>
      </div>
      <p className="tagline">{t('header.tagline')}</p>
    </header>
  );
}
