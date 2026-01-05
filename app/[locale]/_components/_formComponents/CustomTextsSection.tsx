'use client';

import { AITextField } from '@/app/components/ui';

interface CustomTextsSection {
  greeting: {
    value: string;
    onChange: (value: string) => void;
    label: string;
    enhanceLabel: string;
    enhancingLabel: string;
    clearLabel: string;
  };
  story: {
    value: string;
    onChange: (value: string) => void;
    label: string;
    enhanceLabel: string;
    enhancingLabel: string;
    clearLabel: string;
  };
  closing: {
    value: string;
    onChange: (value: string) => void;
    label: string;
    enhanceLabel: string;
    enhancingLabel: string;
    clearLabel: string;
  };
  locale: string;
}

export function CustomTextsSection({
  greeting,
  story,
  closing,
  locale,
}: CustomTextsSection) {
  return (
    <div className="ai-text-fields">
      <AITextField
        textType="greeting"
        value={greeting.value}
        onChange={greeting.onChange}
        label={greeting.label}
        enhanceLabel={greeting.enhanceLabel}
        enhancingLabel={greeting.enhancingLabel}
        clearLabel={greeting.clearLabel}
        locale={locale}
      />

      <AITextField
        textType="story"
        value={story.value}
        onChange={story.onChange}
        label={story.label}
        enhanceLabel={story.enhanceLabel}
        enhancingLabel={story.enhancingLabel}
        clearLabel={story.clearLabel}
        locale={locale}
      />

      <AITextField
        textType="closing"
        value={closing.value}
        onChange={closing.onChange}
        label={closing.label}
        enhanceLabel={closing.enhanceLabel}
        enhancingLabel={closing.enhancingLabel}
        clearLabel={closing.clearLabel}
        locale={locale}
      />
    </div>
  );
}
