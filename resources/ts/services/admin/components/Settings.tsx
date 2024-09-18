import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { webNewsApi } from "../apis/news.api";
import { useSignal } from "@preact/signals";
import { weatherApi } from "../apis/weather.api";
import { useForm } from "react-hook-form";
import { type ConverterBody, websConverterApi } from "../apis/converter.api";
import { isValidRUC, isValidDni } from "@/orders/libs";
import { useEffect } from "preact/hooks";
import Form from "~/components/form";
import CalculatorVigilio from "./Calculator";
import { dniApi } from "@/orders/apis/others/dni.api";
import { rucApi } from "@/orders/apis/others/ruc.api";
import Loading from "./Loading";
import LoaderSubmit from "~/components/LoaderSubmit";
import AssistantVirtualAdmin from "./AssistantVirtualAdmin";
import useAuthStore from "@/auth/stores/auth.store";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { aiImagesApi } from "@/bot/apis/ai.image.api";
import { Input, maxLength, minLength, object, string } from "@vigilio/valibot";
import { valibotVigilio } from "~/libs/valibot";
import useCopyToClipboard from "~/hooks/useCopyToClipboard";
import { onDownloadImage } from "~/libs/helpers";

function Settings() {
	const showBottom = useSignal(false);
	function toggleMostrarBotones() {
		showBottom.value = !showBottom.value;
	}
	return (
		<div className="fixed top-28 right-1 z-[999999999999999999999999999]">
			<button
				id="herramientas"
				className="dark:bg-admin-terciary shadow  w-[30px] h-[30px] bg-white  flex justify-center items-center dark:text-white font-bold  rounded"
				type="button"
				aria-label="change button"
				onClick={toggleMostrarBotones}
			>
				<i class="far fa-cogs" />
			</button>
			<div>
				<button
					type="button"
					aria-label="change button"
					className={`${
						showBottom.value ? "block" : "hidden"
					} dark:bg-admin-terciary bg-opacity-60 w-[30px] h-[30px] bg-white shadow flex justify-center items-center dark:text-white font-bold rounded my-2`}
					style={{
						position: "absolute",
						left: "0px",
						transform: "translateY(-80px)",
					}}
					onClick={() =>
						sweetModal({
							html: reactComponent(<Weather />),
							showCloseButton: true,
							position: "start",
							isCloseInBackground: false,
							sweetWidth: "600px",
						})
					}
				>
					<i class="fas fa-cloud" />
				</button>
				<button
					type="button"
					aria-label="change button"
					className={`${
						showBottom.value ? "block" : "hidden"
					} dark:bg-admin-terciary bg-opacity-60 w-[30px] h-[30px] bg-white shadow flex justify-center items-center dark:text-white font-bold rounded my-2`}
					style={{
						position: "absolute",
						left: "-40px",
						transform: "translateY(-60px)",
					}}
					onClick={() =>
						sweetModal({
							html: reactComponent(<CalculatorVigilio />),
							showCloseButton: true,
							position: "center",
							sweetWidth: "600px",
							isCloseInBackground: false,
						})
					}
				>
					<i class="fas fa-calculator" />
				</button>
				{/* solo admin */}
				{useAuthStore().state!.role_id === 1 ? (
					<button
						type="button"
						aria-label="change button"
						className={`${
							showBottom.value ? "block" : "hidden"
						} dark:bg-admin-terciary bg-opacity-60 w-[30px] h-[30px] bg-white shadow flex justify-center items-center dark:text-white font-bold rounded my-2`}
						style={{
							position: "absolute",
							left: "-40px",
							transform: "translateY(-20px)",
						}}
						onClick={() =>
							sweetModal({
								html: reactComponent(<AssistantVirtualAdmin />),
								showCloseButton: true,
								position: "center",
								isCloseInBackground: false,
							})
						}
					>
						<i class="fas fa-user-robot" />
					</button>
				) : null}
				<button
					onClick={() =>
						sweetModal({
							html: reactComponent(<News />),
							showCloseButton: true,
							sweetWidth: "650px",
							isCloseInBackground: false,
						})
					}
					className={`${
						showBottom.value ? "block" : "hidden"
					} dark:bg-admin-terciary bg-opacity-60 w-[30px] h-[30px] bg-white shadow flex justify-center items-center dark:text-white font-bold  rounded my-2`}
					type="button"
					aria-label="change button"
					style={{
						position: "absolute",
						left: "-0px",
						transform: "translateY(5px)",
					}}
				>
					<i class="fas fa-newspaper" />
				</button>
				<button
					onClick={() =>
						sweetModal({
							html: reactComponent(<ImagesIa />),
							showCloseButton: true,
							sweetWidth: "450px",
							isCloseInBackground: false,
						})
					}
					className={`${
						showBottom.value ? "block" : "hidden"
					} dark:bg-admin-terciary bg-opacity-60 w-[30px] h-[30px] bg-white shadow flex justify-center items-center dark:text-white font-bold  rounded my-2`}
					type="button"
					aria-label="change button"
					style={{
						position: "absolute",
						left: "-0px",
						transform: "translateY(45px)",
					}}
				>
					<i class="fas fa-images" />
				</button>
			</div>
		</div>
	);
}

