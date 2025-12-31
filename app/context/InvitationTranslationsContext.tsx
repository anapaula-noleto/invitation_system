import { createContext, useContext } from 'react';

export interface InvitationTranslations {
  together: string;
  saveDate: string;
  location: string;
  ourStory: string;
  footerText: string;
  invitationBadge: string;
}

const InvitationTranslationsContext = createContext<InvitationTranslations | null>(null);

export function useInvitationTranslations() {
  const context = useContext(InvitationTranslationsContext);
  if (!context) {
    throw new Error('useInvitationTranslations must be used within InvitationTranslationsProvider');
  }
  return context;
}

export function InvitationTranslationsProvider({
  children,
  translations,
}: {
  children: React.ReactNode;
  translations: InvitationTranslations;
}) {
  return (
    <InvitationTranslationsContext.Provider value={translations}>
      {children}
    </InvitationTranslationsContext.Provider>
  );
}
