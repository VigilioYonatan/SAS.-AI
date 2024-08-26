interface HrProps {
	spacing?: number;
}
function Hr({ spacing = 0.5 }: HrProps) {
	return (
		<div
			style={`margin:${spacing}px 0px;`}
			class="h-[0.1px] my-1 w-full bg-gray-400"
		/>
	);
}

export default Hr;
