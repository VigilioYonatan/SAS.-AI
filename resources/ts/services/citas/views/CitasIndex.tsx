import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import Calendar from "~/components/Calendary";
import { reactComponent } from "~/libs/preact";
import CitasSettings from "./CitasSettings";
import { useSignal } from "@preact/signals";
import dayjs, { handlerError, NOW } from "~/libs/helpers";
import { citasByDayApi } from "../apis/citasByDay.api";
import Form from "~/components/form";
import { citasStoreApi } from "../apis/citas.store.api";
import { useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import { CitasStoreDto, citasStoreDto } from "../dtos/citas.store.dto";
import useEmpresastore, {
	storageEmpresa,
} from "@/empresas/stores/empresa.store";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import { useEffect } from "preact/hooks";
import { citasDestroyApi } from "../apis/citas.destroy.api";
import { citasUpdateApi } from "../apis/citas.update.api";
import { CitasSchema } from "../schemas/citas.schema";
import { CitasUpdateDto, citasUpdateDto } from "../dtos/citas.update.dto";
import { empresaContactsUpdateApi } from "@/empresas/apis/empresas.contacts.update.api";

function CitasIndex() {
	const today = useSignal(NOW().format("YYYY-MM-DD HH:mm"));

	const query = citasByDayApi(today);

	let component: JSX.Element | null = null;
	if (query.isLoading) {
		component = <Loading />;
	}
	if (query.isError) {
		component = <View404 />;
	}
	if (query.isSuccess) {
		const citasDestroyMutation = citasDestroyApi();
		useEffect(() => {
			query.refetch(false);
		}, [today.value]);

		const citas = query.data?.citas;

		const hours = Array.from({ length: 24 }, (_, index) => {
			const hour = index < 10 ? `0${index}` : index; // Formato 00, 01, ..., 24
			return `${hour}:00`;
		});

		component = (
			<div class="m-2">
				<div className="flex flex-col gap-4 mx-1 ">
					<AdminBreadCrumb current="Citas/Meetings" />
				</div>
				<div class="flex justify-between mt-2">
					<div>
						<button
							type="button"
							onClick={() => {
								sweetModal({
									html: reactComponent(<CitasSettings />),
									showCloseButton: true,
									isCloseInBackground: false,
									sweetWidth: "700px",
									position: "start",
								});
							}}
							class="bg-primary px-6 py-2 rounded-md text-white text-xs font-bold"
						>
							<i class="fa-solid fa-gear text-xs" /> Configuración
						</button>
					</div>
				</div>
				<div class="max-w-8xl  mt-4">
					<div class="overflow-auto">
						<Calendar
							onPickDate={(day, month, year) => {
								// const date = new Date(year, month, Number(day)); // Restar 1 al mes porque los meses son indexados desde 0
								today.value = dayjs(`${year}-${month + 1}-${day}`).format(
									"YYYY-MM-DD HH:mm",
								);
							}}
							custom={(day) => (
								<div
									class={`absolute bg-danger text-white text-sm w-[20px] h-[20px] rounded-full right-0 bottom-1 font-bold ${
										query.data?.citasCount[Number(day)]! > 0 ? "" : "hidden"
									}`}
								>
									{query.data?.citasCount[Number(day)]}
								</div>
							)}
							onNextMonth={(year, month) => {
								today.value = dayjs(`${year}-${month + 1}`).format(
									"YYYY-MM-DD HH:mm",
								);
							}}
							onPreviousMonth={(year, month) => {
								today.value = dayjs(`${year}-${month + 1}`).format(
									"YYYY-MM-DD HH:mm",
								);
							}}
						/>
					</div>
					<br />
					<div class="flex gap-4">
						<span class="text-lg dark:text-white font-bold my-2 block ">
							{dayjs(NOW()).isSame(dayjs(today.value), "day")
								? "HOY"
								: dayjs(today.value).format("DD [de] MMMM YYYY")}
						</span>
					</div>

					<div class="flex flex-col gap-2">
						{hours.map((hour, i) => {
							const citasFiltered = citas?.filter((time) => {
								return time.hour.split(":")[0] === hour.split(":")[0];
							});

							return (
								<div
									key={hour}
									className={`py-2 dark:bg-admin-terciary bg-paper-light rounded-md p-2    text-sm  flex gap-2  min-h-[60px]  h-full ${
										citasFiltered?.length ? "border-2 border-primary" : ""
									}`}
								>
									{(() => {
										return (
											<>
												{" "}
												<span class="dark:text-white font-bold flex justify-center items-center w-[50px] mx-2">
													{hour}
													{i + 1 > 12 ? "PM" : "AM"}
												</span>
												{citasFiltered?.length ? (
													<>
														{citasFiltered!.length > 1 ? (
															<>
																<div class="flex flex-col gap-2  w-full h-full">
																	<span class="font-bold text-center dark:text-white">
																		hay {citasFiltered!.length} Citas
																	</span>
																	<div class="grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid justify-center items-center gap-2">
																		{citasFiltered.map((cita) => (
																			<div
																				class="bg-primary p-2 rounded-md"
																				key={cita.id}
																				onClick={() =>
																					sweetModal({
																						html: reactComponent(
																							<CitasShow cita={cita} />,
																						),
																						showCloseButton: true,
																						isCloseInBackground: false,
																					})
																				}
																			>
																				<div class="flex flex-col">
																					<span class="text-white text-xs font-semibold block text-center">
																						{cita.telephone}
																					</span>
																					<span class="text-white text-xs font-semibold block text-center">
																						{cita.hour}
																					</span>
																				</div>

																				<br />
																				<div>
																					<div class="grid grid-cols-3 gap-1  justify-center items-center ">
																						{cita.contact ? (
																							<>
																								{(() => {
																									const empresaContactsUpdateMutation =
																										empresaContactsUpdateApi();
																									return (
																										<button
																											class={` border  border-black    px-3 py-1.5 rounded-md ${
																												cita.contact.ia
																													? "bg-black text-white"
																													: "text-black"
																											}`}
																											type="button"
																											aria-label="enabled ia"
																											onClick={(e) => {
																												e.stopPropagation();
																												sweetModal({
																													title:
																														"Estas seguro de quitar la IA a  este usuario?",
																													text: "Este usuario ya no le responderá la IA si lo desactivas.",
																													icon: "info",
																													isCloseInBackground: false,
																													showCancelButton: true,
																													showCloseButton: true,
																												}).then(
																													({ isConfirmed }) => {
																														if (isConfirmed) {
																															empresaContactsUpdateMutation.mutate(
																																{
																																	...(cita.contact ??
																																		{}),
																																	ia:
																																		!cita
																																			.contact
																																			.ia,
																																},
																																{
																																	onSuccess:
																																		(data: {
																																			message: string;
																																		}) => {
																																			query.refetch(
																																				false,
																																			);
																																			sweetAlert(
																																				{
																																					icon: "success",
																																					title:
																																						data.message,
																																				},
																																			);
																																		},
																																	onError:
																																		(error: {
																																			message: string;
																																		}) => {
																																			sweetAlert(
																																				{
																																					icon: "danger",
																																					title: `Hubo un error al realizar esta acción, ${error.message}`,
																																				},
																																			);
																																		},
																																},
																															);
																														}
																													},
																												);
																											}}
																										>
																											<i class="fal fa-user-robot" />
																										</button>
																									);
																								})()}
																							</>
																						) : null}

																						<button
																							type="button"
																							class="px-2 py-2 rounded-md text-white bg-orange-600"
																							onClick={(e) => {
																								e.stopPropagation();
																								sweetModal((onClose) => ({
																									html: reactComponent(
																										<CitasUpdate
																											cita={cita}
																											refetch={query.refetch}
																											onClose={onClose}
																										/>,
																									),
																									showCloseButton: true,
																									isCloseInBackground: false,
																								}));
																							}}
																						>
																							<i class="fa-solid fa-pen" />
																						</button>
																						<button
																							type="button"
																							class="px-2 py-2 rounded-md text-white bg-danger"
																							onClick={(e) => {
																								e.stopPropagation();
																								sweetModal({
																									title:
																										"¿Estás seguro de cancelar cita?",
																									showCancelButton: true,
																									showCloseButton: true,
																									isCloseInBackground: false,
																								}).then(({ isConfirmed }) => {
																									if (isConfirmed) {
																										citasDestroyMutation.mutate(
																											cita.id,
																											{
																												onSuccess() {
																													query.refetch(false);
																													sweetAlert({
																														icon: "success",
																														title:
																															"Se canceló cita correctamente",
																													});
																												},
																												onError(err) {
																													sweetAlert({
																														icon: "danger",
																														title: err.message,
																													});
																												},
																											},
																										);
																									}
																								});
																							}}
																						>
																							<i class="fa-solid fa-ban" />
																						</button>
																					</div>
																				</div>
																			</div>
																		))}
																	</div>
																</div>
															</>
														) : (
															<div
																class="gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3  w-full overflow-auto"
																onClick={() =>
																	sweetModal({
																		html: reactComponent(
																			<CitasShow cita={citasFiltered![0]} />,
																		),
																		showCloseButton: true,
																		isCloseInBackground: false,
																	})
																}
															>
																<div class="flex flex-col justify-center items-center font-semibold dark:text-white">
																	<span class="text-center text-xs dark:text-normal">
																		{citasFiltered![0].telephone}
																	</span>
																	<span class="text-center text-xs dark:text-normal">
																		{citasFiltered![0].hour}
																	</span>
																</div>
																<p class="w-[200px] xl:w-[300px] h-[80px]   m-2 font-semibold hidden md:flex overflow-auto dark:text-white  flex-col ">
																	{Object.entries(
																		citasFiltered![0].answers,
																	).map(([key, value]) => (
																		<div key={key} class="flex flex-col gap-1">
																			<span class="font-bold text-primary">
																				- {key}
																			</span>{" "}
																			<span>{value}</span>
																		</div>
																	))}
																</p>
																<div class="grid grid-cols-2 gap-1  justify-center items-center ">
																	{citasFiltered![0].contact ? (
																		<>
																			{(() => {
																				const empresaContactsUpdateMutation =
																					empresaContactsUpdateApi();
																				return (
																					<button
																						class={` border  border-black    px-3 py-1.5 rounded-md ${
																							citasFiltered![0].contact.ia
																								? "bg-black text-white"
																								: "text-black"
																						}`}
																						type="button"
																						aria-label="enabled ia"
																						onClick={(e) => {
																							e.stopPropagation();
																							sweetModal({
																								title:
																									"Estas seguro de quitar la IA a  este usuario?",
																								text: "Este usuario ya no le responderá la IA si lo desactivas.",
																								icon: "info",
																								isCloseInBackground: false,
																								showCancelButton: true,
																								showCloseButton: true,
																							}).then(({ isConfirmed }) => {
																								if (isConfirmed) {
																									empresaContactsUpdateMutation.mutate(
																										{
																											...citasFiltered![0]
																												.contact,
																											ia:
																												!citasFiltered![0]
																													.contact.ia,
																										},
																										{
																											onSuccess: (data: {
																												message: string;
																											}) => {
																												query.refetch(false);
																												sweetAlert({
																													icon: "success",
																													title: data.message,
																												});
																											},
																											onError: (error: {
																												message: string;
																											}) => {
																												sweetAlert({
																													icon: "danger",
																													title: `Hubo un error al realizar esta acción, ${error.message}`,
																												});
																											},
																										},
																									);
																								}
																							});
																						}}
																					>
																						<i class="fal fa-user-robot" />
																					</button>
																				);
																			})()}
																		</>
																	) : null}

																	<button
																		type="button"
																		class="px-2 py-2 rounded-md text-white bg-danger"
																		onClick={(e) => {
																			e.stopPropagation();
																			sweetModal({
																				title:
																					"¿Estás seguro de cancelar cita?",
																				showCancelButton: true,
																				showCloseButton: true,
																				isCloseInBackground: false,
																			}).then(({ isConfirmed }) => {
																				if (isConfirmed) {
																					citasDestroyMutation.mutate(
																						citasFiltered![0].id,
																						{
																							onSuccess() {
																								query.refetch(false);
																								sweetAlert({
																									icon: "success",
																									title:
																										"Se canceló cita correctamente",
																								});
																							},
																							onError(err) {
																								sweetAlert({
																									icon: "danger",
																									title: err.message,
																								});
																							},
																						},
																					);
																				}
																			});
																		}}
																	>
																		<i class="fa-solid fa-ban" />
																	</button>
																	<button
																		type="button"
																		class="px-2 py-2 rounded-md text-white bg-orange-600"
																		onClick={(e) => {
																			e.stopPropagation();
																			sweetModal((onClose) => ({
																				html: reactComponent(
																					<CitasUpdate
																						cita={citasFiltered![0]}
																						refetch={query.refetch}
																						onClose={onClose}
																					/>,
																				),
																				showCloseButton: true,
																				isCloseInBackground: false,
																				// <CitasStore
																				//     timer={
																				//         timer
																				//     }
																				// />
																			}));
																		}}
																	>
																		<i class="fa-solid fa-pen" />
																	</button>
																</div>
															</div>
														)}
													</>
												) : (
													<div class="w-full ">
														<span class="flex justify-center items-center dark:text-white font-bold">
															No hay Citas
														</span>
													</div>
												)}
												<div class="flex justify-center items-center">
													<button
														type="button"
														class="px-4 py-2 rounded-md text-white bg-primary"
														onClick={() => {
															sweetModal((onClose) => ({
																html: reactComponent(
																	<CitasStore
																		hour={hour}
																		date={today.value as unknown as Date}
																		refetch={query.refetch}
																		onClose={onClose}
																	/>,
																),
																showCloseButton: true,
																isCloseInBackground: false,
															}));
														}}
													>
														+
													</button>
												</div>
											</>
										);
									})()}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
	return component;
}
interface CitasStoreProps {
	date: Date;
	hour: string;
	onClose: () => void;
	refetch: (clean?: boolean) => void;
}
function CitasStore({ date, hour, onClose, refetch }: CitasStoreProps) {
	const citasStoreMutation = citasStoreApi();
	const empresaStore = useEmpresastore();
	const questions = empresaStore.state!.citasSetting.questions;

	const citasStoreForm = useForm<CitasStoreDto>({
		resolver: valibotVigilio(citasStoreDto),
		defaultValues: {
			date,
			hour,
			answers: questions
				?.map((key) => key.question)
				.reduce((acc, curr) => {
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					(acc as any)[String(curr)] = ""; // Asignar un valor vacío a la clave actual
					return acc;
				}, {}),
		},
	});
	const answers = citasStoreForm.watch("answers");

	function onCitasStore(body: CitasStoreDto) {
		if (!Object.values(body.answers).length) {
			citasStoreForm.setError("answers", {
				message: "Este campo es obligatorio.",
			});
			return;
		}
		sweetModal({
			title: "¿Estas seguro de agregar esta cita?",
			showCancelButton: true,
			showCloseButton: true,
			isCloseInBackground: false,
		}).then(({ isConfirmed }) => {
			if (isConfirmed) {
				citasStoreMutation.mutate(body, {
					onSuccess() {
						sweetAlert({
							title: "Se agregó nueva cita",
							icon: "success",
						});
						refetch(false);
						onClose();
					},
					onError(error) {
						handlerError(citasStoreForm, error);
					},
				});
			}
		});
	}
	return (
		<div>
			<h1 class="font-semibold text-lg dark:text-white">
				Crear Cita {dayjs(date).format("YYYY-MM-DD")} {hour}
			</h1>
			<Form onSubmit={onCitasStore} {...citasStoreForm}>
				<Form.control
					title="Telefono"
					type="tel"
					ico={<span class="font-bold">+{storageEmpresa?.dial_code}</span>}
					name={"telephone" as keyof CitasStoreDto}
				/>
				<br />
				<span class="text-md font-bold dark:text-white">Respuestas</span>

				{
					questions.map((question, i) => {
						const key = question.question;
						return (
							<div key={`${key}${i + 1}`}>
								<div>
									<span class="text-xs dark:text-white font-semibold ">
										{question.question}
									</span>
									{question.options.length ? (
										<div class="flex flex-col">
											{question.options.map((opt, u) => (
												<label htmlFor={`answers${u}`} key={opt}>
													<input
														type="checkbox"
														id={`answers${u}`}
														value={opt}
														checked={answers[key] === opt}
														onChange={() => {
															citasStoreForm.setValue("answers", {
																...answers,
																[key]: opt,
															});
														}}
														class=""
													/>
													<span class="text-xs ml-2 dark:text-white ">
														{opt}
													</span>
												</label>
											))}
										</div>
									) : (
										<div>
											<input
												type="text"
												onChange={(e) => {
													citasStoreForm.setValue("answers", {
														...answers,
														[key]: (e.target as HTMLInputElement).value,
													});
												}}
												class="border border-gray-200 dark:border-gray-600 w-full h-[2.5rem] flex items-center gap-2 text-xs rounded-lg  overflow-hidden dark:text-secondary-light text-secondary-dark dark:bg-admin-terciary bg-paper-light my-1 shadow-sm"
											/>
										</div>
									)}
								</div>
								{citasStoreForm.formState.errors.answers?.[key] ? (
									<p class="text-xs text-danger font-semibold">
										{
											// biome-ignore lint/suspicious/noExplicitAny: <explanation>
											(citasStoreForm as any).formState.errors.answers?.[key]
												.message
										}
									</p>
								) : (
									<></>
								)}
							</div>
						);
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					}) as any
				}

				<br />
				<Form.control
					title="Descripción de la cita"
					type="time"
					name={"hour" as keyof CitasStoreDto}
				/>
				<Form.control
					title="Descripción de la cita"
					name={"description" as keyof CitasStoreDto}
					placeholder=""
				/>
				<br />
				<Form.button.submit
					title="Agregar Cita"
					isLoading={citasStoreMutation.isLoading || false}
					disabled={citasStoreMutation.isLoading || false}
				/>
			</Form>
		</div>
	);
}
interface CitasUpdateProps {
	cita: CitasSchema;
	onClose: () => void;
	refetch: (clean?: boolean) => void;
}
function CitasUpdate({ cita, onClose, refetch }: CitasUpdateProps) {
	const citasStoreMutation = citasUpdateApi(cita.id);
	const empresaStore = useEmpresastore();
	const questions = empresaStore.state?.citasSetting.questions;

	const citasStoreForm = useForm<CitasUpdateDto>({
		resolver: valibotVigilio(citasUpdateDto),
		defaultValues: cita,
	});
	const answers = citasStoreForm.watch("answers");

	function onCitasStore(body: CitasUpdateDto) {
		if (!Object.values(body.answers).length) {
			citasStoreForm.setError("answers", {
				message: "Este campo es obligatorio.",
			});
			return;
		}
		sweetModal({
			title: "¿Estas seguro de editar esta cita?",
			isCloseInBackground: false,
			showCancelButton: true,
			showCloseButton: true,
		}).then(({ isConfirmed }) => {
			if (isConfirmed) {
				citasStoreMutation.mutate(body, {
					onSuccess() {
						sweetAlert({
							title: "Se editar esta cita correctamente",
							icon: "success",
						});
						refetch(false);
						onClose();
					},
					onError(error) {
						handlerError(citasStoreForm, error);
					},
				});
			}
		});
	}
	return (
		<div>
			<h1 class="font-semibold text-lg dark:text-white">
				Crear Cita {dayjs(cita.date).format("YYYY-MM-DD")} {cita.hour}
			</h1>
			<Form onSubmit={onCitasStore} {...citasStoreForm}>
				<Form.control
					title="Telefono"
					type="tel"
					ico={<span class="font-bold">+{storageEmpresa?.dial_code}</span>}
					name={"telephone" as keyof CitasStoreDto}
				/>
				<br />
				<span class="text-md font-bold dark:text-white">Respuestas</span>
				{
					questions?.map((question) => {
						const key = question.question;
						return (
							<div key={key}>
								<div>
									<span class="text-xs dark:text-white font-semibold ">
										{question.question}
									</span>
									{question.options.length ? (
										<div class="flex flex-col">
											{question.options.map((opt, u) => (
												<label htmlFor={`answers${u}`} key={opt}>
													<input
														type="checkbox"
														id={`answers${u}`}
														value={opt}
														checked={answers[key] === opt}
														onChange={() => {
															citasStoreForm.setValue("answers", {
																...answers,
																[key]: opt,
															});
														}}
														class=""
													/>
													<span class="text-xs ml-2 dark:text-white ">
														{opt}
													</span>
												</label>
											))}
										</div>
									) : (
										<div>
											<input
												type="text"
												value={answers[key]}
												onChange={(e) => {
													citasStoreForm.setValue("answers", {
														...answers,
														[key]: (e.target as HTMLInputElement).value,
													});
												}}
												class="border border-gray-200 dark:border-gray-600 w-full h-[2.5rem] flex items-center gap-2 text-xs rounded-lg  overflow-hidden dark:text-secondary-light text-secondary-dark dark:bg-admin-terciary bg-paper-light my-1 shadow-sm"
											/>
										</div>
									)}
								</div>
								{citasStoreForm.formState.errors.answers?.[key] ? (
									<p class="text-xs text-danger font-semibold">
										{
											// biome-ignore lint/suspicious/noExplicitAny: <explanation>
											(citasStoreForm as any).formState.errors.answers?.[key]
												.message
										}
									</p>
								) : (
									<></>
								)}
							</div>
						);
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					}) as any
				}

				<br />
				<Form.control
					title="Descripción de la cita"
					type="time"
					name={"hour" as keyof CitasStoreDto}
				/>
				<Form.control
					title="Descripción de la cita"
					name={"description" as keyof CitasStoreDto}
					placeholder=""
				/>
				<br />
				<Form.button.submit
					title="Editar Cita"
					isLoading={citasStoreMutation.isLoading || false}
					disabled={citasStoreMutation.isLoading || false}
				/>
			</Form>
		</div>
	);
}

interface CitasShowProps {
	cita: CitasSchema;
}
function CitasShow({ cita }: CitasShowProps) {
	return (
		<div class="dark:text-white flex flex-col gap-2">
			<h3 class="font-bold">
				{dayjs(cita.date).format("YYYY-MM-DD")} {cita.hour}
			</h3>
			<span>
				<b>Telefono:</b> {cita.telephone}
			</span>
			<span>
				<b>Descripcion:</b> {cita.description ?? "-"}
			</span>

			<div>
				<b>Respuestas:</b>
				{Object.entries(cita.answers).map(([key, value]) => (
					<div key={key} class="flex flex-col gap-1">
						<span class="font-bold text-primary">- {key}</span>{" "}
						<span>{value}</span>
					</div>
				))}
			</div>
		</div>
	);
}
export default CitasIndex;
