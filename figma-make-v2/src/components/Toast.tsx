type ToastProps = {
  message: string;
};

export function Toast({ message }: ToastProps) {
  return (
    <div className="absolute bg-[#3232ff] box-border content-stretch flex gap-[10px] items-center justify-center left-[50%] pl-[11px] pr-[12px] py-[8px] rounded-[8px] top-[389px] translate-x-[-50%] opacity-0 animate-[fadeIn_0.2s_ease-in_forwards]">
      <div className="flex flex-col font-['Departure_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-white">
        <p className="leading-[1.4] whitespace-pre">{message}</p>
      </div>
    </div>
  );
}