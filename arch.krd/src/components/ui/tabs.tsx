
import * as React from 'react';

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, className, children }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  return (
    <div className={className}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        return child;
      })}
    </div>
  );
};

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({ className, children }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (value: string) => void;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ 
  value, 
  className, 
  children,
  activeTab,
  setActiveTab 
}) => {
  return (
    <button
      className={`${className} ${activeTab === value ? 'bg-black text-white' : ''}`}
      onClick={() => setActiveTab?.(value)}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  activeTab?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({ 
  value, 
  children,
  activeTab 
}) => {
  if (activeTab !== value) return null;
  return <div>{children}</div>;
};