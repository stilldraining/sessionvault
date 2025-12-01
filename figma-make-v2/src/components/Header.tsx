import svgPaths from "../imports/svg-dzyxnoxlkw";
import svgPathsHistory from "../imports/svg-x7auikxt7d";
import svgPathsMoveUp from "../imports/svg-sf74npz3wk";

type HeaderProps = {
  selectedCount: number;
  onSelectAll: () => void;
  onOpenLinks: () => void;
  onSaveSession: () => void;
  onDeleteSession: () => void;
  onReviveSession: () => void;
  onMoveToActive: () => void;
  isHistorySession?: boolean;
  isGraveyardSession?: boolean;
};

function SelectAllButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-zinc-900 box-border content-stretch flex gap-[10px] items-center justify-center pl-[9px] pr-[8px] py-[8px] relative rounded-[8px] shrink-0 cursor-pointer hover:bg-zinc-800 transition-colors"
    >
      <div aria-hidden="true" className="absolute border border-[#2c2c30] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['Departure_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-nowrap text-white">
        <p className="leading-[1.4] whitespace-pre">Select all</p>
      </div>
    </button>
  );
}

function ExternalLinkIcon() {
  return (
    <div className="absolute left-[9px] size-[16px] top-[9px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="External link">
          <path d={svgPaths.p1ab89780} fill="var(--fill-0, white)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function ExternalLinkButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-zinc-900 relative rounded-[100px] shrink-0 size-[33px] cursor-pointer hover:bg-zinc-800 transition-colors"
    >
      <div aria-hidden="true" className="absolute border border-[#2c2c30] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <ExternalLinkIcon />
    </button>
  );
}

function FloppyDiskIcon() {
  return (
    <div className="absolute left-[8px] size-[18px] top-[8px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="floppy disk save">
          <path clipRule="evenodd" d={svgPaths.p9191180} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p292b1f00} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function SaveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-[#3232ff] relative rounded-[100px] shrink-0 size-[33px] cursor-pointer hover:bg-[#4848ff] transition-colors"
    >
      <div aria-hidden="true" className="absolute border border-[#6f6ffe] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <FloppyDiskIcon />
    </button>
  );
}

function Divider() {
  return (
    <div className="flex h-[24px] items-center justify-center relative shrink-0 w-px" style={{ "--transform-inner-width": "24", "--transform-inner-height": "1" } as React.CSSProperties}>
      <div className="flex-none rotate-[90deg]">
        <div className="h-px relative rounded-[4px] w-[24px]">
          <div className="flex flex-row items-center size-full">
            <div className="h-px w-[24px]" />
          </div>
          <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.12)] border-solid inset-0 pointer-events-none rounded-[4px]" />
        </div>
      </div>
    </div>
  );
}

function SkullIcon() {
  return (
    <div className="absolute left-[7px] size-[18px] top-[8px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Skull">
          <path clipRule="evenodd" d={svgPathsHistory.p27c55b80} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-[#ca0101] relative rounded-[100px] shrink-0 size-[33px] cursor-pointer hover:bg-[#d41111] transition-colors"
    >
      <div aria-hidden="true" className="absolute border border-[#ff7e7e] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <SkullIcon />
    </button>
  );
}

function MoveUpIcon() {
  return (
    <div className="absolute left-[7px] size-[18px] top-[8px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Move Up">
          <path clipRule="evenodd" d={svgPathsMoveUp.p265ec00} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPathsMoveUp.p2047bf00} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPathsMoveUp.pdc26700} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPathsMoveUp.p9cabc00} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function MoveToActiveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-zinc-900 relative rounded-[100px] shrink-0 size-[33px] cursor-pointer hover:bg-zinc-800 transition-colors"
    >
      <div aria-hidden="true" className="absolute border border-[#2c2c30] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <MoveUpIcon />
    </button>
  );
}

function ReviveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-zinc-900 box-border content-stretch flex gap-[10px] items-center justify-center pl-[9px] pr-[8px] py-[8px] relative rounded-[8px] shrink-0 cursor-pointer hover:bg-zinc-800 transition-colors"
    >
      <div aria-hidden="true" className="absolute border border-[#2c2c30] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['Departure_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-nowrap text-white">
        <p className="leading-[1.4] whitespace-pre">Revive</p>
      </div>
    </button>
  );
}

