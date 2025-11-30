import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface SessionActionsContextType {
  onRestoreWindow?: () => void;
  onArchiveSession?: () => void;
  onDeleteSession?: () => void;
  onRestoreSession?: () => void;
  setSessionActions: (actions: {
    onRestoreWindow?: () => void;
    onArchiveSession?: () => void;
    onDeleteSession?: () => void;
    onRestoreSession?: () => void;
  }) => void;
}

const SessionActionsContext = createContext<SessionActionsContextType | undefined>(undefined);

export function SessionActionsProvider({ children }: { children: ReactNode }) {
  const [sessionActions, setSessionActionsState] = useState<{
    onRestoreWindow?: () => void;
    onArchiveSession?: () => void;
    onDeleteSession?: () => void;
    onRestoreSession?: () => void;
  } | null>(null);

  const setSessionActions = useCallback((actions: {
    onRestoreWindow?: () => void;
    onArchiveSession?: () => void;
    onDeleteSession?: () => void;
    onRestoreSession?: () => void;
  }) => {
    setSessionActionsState(actions);
  }, []);

  return (
    <SessionActionsContext.Provider
      value={{
        onRestoreWindow: sessionActions?.onRestoreWindow,
        onArchiveSession: sessionActions?.onArchiveSession,
        onDeleteSession: sessionActions?.onDeleteSession,
        onRestoreSession: sessionActions?.onRestoreSession,
        setSessionActions,
      }}
    >
      {children}
    </SessionActionsContext.Provider>
  );
}

export function useSessionActions() {
  const context = useContext(SessionActionsContext);
  if (context === undefined) {
    throw new Error('useSessionActions must be used within a SessionActionsProvider');
  }
  return context;
}

