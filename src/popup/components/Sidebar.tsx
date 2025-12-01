import svgPaths from "../imports/svg-sidebar";

export type SessionItem = {
  id: string;
  tabCount: number;
  timestamp?: string;
  label?: string;
  isActive?: boolean;
  isGraveyard?: boolean;
};

type SidebarProps = {
  sessions: SessionItem[];
  selectedSessionId: string;
  onSessionSelect: (sessionId: string) => void;
};

function SkullIcon() {
  return (
    <div className="relative shrink-0 size-[14px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Skull">
          <path clipRule="evenodd" d={svgPaths.p22aefd00} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function SectionTitle({ title, icon }: { title: string; icon?: React.ReactNode }) {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center pb-[4px] pt-[16px] px-0 relative shrink-0 w-full">
      <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0">
        {icon}
        <div className="flex flex-col font-['Departure_Mono',monospace] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-nowrap text-white">
          <p className="leading-[1.4] whitespace-pre">{title}</p>
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="opacity-[0.15] relative shrink-0 w-full">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start px-[8px] py-0 relative w-full">
          <div className="h-px relative rounded-[5px] shrink-0 w-full">
            <div className="flex flex-row items-center size-full">
              <div className="h-px w-full" />
            </div>
            <div aria-hidden="true" className="absolute border border-dashed border-white inset-0 pointer-events-none rounded-[5px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionCard({
  session,
  isSelected,
  onClick,
}: {
  session: SessionItem;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div 
      onClick={onClick}
      className={`relative rounded-[5px] shrink-0 w-full cursor-pointer hover:bg-[#0a0a0a] transition-colors ${isSelected && !session.isActive ? 'bg-[#121212]' : ''}`}
    >
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className={`box-border content-stretch flex gap-[10px] items-center p-[8px] relative w-full ${isSelected ? 'bg-[#121212]' : ''}`}>
          <div className="content-stretch flex flex-col font-['Departure_Mono',monospace] items-start justify-center leading-[0] not-italic relative shrink-0 text-nowrap text-left">
            <div className="flex flex-col justify-center relative shrink-0 text-[14px] text-white">
              <p className="leading-[1.4] text-nowrap whitespace-pre">{session.tabCount} {session.tabCount === 1 ? 'tab' : 'tabs'}</p>
            </div>
            {session.isActive ? (
              <div className="flex flex-col justify-center relative shrink-0 text-[12px] text-[springgreen]">
                <p className="leading-[1.4] text-nowrap whitespace-pre">{session.label}</p>
              </div>
            ) : (
              <div className={`flex flex-col justify-center relative shrink-0 text-[12px] ${isSelected ? 'text-[#7763ce]' : 'text-[rgba(255,255,255,0.5)]'}`}>
                <p className="leading-[1.4] text-nowrap whitespace-pre">{session.timestamp}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ sessions, selectedSessionId, onSessionSelect }: SidebarProps) {
  const activeSession = sessions.find((s) => s.isActive);
  const historySessions = sessions.filter((s) => !s.isActive && !s.isGraveyard);
  const graveyardSessions = sessions.filter((s) => s.isGraveyard);

  return (
    <div className="box-border content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[200px] overflow-y-auto">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-[rgba(255,255,255,0.12)] border-dashed inset-0 pointer-events-none" />
      
      {activeSession && (
        <SessionCard
          session={activeSession}
          isSelected={selectedSessionId === activeSession.id}
          onClick={() => onSessionSelect(activeSession.id)}
        />
      )}

      {historySessions.length > 0 && (
        <>
          <SectionTitle title="HISTORY" />
          {historySessions.map((session, index) => (
            <div key={session.id} className="w-full">
              <SessionCard
                session={session}
                isSelected={selectedSessionId === session.id}
                onClick={() => onSessionSelect(session.id)}
              />
              {index < historySessions.length - 1 && <Divider />}
            </div>
          ))}
        </>
      )}

      {graveyardSessions.length > 0 && (
        <>
          <SectionTitle title="GRAVEYARD" icon={<SkullIcon />} />
          {graveyardSessions.map((session, index) => (
            <div key={session.id} className="w-full">
              <SessionCard
                session={session}
                isSelected={selectedSessionId === session.id}
                onClick={() => onSessionSelect(session.id)}
              />
              {index < graveyardSessions.length - 1 && <Divider />}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

