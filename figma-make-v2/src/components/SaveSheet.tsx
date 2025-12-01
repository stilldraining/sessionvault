import { motion } from "motion/react";
import svgPaths from "../imports/svg-t87ige2x1i";

type SaveSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
};

function CloseRemoveIcon() {
  return (
    <div className="absolute left-[8px] size-[18px] top-[8px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Close remove">
          <path clipRule="evenodd" d={svgPaths.pf1aab80} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-zinc-900 relative rounded-[100px] shrink-0 size-[33px] cursor-pointer hover:bg-zinc-800 transition-colors"
    >
      <div aria-hidden="true" className="absolute border border-[#2c2c30] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <CloseRemoveIcon />
    </button>
  );
}

function ArrowDownIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[18px]">
      <div className="absolute inset-[32.29%_17.71%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 7">
          <g id="Arrow---Down-2">
            <path d={svgPaths.pbf76700} fill="var(--fill-0, white)" id="Stroke-1" />
          </g>
        </svg>
      </div>
    </div>
  );
}

export function SaveSheet({ isOpen, onClose, onSave }: SaveSheetProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute bg-[rgba(255,255,255,0.19)] h-[457px] left-0 top-0 w-[600px] z-10"
        onClick={onClose}
      />

      {/* Save Panel */}
      <motion.div
        initial={{ x: 250 }}
        animate={{ x: 0 }}
        exit={{ x: 250 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute bg-black content-stretch flex flex-col h-[457px] items-start justify-between left-[350px] overflow-clip top-0 w-[250px] z-20"
      >
        {/* Header */}
        <div className="relative shrink-0 w-full">
          <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
            <div className="box-border content-stretch flex gap-[12px] items-center p-[12px] relative w-full">
              <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0">
                <div className="flex flex-col font-['Departure_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-nowrap text-white">
                  <p className="leading-[1.4] whitespace-pre">SAVE TO NOTION</p>
                </div>
                <CloseButton onClick={onClose} />
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(255,255,255,0.12)] border-dashed inset-0 pointer-events-none" />
        </div>

        {/* Form */}
        <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full">
          <div className="size-full">
            <div className="box-border content-stretch flex flex-col gap-[10px] items-start p-[16px] relative size-full">
              {/* Location Selector */}
              <button className="bg-[rgba(255,255,255,0.06)] relative rounded-[4px] shrink-0 w-full cursor-pointer hover:bg-[rgba(255,255,255,0.08)] transition-colors">
                <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                  <div className="box-border content-stretch flex items-center justify-between p-[8px] relative w-full">
                    <div className="flex flex-col font-['Departure_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(255,255,255,0.5)] text-nowrap">
                      <p className="leading-[1.4] whitespace-pre">Choose location</p>
                    </div>
                    <ArrowDownIcon />
                  </div>
                </div>
              </button>

              {/* Title Input */}
              <input
                type="text"
                placeholder="Enter title"
                className="bg-[rgba(255,255,255,0.06)] relative rounded-[4px] shrink-0 w-full border-none outline-none font-['Departure_Mono:Regular',sans-serif] text-[12px] text-white placeholder:text-[rgba(255,255,255,0.5)] p-[8px] focus:bg-[rgba(255,255,255,0.08)] transition-colors"
              />

              {/* Tags Input */}
              <input
                type="text"
                placeholder="Enter tags"
                className="bg-[rgba(255,255,255,0.06)] relative rounded-[4px] shrink-0 w-full border-none outline-none font-['Departure_Mono:Regular',sans-serif] text-[12px] text-white placeholder:text-[rgba(255,255,255,0.5)] p-[8px] focus:bg-[rgba(255,255,255,0.08)] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="relative shrink-0 w-full">
          <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
            <div className="box-border content-stretch flex gap-[12px] items-center p-[12px] relative w-full">
              <button
                onClick={onSave}
                className="basis-0 bg-[#3232ff] grow min-h-px min-w-px relative rounded-[8px] shrink-0 cursor-pointer hover:bg-[#4848ff] transition-colors"
              >
                <div aria-hidden="true" className="absolute border border-[#6f6ffe] border-solid inset-0 pointer-events-none rounded-[8px]" />
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="box-border content-stretch flex gap-[10px] items-center justify-center pl-[9px] pr-[8px] py-[8px] relative w-full">
                    <div className="flex flex-col font-['Departure_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-nowrap text-white">
                      <p className="leading-[1.4] whitespace-pre">Save</p>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}