import type { Session, SessionMetadata } from '../../lib/types';

interface SessionCardProps {
  session: Session | SessionMetadata;
  onClick: () => void;
}

export default function SessionCard({ session, onClick }: SessionCardProps) {
  const isCurrentSession = session.id === 'current';
  
  const date = new Date(session.timestamp);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Support both full Session and SessionMetadata
  const totalTabs = 'tabCount' in session ? session.tabCount : session.tabs.length;
  const pendingTabs = 'pendingTabCount' in session 
    ? session.pendingTabCount 
    : session.tabs.filter((t) => t.status === 'pending').length;

  return (
    <div className={`session-card ${isCurrentSession ? 'session-card-current' : ''}`} onClick={onClick}>
      <div className="session-card-header">
        <div className="session-date">
          {isCurrentSession ? 'Current Session' : formattedDate}
        </div>
        <div className={`session-status session-status-${session.status}`}>
          {session.status}
        </div>
      </div>
      <div className="session-card-body">
        <div className="session-tabs-count">
          {totalTabs} {totalTabs === 1 ? 'tab' : 'tabs'}
        </div>
        {session.status === 'pending' && pendingTabs > 0 && (
          <div className="session-pending-indicator">
            {pendingTabs} pending
          </div>
        )}
      </div>
    </div>
  );
}

