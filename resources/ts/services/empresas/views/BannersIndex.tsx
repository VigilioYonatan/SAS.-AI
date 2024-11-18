import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import Container from "@/admin/components/Container";
import { gridBannerIndexApi } from "../apis/grid_banner/grid_banner.index.api";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { GridBannerSchema } from "../schemas/grid_banner.schema";
import { useFieldArray, useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import {
	GridBannerUpdateDto,
	gridBannerUpdateDto,
} from "../dtos/grid_banner.update.dto";
import { gridBannerUpdateApi } from "../apis/grid_banner/grid_banner.update.api";
import Form from "~/components/form";
import Hr from "@/web/components/Hr";
import { Fragment } from "preact/jsx-runtime";
import { handlerError } from "~/libs/helpers";
import { getFilesEdit, printFileWithDimension } from "~/libs/upload";
import useMediaQuery, { ResponsiveWidth } from "~/hooks/useMediaQuery";
import AlertInfo from "~/components/Alerts/AlertInfo";
import { BannerStoreDto, bannerStoreDto } from "../dtos/banner.store.dto";
import { bannerStoreApi } from "../apis/banner/banner.store.api";
import { BASE_URL } from "~/config";
import { BannerSchema } from "../schemas/banner.schema";
import {
	bannerUpdateApi,
	bannerUpdatFileApi,
} from "../apis/banner/banner.update.api";
import {
	bannerUpdateDto,
	BannerUpdateDto,
	BannerUpdateFileDto,
	bannerUpdateFileDto,
} from "../dtos/banner.update.dto";
import { useEffect } from "preact/hooks";
import { formSelectNumber } from "~/components/form/FormSelect";

function BannersIndex() {
	const gridBannerIndexQuery = gridBannerIndexApi();
	const widthResponsive = ResponsiveWidth();
	let component: JSX.Element | JSX.Element[] | null = null;
	if (gridBannerIndexQuery.isLoading) {
		component = <Loading />;
	}
	if (gridBannerIndexQuery.isError) {
		component = <View404 />;
	}
	if (gridBannerIndexQuery.isSuccess) {
		component = (
			<>
				{gridBannerIndexQuery.data?.data.map((grid, g) => {
					return (
						<div key={grid.id}>
							<div class="flex justify-between w-full mb-1 items-center">
								<span class="font-semibold text-sm">Banner {g + 1}</span>
								<div class="flex gap-2 items-center">
									{" "}
									<button
										type="button"
										class="bg-primary px-4 py-1 rounded-md"
										onClick={() => {
											sweetModal((onClose) => ({
												html: reactComponent(
													<Banners
														grid={grid}
														banners={grid.banners}
														g={g}
														onClose={onClose}
														refetch={gridBannerIndexQuery.refetch}
													/>,
												),
												showCloseButton: true,
												isCloseInBackground: false,
											}));
										}}
									>
										<i class="fa-sharp-duotone fa-solid fa-image-landscape" />
									</button>
									<button
										type="button"
										class="bg-primary px-4 py-1 rounded-md"
										onClick={() => {
											sweetModal((onClose) => ({
												html: reactComponent(
													<GridBannerUpdate
														grid={grid}
														i={g + 1}
														onClose={onClose}
														refetch={gridBannerIndexQuery.refetch}
													/>,
												),
												showCloseButton: true,
												isCloseInBackground: false,
												sweetWidth: "600px",
												position: "start",
											}));
										}}
									>
										<i class="fas fa-gears" />
									</button>
								</div>
							</div>

							<div
								class={`dark:bg-admin-terciary w-full  grid banner-${g} relative  `}
							>
								<>
									{Array.from({
										length:
											grid.responsive
												.filter((val) => {
													return widthResponsive >= val.width;
												})
												.pop()?.cols || 1,
									}).map((_, i) => {
										return (
											// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
											<Fragment key={i}>
												{(() => {
													const banner = grid.banners.find(
														(banner) => banner.order === i + 1,
													);
													return (
														<>
															{banner ? (
																<>
																	{(() => {
																		const file = printFileWithDimension(
																			banner.file,
																			null,
																		)[0];
																		return (
																			<div
																				class="w-full relative row-span-1"
																				key={banner.id}
																				style={{
																					gridColumn: `span ${banner.col} / span ${banner.col}`,
																					gridRow: `span ${banner.row} / span ${banner.row}`,
																				}}
																			>
																				{file?.endsWith("mp4") ? (
																					<div class="relative w-full h-full">
																						<video
																							class="absolute top-0 left-0 w-full h-full object-cover"
																							autoplay
																							muted
																							loop
																						>
																							<source
																								src={file}
																								type="video/mp4"
																							/>
																							Tu navegador no soporta el
																							elemento video.
																						</video>
																					</div>
																				) : (
																					<div
																						class="w-full h-full block  bg-cover  bg-no-repeat"
																						style={{
																							backgroundImage: `url(${file})`,
																						}}
																					/>
																				)}
																				<button
																					type="button"
																					class="top-1 right-1 absolute bg-black bg-opacity-70 text-xs px-2 py-1 rounded-md"
																					onClick={() => {
																						sweetModal((onClose) => ({
																							html: reactComponent(
																								<BannerUpdate
																									onClose={onClose}
																									banner={banner}
																									g={g}
																									refetch={
																										gridBannerIndexQuery.refetch
																									}
																									grid={grid}
																								/>,
																							),
																							showCloseButton: true,
																							isCloseInBackground: false,
																						}));
																					}}
																				>
																					<i class="fas fa-pen" />
																				</button>
																			</div>
																		);
																	})()}
																</>
															) : (
																<div
																	type="button"
																	onClick={() => {
																		sweetModal((onClose) => ({
																			html: reactComponent(
																				<BannerStore
																					order={i + 1}
																					grid={grid}
																					i={g + 1}
																					onClose={onClose}
																					refetch={gridBannerIndexQuery.refetch}
																				/>,
																			),
																			showCloseButton: true,
																			isCloseInBackground: true,
																		}));
																	}}
																	aria-label="more"
																	class="h-full bg-admin-background-dark w-full flex justify-center items-center"
																	// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
																	key={i}
																>
																	<span class="text-3xl font-bold">+</span>
																</div>
															)}
														</>
													);
												})()}
											</Fragment>
										);
									})}
								</>

								<style jsx>{`
                                    ${grid.responsive
																			.map(
																				(responsive) => `
                            @media screen and (min-width:${responsive.width}px){
                                .banner-${g}{
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
				})}
			</>
		);
	}
	return (
		<Container className="p-2 dark:text-white">
			<div className="flex flex-col gap-4 mx-1 ">
				<AdminBreadCrumb current="Banners" />
			</div>
			<div class="flex flex-col gap-4 [&>header]:relative">
				<div>
					{useMediaQuery("(max-width:1000px)") ? (
						<AlertInfo>
							<span class=" text-sm font-semibold">
								Se recomienda Editar los Banners en una Laptop/PC
							</span>
						</AlertInfo>
					) : null}
					<span class="font-bold text-sm">
						Ancho Actual: <b>{widthResponsive}PX</b>{" "}
					</span>
				</div>
				{component}
			</div>
		</Container>
	);
}
interface GridBannerEditProps {
	grid: GridBannerSchema;
	i: number;
	onClose: () => void;
	refetch: (clean?: boolean) => void;
}
export function GridBannerUpdate({
	grid,
	i,
	onClose,
	refetch,
}: GridBannerEditProps) {
	const gridUpdateMutation = gridBannerUpdateApi(grid.id);
	const gridUpdateForm = useForm<GridBannerUpdateDto>({
		resolver: valibotVigilio(gridBannerUpdateDto),
		defaultValues: grid,
	});
	function onGridBannerUpdate(data: GridBannerUpdateDto) {
		sweetModal({ title: "¿Estas seguro de editar tu banner?" }).then(
			({ isConfirmed }) => {
				if (isConfirmed) {
					gridUpdateMutation.mutate(data, {
						onSuccess() {
							sweetAlert({
								title: "Editado correctamente",
								icon: "success",
							});
							onClose();
							refetch(true);
						},
						onError(error) {
							handlerError(gridUpdateForm, error);
						},
					});
				}
			},
		);
	}
	const responseArray = useFieldArray({
		control: gridUpdateForm.control,
		name: "responsive",
	});

	return (
		<div class="dark:text-white">
			<span class="font-bold uppercase text-lg">Banner {i}</span>
			<br />
			<Form {...gridUpdateForm} onSubmit={onGridBannerUpdate}>
				<div>
					<span class="dark:text-white text-xs font-semibold">Responsive</span>
					{responseArray.fields.map((responsive, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<Fragment key={i}>
							<div class="grid grid-cols-4 gap-2 items-center">
								<Form.control
									name={`responsive.${i}.width`}
									title={`(${responsive.width}px)`}
									type="number"
									options={{ setValueAs: Number }}
									disabled
								/>
								<Form.control
									name={`responsive.${i}.height`}
									title="Altura"
									type="number"
									options={{ setValueAs: Number }}
									question="Altura del banner en pixeles"
								/>
								<div class="grid md:grid-cols-2 gap-2">
									<Form.control
										name={`responsive.${i}.cols`}
										title="Columnas"
										type="number"
										options={{ setValueAs: Number }}
										question="Numero de columnas"
									/>
									<Form.control
										name={`responsive.${i}.rows`}
										title="Filas"
										type="number"
										options={{
											setValueAs: formSelectNumber,
										}}
										question="Numero de  filas"
									/>
								</div>

								<Form.control
									name={`responsive.${i}.gap`}
									title="Espacio"
									type="number"
									options={{ setValueAs: Number }}
									question="Espacio entre cartas"
								/>
							</div>

							<Hr />
						</Fragment>
					))}
				</div>
				<Form.control.toggle
					title="Habilitar"
					name={"enabled" as keyof GridBannerUpdateDto}
				/>
				<Form.control name={"title"} title="Título" question="Titulo" />
				<Form.control.editorJS name={"custom_html"} title="JS Custom" />
				<Form.button.submit
					isLoading={gridUpdateMutation.isLoading || false}
					disabled={gridUpdateMutation.isLoading || false}
					title="Actualizar"
				/>
			</Form>
		</div>
	);
}

interface BannerStoreProps {
	grid: GridBannerSchema;
	order: number;
	i: number;
	onClose: () => void;
	refetch: (clean?: boolean) => void;
}
function BannerStore({ order, grid, i, refetch, onClose }: BannerStoreProps) {
	const bannerStoreMutation = bannerStoreApi();
	const bannerStoreForm = useForm<BannerStoreDto>({
		resolver: valibotVigilio(bannerStoreDto),
		defaultValues: { order, grid_banner_id: grid.id, col: 1, row: 1 },
	});

	function onBannerStore(body: BannerStoreDto) {
		sweetModal({ title: "¿Estas seguro de agregar un banner?" }).then(
			({ isConfirmed }) => {
				if (isConfirmed) {
					bannerStoreMutation.mutate(body, {
						onSuccess() {
							refetch(false);
							onClose();
							sweetAlert({
								icon: "success",
								title: "Banner agregado correctamente.",
							});
						},
						onError(error) {
							handlerError(bannerStoreForm, error);
						},
					});
				}
			},
		);
	}
	return (
		<div class="dark:text-white">
			<span>Banner {i}</span>
			<Form {...bannerStoreForm} onSubmit={onBannerStore}>
				<Form.control
					title="Link"
					placeholder={BASE_URL}
					name={"link" as keyof BannerStoreDto}
					question="Este campo no es obligatorio. El link cuando el usuario presione."
				/>
				<div class="grid grid-cols-2 gap-2">
					<Form.control
						type="number"
						title="Columna"
						name={"col" as keyof BannerStoreDto}
						options={{ setValueAs: Number }}
					/>
					<Form.control
						title="Fila"
						options={{ setValueAs: Number }}
						type="number"
						name={"row" as keyof BannerStoreDto}
					/>
				</div>
				<div class="grid grid-cols-3 gap-2">
					<Form.control
						title="Botón"
						name={"button" as keyof BannerStoreDto}
						question="Si el campo es vació, no se mostrará."
					/>
					<Form.control.toggle
						title="Habilitar"
						name={"enabled" as keyof BannerStoreDto}
						question="¿Quieres mostrar este banner a tu web?"
					/>
				</div>

				<Form.control.file
					name={"file" as keyof BannerStoreDto}
					accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, video/mp4"
					typeFile="image-video"
					title="Imagenes/video"
					typesText="JPG, PNG, WEBP, GIF, MP4, OGG Ó JPEG"
					multiple
					showButonCopy
					showButtonClean
				/>
				<Form.button.submit
					title="Agregar"
					disabled={bannerStoreMutation.isLoading || false}
					isLoading={bannerStoreMutation.isLoading || false}
				/>
			</Form>
		</div>
	);
}
interface BannersProps {
	banners: BannerSchema[];
	g: number;
	grid: GridBannerSchema & { banners: BannerSchema[] };
	onClose: () => void;
	refetch: (clean?: boolean) => void;
}
function Banners({ banners, g, grid, refetch }: BannersProps) {
	return (
		<div class="dark:text-white">
			<span class="font-bold">Banner {g + 1}</span>
			<br />
			<br />
			<div class="flex gap-2 flex-wrap w-full justify-center items-center">
				{banners.map((banner) => (
					<div key={banner.id}>
						<>
							{(() => {
								const file = printFileWithDimension(banner.file, null)[0];

								return (
									<div class=" relative w-[120px]  h-[120px]" key={banner.id}>
										{file?.endsWith("mp4") ? (
											<div class="relative w-full h-full">
												<video
													class="absolute top-0 left-0 w-full h-full object-cover"
													autoplay
													muted
													loop
												>
													<source src={file} type="video/mp4" />
													Tu navegador no soporta el elemento video.
												</video>
											</div>
										) : (
											<div
												class="w-full h-full block  bg-cover  bg-no-repeat"
												style={{
													backgroundImage: `url(${file})`,
												}}
											/>
										)}
										<button
											type="button"
											class="top-1 right-1 absolute bg-black bg-opacity-70 text-xs px-2 py-1 rounded-md"
											onClick={() => {
												sweetModal((onClose) => ({
													html: reactComponent(
														<BannerUpdate
															onClose={onClose}
															banner={banner}
															g={g}
															refetch={refetch}
															grid={grid}
														/>,
													),
													showCloseButton: true,
													isCloseInBackground: false,
												}));
											}}
										>
											<i class="fas fa-pen" />
										</button>
									</div>
								);
							})()}
						</>
					</div>
				))}
			</div>
		</div>
	);
}
interface BannerUpdateProps {
	banner: BannerSchema;
	g: number;
	grid: GridBannerSchema & { banners: BannerSchema[] };
	onClose: () => void;
	refetch: (clean?: boolean) => void;
}
function BannerUpdate({
	g,
	refetch,
	onClose,
	banner,
	grid,
}: BannerUpdateProps) {
	const bannerUpdateMutation = bannerUpdateApi(banner.id);
	const bannerUpdatFileMutation = bannerUpdatFileApi(banner.id);
	const bannerUpdateForm = useForm<BannerUpdateDto>({
		resolver: valibotVigilio(bannerUpdateDto),
		defaultValues: banner,
	});
	const bannerUpdateFormFile = useForm<BannerUpdateFileDto>({
		resolver: valibotVigilio(bannerUpdateFileDto),
	});

	function onBannerUpdate(body: BannerUpdateDto) {
		sweetModal({ title: "¿Estas seguro de editar este banner?" }).then(
			({ isConfirmed }) => {
				if (isConfirmed) {
					bannerUpdateMutation.mutate(body, {
						onSuccess() {
							refetch(false);
							onClose();
							sweetAlert({
								icon: "success",
								title: "Banner editado correctamente.",
							});
						},
						onError(error) {
							handlerError(bannerUpdateForm, error);
						},
					});
				}
			},
		);
	}
	function onBannerUpdateFile(body: BannerUpdateFileDto) {
		sweetModal({
			title: "¿Estás seguro de editar este banner file?",
			showCloseButton: true,
			showCancelButton: true,
		}).then(({ isConfirmed }) => {
			if (isConfirmed) {
				bannerUpdatFileMutation.mutate(
					{ ...body },
					{
						onSuccess() {
							sweetAlert({
								icon: "success",
								title: "Se actualizó imagenes correctamente",
							});
							refetch(false);
							onClose();
						},
						onError() {
							sweetAlert({
								icon: "danger",
								title: "Error al editar imagen",
							});
						},
					},
				);
			}
		});
	}
	async function initialUpdateImages() {
		if (banner.file) {
			const [imgs, videos] = await Promise.all([
				getFilesEdit(banner.file, 1200),
				getFilesEdit(banner.file, null, "video/mp4"),
			]);
			const images = [...imgs, ...videos];
			bannerUpdateFormFile.setValue("file", images);
		}
	}

	useEffect(() => {
		initialUpdateImages();
	}, []);
	const arrayOrders = grid.banners.map((val) => val.order);
	const max = Math.max(...arrayOrders);
	const fullArray = Array.from({ length: max }, (_, i) => i + 1);

	const missingNumbers = fullArray.filter((num) => !arrayOrders.includes(num));
	const arrayNumber = [...arrayOrders, ...missingNumbers]
		.toSorted()
		.filter((val) => val !== banner.order)
		.filter(Boolean)
		.map((val) => ({ key: String(val), value: String(val) }));
	return (
		<div class="dark:text-white">
			<span>
				Banner {g} - Carta {banner.order}
			</span>
			<Form {...bannerUpdateForm} onSubmit={onBannerUpdate}>
				<Form.control
					title="Link"
					placeholder={BASE_URL}
					name={"link" as keyof BannerStoreDto}
					question="Este campo no es obligatorio. El link cuando el usuario presione."
				/>
				<Form.control.select
					title="Orden"
					array={arrayNumber}
					name={"order" as keyof BannerStoreDto}
					options={{ setValueAs: Number }}
					placeholder="Orden"
					question="Orden - Lugar donde se ubicará esta carta"
				/>
				<div class="grid grid-cols-2 gap-2">
					<Form.control
						type="number"
						title="Columna"
						name={"col" as keyof BannerStoreDto}
						options={{ setValueAs: Number }}
					/>
					<Form.control
						type="number"
						title="Fila"
						options={{ setValueAs: Number }}
						name={"row" as keyof BannerStoreDto}
					/>
				</div>
				<Form.control.toggle
					title="Habilitar"
					name={"enabled" as keyof BannerStoreDto}
					question="¿Quieres mostrar este banner a tu web?"
				/>
				<Form.control
					title="Botón"
					name={"button" as keyof BannerStoreDto}
					question="Si el campo es vació, no se mostrará."
				/>
				<Form.button.submit
					title="Actualizar"
					disabled={bannerUpdateMutation.isLoading || false}
					isLoading={bannerUpdateMutation.isLoading || false}
				/>
			</Form>
			<br />
			<Form {...bannerUpdateFormFile} onSubmit={onBannerUpdateFile}>
				<Form.control.file
					name={"file" as keyof BannerUpdateFileDto}
					accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, video/mp4"
					typeFile="image-video"
					title="Imagenes/video"
					typesText="JPG, PNG, WEBP, GIF, MP4, OGG Ó JPEG"
					multiple
					showButonCopy
					showButtonClean
				/>
				<Form.button.submit
					title="Actualizar"
					disabled={bannerUpdatFileMutation.isLoading || false}
					isLoading={bannerUpdatFileMutation.isLoading || false}
				/>
			</Form>
		</div>
	);
}
export default BannersIndex;
