import svgPaths from "./svg-sf74npz3wk";

function ExternalLink() {
  return (
    <div className="absolute left-[9px] size-[16px] top-[9px]" data-name="External link">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="External link">
          <path d={svgPaths.p1ab89780} fill="var(--fill-0, white)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function ExternalLink1() {
  return (
    <div className="bg-zinc-900 relative rounded-[100px] shrink-0 size-[33px]" data-name="External link">
      <div aria-hidden="true" className="absolute border border-[#2c2c30] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <ExternalLink />
    </div>
  );
}

function MoveUp() {
  return (
    <div className="absolute left-[7px] size-[18px] top-[8px]" data-name="Move Up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Move Up">
          <path clipRule="evenodd" d={svgPaths.p265ec00} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p2047bf00} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.pdc26700} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p9cabc00} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function MoveUp1() {
  return (
    <div className="bg-zinc-900 relative rounded-[100px] shrink-0 size-[33px]" data-name="Move Up">
      <div aria-hidden="true" className="absolute border border-[#2c2c30] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <MoveUp />
    </div>
  );
}

function Container() {
  return (
    <div className="h-px relative rounded-[4px] w-[24px]" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="h-px w-[24px]" />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.12)] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function FloppyDiskSave() {
  return (
    <div className="absolute left-[8px] size-[18px] top-[8px]" data-name="floppy disk save">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="floppy disk save">
          <path clipRule="evenodd" d={svgPaths.p9191180} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p292b1f00} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function SaveIcon() {
  return (
    <div className="bg-[#3232ff] relative rounded-[100px] shrink-0 size-[33px]" data-name="Save icon">
      <div aria-hidden="true" className="absolute border border-[#6f6ffe] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <FloppyDiskSave />
    </div>
  );
}

function ExternalLinkButton() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="External link button">
      <ExternalLink1 />
      <MoveUp1 />
      <div className="flex h-[24px] items-center justify-center relative shrink-0 w-px" style={{ "--transform-inner-width": "24", "--transform-inner-height": "1" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <Container />
        </div>
      </div>
      <SaveIcon />
    </div>
  );
}

function TextContainer() {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0" data-name="Text Container">
      <div className="flex flex-col font-['Departure_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-nowrap text-white">
        <p className="leading-[1.4] whitespace-pre">1 TAB SELECTED</p>
      </div>
      <ExternalLinkButton />
    </div>
  );
}

function Container1() {
  return (
    <div className="min-w-[200px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center min-w-inherit overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[12px] items-center min-w-inherit p-[12px] relative w-full">
          <TextContainer />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(255,255,255,0.12)] border-dashed inset-0 pointer-events-none" />
    </div>
  );
}

function TextContainer1() {
  return (
    <div className="content-stretch flex flex-col font-['Departure_Mono:Regular',sans-serif] items-start justify-center leading-[0] not-italic relative shrink-0 text-nowrap" data-name="Text Container">
      <div className="flex flex-col justify-center relative shrink-0 text-[14px] text-white">
        <p className="leading-[1.4] text-nowrap whitespace-pre">8 tabs</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[12px] text-[rgba(0,255,128,0.5)]">
        <p className="leading-[1.4] text-nowrap whitespace-pre">ACTIVE WINDOW</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="relative rounded-[5px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center p-[8px] relative w-full">
          <TextContainer1 />
        </div>
      </div>
    </div>
  );
}

function SectionTitle() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="Section Title">
      <div className="flex flex-col font-['Departure_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-nowrap text-white">
        <p className="leading-[1.4] whitespace-pre">HISTORY</p>
      </div>
    </div>
  );
}

function Title() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center pb-[4px] pt-[16px] px-0 relative shrink-0 w-full" data-name="Title">
      <SectionTitle />
    </div>
  );
}

function TextContainer2() {
  return (
    <div className="content-stretch flex flex-col font-['Departure_Mono:Regular',sans-serif] items-start justify-center leading-[0] not-italic relative shrink-0 text-nowrap" data-name="Text Container">
      <div className="flex flex-col justify-center relative shrink-0 text-[14px] text-white">
        <p className="leading-[1.4] text-nowrap whitespace-pre">3 TABS</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[#7763ce] text-[12px]">
        <p className="leading-[1.4] text-nowrap whitespace-pre">01 DEC / 11:12</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-[#121212] relative rounded-[5px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center p-[8px] relative w-full">
          <TextContainer2 />
        </div>
      </div>
    </div>
  );
}

function Info() {
  return (
    <div className="content-stretch flex flex-col font-['Departure_Mono:Regular',sans-serif] items-start justify-center leading-[0] not-italic relative shrink-0 text-nowrap" data-name="Info">
      <div className="flex flex-col justify-center relative shrink-0 text-[14px] text-white">
        <p className="leading-[1.4] text-nowrap whitespace-pre">4 TABS</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[12px] text-[rgba(255,255,255,0.5)]">
        <p className="leading-[1.4] text-nowrap whitespace-pre">01 DEC / 09:32</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="relative rounded-[5px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center p-[8px] relative w-full">
          <Info />
        </div>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-px relative rounded-[5px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="h-px w-full" />
      </div>
      <div aria-hidden="true" className="absolute border border-dashed border-white inset-0 pointer-events-none rounded-[5px]" />
    </div>
  );
}

function Divider() {
  return (
    <div className="opacity-[0.15] relative shrink-0 w-full" data-name="Divider">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start px-[8px] py-0 relative w-full">
          <Container5 />
        </div>
      </div>
    </div>
  );
}

function Info1() {
  return (
    <div className="content-stretch flex flex-col font-['Departure_Mono:Regular',sans-serif] items-start justify-center leading-[0] not-italic relative shrink-0 text-nowrap" data-name="Info">
      <div className="flex flex-col justify-center relative shrink-0 text-[14px] text-white">
        <p className="leading-[1.4] text-nowrap whitespace-pre">8 TABS</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[12px] text-[rgba(255,255,255,0.5)]">
        <p className="leading-[1.4] text-nowrap whitespace-pre">29 NOV / 14:43</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="relative rounded-[5px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center p-[8px] relative w-full">
          <Info1 />
        </div>
      </div>
    </div>
  );
}

function Skull() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Skull">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Skull">
          <path clipRule="evenodd" d={svgPaths.p22aefd00} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function SectionTitle1() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="Section Title">
      <Skull />
      <div className="flex flex-col font-['Departure_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-nowrap text-white">
        <p className="leading-[1.4] whitespace-pre">GRAVEYARD</p>
      </div>
    </div>
  );
}

function Title1() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center pb-[4px] pt-[16px] px-0 relative shrink-0 w-full" data-name="Title">
      <SectionTitle1 />
    </div>
  );
}

