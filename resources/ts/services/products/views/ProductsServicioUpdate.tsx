import { useFieldArray, useForm } from "react-hook-form";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { useEffect, useMemo } from "preact/hooks";
import { slug as transformSlug } from "@vigilio/express-core/helpers";
import Form from "~/components/form";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import AdminHr from "~/components/AdminHr";
import { subtotal as subtotalCart, formatMoney } from "@/cart/libs/helpers";
import { valibotVigilio } from "~/libs/valibot";
import { getFilesEdit } from "~/libs/upload";
import { getPeriodDescription, handlerError } from "~/libs/helpers";
import useEmpresastore, {
	storageEmpresa,
} from "@/empresas/stores/empresa.store";
import useAuthstore from "@/auth/stores/auth.store";
import {
	productsShowApi,
	type ProductsShowAPI,
} from "../apis/products/products.show.api";
import { formSelectNumber } from "~/components/form/WebFormSelect";
import {
	productsUpdateImagesDto,
	ProductsUpdateImagesDto,
} from "../dtos/products_normal.dto";
import { categoriesIndexApi } from "../apis/categories/categories.index.api";
import { ProductsServicioSchemaFromServer } from "../schemas/products_servicio.schema";
import {
	productsServicioUpdateDto,
	ProductsServicioUpdateDto,
} from "../dtos/products_servicio.dto";
import {
	productsServicioUpdateApi,
	servicioUpdateImagesApi,
} from "../apis/products/products_servicio.update.api";
import { useSignal } from "@preact/signals";

