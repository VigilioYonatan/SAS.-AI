import { storageEmpresa } from "@/empresas/stores/empresa.store";

interface TitleSectionProps {
	children: JSX.Element | JSX.Element[] | string;
	showBorder?: boolean;
}
function TitleSectionTwo({ children, showBorder = true }: TitleSectionProps) {
	return (
		<>
			<h3
				class={` inline-block dark:text-white text-lg font-bold my-4  ${
					showBorder ? "title-container-2" : ""
				}`}
			>
				{children}
			</h3>
			{storageEmpresa?.setting.border_title_type === "normal" ? (
				<style jsx>
					{`
                        .title-container-2 {
                            position: relative;
                        }

                        .title-container-2::before {
                            content: "";
                            position: absolute;
                            display: inline-block;
                            bottom: -5px;
                            left: 0;
                            width: 50%;
                            height: 2px;
                            background-color: var(--primary);
                        }
                    `}
				</style>
			) : null}
		</>
	);
}

export default TitleSectionTwo;
