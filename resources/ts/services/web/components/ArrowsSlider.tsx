import type { HTMLAttributes } from "preact/compat";

export function SampleNextArrow(props: HTMLAttributes<HTMLDivElement>) {
	const { className, onClick } = props;
	return (
		<div className={className} onClick={onClick}>
			<i class="fas fa-caret-right text-xl text-primary" />
		</div>
	);
}

export function SamplePrevArrow(props: HTMLAttributes<HTMLDivElement>) {
	const { className, onClick } = props;
	return (
		<div className={className} onClick={onClick} style={{}}>
			<i class="fas fa-caret-left text-xl text-primary" />
		</div>
	);
}