function News() {
	const location = useSignal("mundo");
	const newsApi = webNewsApi(location.value);

	let component: JSX.Element | null = null;
	if (newsApi.isLoading) {
		component = <Loading className="h-[500px]" />;
	}
	if (newsApi.isError) {
		component = <span class="dark:text-white">Error, pruebelo mas tarde</span>;
	}
	if (newsApi.isSuccess) {
		component = (
			<div>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						newsApi.refetch(false);
					}}
					class="flex gap-2 items-center mb-5"
				>
					<h3 class="text-md text-primary text-xl">Noticias de Hoy </h3>
					<input
						type="text"
						class="dark:text-secondary-light text-secondary-dark dark:bg-admin-terciary bg-paper-light my-1 shadow-sm border border-gray-200 dark:border-gray-600 rounded-md w-[60px] text-sm py-1"
						value={location.value}
						onChange={(e) => {
							location.value = (e.target as HTMLInputElement).value;
						}}
						placeholder=""
					/>
					<button
						type="submit"
						aria-label="search"
						class="bg-primary py-1 px-3 text-white rounded-md"
					>
						<i class="fa-solid fa-magnifying-glass" />
					</button>
					{newsApi.isFetching ? <LoaderSubmit color="var(--primary)" /> : null}
				</form>

				<div class="flex flex-col gap-4 max-h-[500px] overflow-auto">
					{newsApi.data?.news.map((noti) => {
						return (
							<div class="dark:text-white" key={noti.title}>
								<div
									dangerouslySetInnerHTML={{
										__html: noti.fuente,
									}}
									class="flex gap-2 items-center text-xs"
								/>

								<div class="flex gap-4">
									<div class="flex flex-col gap-1">
										<a
											href={noti.uri}
											target="_blank"
											rel="noreferrer"
											class="text-md text-primary hover:underline font-bold"
										>
											{noti.title}
										</a>
										<p class="text-sm font-base">{noti.description}</p>
									</div>
									{noti.image ? (
										<img
											src={noti.image}
											width={100}
											class="object-cover w-[100px] h-[100px]"
											height={100}
											alt={noti.title}
										/>
									) : null}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	}

	return component;
}

function Weather() {
	const weatherQuery = weatherApi();
	let component: JSX.Element | null = null;

	if (weatherQuery.isLoading) {
		component = <Loading className="h-[500px]" />;
	}
	if (weatherQuery.isError) {
		component = <span class="dark:text-white">Error, pruebelo mas tarde</span>;
	}
	if (weatherQuery.isSuccess) {
		const clima = weatherQuery.data!.weather;
		const formConverter = useForm<ConverterBody>({
			mode: "all",
			defaultValues: { from: "USD", to: "PEN" },
		});
		const formdnisunat = useForm<{ type: "DNI" | "RUC"; value: string }>({
			mode: "all",
			defaultValues: { type: "DNI" },
		});
		const converterMutation = websConverterApi();
		const dniMutation = dniApi();
		const rucMutation = rucApi();
		const type = formdnisunat.watch("type");
		function onConverter(data: ConverterBody) {
			converterMutation.mutate(data);
		}
		function onDniSunat(data: { type: "DNI" | "RUC"; value: string }) {
			if (data.type === "DNI") {
				dniMutation.mutate(data.value);
			} else {
				rucMutation.mutate(data.value);
			}
		}
		useEffect(() => {
			formdnisunat.setValue("value", "");
		}, [type]);
		component = (
			<div class="flex flex-col w-full justify-center items-center gap-4 ">
				<div>
					<h3 class="text-primary text-center font-bold">Clima Actual</h3>
					<div class="flex gap-2 items-center justify-center">
						<img
							width={80}
							height={80}
							class="[&>svg]:w-[100px] [&>svg]:h-[100px] [&>svg]:fill-black"
							src={clima.image}
							alt="weather"
						/>

						<div class="dark:text-white flex flex-col justify-center items-center">
							<div class="flex flex-col">
								<span class="text-4xl font-bold">{clima.temperature}</span>
							</div>
							<div
								dangerouslySetInnerHTML={{
									__html: clima.humedad,
								}}
								class="flex gap-2 text-xs [&>svg]:w-[20px] items-center dark:text-white "
							/>
							<div
								dangerouslySetInnerHTML={{
									__html: clima.viento,
								}}
								class="flex gap-2 text-xs [&>svg]:w-[20px] [&>div>span>span>svg]:w-[20px] items-center dark:textwhite"
							/>
						</div>
					</div>
				</div>
				<div class="h-[0.1px] w-full bg-terciary" />
				<div class="w-full">
					<h3 class="text-primary text-center font-bold">
						Convertir Moneda - {formConverter.watch("from")} a{" "}
						{formConverter.watch("to")}
					</h3>
					<Form className="w-full" onSubmit={onConverter} {...formConverter}>
						<Form.control
							type="number"
							name={"amount"}
							title="Monto"
							options={{
								validate: {
									onlyNumber: (v) => !Number.isNaN(v),
									grant: (v) => Number(v) > 0,
								},
								value: "1" as unknown as undefined,
							}}
						/>
						<div class="flex gap-4 items-center [&>div>label]:hidden">
							<Form.control.select
								name={"from"}
								title="Moneda"
								placeholder="Escoja tipo de moneda"
								array={[
									{
										key: storageEmpresa?.money.simbolo,
										value: storageEmpresa?.money.money!,
									},
									{ key: "USD", value: "Dolar" },
									{ key: "EUR", value: "Euro" },
								]}
								options={{
									validate: {
										no: (v) => ["PEN", "USD", "EUR"].includes(v),
									},
								}}
							/>
							<span class="dark:text-white">a</span>
							<Form.control.select
								name={"to"}
								title="Moneda"
								placeholder="Escoja tipo de moneda"
								array={[
									{
										key: storageEmpresa?.money.simbolo,
										value: storageEmpresa?.money.money!,
									},
									{ key: "USD", value: "Dolar" },
									{ key: "EUR", value: "Euro" },
								]}
								options={{
									validate: {
										no: (v) => ["PEN", "USD", "EUR"].includes(v),
									},
								}}
							/>
						</div>
						<>
							{converterMutation.isError ? (
								<span>{JSON.stringify(converterMutation.error)}</span>
							) : null}
							{converterMutation.isSuccess && !converterMutation.isLoading ? (
								<>
									<div
										class="dark:text-white"
										dangerouslySetInnerHTML={{
											__html: converterMutation.data?.result.resultado!,
										}}
									/>
									<div
										class="dark:text-white"
										dangerouslySetInnerHTML={{
											__html: converterMutation.data?.result.today!,
										}}
									/>
									<span class="text-xs text-terciary">
										Actualizado {new Date().toLocaleString()}
									</span>
								</>
							) : null}
						</>

						<Form.button.submit
							isLoading={converterMutation.isLoading || false}
							ico={<i class="fas fa-search-dollar" />}
							className="py-3"
							title="Convertir"
						/>
					</Form>
				</div>
				<div class="h-[0.1px] w-full bg-terciary" />
				{storageEmpresa?.dial_code === "51" ? (
					<div class="w-full">
						<Form {...formdnisunat} onSubmit={onDniSunat}>
							<Form.control.select
								name={"type"}
								array={[
									{ key: "DNI", value: "DNI" },
									{ key: "RUC", value: "RUC" },
								]}
								title="Documento"
								placeholder="Escoja documento"
							/>
							{formdnisunat.watch("type") === "DNI" ? (
								<Form.control
									name="value"
									title="DNI"
									options={{
										validate: {
											ruc: (val) => isValidDni.test(val),
										},
									}}
								/>
							) : (
								<Form.control
									name="value"
									title="RUC"
									options={{
										validate: {
											ruc: (val) => isValidRUC.test(val),
										},
									}}
								/>
							)}
							<>
								{type === "DNI" &&
								dniMutation.isSuccess &&
								!dniMutation.isLoading ? (
									<pre class="w-full dark:text-white text-xs break-words text-wrap">
										{JSON.stringify(dniMutation.data?.data, null, 3)}
									</pre>
								) : null}
								{type === "RUC" &&
								rucMutation.isSuccess &&
								!rucMutation.isLoading ? (
									<pre class="w-full dark:text-white text-xs text-wrap  break-words">
										{JSON.stringify(rucMutation.data?.result, null, 3)}
									</pre>
								) : null}
							</>

							<Form.button.submit
								disabled={
									dniMutation.isLoading || rucMutation.isLoading || false
								}
								isLoading={
									dniMutation.isLoading || rucMutation.isLoading || false
								}
								ico={<i class="fas fa-search" />}
								title="Buscar"
							/>
						</Form>
					</div>
				) : null}
			</div>
		);
	}
	return (
		<div class=" min-h-[300px] flex justify-center items-center">
			{component}
		</div>
	);
}

function ImagesIa() {
	const [cp] = useCopyToClipboard();
	const imageDto = object({
		name: string([minLength(2), maxLength(80)]),
	});
	type ImageDto = Input<typeof imageDto>;
	const imageForm = useForm<ImageDto>({ resolver: valibotVigilio(imageDto) });
	const aiImagesMutation = aiImagesApi();
	function onSearchImage(body: ImageDto) {
		aiImagesMutation.mutate(body.name, {
			onSuccess() {
				sweetAlert({ icon: "success", title: "Se encontró imagenes" });
			},
			onError(err) {
				sweetAlert({ icon: "success", title: err.message });
			},
		});
	}
	return (
		<div>
			<Form onSubmit={onSearchImage} {...imageForm}>
				<Form.control
					title="Buscar"
					name="name"
					placeholder="Buscar Imagenes"
				/>

				<Form.button.submit
					ico={<i class="far fa-search" />}
					title="Buscar"
					isLoading={aiImagesMutation.isLoading || false}
				/>
			</Form>
			{aiImagesMutation.isSuccess && !aiImagesMutation.isLoading ? (
				<div class="mt-6">
					<span class="dark:text-white font-semibold text-xs">Resultados</span>
					<div class="flex flex-wrap gap-2 h-[400px] overflow-auto">
						{(() => {
							const images = aiImagesMutation.data?.data.images;

							return (
								<>
									{images?.map((image) => (
										<div key={image.preview} class="w-[100px] relative group">
											<img
												width={100}
												height={100}
												src={
													image.image.endsWith(".png")
														? image.image
														: image.preview
												}
												alt=""
												class="rounded-md  w-full h-full object-contain"
											/>
											<div class=" gap-2 items-center absolute  justify-center  bottom-2 right-0 left-0 w-full hidden group-hover:flex">
												<button
													aria-label="btn"
													type="button"
													class="bg-black bg-opacity-80 text-white p-1 rounded-md text-xs"
													onClick={() => {
														sweetModal({
															html: reactComponent(
																<div>
																	<img
																		class="object-contain"
																		src={image.image}
																		width={500}
																		height={500}
																		alt=""
																	/>
																</div>,
															),
															showCloseButton: true,
														});
													}}
												>
													<i class="far fa-eye" />
												</button>
												<button
													aria-label="btn"
													type="button"
													class="bg-black bg-opacity-80 text-white p-1 rounded-md text-xs"
													onClick={async () => {
														try {
															cp(image.image).then(() => {
																sweetAlert({
																	icon: "success",
																	title: "Copiado correctamente.",
																});
															});
														} catch (error) {
															sweetAlert({
																icon: "danger",
																title: "Error al copiar",
															});
														}
													}}
												>
													<i class="far fa-copy" />
												</button>
												<button
													aria-label="btn"
													type="button"
													class="bg-black bg-opacity-80 text-white p-1 rounded-md text-xs"
													onClick={() => {
														onDownloadImage(
															image.image,
															`${imageForm.watch("name")}.${image.image
																.split(".")
																.at(-1)}`,
														);
													}}
												>
													<i class="fas fa-download" />
												</button>
											</div>
										</div>
									))}
								</>
							);
						})()}
					</div>
				</div>
			) : null}
		</div>
	);
}
export default Settings;
