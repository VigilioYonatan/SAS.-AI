import { BannerSchema } from "@/empresas/schemas/banner.schema";
import { GridBannerSchema } from "@/empresas/schemas/grid_banner.schema";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import TitleSection from "@/web/components/TitleSection";
import { useEffect } from "preact/hooks";
import { printFileWithDimension } from "~/libs/upload";

interface GridBanners {
	grid: (GridBannerSchema & { banners: BannerSchema[] })[];
	i: number;
}
function GridBanners({ grid, i }: GridBanners) {
	if (!grid[i].banners.length || !grid[i].enabled) return null;
	useEffect(() => {
		if (grid[i].custom_html) {
			const script = document.createElement("script");
			const div = document.querySelector(`.grid-banner-${i}`);
			script.innerHTML = grid[i].custom_html;
			div?.appendChild(script);

			// Limpieza del script para evitar problemas
			return () => {
				document.body.removeChild(script);
			};
		}
	}, []);
	return (
		<div
			data-aos={`${
				storageEmpresa?.setting.isScrolling
					? storageEmpresa.setting.type_animation
					: ""
			}`}
			class={`max-w-6xl mx-auto my-4 md:my-8 relative grid-banner-${i}`}
		>
			{grid[i].title ? <TitleSection>{grid[i].title}</TitleSection> : null}
			<div class={`w-full  grid banner-${i} relative`}>
				<>
					{grid[i].banners.map((banner) => {
						const file = printFileWithDimension(banner.file, null)[0];

						return (
							<div
								class="w-full relative h-full"
								key={banner.id}
								onClick={() => {
									if (banner.link && !banner.button) {
										window.location.href = banner.link;
									}
								}}
							>
								{file?.endsWith("mp4") ? (
									<div class="relative w-full h-full flex justify-center items-end">
										<video
											class="absolute top-0 left-0 w-full h-full object-cover -z-10"
											autoplay
											muted
											loop
										>
											<source src={file} type="video/mp4" />
											Tu navegador no soporta el elemento video.
										</video>
										{banner.button && banner.link ? (
											<a
												href={banner.link}
												class="bg-primary px-4 py-2 text-xs font-semibold mb-2"
											>
												{banner.button}
											</a>
										) : null}
									</div>
								) : (
									<div
										class="w-full h-full   bg-cover  bg-no-repeat -z-10 flex justify-center items-end"
										style={{
											backgroundImage: `url(${file})`,
										}}
									>
										{banner.button && banner.link ? (
											<a
												href={banner.link}
												class="bg-primary px-4 py-2 text-xs font-semibold  mb-2"
											>
												{banner.button}
											</a>
										) : null}
									</div>
								)}
							</div>
						);
					})}
				</>
				<style jsx>{`
                    ${grid[i].responsive
											.map(
												(responsive) => `
                            @media screen and (min-width:${responsive.width}px){
                                .grid-banner-${i} .banner-${i}{
                                    height: ${responsive.height}px;
                                    grid-template-columns: repeat(${
																			responsive.cols
																		}, minmax(0, 1fr));
                                    ${
																			responsive.rows
																				? `grid-template-rows: repeat(${responsive.rows}, minmax(0, 1fr));`
																				: ""
																		}
                                    
                                    gap: ${responsive.gap}rem;
                                }
                            }
                        `,
											)
											.join("")}
                `}</style>
			</div>
		</div>
	);
}

export default GridBanners;
