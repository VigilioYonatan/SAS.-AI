import type { BackgroundSchemaFromServer } from "@/empresas/schemas/background.schema";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import AdminEdit from "@/web/components/AdminEdit";
import {
	SampleNextArrow,
	SamplePrevArrow,
} from "@/web/components/ArrowsSlider";
import Slider from "react-slick";
import { printFileWithDimension } from "~/libs/upload";
export const icons = {
	normal: [
		`<img src='/images/settings/others/flecha-pais.png' alt='' class='w-full h-full' width='50'height='50'/>`,
		`<img src='/images/settings/others/flecha-interrogacion.png' alt='' class='w-full h-full object-contain' width='50' height='50' />`,
		`<img src='/images/settings/others/flecha-cupones.png' alt='' class='w-full h-full object-contain' width='50' height='50'/>`,
		`<img src='/images/settings/others/flecha-rastreo.png' alt='' class='w-full h-full object-contain' width='50' height='50' />`,
	],
	icons: [
		`<i class='fas fa-location-arrow text-4xl text-primary'></i>`,
		`<i class='fas fa-question text-4xl text-primary'></i>`,
		`<i class='fas fa-redo-alt text-4xl text-primary'></i>`,
		`<i class='fas fa-hand-point-left text-4xl text-primary'></i>`,
	],
	premium: [
		`<svg xmlns="http://www.w3.org/2000/svg" fill="var(--primary)" viewBox="0 0 192 192" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2"><path d="M1290.45 101.974a6.588 6.588 0 0 0 3.05 12.118l56.62 4.32c4.71.631 10.1 2.726 11.73 6.975 0 .013.01.026.01.039l21.59 55.476a6.575 6.575 0 0 0 6.42 4.193 6.593 6.593 0 0 0 6.04-4.74l47.33-162.513a6.594 6.594 0 0 0-2.37-7.117 6.589 6.589 0 0 0-7.5-.273l-142.92 91.522Zm23.69.478 111.54-71.433-36.99 127.017-14.55-37.374c-3.25-8.484-13.14-14.148-22.51-15.341a6.148 6.148 0 0 0-.33-.034l-37.16-2.835Z" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2" transform="translate(-1147.52 7.429) scale(.9107)"/></svg>`,
		`<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 192 192" id="Layer_1" data-name="Layer 1"><defs><style>.cls-3{fill:none;stroke:var(--primary);stroke-linejoin:round;stroke-width:12px;stroke-linecap:round}</style></defs><path d="M0 0h192v192H0z" style="fill:none"/><path d="M158.63 140V22H33.37v118H90v30l20-30h48.63z" style="stroke:var(--primary);stroke-linejoin:round;stroke-width:12px;fill:none"/><path d="M65 92a31.16 31.16 0 0 0 62 0Z" class="cls-3"/><ellipse cx="118" cy="60" rx="10" ry="12.73"  fill="var(--primary)"/><path d="M71 64a8.07 8.07 0 0 1 16 0 17 17 0 0 0-16 0Z" class="cls-3"/></svg>`,
		`<svg xmlns="http://www.w3.org/2000/svg" fill="var(--primary)" viewBox="0 0 192 192" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2"><path d="M774.436 356.981c-11.316 9.782-26.058 15.701-42.172 15.701-29.135 0-53.786-19.345-61.798-45.88a6.003 6.003 0 0 0-7.478-4.01 6.003 6.003 0 0 0-4.01 7.478c9.501 31.469 38.735 54.412 73.286 54.412 19.805 0 37.865-7.538 51.46-19.9l18.415 15.467a6 6 0 0 0 9.857-4.716l-.982-48.562a5.998 5.998 0 0 0-6.915-5.809l-48.002 7.42a6 6 0 0 0-2.943 10.524l21.282 17.875Zm24.719-22.912.576 28.487-28.734-24.134 28.158-4.353ZM681.498 250.88l-19.639-16.477a6.001 6.001 0 0 0-9.855 4.721l1.008 48.562a5.999 5.999 0 0 0 6.919 5.805l47.998-7.446a6.002 6.002 0 0 0 2.937-10.526l-20.056-16.826c11.216-9.415 25.677-15.089 41.454-15.089 28.62 0 52.915 18.67 61.358 44.485a6.003 6.003 0 0 0 7.568 3.837 6.003 6.003 0 0 0 3.838-7.568c-10.013-30.613-38.824-52.754-72.764-52.754-19.47 0-37.251 7.284-50.766 19.276Zm-16.631 29.701-.591-28.486 28.747 24.118-28.156 4.368Z" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2" transform="translate(-636 -212)"/></svg>`,
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50.8 50.8"><path fill="none" stroke="var(--primary)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.175" d="M5.82 41.451s9.994-13.552 23.549-10.495v9.143l15.61-15.463-15.61-15.111v10.319S5.82 23.107 5.82 41.452z" style="paint-order:markers stroke fill"/></svg>`,
	],
};
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
							image={
								icons[
									storageEmpresa.setting.type_icons as keyof typeof icons
								][0]
							}
						/>
					) : null}

					<CardType
						title="Soporte 24/7"
						subtitle="Contactanos 24 horas al dia con inteligencia Artificial"
						image={
							icons[storageEmpresa!.setting.type_icons as keyof typeof icons][1]
						}
					/>
					<CardType
						title="Ofertas y Descuentos"
						subtitle="Promociones por tiempo limitado, cupones de descuento y ventas flash pueden incentivar las compras."
						image={
							icons[storageEmpresa!.setting.type_icons as keyof typeof icons][2]
						}
					/>
					<CardType
						title="Seguimiento de Pedidos"
						subtitle="Rastrear sus pedido en tiempo real. "
						image={
							icons[storageEmpresa!.setting.type_icons as keyof typeof icons][3]
						}
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
	ico?: string;
}
export function CardType({ image, subtitle, title }: CardTypeProps) {
	return (
		<div class="flex p-6 lg:p-4 gap-2  w-full  dark:bg-background-dark bg-white flex-1 items-center  dark:border-gray-600 border-gray-300 border">
			<div
				dangerouslySetInnerHTML={{ __html: image }}
				class="min-w-[50px] h-[45px] flex justify-center items-center"
			/>
			<div class="flex flex-col dark:text-white">
				<span class="font-bold text-primary">{title}</span>
				<p class="text-xs font-semibold">{subtitle}</p>
			</div>
		</div>
	);
}
export default BackgroundSection;
