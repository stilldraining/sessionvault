import svgPaths from "./svg-k2h1igvz42";

function Button() {
  return (
    <div className="bg-zinc-900 box-border content-stretch flex gap-[10px] items-center justify-center pl-[9px] pr-[8px] py-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#2c2c30] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['Departure_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-nowrap text-white">
        <p className="leading-[1.4] whitespace-pre">Select all</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Departure_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-white">
        <p className="leading-[1.4] whitespace-pre">{`SESSION VAULT `}</p>
      </div>
      <Button />
    </div>
  );
}

function Header() {
  return (
    <div className="h-[57px] min-w-[200px] relative shrink-0 w-[600px]" data-name="Header">
      <div className="box-border content-stretch flex gap-[12px] h-[57px] items-center min-w-inherit overflow-clip p-[12px] relative rounded-[inherit] w-[600px]">
        <Container />
      </div>
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(255,255,255,0.12)] border-dashed inset-0 pointer-events-none" />
    </div>
  );
}

function TextContainer() {
  return (
    <div className="content-stretch flex flex-col font-['Departure_Mono:Regular',sans-serif] items-start justify-center leading-[0] not-italic relative shrink-0 text-nowrap" data-name="Text Container">
      <div className="flex flex-col justify-center relative shrink-0 text-[14px] text-white">
        <p className="leading-[1.4] text-nowrap whitespace-pre">8 tabs</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[12px] text-[springgreen]">
        <p className="leading-[1.4] text-nowrap whitespace-pre">ACTIVE WINDOW</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[#121212] relative rounded-[5px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center p-[8px] relative w-full">
          <TextContainer />
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

function TextContainer1() {
  return (
    <div className="content-stretch flex flex-col font-['Departure_Mono:Regular',sans-serif] items-start justify-center leading-[0] not-italic relative shrink-0 text-nowrap" data-name="Text Container">
      <div className="flex flex-col justify-center relative shrink-0 text-[14px] text-white">
        <p className="leading-[1.4] text-nowrap whitespace-pre">3 TABS</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[12px] text-[rgba(255,255,255,0.5)]">
        <p className="leading-[1.4] text-nowrap whitespace-pre">01 DEC / 11:12</p>
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

function Container3() {
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

function Container4() {
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
          <Container4 />
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

function Container5() {
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

function TextContainer2() {
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

function Container6() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center p-[8px] relative w-full">
          <TextContainer2 />
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

function Container7() {
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
      <Container1 />
      <Title />
      <Container2 />
      <Container3 />
      <Divider />
      <Container5 />
      <Title1 />
      <Container6 />
      <Divider />
      <Container7 />
    </div>
  );
}

function TextContainer3() {
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

function Container8() {
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

function TextContainer4() {
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

function Container9() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full" data-name="Container">
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
        <p className="leading-[1.4]">Traf</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[12px] text-[rgba(193,179,255,0.63)] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">https://tr.af/</p>
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
        <p className="leading-[1.4]">Iconly Pro Lifetime Access 40,000+ icons. Flat, 3D, Animated.</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[12px] text-[rgba(193,179,255,0.63)] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">https://iconly.gumroad.com/l/iconlyprolifetime</p>
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

function Sidebar1() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Sidebar">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[4px] items-start p-[8px] relative w-full">
          <Container8 />
          <Container9 />
          <Container10 />
          <Container11 />
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

function Notification() {
  return (
    <div className="absolute bg-[#3232ff] box-border content-stretch flex gap-[10px] items-center justify-center left-[calc(50%+0.5px)] pl-[11px] pr-[12px] py-[8px] rounded-[8px] top-[389px] translate-x-[-50%]" data-name="Notification">
      <div className="flex flex-col font-['Departure_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-white">
        <p className="leading-[1.4] whitespace-pre">LINK COPIED TO CLIPBOARD</p>
      </div>
    </div>
  );
}

export default function LinkClicked() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start relative size-full" data-name="Link clicked">
      <Header />
      <MainContent />
      <Notification />
    </div>
  );
}