function TextContainer3() {
  return (
    <div className="content-stretch flex flex-col font-['Departure_Mono:Regular',sans-serif] items-start justify-center leading-[0] not-italic relative shrink-0 text-nowrap" data-name="Text Container">
      <div className="flex flex-col justify-center relative shrink-0 text-[14px] text-white">
        <p className="leading-[1.4] text-nowrap whitespace-pre">12 TABS</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[12px] text-[rgba(255,255,255,0.5)]">
        <p className="leading-[1.4] text-nowrap whitespace-pre">01 DEC / 12:67</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center p-[8px] relative w-full">
          <TextContainer3 />
        </div>
      </div>
    </div>
  );
}

function Info2() {
  return (
    <div className="basis-0 content-stretch flex flex-col font-['Departure_Mono:Regular',sans-serif] grow items-start justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-nowrap" data-name="Info">
      <div className="flex flex-col justify-center relative shrink-0 text-[14px] text-white">
        <p className="leading-[1.4] text-nowrap whitespace-pre">8 TABS</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[12px] text-[rgba(255,255,255,0.5)]">
        <p className="leading-[1.4] text-nowrap whitespace-pre">29 NOV / 14:43</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="relative rounded-[5px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center p-[8px] relative w-full">
          <Info2 />
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="box-border content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[200px]" data-name="Sidebar">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-[rgba(255,255,255,0.12)] border-dashed inset-0 pointer-events-none" />
      <Container2 />
      <Title />
      <Container3 />
      <Container4 />
      <Divider />
      <Container6 />
      <Title1 />
      <Container7 />
      <Divider />
      <Container8 />
    </div>
  );
}

function TextContainer4() {
  return (
    <div className="basis-0 content-stretch flex flex-col font-['Departure_Mono:Regular',sans-serif] grow items-start justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0" data-name="Text Container">
      <div className="flex flex-col justify-center min-w-full relative shrink-0 text-[14px] text-white w-[min-content]">
        <p className="leading-[1.4]">Loaded (formerly CDKeys) / Your #1 Digital Game Store</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[12px] text-[rgba(193,179,255,0.63)] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">https://loaded.com</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-[#121212] relative rounded-[4px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center p-[8px] relative w-full">
          <TextContainer4 />
        </div>
      </div>
    </div>
  );
}

function TextContainer5() {
  return (
    <div className="basis-0 content-stretch flex flex-col font-['Departure_Mono:Regular',sans-serif] grow items-start justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0" data-name="Text Container">
      <div className="flex flex-col justify-center min-w-full relative shrink-0 text-[14px] text-white w-[min-content]">
        <p className="leading-[1.4]">Iconly Pro</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[12px] text-[rgba(193,179,255,0.63)] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">https://web.iconly.pro/?keyword=folder</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center p-[8px] relative w-full">
          <TextContainer5 />
        </div>
      </div>
    </div>
  );
}

function TextContainer6() {
  return (
    <div className="basis-0 content-stretch flex flex-col font-['Departure_Mono:Regular',sans-serif] grow items-start justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0" data-name="Text Container">
      <div className="flex flex-col justify-center min-w-full relative shrink-0 text-[14px] text-white w-[min-content]">
        <p className="leading-[1.4]">Traf</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[12px] text-[rgba(193,179,255,0.63)] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">https://tr.af/</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center p-[8px] relative w-full">
          <TextContainer6 />
        </div>
      </div>
    </div>
  );
}

function TextContainer7() {
  return (
    <div className="basis-0 content-stretch flex flex-col font-['Departure_Mono:Regular',sans-serif] grow items-start justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0" data-name="Text Container">
      <div className="flex flex-col justify-center min-w-full relative shrink-0 text-[14px] text-white w-[min-content]">
        <p className="leading-[1.4]">Iconly Pro Lifetime Access 40,000+ icons. Flat, 3D, Animated.</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[12px] text-[rgba(193,179,255,0.63)] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">https://iconly.gumroad.com/l/iconlyprolifetime</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center p-[8px] relative w-full">
          <TextContainer7 />
        </div>
      </div>
    </div>
  );
}

function Sidebar1() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Sidebar">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[4px] items-start p-[8px] relative w-full">
          <Container9 />
          <Container10 />
          <Container11 />
          <Container12 />
        </div>
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Main Content">
      <Sidebar />
      <Sidebar1 />
    </div>
  );
}

export default function HistorySingleTabSelected() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start relative size-full" data-name="History / Single tab selected">
      <Container1 />
      <MainContent />
    </div>
  );
}