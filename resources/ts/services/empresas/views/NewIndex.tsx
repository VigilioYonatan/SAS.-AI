import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import Container from "@/admin/components/Container";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import Form from "~/components/form";
import {
	newStoreDto,
	newUpdateImageDto,
	NewUpdateImageDto,
	type NewStoreDto,
} from "../dtos/new.store.dto";
import { formatDateTwo, handlerError, NOW } from "~/libs/helpers";
import { newStoreApi } from "../apis/new/new.store.api";
import { useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import { newIndexApi } from "../apis/new/new.index.api";
import { newUpdateImagesApi, webUpdateApi } from "../apis/new/new.update.api";
import type { NewSchema } from "../schemas/new.schema";
import AlertInfo from "~/components/Alerts/AlertInfo";
import useAuthStore from "@/auth/stores/auth.store";
import { BASE_URL } from "~/config";
import { getFilesEdit } from "~/libs/upload";
import { useEffect } from "preact/hooks";
import AdminHr from "~/components/AdminHr";

function BackgroundIndex() {
	const authStore = useAuthStore();
	if (!authStore.guards.permissionAdminGuard()) {
		window.history.back();
		return null;
	}
	const newIndexQuery = newIndexApi();

	let component: JSX.Element | JSX.Element[] | null = null;
	if (newIndexQuery.isLoading) {
		component = <Loading />;
	}
	if (newIndexQuery.isError) {
		component = <View404 message="error background" />;
	}
	if (newIndexQuery.isSuccess) {
		component = (
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{newIndexQuery.data?.data.length ? (
					<NewUpdate noticia={newIndexQuery.data?.data[0]} />
				) : (
					<NewStore refetch={newIndexQuery.refetch} />
				)}
			</div>
		);
	}
	return (
		<Container className="p-2">
			<>
				<div class="flex flex-col gap-4 mx-1 ">
					<AdminBreadCrumb current="noticia" />
				</div>

				{component}
			</>
		</Container>
	);
}

interface NewStoreProps {
	refetch: () => void;
}
function NewStore({ refetch }: NewStoreProps) {
	const newStoreMutate = newStoreApi();
	const newStoreForm = useForm<NewStoreDto>({
		resolver: valibotVigilio(newStoreDto),
		defaultValues: {
			date: formatDateTwo(NOW().toDate(), "YYYY-MM-DD") as Date,
		},
	});
	function onNewStore(body: NewStoreDto) {
		sweetModal({
			icon: "info",
			title: "¿Estas seguro de agregar una nueva noticia?",
			showCloseButton: true,
			showCancelButton: true,
		}).then(({ isConfirmed }) => {
			if (isConfirmed) {
				newStoreMutate.mutate(body, {
					onSuccess() {
						refetch();
						sweetAlert({
							icon: "success",
							title: "Agregado noticia nuevo",
						});
					},
					onError(error) {
						handlerError(newStoreForm, error);
					},
				});
			}
		});
	}
	return (
		<Form {...newStoreForm} onSubmit={onNewStore}>
			<AlertInfo>Noticia que se mostrará a tus clientes.</AlertInfo>
			<Form.control
				title="Título"
				placeholder=""
				name={"title" as keyof NewStoreDto}
			/>
			<Form.control
				title="Subtitulo"
				placeholder=""
				name={"subtitle" as keyof NewStoreDto}
			/>
			<Form.control
				title="Link"
				placeholder={BASE_URL}
				name={"link" as keyof NewStoreDto}
				question={
					<span>
						Este campo no es obligatorio. <br />
						Cuando el cliente le de click a tu noticia, le enviará al link
						puesto.
					</span>
				}
			/>
			<Form.control
				title="Fecha retroceso"
				type="date"
				name={"date" as keyof NewStoreDto}
				question="Fecha de retroceso, util si anuncias ofertas con tiempo."
			/>
			<Form.control.toggle
				title="Mostrar"
				name={"enabled" as keyof NewStoreDto}
			/>
			<Form.control.file
				name={"image" as keyof NewStoreDto}
				title="Imagen"
				accept="image/*"
				multiple={false}
				typeFile="image"
			/>
			<Form.button.submit
				title="Guardar"
				disabled={newStoreMutate.isLoading || false}
				isLoading={newStoreMutate.isLoading || false}
			/>
		</Form>
	);
}

interface NewUpdateProps {
	noticia: NewSchema;
}
function NewUpdate({ noticia }: NewUpdateProps) {
	const newUpdateMutate = webUpdateApi(noticia.id);
	const newUpdateForm = useForm<NewStoreDto>({
		resolver: valibotVigilio(newStoreDto),
		defaultValues: {
			...noticia,
			date: noticia.date
				? (formatDateTwo(noticia.date, "YYYY-MM-DD") as Date)
				: null,
			image: null,
		},
	});
	const formProductsNormalUpdateImages = useForm<NewUpdateImageDto>({
		mode: "all",
		resolver: valibotVigilio(newUpdateImageDto),
	});
	const mutateProductsNormalUpdateImagesApi = newUpdateImagesApi(noticia.id);

	const onUpdateImagesProduct = (data: NewUpdateImageDto) => {
		sweetModal({
			title: "¿Estás seguro de editar la imagen de esta noticia?",
			customIcon: "<i class='fas fa-news text-3xl dark:text-white' /> </i>",
			showCloseButton: true,
			showCancelButton: true,
		}).then(({ isConfirmed }) => {
			if (isConfirmed) {
				mutateProductsNormalUpdateImagesApi.mutate(
					{ ...data },
					{
						onSuccess() {
							sweetAlert({
								icon: "success",
								title: "Se actualizó imagen correctamente",
							});
						},
						onError() {
							sweetAlert({
								icon: "danger",
								title: "Error al actualizar imagen",
							});
						},
					},
				);
			}
		});
	};
	async function initialUpdateImages() {
		if (noticia.image) {
			const image = await getFilesEdit(noticia.image, 800);
			formProductsNormalUpdateImages.setValue("image", image);
		}
	}

	useEffect(() => {
		initialUpdateImages();
	}, []);
	function onNewUpdate(body: NewStoreDto) {
		newUpdateMutate.mutate(body, {
			onSuccess() {
				sweetAlert({
					icon: "success",
					title: "Modificado correctamente",
				});
			},
			onError(error) {
				handlerError(newUpdateForm, error);
			},
		});
	}
	return (
		<>
			<Form {...newUpdateForm} onSubmit={onNewUpdate}>
				<Form.control
					title="Título"
					placeholder="xxxxx"
					name={"title" as keyof NewStoreDto}
				/>
				<Form.control
					title="Subtitulo"
					placeholder="xxxxx"
					name={"subtitle" as keyof NewStoreDto}
				/>
				<Form.control
					title="Link"
					placeholder={BASE_URL}
					name={"link" as keyof NewStoreDto}
					question={
						<span>
							Este campo no es obligatorio. <br />
							Cuando el cliente le de click a tu noticia, le enviará al link
							puesto.
						</span>
					}
				/>
				<Form.control
					title="Fecha retroceso"
					type="date"
					name={"date" as keyof NewStoreDto}
					question="Fecha de retroceso, util si anuncias ofertas con tiempo."
				/>
				<Form.control.toggle
					title="Mostrar"
					name={"enabled" as keyof NewStoreDto}
				/>
				<AlertInfo>
					<span class="font-semibold">
						La imagen no es obligatorio, pero si deseas insertar imagen en tu
						noticia.
					</span>
				</AlertInfo>

				<Form.button.submit
					title="Guardar"
					disabled={newUpdateMutate.isLoading || false}
					isLoading={newUpdateMutate.isLoading || false}
				/>
			</Form>
			<AdminHr />
			<div>
				<div class="flex justify-between items-center">
					<h3 class="dark:text-white  font-bold uppercase text-center flex gap-2 break-words text-wrap ">
						<i class="fa-solid fa-image" />
						Editar imagen
					</h3>
				</div>
				<Form
					{...formProductsNormalUpdateImages}
					onSubmit={onUpdateImagesProduct}
				>
					<Form.control.file
						name={"image" as keyof NewUpdateImageDto}
						title="Imagen de Noticia"
						accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
						typeFile="image"
						multiple
						showButonCopy
						showButtonClean
					/>
					<div class="flex justify-center">
						<Form.button.submit
							disabled={mutateProductsNormalUpdateImagesApi.isLoading || false}
							isLoading={mutateProductsNormalUpdateImagesApi.isLoading || false}
							ico={<i class="fas fa-pen" />}
							title="Editar"
						/>
					</div>
				</Form>
			</div>
		</>
	);
}

export default BackgroundIndex;
