// import useEmpresastore from "@/empresa/stores/empresa.store";
// import {
// 	SampleNextArrow,
// 	SamplePrevArrow,
// } from "@/web/components/ArrowsSlider";
// import Slider from "react-slick";
// import enviroments from "~/config";
// import { printFileWithDimension } from "~/libs/upload";

// function PrincipalSection() {
// 	const wallpapers = useEmpresastore().state!.images_home;

// 	return (
// 		<div className="max-w-6xl mx-auto  flex gap-4  lg:h-[400px] flex-col lg:flex-row px-4 my-12">
// 			<Slider
// 				className="w-full rounded-lg shadow overflow-hidden"
// 				{...{
// 					dots: false,
// 					infinite: true,
// 					speed: 500,
// 					slidesToShow: 1,
// 					slidesToScroll: 1,
// 					autoplay: true,
// 					adaptiveHeight: true,
// 					nextArrow: <SampleNextArrow />,
// 					prevArrow: <SamplePrevArrow />,
// 				}}
// 			>
// 				{printFileWithDimension(wallpapers, 1200).map((img, i) => (
// 					<div key={img} class="h-[450px] w-full relative group">
// 						<img
// 							src={img}
// 							width={1200}
// 							height={400}
// 							class="absolute object-cover w-full h-full -z-10  group-hover:scale-150 delay-custom-1"
// 							alt="pet"
// 						/>
// 						{i === 0 ? (
// 							<div class="flex justify-center items-center flex-col gap-4 w-full h-full">
// 								<h3 class="text-primary font-bold tracking-wider text-3xl text-center">
// 									Lo que necesita tu mascota todo el tiempo.
// 								</h3>
// 								<p class="text-primary tracking-wider text-center text-sm">
// 									minorista especializado en servicios y soluciones para
// 									mascotas
// 								</p>
// 								<a
// 									href={`${enviroments.VITE_URL}/shop`}
// 									class="bg-primary px-6 py-4  text-white hover:text-primary hover:bg-white rounded-md font-semibold"
// 								>
// 									Comprar ahora!
// 								</a>
// 							</div>
// 						) : null}
// 					</div>
// 				))}
// 			</Slider>

// 			<div class="w-full h-[300px] lg:w-[300px] lg:h-full relative flex flex-col   gap-4 rounded-lg overflow-hidden group">
// 				<img
// 					class="w-full h-full absolute object-cover  group-hover:scale-150 delay-custom-1 -z-10 inset-0"
// 					src="https://minion-theme-vertical.myshopify.com/cdn/shop/files/Frame_25.png?v=1695131760&width=533"
// 					width={300}
// 					height={400}
// 					alt=""
// 				/>
// 				<h3 class="text-white text-xl text-center font-bold  mt-6">
// 					Las necesidades de tu gatito
// 				</h3>
// 			</div>
// 		</div>
// 	);
// }

// export default PrincipalSection;
