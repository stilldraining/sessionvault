import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface SelectionContextType {
  selectedTabs: Set<string>;
  toggleSelection: (tabId: string) => void;
  selectAll: (tabIds: string[]) => void;
  clearSelection: () => void;
  hasSelection: boolean;
  pendingTabIds: string[];
  setPendingTabIds: (ids: string[]) => void;
  onBulkBookmark?: () => void;
  onBulkSaveToNotion?: () => void;
  onBulkDismiss?: () => void;
  onBulkCloseTab?: () => void;
  onBulkMoveToActiveWindow?: () => void;
  onBulkRestoreTabs?: () => void;
  setBulkActions: (actions: {
    onBulkBookmark: () => void;
    onBulkSaveToNotion: () => void;
    onBulkDismiss?: () => void;
    onBulkCloseTab?: () => void;
    onBulkMoveToActiveWindow?: () => void;
    onBulkRestoreTabs?: () => void;
  }) => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedTabs, setSelectedTabs] = useState<Set<string>>(new Set());
  const [pendingTabIds, setPendingTabIds] = useState<string[]>([]);
  const [bulkActions, setBulkActionsState] = useState<{
    onBulkBookmark: () => void;
    onBulkSaveToNotion: () => void;
    onBulkDismiss?: () => void;
    onBulkCloseTab?: () => void;
    onBulkMoveToActiveWindow?: () => void;
    onBulkRestoreTabs?: () => void;
  } | null>(null);

  const toggleSelection = useCallback((tabId: string) => {
    setSelectedTabs((prev) => {
      const next = new Set(prev);
      if (next.has(tabId)) {
        next.delete(tabId);
      } else {
        next.add(tabId);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback((tabIds: string[]) => {
    setSelectedTabs(new Set(tabIds));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTabs(new Set());
  }, []);

  const setBulkActions = useCallback(
    (actions: {
      onBulkBookmark: () => void;
      onBulkSaveToNotion: () => void;
      onBulkDismiss?: () => void;
      onBulkCloseTab?: () => void;
      onBulkMoveToActiveWindow?: () => void;
      onBulkRestoreTabs?: () => void;
    }) => {
      setBulkActionsState(actions);
    },
    []
  );

  return (
    <SelectionContext.Provider
      value={{
        selectedTabs,
        toggleSelection,
        selectAll,
        clearSelection,
        hasSelection: selectedTabs.size > 0,
        pendingTabIds,
        setPendingTabIds,
        onBulkBookmark: bulkActions?.onBulkBookmark,
        onBulkSaveToNotion: bulkActions?.onBulkSaveToNotion,
        onBulkDismiss: bulkActions?.onBulkDismiss,
        onBulkCloseTab: bulkActions?.onBulkCloseTab,
        onBulkMoveToActiveWindow: bulkActions?.onBulkMoveToActiveWindow,
        onBulkRestoreTabs: bulkActions?.onBulkRestoreTabs,
        setBulkActions,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
}

