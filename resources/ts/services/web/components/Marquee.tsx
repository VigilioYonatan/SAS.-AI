interface MarqueeProps {
	delay: number;
	children: JSX.Element | JSX.Element[];
	className?: string;
}
function Marquee({ delay, children, className = "" }: MarqueeProps) {
	const classRandom = Math.random().toString(32).slice(2, 8);
	return (
		<>
			<div
				class={`${classRandom} w-full overflow-hidden h-[100px]  bg-[#DEEFFF] dark:bg-paper-dark  py-2 relative flex justify-center items-center my-4 `}
			>
				<div
					class={`marquee-text ${className} gap-12 flex justify-between items-center`}
				>
					{Array.from({ length: 3 }).map(() => children)}
				</div>
			</div>
			<style jsx>
				{`
                    @keyframes marquee {
                        0% {
                            transform: translateX(100%);
                        }
                        100% {
                            transform: translateX(-100%);
                        }
                    }
                    .${classRandom} .marquee-text {
                        position: absolute;
                        animation: marquee ${delay}s linear infinite;
                    }
                `}
			</style>
		</>
	);
}

export default Marquee;
