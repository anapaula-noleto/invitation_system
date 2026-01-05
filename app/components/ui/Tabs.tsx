'use client';

import { useState, createContext, useContext, useId, useEffect } from 'react';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
}

interface TabsProps {
  defaultTab: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ defaultTab, activeTab: controlledActiveTab, onTabChange, children, className = '' }: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab);
  const baseId = useId();

  // Use controlled or internal state
  const activeTab = controlledActiveTab ?? internalActiveTab;

  // Sync internal state with controlled state
  useEffect(() => {
    if (controlledActiveTab !== undefined) {
      setInternalActiveTab(controlledActiveTab);
    }
  }, [controlledActiveTab]);

  const setActiveTab = (id: string) => {
    if (onTabChange) {
      onTabChange(id);
    } else {
      setInternalActiveTab(id);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, baseId }}>
      <div className={`tabs ${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabList({ children, className = '' }: TabListProps) {
  return (
    <div className={`tabs-list ${className}`} role="tablist">
      {children}
    </div>
  );
}

interface TabProps {
  id: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function Tab({ id, children, icon }: TabProps) {
  const { activeTab, setActiveTab, baseId } = useTabs();
  const isActive = activeTab === id;

  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${id}`}
      aria-selected={isActive}
      aria-controls={`${baseId}-panel-${id}`}
      className={`tabs-tab ${isActive ? 'active' : ''}`}
      onClick={() => setActiveTab(id)}
    >
      {icon && <span className="tabs-tab-icon">{icon}</span>}
      <span className="tabs-tab-label">{children}</span>
    </button>
  );
}

interface TabPanelProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ id, children, className = '' }: TabPanelProps) {
  const { activeTab, baseId } = useTabs();
  const isActive = activeTab === id;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${id}`}
      aria-labelledby={`${baseId}-tab-${id}`}
      className={`tabs-panel ${className}`}
    >
      {children}
    </div>
  );
}
