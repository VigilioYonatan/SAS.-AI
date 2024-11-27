import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import Container from "@/admin/components/Container";
import { backgroundIndexApi } from "../apis/background.index.api";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import { printFileWithDimension } from "~/libs/upload";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import BackgroundStore from "./BackgroundStore";
import { backgroundDestroyApi } from "../apis/background.destroy.api";
import BackgroundUpdate from "./BackgroundUpdate";
import useAuthStore from "@/auth/stores/auth.store";

function BackgroundIndex() {
	const authStore = useAuthStore();
	if (!authStore.guards.permissionAdminGuard()) {
		window.history.back();
		return null;
	}
	const backgroundIndexQuery = backgroundIndexApi();

	let component: JSX.Element | JSX.Element[] | null = null;
	if (backgroundIndexQuery.isLoading) {
		component = <Loading />;
	}
	if (backgroundIndexQuery.isError) {
		component = <View404 message="error background" />;
	}
	if (backgroundIndexQuery.isSuccess) {
		const backgroundDestroyDestroy = backgroundDestroyApi();

		component = (
			<div class="flex flex-col gap-4">
				<div class="">
					<span class="font-bold text-xl dark:text-white">Background</span>
					<div>
						{backgroundIndexQuery.data?.data.length ? (
							<>
								{backgroundIndexQuery.data?.data.map((background) => (
									<div
										class="flex flex-col md:flex-row gap-4 border-b border-gray-600 p-2"
										key={background.id}
									>
										{printFileWithDimension(
											background.image,
											1600,
										)[0]?.endsWith("mp4") ? (
											// biome-ignore lint/a11y/useMediaCaption: <explanation>
											<video
												src={printFileWithDimension(background.image, 1600)[0]}
												width={1600}
												height={1600}
												controls
											/>
										) : (
											<img
												class="w-[600px] h-[300px] object-contain"
												src={printFileWithDimension(background.image, 1600)[0]}
												width={1600}
												height={1600}
												alt={background.title}
											/>
										)}

										<div class="flex flex-col gap-4 justify-center items-center lg:items-start">
											<span class="font-bold text-xl dark:text-white">
												{background.title}
											</span>
											<p class="dark:text-white">
												{background.description ?? ""}
											</p>
											<a
												class="text-white bg-primary px-4 py-2 rounded-md font-semibold  text-xs"
												href={background.url}
												target="_blank"
												rel="noreferrer"
											>
												Más información
											</a>
											<div class="flex gap-2">
												<button
													class="bg-orange-600 text-white px-2 py-1 rounded-md text-xs"
													type="button"
													aria-label="edit"
													onClick={() => {
														sweetModal((onclose) => ({
															html: reactComponent(
																<BackgroundUpdate
																	id={background.id}
																	onClose={onclose}
																	refetch={backgroundIndexQuery.refetch}
																/>,
															),
															showCloseButton: true,
															sweetWidth: "700px",
															isCloseInBackground: false,
														}));
													}}
												>
													<i class="fa-solid fa-pen" /> Editar
												</button>
												<button
													class="bg-danger text-white px-2 py-1 rounded-md text-xs"
													type="button"
													aria-label="delete"
													onClick={() => {
														sweetModal({
															title: "Estas seguro?",
															text: `Quieres eliminar este background <b>${background.title}</b>`,
															icon: "danger",
															showCancelButton: true,
															confirmButtonText: "Si, Eliminar!",
															showCloseButton: true,
														}).then((result) => {
															if (result.isConfirmed) {
																backgroundDestroyDestroy.mutate(background.id, {
																	onSuccess: () => {
																		sweetAlert({
																			icon: "success",
																			title: `El background ${background.id} fue eliminado correctamente`,
																		});
																		backgroundIndexQuery.refetch();
																	},
																	onError: (error) => {
																		sweetModal({
																			icon: "danger",
																			text: `El background ${
																				background.id
																			} no fue eliminado, :${JSON.stringify(
																				error,
																			)}`,
																			title: "Error!",
																		});
																	},
																});
															}
														});
													}}
												>
													<i class="fa-solid fa-trash" /> Eliminar
												</button>
											</div>
										</div>
									</div>
								))}
							</>
						) : (
							<span class="dark:text-white">No hay background</span>
						)}
					</div>
				</div>
			</div>
		);
	}
	return (
		<Container className="p-2">
			<>
				<div class="flex flex-col gap-4 mx-1 ">
					<AdminBreadCrumb current="backgrounds" />
				</div>
				<div class="flex gap-4">
					<button
						type="button"
						class="px-4 py-2 rounded-md shadow-sm dark:text-white dark:bg-admin-terciary bg-paper-light text-black text-xs font-bold "
						aria-label="add background"
						onClick={() => {
							sweetModal((onclose) => ({
								html: reactComponent(
									<BackgroundStore
										onClose={onclose}
										refetch={backgroundIndexQuery.refetch}
									/>,
								),
								sweetWidth: "600px",
								isCloseInBackground: false,
								showCloseButton: true,
							}));
						}}
					>
						Agregar
					</button>
				</div>
				{component}
			</>
		</Container>
	);
}

export default BackgroundIndex;
