interface TitleSectionProps {
	children: JSX.Element | JSX.Element[] | string;
}
function TitleSection({ children }: TitleSectionProps) {
	return (
		<>
			<h3 class="text-xl md:text-3xl font-bold text-center  dark:text-white my-4 title-container-1">
				{children}
			</h3>
			<style jsx>
				{`
                    .title-container-1 {
                        position: relative;
                    }

                    .title-container-1::before {
                        content: "";
                        position: absolute;
                        display: inline-block;
                        bottom: -9px;
                        left: 45%;
                        width: 10%;
                        height: 4px;
                        background-color: var(--primary);
                    }
                `}
			</style>
		</>
	);
}

export default TitleSection;
