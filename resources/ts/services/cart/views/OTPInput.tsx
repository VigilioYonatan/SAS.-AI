export function cn(...args: unknown[]) {
	return args
		.flat()
		.filter((x) => typeof x === "string")
		.join(" ")
		.trim();
}

import type { SlotProps } from "input-otp";
// Feel free to copy. Uses @shadcn/ui tailwind colors.
export function Slot(props: SlotProps) {
	return (
		<div
			className={cn(
				"relative w-10 h-10 text-lg",
				"flex items-center justify-center",
				"transition-all duration-300",
				"border-zinc-200 border-y border-r first:border-l first:rounded-l-md last:rounded-r-md",
				"group-hover:border-zinc-200 group-focus-within:border-zinc-200",
				"outline outline-0 outline-zinc-200",
				{ "outline-4 outline-zinc-300": props.isActive },
			)}
		>
			{props.char !== null && <div>{props.char}</div>}
			{props.hasFakeCaret && <FakeCaret />}
		</div>
	);
}

// You can emulate a fake textbox caret!
export function FakeCaret() {
	return (
		<div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-caret-blink">
			<div className="w-px h-8 bg-black" />
		</div>
	);
}

// Inspired by Stripe's MFA input.
export function FakeDash() {
	return (
		<div className="flex items-center justify-center w-10">
			<div className="w-3 h-1 rounded-full bg-slate-500" />
		</div>
	);
}
