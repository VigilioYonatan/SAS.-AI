import { printLogoInformation } from "@/information/libs/helpers";
import useInformationstore from "@/information/stores/information.store";

interface LogoImageProps {
	width?: string;
	height?: string;
}
function LogoImage({ height = "100", width = "100" }: LogoImageProps) {
	const { state } = useInformationstore();

	return (
		<>
			{state?.logo ? (
				<img
					class={`w-[${width}px] h-[${height}px] object-contain`}
					width={width}
					height={height}
					src={printLogoInformation(state.logo, 300)[0]}
					alt="Yonatan Logo"
				/>
			) : (
				<span class="text-primary text-4xl font-vigilio-title">
					{state?.name[0]}
				</span>
			)}
		</>
	);
}

export default LogoImage;