export function Header({ selectedCount, onSelectAll, onOpenLinks, onSaveSession, onDeleteSession, onReviveSession, onMoveToActive, isHistorySession, isGraveyardSession }: HeaderProps) {
  if (selectedCount > 0) {
    // When tabs are selected in a history session, show 3 buttons
    if (isHistorySession) {
      return (
        <div className="min-w-[200px] relative shrink-0 w-full">
          <div className="flex flex-row items-center min-w-inherit overflow-clip rounded-[inherit] size-full">
            <div className="box-border content-stretch flex gap-[12px] items-center min-w-inherit p-[12px] relative w-full">
              <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0">
                <div className="flex flex-col font-['Departure_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-nowrap text-white">
                  <p className="leading-[1.4] whitespace-pre">{selectedCount} {selectedCount === 1 ? 'TAB' : 'TABS'} SELECTED</p>
                </div>
                <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
                  <ExternalLinkButton onClick={onOpenLinks} />
                  <MoveToActiveButton onClick={onMoveToActive} />
                  <Divider />
                  <SaveButton onClick={onSaveSession} />
                </div>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(255,255,255,0.12)] border-dashed inset-0 pointer-events-none" />
        </div>
      );
    }
    
    // When tabs are selected in active window, show 2 buttons
    return (
      <div className="min-w-[200px] relative shrink-0 w-full">
        <div className="flex flex-row items-center min-w-inherit overflow-clip rounded-[inherit] size-full">
          <div className="box-border content-stretch flex gap-[12px] items-center min-w-inherit p-[12px] relative w-full">
            <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0">
              <div className="flex flex-col font-['Departure_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-nowrap text-white">
                <p className="leading-[1.4] whitespace-pre">{selectedCount} {selectedCount === 1 ? 'TAB' : 'TABS'} SELECTED</p>
              </div>
              <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
                <ExternalLinkButton onClick={onOpenLinks} />
                <Divider />
                <SaveButton onClick={onSaveSession} />
              </div>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(255,255,255,0.12)] border-dashed inset-0 pointer-events-none" />
      </div>
    );
  }

  // When history session is selected (no tabs selected), show open + delete buttons
  if (isHistorySession) {
    return (
      <div className="h-[57px] min-w-[200px] relative shrink-0 w-[600px]">
        <div className="box-border content-stretch flex gap-[12px] h-[57px] items-center min-w-inherit overflow-clip p-[12px] relative rounded-[inherit] w-[600px]">
          <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0">
            <div className="flex flex-col font-['Departure_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-white">
              <p className="leading-[1.4] whitespace-pre">{`SESSION VAULT `}</p>
            </div>
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
              <ExternalLinkButton onClick={onOpenLinks} />
              <DeleteButton onClick={onDeleteSession} />
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(255,255,255,0.12)] border-dashed inset-0 pointer-events-none" />
      </div>
    );
  }

  // When graveyard session is selected (no tabs selected), show only revive button
  if (isGraveyardSession) {
    return (
      <div className="h-[57px] min-w-[200px] relative shrink-0 w-[600px]">
        <div className="box-border content-stretch flex gap-[12px] h-[57px] items-center min-w-inherit overflow-clip p-[12px] relative rounded-[inherit] w-[600px]">
          <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0">
            <div className="flex flex-col font-['Departure_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-white">
              <p className="leading-[1.4] whitespace-pre">{`SESSION VAULT `}</p>
            </div>
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
              <ReviveButton onClick={onReviveSession} />
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(255,255,255,0.12)] border-dashed inset-0 pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="h-[57px] min-w-[200px] relative shrink-0 w-[600px]">
      <div className="box-border content-stretch flex gap-[12px] h-[57px] items-center min-w-inherit overflow-clip p-[12px] relative rounded-[inherit] w-[600px]">
        <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0">
          <div className="flex flex-col font-['Departure_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-white">
            <p className="leading-[1.4] whitespace-pre">{`SESSION VAULT `}</p>
          </div>
          <SelectAllButton onClick={onSelectAll} />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(255,255,255,0.12)] border-dashed inset-0 pointer-events-none" />
    </div>
  );
}