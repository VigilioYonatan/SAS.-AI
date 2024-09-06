interface TitleSectionProps {
	children: JSX.Element | JSX.Element[] | string;
}
function TitleSection({ children }: TitleSectionProps) {
	return (
		<h3 class="text-xl md:text-3xl font-bold text-center  dark:text-white my-4">
			{children}
		</h3>
	);
}

export default TitleSection;
