import { storageEmpresa } from "@/empresas/stores/empresa.store";
import AdminEdit from "@/web/components/AdminEdit";
import TitleSection from "@/web/components/TitleSection";
import useCounter from "~/hooks/useCounter";
import { NOW, restarDays } from "~/libs/helpers";
import { printFileWithDimension } from "~/libs/upload";

interface AboutSectionProps {
	productsquantity: number;
}
function AboutSection({ productsquantity }: AboutSectionProps) {
	const counter99 = useCounter(99, 3);
	const counter = useCounter(productsquantity, 3);
	const year = useCounter(
		restarDays(storageEmpresa?.yearFounded as Date, NOW().toDate(), "year"),
		3,
	);
	return (
		<section
			class="max-w-6xl mx-auto px-2 py-6 my-6 lg:my-12 bg-white dark:bg-background-dark"
			data-aos={`${storageEmpresa?.setting.isScrolling ? "fade-up" : ""} `}
		>
			<AdminEdit uri="/admin/settings#foto_empresa" />
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
				<div class="h-[300px] w-full lg:w-[500px]  lg:h-[400px] overflow-hidden">
					{storageEmpresa!.setting.photo ? (
						<img
							class={` ${
								storageEmpresa?.setting.type_border === "circle"
									? "rounded-md"
									: ""
							} hover:scale-110 w-full h-full delay-custom-1`}
							width={500}
							height={400}
							src={
								printFileWithDimension(storageEmpresa!.setting.photo, 800)[0]
							}
							alt={storageEmpresa?.name_empresa}
						/>
					) : null}
				</div>

				<div class="flex flex-col items-center  dark:text-white">
					<TitleSection>{storageEmpresa?.name_empresa!}</TitleSection>
					<p class="text-sm md:text-md font-normal md:min-h-[200px]">
						{storageEmpresa?.setting.about ||
							"No se ingresó información de tu empresa"}
					</p>
					<div class="flex gap-6 items-center mt-6">
						<div class="flex gap-2 flex-col sm:flex-row">
							<span class="text-5xl font-bold text-primary  px-3  border-l-4 border-primary">
								{year}
							</span>
							<div class="flex flex-col">
								<span class="text-sm font-semibold ">Años de </span>
								<b class="font-semibold">Experiencia</b>
							</div>
						</div>
						<div class="flex gap-2 flex-col sm:flex-row">
							<span class="text-5xl font-bold text-primary px-3 border-l-4 border-primary">
								{productsquantity > 99 ? <>+{counter99}</> : counter}
							</span>
							<div class="flex flex-col">
								<span class="text-sm font-semibold">Productos</span>
								<b class="font-semibold">Disponibles</b>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default AboutSection;
