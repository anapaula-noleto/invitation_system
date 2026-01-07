'use client';

import { useTranslations } from 'next-intl';

export function ReferenceInstructions() {
  const t = useTranslations('form.photos.referenceInstructions');

  return (
    <div className="reference-instructions">
      <h4 className="reference-instructions-title">{t('title')}</h4>
      <ul className="reference-instructions-list">
        <li>{t('tip1')}</li>
        <li>{t('tip2')}</li>
        <li>{t('tip3')}</li>
        <li>{t('tip4')}</li>
      </ul>
    </div>
  );
}