interface ProductsServicioUpdateProps {
	id?: string | number;
	refetch?: (clean?: boolean) => void;
	refetchProduct?: (clean?: boolean) => void;
}
function ProductsServicioUpdate({
	id,
	refetch,
	refetchProduct,
}: ProductsServicioUpdateProps) {
	const { guards } = useAuthstore();
	if (!guards.permissionAdminGuard()) {
		window.history.back();
		return null;
	}
	const productQuery = productsShowApi(id as string, true);

	let component: JSX.Element | JSX.Element[] | null = null;

	if (productQuery.isLoading) {
		component = <Loading />;
	}
	if (productQuery.isError) {
		component = <View404 message={`No se encontró un producto: ${id}`} />;
	}
	if (productQuery.isSuccess && productQuery.data) {
		const empresa = useEmpresastore();
		const product = productQuery.data
			.product as ProductsShowAPI["product"] as ProductsServicioSchemaFromServer;
		const error = useSignal<string | null>(null);

		const { createdAt, updatedAt, images, id, category, empresa_id, ...rest } =
			product;
		const formProductsServicioUpdate = useForm<ProductsServicioUpdateDto>({
			resolver: valibotVigilio(productsServicioUpdateDto),
			mode: "all",
			defaultValues: {
				...rest,
				price: Number(rest.price),
				discount: Number(rest.discount),
			},
		});
		const name = formProductsServicioUpdate.watch("name");
		const discount = formProductsServicioUpdate.watch("discount");
		const price = formProductsServicioUpdate.watch("price");
		const categoriesIndexQuery = categoriesIndexApi(true);

		const categoriesSelect = useMemo(() => {
			if (categoriesIndexQuery.isSuccess && categoriesIndexQuery.data) {
				return categoriesIndexQuery.data.data.map((value) => ({
					key: value.id,
					value: value.name,
				}));
			}
			return [];
		}, [categoriesIndexQuery.data, categoriesIndexQuery.isSuccess]);
		const formProductsServicioUpdateImages = useForm<ProductsUpdateImagesDto>({
			mode: "all",
			resolver: valibotVigilio(productsUpdateImagesDto),
		});

		const mutateProductsServicioUpdateApi = productsServicioUpdateApi(
			product.id,
		);
		const mutateProductsServicioUpdateImagesApi = servicioUpdateImagesApi(
			product.id,
		);

		function onUpdateProduct(body: ProductsServicioUpdateDto) {
			if (!body.showHorario && !body.days.length) {
				error.value =
					"Debes agregar un suscripción o habilitar 'mostrar horario' depende del servicio.";
				return;
			}
			const existHorario = body.days.some(
				(item, index) =>
					body.days.findIndex((i) => i.days === item.days) !== index,
			);
			const existHorario2 = body.days.some(
				(item, index) =>
					body.days.findIndex((i) => i.name === item.name) !== index,
			);
			if (existHorario) {
				error.value = "Se repitieron los dias en el campo suscripción";
				return;
			}
			if (existHorario2) {
				error.value = "Se repitieron los nombres en el campo suscripción";
				return;
			}

			error.value = null;
			sweetModal({
				title: "¿Estás seguro de editar este servicio?",
				customIcon:
					"<i class='fa-regular fa-handshake text-3xl dark:text-white' /> </i>",
				showCloseButton: true,
				showCancelButton: true,
			}).then(({ isConfirmed }) => {
				if (isConfirmed) {
					mutateProductsServicioUpdateApi.mutate(body, {
						onSuccess(data) {
							sweetAlert({
								icon: "success",
								title: `<p class="text-center">Servicio actualizado correctamente <b>${data.product.name}</b></p>`,
							});
							productQuery.refetch(false);
							if (refetchProduct) {
								refetchProduct(false);
							}
							if (refetch) {
								refetch(false);
							}
						},
						onError(error) {
							handlerError(formProductsServicioUpdate, error);
						},
					});
				}
			});
		}
		const onUpdateImagesProduct = (data: ProductsUpdateImagesDto) => {
			sweetModal({
				title: "¿Estás seguro de editar las imagenes de este servicio?",
				customIcon:
					"<i class='fa-regular fa-handshake text-3xl dark:text-white' /> </i>",
				showCloseButton: true,
				showCancelButton: true,
			}).then(({ isConfirmed }) => {
				if (isConfirmed) {
					mutateProductsServicioUpdateImagesApi.mutate(
						{ ...data, name: product.name },
						{
							onSuccess() {
								sweetAlert({
									icon: "success",
									title: "Se actualizó imagenes correctamente",
								});
								if (refetchProduct) {
									refetchProduct(false);
								}
								if (refetch) {
									refetch(false);
								}
								productQuery.refetch(false);
							},
							onError(error) {
								handlerError(formProductsServicioUpdate, error);
							},
						},
					);
				}
			});
		};

		useEffect(() => {
			if (name) {
				formProductsServicioUpdate.setValue("slug", transformSlug(name || ""), {
					shouldValidate: true,
				});
			}
		}, [name]);

		useEffect(() => {
			formProductsServicioUpdate.setValue("slug", transformSlug(name || ""), {
				shouldValidate: true,
			});
		}, [name]);

		async function initialUpdateImages() {
			if (product.images) {
				const images = await getFilesEdit(product.images, 500);
				formProductsServicioUpdateImages.setValue("images", images);
			}
		}

		const subtotal = useMemo(
			() => subtotalCart(price, discount),
			[discount, price],
		);

		useEffect(() => {
			initialUpdateImages();
		}, []);
		const { fields, append, remove } = useFieldArray({
			control: formProductsServicioUpdate.control,
			name: "characteristics",
		});
		const dayjsArry = useFieldArray({
			control: formProductsServicioUpdate.control,
			name: "days",
		});
		component = (
			<div class="text-start  mt-6">
				<div class="flex justify-between items-center mb-4 ">
					<h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2 ">
						<i class="fa-regular fa-handshake" />
						<span class="break-words text-wrap ">
							Editar Servicio - {product.name}
						</span>
					</h3>
				</div>
				<Form {...formProductsServicioUpdate} onSubmit={onUpdateProduct}>
					<div class="flex justify-between items-center mb-4">
						<Form.button.reset />
					</div>
					<div class="">
						<div class="w-full flex flex-row gap-2">
							<Form.control
								name={"name" as keyof ProductsServicioUpdateDto}
								title="Nombre"
								placeholder="Nombre de servicio"
							/>

							<Form.control
								name={"slug" as keyof ProductsServicioUpdateDto}
								title="Slug"
								placeholder="nombre-de-servicio"
								options={{ setValueAs: transformSlug }}
								disabled
							/>
						</div>
						<div class="w-full flex flex-col md:flex-row gap-2">
							<Form.control
								name={"price" as keyof ProductsServicioUpdateDto}
								step={0.1}
								type="number"
								title="Precio Normal"
								placeholder={`${formatMoney(10)}`}
								options={{
									setValueAs(value) {
										return Number(value) > 0 ? Number(value) : null;
									},
								}}
							/>
							<div class="w-full flex items-center gap-2">
								<Form.control
									name={"discount" as keyof ProductsServicioUpdateDto}
									type="number"
									title="Descuento"
									placeholder="0%"
									step={0.1}
									options={{
										value: 0 as unknown as undefined,
										setValueAs(value) {
											return Number(value) >= 0 ? Number(value) : null;
										},
									}}
								/>
								<div class="flex flex-col gap-1">
									<span class="text-lg whitespace-nowrap  text-primary">
										<span class="text-gray-400">{formatMoney(subtotal)}</span> -{" "}
										{empresa.state!.enabled_igv
											? formatMoney(
													subtotalCart(subtotal, empresa.state!.igv, true),
												)
											: null}{" "}
									</span>
									<span class="text-xs whitespace-nowrap dark:text-white flex gap-2 items-center">
										{discount ? (
											<span class="text-xs dark:text-white text-black">
												- incl. {discount}%
											</span>
										) : null}
										{empresa.state!.enabled_igv
											? `+ inc. ${empresa.state!.igv}% ${
													empresa.state!.tipo_impuesto
												}`
											: null}
									</span>
								</div>
							</div>
						</div>
						<div class="w-full flex flex-row gap-2">
							<Form.control.toggle
								name={"enabled" as keyof ProductsServicioUpdateDto}
								title="Disponibilidad"
								question="Cuando está habilitado los clientes podrán comprar el producto."
							/>

							<Form.control.select
								name={"category_id" as keyof ProductsServicioUpdateDto}
								title="Categoría"
								placeholder="Escoger categoría"
								array={categoriesSelect}
								options={{
									setValueAs: formSelectNumber,
								}}
								isLoading={categoriesIndexQuery.isLoading || false}
							/>
						</div>

						<div class="flex flex-col gap-2">
							<span class="text-xs dark:text-white font-semibold">
								Suscripciones <br /> (Este campo es necesario si ofreces
								servicios de SUSCRIPCIONES y MENSUALIDADES)
								<br />
								Cuando tu cliente realize el pago verá las suscripciones de dias
								disponibles de este servicio.
								<br />
								Por ejemplo: Mensual, Semestral, Anual
							</span>
							<div>
								{dayjsArry.fields.map((field, i) => (
									<div key={field} class="flex gap-2 items-center">
										<Form.control
											title="Días"
											type="number"
											placeholder={"7"}
											name={`days.${i}.days`}
											options={{ setValueAs: Number }}
											question={
												<span class="block w-[100px]">
													<br />7 días: 1 semana
													<br />
													30 días: 30 dias
													<br />
													365 días: 1 año
													<br />
													etc
												</span>
											}
										/>
										<Form.control
											title="Cantidad"
											type="number"
											placeholder={"1"}
											name={`days.${i}.cantidad`}
											options={{ setValueAs: Number }}
										/>
										<Form.control
											title="Nombre"
											placeholder={"Mensual"}
											name={`days.${i}.name`}
										/>
										<span class="text-xs dark:text-white text-center flex flex-col">
											<span>
												{getPeriodDescription(
													formProductsServicioUpdate.watch(`days.${i}.days`),
												)}
											</span>
											<span>
												{empresa.state!.enabled_igv
													? formatMoney(
															subtotalCart(subtotal, empresa.state!.igv, true) *
																formProductsServicioUpdate.watch(
																	`days.${i}.cantidad`,
																),
														)
													: formatMoney(
															subtotal *
																formProductsServicioUpdate.watch(
																	`days.${i}.cantidad`,
																),
														)}
											</span>
										</span>
										<button
											type="button"
											class="bg-danger mt-3 px-4 py-2  text-white rounded-md "
											onClick={() => {
												dayjsArry.remove(i);
											}}
										>
											<i class="fas fa-trash" />
										</button>
									</div>
								))}
								<button
									type="button"
									class="bg-primary px-4 py-2  text-white rounded-md"
									onClick={() => {
										dayjsArry.append({
											days: 30,
											cantidad: 1,
											name: "Mensual",
										});
									}}
								>
									+
								</button>
							</div>
						</div>
						<br />
						<div class="flex flex-col">
							<span class="text-xs font-semibold dark:text-white">
								¿Mostrar horario? <br /> (Este campo es necesario si ofreces
								servicios con horarios. <br /> Por ejemplo: barberías,
								peluquerias, Spas, consultas medicas, etc)
								<br />
							</span>
							<Form.control.toggle
								name={"showHorario" as keyof ProductsServicioUpdateDto}
								title=""
								question={
									<div class="md:w-[100px]">
										Cuando está habilitado, tus clientes podrán escoger la fecha
										y hora en que requerirán tu servicio al momento de realizar
										el pago.
										<br />
										Lo podrás ver en CITAS <i class="fas fa-handshake-alt" />
									</div>
								}
							/>
						</div>
						{error.value ? (
							<p class="text-sm text-danger font-bold">{error.value}</p>
						) : (
							<></>
						)}

						<Form.control.area
							name={"description" as keyof ProductsServicioUpdateDto}
							title="Descripción"
							placeholder="Descripción del servicio"
						/>
						{storageEmpresa!.web ? (
							<Form.control
								name={"url" as keyof ProductsServicioUpdateDto}
								title="Url"
								question={
									<div class="w-[150px]">
										Cuando tu cliente le pregunte a la inteligencia Artificial.
										'Más información del producto', la inteligencia Artificial
										le mandará este url <br />
									</div>
								}
								placeholder={`${storageEmpresa?.web}/url-de-producto`}
							/>
						) : (
							<></>
						)}
						<div>
							<div class="mb-2">
								<span class="dark:text-white text-xs font-bold">
									Caracterísiticas del servicio
								</span>
								<div class="max-h-[300px] overflow-auto">
									{fields.map((field, i) => (
										<div class="flex gap-2 items-center" key={field.id}>
											<Form.control
												name={`characteristics.${i}.name`}
												title="Nombre"
												placeholder="Velocidad de Descarga"
											/>
											<Form.control
												name={`characteristics.${i}.value`}
												title="Valor"
												placeholder="24gb"
											/>
											<button
												class="mx-auto block bg-danger px-2 py-1 mt-2 rounded-md shadow text-white"
												type="button"
												aria-label="to add"
												onClick={() => {
													remove(i);
												}}
											>
												<i class="fa-solid fa-trash" />
											</button>
										</div>
									))}
								</div>
							</div>
							<button
								class="bg-primary px-4 py-2 rounded-md shadow text-white"
								type="button"
								aria-label="to add"
								onClick={() => {
									append({ name: "", value: "" });
								}}
							>
								+
							</button>
						</div>
					</div>

					<div class="flex justify-center">
						<Form.button.submit
							disabled={mutateProductsServicioUpdateApi.isLoading || false}
							isLoading={mutateProductsServicioUpdateApi.isLoading || false}
							title="Guardar"
						/>
					</div>
				</Form>
				<AdminHr />
				<div class="flex justify-between items-center">
					<h3 class="dark:text-white  font-bold uppercase text-center flex gap-2 break-words text-wrap ">
						<i class="fa-solid fa-image" />
						Editar imagenes - {product.name}
					</h3>
				</div>
				<Form
					{...formProductsServicioUpdateImages}
					onSubmit={onUpdateImagesProduct}
				>
					<Form.control.file
						name={"images" as keyof ProductsUpdateImagesDto}
						title="Images de perfil"
						accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
						typeFile="image"
						multiple
						showButonCopy
						showButtonClean
					/>
					<div class="flex justify-center">
						<Form.button.submit
							disabled={
								mutateProductsServicioUpdateImagesApi.isLoading || false
							}
							isLoading={
								mutateProductsServicioUpdateImagesApi.isLoading || false
							}
							ico={<i class="fas fa-pen" />}
							title="Editar"
						/>
					</div>
				</Form>
			</div>
		);
	}

	return component;
}

export default ProductsServicioUpdate;
