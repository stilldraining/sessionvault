import svgPaths from "../imports/svg-tablist";

export type TabItem = {
  id: string;
  title: string;
  url: string;
  savedToNotion?: boolean;
};

type TabListProps = {
  tabs: TabItem[];
  selectedTabIds: Set<string>;
  onTabSelect: (tabId: string) => void;
  onTabClick: (tab: TabItem) => void;
  onClearSelection: () => void;
  isGraveyardSession?: boolean;
};

function King() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="King">
          <path d={svgPaths.p394618f0} fill="var(--fill-0, #A4FF12)" id="Vector" />
          <path d={svgPaths.pf280980} fill="var(--fill-0, #A4FF12)" id="Vector_2" opacity="0.4" />
          <path d={svgPaths.p15933a00} fill="var(--fill-0, #A4FF12)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function SessionOrganisedBanner() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center p-[8px] relative w-full">
          <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-center justify-center min-h-px min-w-px relative shrink-0">
            <King />
            <div className="flex flex-col font-['Departure_Mono',monospace] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[12px] text-center text-white w-[min-content]">
              <p className="leading-[1.4]">SESSION ORGANISED</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GraveyardSkull() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Skull">
          <path clipRule="evenodd" d={svgPaths.p2fb32400} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" opacity="0.4" />
          <path clipRule="evenodd" d={svgPaths.p288de080} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p36674780} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p17506580} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector_4" />
          <path clipRule="evenodd" d={svgPaths.p1ea15100} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector_5" />
          <path clipRule="evenodd" d={svgPaths.p3f128d00} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector_6" />
          <path clipRule="evenodd" d={svgPaths.p30a51700} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector_7" />
        </g>
      </svg>
    </div>
  );
}

function SessionDeceasedBanner() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center p-[8px] relative w-full">
          <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-center justify-center min-h-px min-w-px relative shrink-0">
            <GraveyardSkull />
            <div className="flex flex-col font-['Departure_Mono',monospace] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[12px] text-center text-white w-[min-content]">
              <p className="leading-[1.4]">SESSION DECEASED</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabCard({
  tab,
  isSelected,
  onSelect,
  onCopyUrl,
  isGraveyard,
}: {
  tab: TabItem;
  isSelected: boolean;
  onSelect: () => void;
  onCopyUrl: () => void;
  isGraveyard?: boolean;
}) {
  const handleContainerClick = (e: React.MouseEvent) => {
    // Don't allow interaction in graveyard
    if (isGraveyard) return;
    
    // Clicking the container selects the item
    e.preventDefault();
    e.stopPropagation();
    onSelect();
  };

  const handleUrlClick = (e: React.MouseEvent) => {
    // Don't allow interaction in graveyard
    if (isGraveyard) return;
    
    // Clicking the URL copies it to clipboard
    e.preventDefault();
    e.stopPropagation();
    onCopyUrl();
  };

  return (
    <button
      onClick={handleContainerClick}
      className={`relative rounded-[4px] shrink-0 w-full transition-all text-left ${
        isGraveyard 
          ? "cursor-default" 
          : isSelected 
            ? "bg-[#121212] cursor-pointer" 
            : "hover:bg-[#0a0a0a] cursor-pointer"
      }`}
      title={isGraveyard ? "" : "Click to select, click URL to copy"}
      disabled={isGraveyard}
    >
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center p-[8px] relative w-full">
          <div className="basis-0 content-stretch flex flex-col font-['Departure_Mono',monospace] grow items-start justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-left">
            <div className="flex flex-col justify-center min-w-full relative shrink-0 text-[14px] text-white w-[min-content]">
              <p className="leading-[1.4] truncate max-w-[350px]">{tab.title}</p>
            </div>
            <div className="flex flex-col justify-center relative shrink-0 text-[12px] text-[rgba(193,179,255,0.63)] text-nowrap">
              <p
                className={`leading-[1.4] whitespace-pre truncate max-w-[350px] ${
                  isGraveyard ? "cursor-default" : "cursor-pointer hover:text-[rgba(193,179,255,0.9)]"
                }`}
                onClick={handleUrlClick}
              >
                {tab.url}
              </p>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

export function TabList({ tabs, selectedTabIds, onTabSelect, onTabClick, onClearSelection, isGraveyardSession }: TabListProps) {
  const handleContainerClick = () => {
    // If clicking on the container (not stopped by a TabCard), clear selection
    onClearSelection();
  };

  // Separate tabs into saved and unsaved
  const savedTabs = tabs.filter((tab) => tab.savedToNotion);
  const unsavedTabs = tabs.filter((tab) => !tab.savedToNotion);
  
  // Check if all tabs are saved to Notion (and there are tabs)
  const allTabsSaved = tabs.length > 0 && savedTabs.length === tabs.length;

  if (tabs.length === 0) {
    return (
      <div 
        className="basis-0 grow min-h-px min-w-px relative shrink-0 flex items-center justify-center"
        onClick={handleContainerClick}
      >
        <div className="flex flex-col font-['Departure_Mono',monospace] text-[12px] text-[rgba(255,255,255,0.5)]">
          <p>No tabs in this session</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="basis-0 grow min-h-px min-w-px relative shrink-0 overflow-y-auto"
      onClick={handleContainerClick}
    >
      <div className="size-full" onClick={handleContainerClick}>
        <div className="box-border content-stretch flex flex-col gap-[4px] items-start p-[8px] relative w-full" onClick={handleContainerClick}>
          {allTabsSaved && <SessionOrganisedBanner />}
          {isGraveyardSession && <SessionDeceasedBanner />}
          
          <div className={isGraveyardSession ? "opacity-25 w-full flex flex-col gap-[4px]" : "w-full flex flex-col gap-[4px]"}>
            {unsavedTabs.map((tab) => (
              <TabCard
                key={tab.id}
                tab={tab}
                isSelected={selectedTabIds.has(tab.id)}
                onSelect={() => onTabSelect(tab.id)}
                onCopyUrl={() => onTabClick(tab)}
                isGraveyard={isGraveyardSession}
              />
            ))}
            
            {savedTabs.length > 0 && (
              <>
                {/* Saved to Notion Section Title */}
                <div className="box-border content-stretch flex gap-[10px] items-center pb-[8px] pt-[12px] px-0 relative shrink-0 w-full">
                  <div className="bg-[#1aa807] box-border content-stretch flex gap-[10px] items-center justify-center px-[2px] py-0 relative shrink-0">
                    <div className="flex flex-col font-['Departure_Mono',monospace] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black text-nowrap">
                      <p className="leading-[1.4] whitespace-pre">SAVED TO NOTION</p>
                    </div>
                  </div>
                </div>
                
                {savedTabs.map((tab) => (
                  <TabCard
                    key={tab.id}
                    tab={tab}
                    isSelected={selectedTabIds.has(tab.id)}
                    onSelect={() => onTabSelect(tab.id)}
                    onCopyUrl={() => onTabClick(tab)}
                    isGraveyard={isGraveyardSession}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

