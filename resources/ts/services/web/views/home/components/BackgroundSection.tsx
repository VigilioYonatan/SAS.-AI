import type { BackgroundSchemaFromServer } from "@/empresas/schemas/background.schema";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import AdminEdit from "@/web/components/AdminEdit";
import {
	SampleNextArrow,
	SamplePrevArrow,
} from "@/web/components/ArrowsSlider";
import Slider from "react-slick";
import { printFileWithDimension } from "~/libs/upload";

interface BackgroundSectionProps {
	backgrounds: BackgroundSchemaFromServer[];
}
function BackgroundSection({ backgrounds }: BackgroundSectionProps) {
	if (!backgrounds.length) return null;
	return (
		<section
			id="start"
			class="max-w-6xl mx-auto px-2 md:px-4 mt-[6.6rem] md:my-20"
		>
			<div class="flex flex-col lg:flex-row  gap-4 relative">
				<AdminEdit uri="/admin/background" />
				<div class="w-full lg:w-[800px]">
					<Slider
						className="w-full "
						{...{
							dots: true,
							infinite: true,
							speed: 500,
							slidesToShow: 1,
							slidesToScroll: 1,
							adaptiveHeight: true,
							nextArrow: <SampleNextArrow />,
							prevArrow: <SamplePrevArrow />,
							arrows: backgrounds.length > 1,
						}}
					>
						{backgrounds.map((background) => (
							<div class="w-full group overflow-hidden" key={background.id}>
								<div
									class=" bg-cover bg-center  p-6  h-[450px] w-full flex flex-col gap-4 justify-center  group-hover:scale-105 delay-custom-1"
									style={{
										backgroundImage: `url('${
											printFileWithDimension(background.image, 1000)[0]
										}')`,
									}}
								>
									<h2 class="font-bold text-3xl text-white w-5/12 ">
										{background.title}
									</h2>
									{background.description ? (
										<p class="font-semibold tracking-wider text-sm text-white w-6/12">
											{background.description}
										</p>
									) : null}
									<a
										href={background.url}
										class="bg-white hover:bg-transparent hover:text-white border delay-custom-1 border-white px-4 py-2 text-black self-start font-bold tracking-wider"
									>
										Más información
									</a>
								</div>
							</div>
						))}
					</Slider>
				</div>

				<div class="grid  sm:grid-cols-2 lg:grid-cols-1  lg:w-[300px]   mt-3">
					{storageEmpresa?.enable_sell_country ? (
						<CardType
							title="Envio a todo el pais"
							subtitle="Se hacen envios a todo el país"
							image="/images/settings/others/flecha-pais.png"
						/>
					) : null}

					<CardType
						title="Soporte 24/7"
						subtitle="Contactanos 24 horas al dia con inteligencia Artificial"
						image="/images/settings/others/flecha-interrogacion.png"
					/>
					<CardType
						title="Ofertas y Descuentos"
						subtitle="Promociones por tiempo limitado, cupones de descuento y ventas flash pueden incentivar las compras."
						image="/images/settings/others/flecha-cupones.png"
					/>
					<CardType
						title="Seguimiento de Pedidos"
						subtitle="Rastrear sus pedido en tiempo real. "
						image="/images/settings/others/flecha-rastreo.png"
					/>
				</div>
			</div>
		</section>
	);
}

interface CardTypeProps {
	image: string;
	title: string;
	subtitle: string;
}
export function CardType({ image, subtitle, title }: CardTypeProps) {
	return (
		<div class="flex p-6 lg:p-4 gap-2  w-full  dark:bg-background-dark bg-white flex-1 items-center  dark:border-gray-600 border-gray-300 border">
			<img
				src={image}
				alt={title}
				class="w-[40px] h-[40px]"
				width={50}
				height={50}
			/>
			<div class="flex flex-col dark:text-white">
				<span class="font-bold">{title}</span>
				<p class="text-xs">{subtitle}</p>
			</div>
		</div>
	);
}
export default BackgroundSection;
