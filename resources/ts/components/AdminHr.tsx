interface AminHrProps {
	spacing?: number;
}
function AdminHr({ spacing = 4 }: AminHrProps) {
	return (
		<div class={`w-full h-[1px] bg-gray-200 dark:bg-gray-600 my-${spacing}`} />
	);
}

export default AdminHr;
