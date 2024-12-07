import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import Container from "@/admin/components/Container";
import { filesIndexApi } from "../apis/files/files.index.api";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import Form from "~/components/form";
import {
    filesStoreApi,
    filesStoreDto,
    FileStoreDto,
} from "../apis/files/files.store.api";
import { useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { getFilesEdit, printFileWithDimension } from "~/libs/upload";
import AlertInfo from "~/components/Alerts/AlertInfo";
import { filesDestroyApi } from "../apis/files/files.destroy.api";
import {
    filesUpdateApi,
    fileUpdateDto,
    FileUpdateDto,
} from "../apis/files/files.update.api";
import { FileSchema } from "../schemas/file.schema";
import { useEffect } from "preact/hooks";
import { getParams } from "~/libs/helpers";

function FilesIndex() {
    const filesIndexQuery = filesIndexApi();
    const params = getParams();
    let component: JSX.Element | JSX.Element[] | null = null;
    if (filesIndexQuery.isLoading) {
        component = <Loading />;
    }
    if (filesIndexQuery.isError) {
        component = <View404 />;
    }
    if (filesIndexQuery.isSuccess) {
        const files = filesIndexQuery.data?.files;
        const filesDestroyMutate = filesDestroyApi();
        component = (
            <div class="grid grid-cols-4 gap-2">
                {files?.map((file) => {
                    const filed = printFileWithDimension(file.file, null);
                    const getUltimo = filed[0]?.split("/").pop();

                    return (
                        <div
                            class={`relative ${
                                getUltimo === params.get("file")
                                    ? "border-2 border-primary"
                                    : ""
                            }`}
                            key={file.id}
                        >
                            {[".jpg", ".jpeg", ".webp", ".jpeg", "png"].some(
                                (ext) => filed[0]?.endsWith(ext)
                            ) ? (
                                <img
                                    width={200}
                                    alt=""
                                    class="w-full h-[200px] object-contain"
                                    src={filed[0]}
                                />
                            ) : [".mp4"].some((ext) =>
                                  filed[0]?.endsWith(ext)
                              ) ? (
                                <video
                                    width={200}
                                    class="w-full h-[200px] object-contain"
                                    loop
                                    muted
                                    autoPlay
                                    src={filed[0]}
                                />
                            ) : (
                                <div class="w-[100px] h-[100px] flex justify-center items-center">
                                    <i class="fas fa-file text-3xl dark:text-white" />
                                </div>
                            )}

                            <div class="absolute top-2 right-2 gap-2 justify-between left-2 flex items-center ">
                                <a
                                    class="bg-blue-500 text-white w-[25px] h-[25px] flex justify-center items-center rounded-md"
                                    href={filed[0]}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <i class="fas fa-eye" />
                                </a>
                                <div class=" gap-2 flex items-center">
                                    <button
                                        type="button"
                                        class=" w-[25px] h-[25px] flex justify-center items-center rounded-md text-white text-xs bg-orange-600"
                                        onClick={() => {
                                            sweetModal({
                                                html: reactComponent(
                                                    <FilesUpdate
                                                        refetch={
                                                            filesIndexQuery.refetch
                                                        }
                                                        file={file}
                                                    />
                                                ),
                                                showCloseButton: true,
                                                isCloseInBackground: false,
                                            });
                                        }}
                                    >
                                        <i class="fas fa-pen" />
                                    </button>
                                    <button
                                        type="button"
                                        class="bg-danger w-[25px] h-[25px] flex justify-center items-center rounded-md text-white"
                                        onClick={() => {
                                            sweetModal({
                                                title: "¿Estas seguro de eliminar este archivo?",
                                                text: "Puede que tu web falle al borrar algunos archivos",
                                                showCancelButton: true,
                                                isCloseInBackground: false,
                                                showCloseButton: true,
                                            }).then(({ isConfirmed }) => {
                                                if (isConfirmed) {
                                                    filesDestroyMutate.mutate(
                                                        file.id,
                                                        {
                                                            onSuccess() {
                                                                sweetAlert({
                                                                    icon: "success",
                                                                    title: "Eliminado correctamente",
                                                                });
                                                                filesIndexQuery.refetch(
                                                                    false
                                                                );
                                                            },
                                                            onError(data) {
                                                                sweetAlert({
                                                                    icon: "danger",
                                                                    title: data.message,
                                                                });
                                                            },
                                                        }
                                                    );
                                                }
                                            });
                                        }}
                                    >
                                        {" "}
                                        <i class="fas fa-trash text-xs" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
    return (
        <Container className="p-2">
            <div className="flex flex-col gap-4 mx-1 ">
                <AdminBreadCrumb current="Archivos" />
            </div>
            <div>
                <button
                    onClick={() => {
                        if (filesIndexQuery.data!.files.length > 60) {
                            sweetAlert({
                                title: "No se puede agregar más archivo",
                                icon: "danger",
                            });
                            return;
                        }
                        sweetModal({
                            html: reactComponent(
                                <FilesStore refetch={filesIndexQuery.refetch} />
                            ),
                            isCloseInBackground: false,
                            showCloseButton: true,
                        });
                    }}
                    type="button"
                    class="bg-primary px-4 py-2 rounded-md text-sm font-semibold"
                >
                    + Agregar
                </button>
            </div>
            <div>{component}</div>
        </Container>
    );
}
interface FilesStoreProps {
    refetch: (clean?: boolean) => void;
}
function FilesStore({ refetch }: FilesStoreProps) {
    const filesForm = useForm<FileStoreDto>({
        resolver: valibotVigilio(filesStoreDto),
    });

    const filesStoreMutation = filesStoreApi();
    function onFileStore(body: FileStoreDto) {
        filesStoreMutation.mutate(body, {
            onSuccess() {
                sweetAlert({
                    title: "Archivo agregado correctamente",
                    icon: "success",
                });
                refetch(false);
            },
            onError(data) {
                sweetAlert({
                    title: data.message,
                    icon: "danger",
                });
                refetch(false);
            },
        });
    }
    return (
        <div class="dark:text-white">
            <AlertInfo>
                Se recomienda subir archivos que estarán en su web.
            </AlertInfo>
            <span class="font-semibold text-xl mb-2 block">
                Agregar Archivo
            </span>
            <Form onSubmit={onFileStore} {...filesForm}>
                <Form.control
                    type="text"
                    title="Nombre de archivo"
                    name={"name" as keyof FileStoreDto}
                />
                <Form.control.file
                    typeFile="image-video"
                    multiple={false}
                    accept="image/jpeg, image/png, image/jpg, image/jpeg, image/webp, image/gif, video/mp4"
                    title="Archivo"
                    name={"file" as keyof FileStoreDto}
                    showButonCopy
                />
                <Form.button.submit
                    disabled={filesStoreMutation.isLoading || false}
                    isLoading={filesStoreMutation.isLoading || false}
                    title="Agregar"
                    ico={null}
                />
            </Form>
        </div>
    );
}
interface FilesUpdateProps {
    refetch: (clean?: boolean) => void;
    file: FileSchema;
}
function FilesUpdate({ refetch, file }: FilesUpdateProps) {
    const filesForm = useForm<FileUpdateDto>({
        resolver: valibotVigilio(fileUpdateDto),
    });

    const filesUpdateMutation = filesUpdateApi(file.id);
    function onFileUpdate(body: FileUpdateDto) {
        sweetModal({
            title: "¿Estas seguro de editar este archivo?",
            isCloseInBackground: false,
            showCancelButton: true,
            showCloseButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                const name = file.file[0].file
                    ?.split(".")
                    .at(0)
                    ?.split("/")
                    .at(-1) as string;

                filesUpdateMutation.mutate(
                    { ...body, name },
                    {
                        onSuccess() {
                            sweetAlert({
                                title: "Actualizado correctamente",
                                icon: "success",
                            });
                            refetch(false);
                        },
                        onError(data) {
                            sweetAlert({
                                title: data.message,
                                icon: "danger",
                            });
                            refetch(false);
                        },
                    }
                );
            }
        });
    }
    async function initial() {
        if (file.file) {
            const f = await getFilesEdit(file.file, null);
            filesForm.setValue("file", f);
        }
    }
    useEffect(() => {
        initial();
    }, []);
    return (
        <div class="dark:text-white">
            <AlertInfo>
                Se recomienda subir archivos que estarán en su web.
            </AlertInfo>
            <span class="font-semibold text-xl mb-2 block">
                Agregar Archivo
            </span>
            <Form onSubmit={onFileUpdate} {...filesForm}>
                <Form.control.file
                    typeFile="image-video"
                    multiple={false}
                    accept="image/jpeg, image/png, image/jpg, image/jpeg, image/webp, image/gif, video/mp4"
                    title="Archivo"
                    name={"file" as keyof FileStoreDto}
                    showButonCopy
                />
                <Form.button.submit
                    disabled={filesUpdateMutation.isLoading || false}
                    isLoading={filesUpdateMutation.isLoading || false}
                    title="Actualizar"
                    ico={null}
                />
            </Form>
        </div>
    );
}

export default FilesIndex;
