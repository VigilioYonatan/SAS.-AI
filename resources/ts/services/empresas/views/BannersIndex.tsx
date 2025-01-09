import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import Container from "@/admin/components/Container";
import { gridBannerIndexApi } from "../apis/grid_banner/grid_banner.index.api";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { GridBannerSchema } from "../schemas/grid_banner.schema";
import { useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import {
    GridBannerUpdateDto,
    gridBannerUpdateDto,
} from "../dtos/grid_banner.update.dto";
import { gridBannerUpdateApi } from "../apis/grid_banner/grid_banner.update.api";
import Form from "~/components/form";
import { Fragment } from "preact/jsx-runtime";
import { getParams, handlerError } from "~/libs/helpers";
import useMediaQuery, { ResponsiveWidth } from "~/hooks/useMediaQuery";
import AlertInfo from "~/components/Alerts/AlertInfo";
import { useSignal } from "@preact/signals";
import TitleSection from "@/web/components/TitleSection";
import { useEffect } from "preact/hooks";
import ServiciosPageIndex from "./ServiciosPageIndex";
import { storageEmpresa } from "../stores/empresa.store";
import PageStore, { PageUpdate } from "./PageStore";
import { pagesShowApi } from "../apis/pages/pages.show.api";
import { GridBannerPageSchemaFromServer } from "../schemas/grid-banner-page.schema";
import Helper from "~/components/Helper";
import { PageSchema } from "../schemas/pages.schema";
import CrudIndex from "./CrudIndex";
import { pagesDestroyApi } from "../apis/pages/pages.destroy.api";
import LoaderSubmit from "~/components/LoaderSubmit";
export const HTMLSHOW = JSON.parse(localStorage.getItem("show-html") || "true");
export const HIDDEEDITOR = JSON.parse(
    localStorage.getItem("hidde-editor") || "false"
);

function BannersIndex() {
    const typeParams = getParams().get("type");
    const typeBanner = useSignal<string>(typeParams ? typeParams : "home");
    const bannerParams = getParams().get("banner");

    const gridBannerIndexQuery =
        typeBanner.value === "home"
            ? gridBannerIndexApi()
            : pagesShowApi(typeBanner, {
                  transformData(data) {
                      return {
                          ...data,
                          data: data.page.grid_banner_pages,
                      };
                  },
              });
    const widthResponsive = ResponsiveWidth();
    const showHtml = useSignal(HTMLSHOW);
    let component: JSX.Element | JSX.Element[] | null = null;

    useEffect(() => {
        gridBannerIndexQuery.refetch(false);
    }, [typeBanner.value]);

    if (gridBannerIndexQuery.isLoading) {
        component = <Loading />;
    }
    if (gridBannerIndexQuery.isError) {
        component = <View404 />;
    }
    if (gridBannerIndexQuery.isSuccess) {
        component =
            typeBanner.value === "home" ? (
                <Fragment>
                    {gridBannerIndexQuery.data?.data.map((grid, g) => {
                        return (
                            <div
                                key={grid.id}
                                class={`grid-banner-${g}  ${
                                    bannerParams && Number(bannerParams) === g
                                        ? "border-4 border-primary shadow"
                                        : ""
                                } relative`}
                            >
                                <div class="flex justify-between w-full mb-1 items-center">
                                    <span class="font-semibold text-sm">
                                        Banner {g}
                                    </span>
                                    <div class="flex gap-2 items-center">
                                        <button
                                            type="button"
                                            class="bg-primary px-4 py-1 rounded-md"
                                            onClick={() => {
                                                sweetModal((onClose) => ({
                                                    html: reactComponent(
                                                        <GridBannerUpdate
                                                            grid={grid}
                                                            i={g}
                                                            onClose={onClose}
                                                            refetch={
                                                                gridBannerIndexQuery.refetch
                                                            }
                                                        />
                                                    ),
                                                    showCloseButton: true,
                                                    isCloseInBackground: false,
                                                    sweetWidth: "1200px",
                                                    position: "start",
                                                }));
                                            }}
                                        >
                                            <i class="fas fa-gears" />
                                        </button>
                                    </div>
                                </div>
                                {grid.title ? (
                                    <TitleSection>{grid.title}</TitleSection>
                                ) : null}
                                {grid.html ? (
                                    <div
                                        class={`w-full   banners-${g} relative dark:bg-admin-terciary`}
                                        dangerouslySetInnerHTML={{
                                            __html: grid.html,
                                        }}
                                    />
                                ) : (
                                    <div class="h-[150px] w-full bg-paper-light dark:bg-admin-terciary" />
                                )}
                            </div>
                        );
                    })}
                </Fragment>
            ) : (
                <ServiciosPageIndex
                    data={
                        gridBannerIndexQuery.data!
                            .data as GridBannerPageSchemaFromServer[]
                    }
                    refetch={gridBannerIndexQuery.refetch}
                    bannerParams={bannerParams}
                />
            );
    }
    const pages: PageSchema[] = [...storageEmpresa!.pages];

    return (
        <Container className="p-2 dark:text-white">
            <div className="flex flex-col gap-4 mx-1 ">
                <AdminBreadCrumb current="Banners" />
            </div>

            <div class="flex flex-col gap-4 [&>header]:relative">
                <div>
                    <div class="flex gap-2 mb-3 w-full">
                        <div class="flex items-center justify-between gap-2 w-full">
                            <div class="flex items-center gap-2 max-w-[350px] flex-wrap">
                                {pages.map((page) => (
                                    <button
                                        type="button"
                                        key={page.id}
                                        onClick={() => {
                                            typeBanner.value = page.slug;
                                        }}
                                        class={`${
                                            typeBanner.value === page.slug
                                                ? ` ${
                                                      page.isDinamic
                                                          ? "bg-blue-500"
                                                          : "bg-primary"
                                                  }`
                                                : ""
                                        } border ${
                                            page.isDinamic
                                                ? "border-blue-500"
                                                : "border-primary"
                                        }  px-4 py-2 rounded-md shadow font-semibold text-xs relative`}
                                    >
                                        {storageEmpresa!.isProduction ? (
                                            <div class=" top-[-12px] right-[-8px] absolute flex gap-1">
                                                <span
                                                    class="bg-orange-400 text-white px-1.5 py-1 rounded-md"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        sweetModal(
                                                            (onClose) => ({
                                                                html: reactComponent(
                                                                    <PageUpdate
                                                                        onClose={
                                                                            onClose
                                                                        }
                                                                        page={
                                                                            page as PageSchema
                                                                        }
                                                                        refetch={
                                                                            gridBannerIndexQuery.refetch
                                                                        }
                                                                    />
                                                                ),
                                                                showCloseButton:
                                                                    true,
                                                                isCloseInBackground:
                                                                    false,
                                                                sweetWidth:
                                                                    "800px",
                                                            })
                                                        );
                                                    }}
                                                >
                                                    {" "}
                                                    <i class="fas fa-pen text-[0.6rem]" />
                                                </span>
                                                {(() => {
                                                    const pagesDestroyMutate =
                                                        pagesDestroyApi();

                                                    return (
                                                        <>
                                                            {page.slug !==
                                                            "home" ? (
                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        pagesDestroyMutate.isLoading ||
                                                                        false
                                                                    }
                                                                    class="bg-danger text-white px-1.5 py-1 rounded-md"
                                                                    onClick={() => {
                                                                        sweetModal(
                                                                            {
                                                                                title: "¿Estas seguro de eliminar página",
                                                                                showCancelButton:
                                                                                    true,
                                                                                showCloseButton:
                                                                                    true,
                                                                                isCloseInBackground:
                                                                                    false,
                                                                            }
                                                                        ).then(
                                                                            ({
                                                                                isConfirmed,
                                                                            }) => {
                                                                                if (
                                                                                    isConfirmed
                                                                                ) {
                                                                                    pagesDestroyMutate.mutate(
                                                                                        page.id,
                                                                                        {
                                                                                            onSuccess() {
                                                                                                sweetAlert(
                                                                                                    {
                                                                                                        icon: "success",
                                                                                                        title: "Eliminado correctamente",
                                                                                                    }
                                                                                                );
                                                                                                gridBannerIndexQuery.refetch(
                                                                                                    true
                                                                                                );
                                                                                            },
                                                                                            onError(
                                                                                                data
                                                                                            ) {
                                                                                                sweetAlert(
                                                                                                    {
                                                                                                        icon: "danger",
                                                                                                        title: `hubo un error  ${data.message}`,
                                                                                                    }
                                                                                                );
                                                                                            },
                                                                                        }
                                                                                    );
                                                                                }
                                                                            }
                                                                        );
                                                                    }}
                                                                >
                                                                    {pagesDestroyMutate.isLoading ? (
                                                                        <LoaderSubmit />
                                                                    ) : (
                                                                        <i class="fas fa-trash text-[0.6rem]" />
                                                                    )}
                                                                </button>
                                                            ) : null}
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        ) : null}
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    page.icon ||
                                                    "<i class='fas fa-globe'></i>",
                                            }}
                                        />{" "}
                                        {page.title}
                                    </button>
                                ))}
                            </div>
                            <div class="flex gap-2 items-center">
                                {" "}
                                <button
                                    class="bg-primary px-3 py-1 rounded-md text-xl font-bold"
                                    type="button"
                                    onClick={() => {
                                        sweetModal((onClose) => ({
                                            html: reactComponent(
                                                <PageStore
                                                    onClose={onClose}
                                                    refetch={
                                                        gridBannerIndexQuery.refetch
                                                    }
                                                />
                                            ),
                                            showCloseButton: true,
                                            isCloseInBackground: false,
                                            sweetWidth: "500px",
                                        }));
                                    }}
                                >
                                    +
                                </button>
                                {storageEmpresa!.isProduction ? (
                                    <button
                                        class="bg-primary px-3 py-2.5 rounded-md text-xs  font-bold"
                                        type="button"
                                        onClick={() => {
                                            sweetModal(() => ({
                                                html: reactComponent(
                                                    <CrudIndex />
                                                ),
                                                showCloseButton: true,
                                                isCloseInBackground: false,
                                                sweetWidth: "800px",
                                            }));
                                        }}
                                    >
                                        CRUD
                                    </button>
                                ) : null}
                            </div>{" "}
                        </div>
                    </div>
                    {useMediaQuery("(max-width:1000px)") ? (
                        <AlertInfo>
                            <span class=" text-sm font-semibold">
                                Se recomienda Editar los Banners en una
                                Laptop/PC
                            </span>
                        </AlertInfo>
                    ) : null}

                    <div class="flex justify-between">
                        <span class="font-bold text-sm flex items-center gap-1">
                            Ancho Actual: <b>{widthResponsive}PX</b>{" "}
                            {typeBanner.value === "home" &&
                            storageEmpresa?.isProduction ? (
                                <button
                                    type="button"
                                    class="bg-black group relative w-[30px] h-[30px] flex rounded-full items-center justify-center text-white "
                                >
                                    ?{" "}
                                    <div class="absolute  w-[500px] top-[1rem] left-[-3rem] group-hover:block hidden z-50">
                                        <img
                                            class="w-full"
                                            width={300}
                                            height={300}
                                            src="/images/settings/others/grids.png"
                                            alt=""
                                        />
                                    </div>
                                </button>
                            ) : null}
                        </span>
                        <div class="flex flex-col">
                            <label class="text-xs dark:text-white font-semibold relative">
                                <input
                                    type="checkbox"
                                    checked={showHtml.value}
                                    name="active"
                                    onChange={(e) => {
                                        showHtml.value = (
                                            e.target as HTMLInputElement
                                        ).checked;
                                        localStorage.setItem(
                                            "show-html",
                                            JSON.stringify(showHtml.value)
                                        );
                                    }}
                                    class="mr-2"
                                />
                                Modo Desarrollador
                                <Helper top={0} key={0} right={0}>
                                    <span>
                                        Activar, solo si eres un desarrollador.
                                    </span>
                                </Helper>
                            </label>
                            <label class="text-xs dark:text-white font-semibold relative">
                                <input
                                    type="checkbox"
                                    checked={HIDDEEDITOR}
                                    name="active2"
                                    onChange={(e) => {
                                        const isTrue = (
                                            e.target as HTMLInputElement
                                        ).checked;
                                        if (!isTrue) {
                                            localStorage.removeItem(
                                                "hidde-editor"
                                            );
                                            return;
                                        }
                                        localStorage.setItem(
                                            "hidde-editor",
                                            JSON.stringify("true")
                                        );
                                    }}
                                    class="mr-2"
                                />
                                Mostrar HTML
                                <Helper top={0} key={0} right={0}>
                                    <span>
                                        Activar, solo si eres un desarrollador.
                                    </span>
                                </Helper>
                            </label>
                        </div>
                    </div>
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
        sweetModal({
            title: "¿Estas seguro de editar tu banner?",
            isCloseInBackground: false,
            showCancelButton: true,
            showCloseButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                gridUpdateMutation.mutate(data, {
                    onSuccess() {
                        sweetAlert({
                            title: "Editado correctamente",
                            icon: "success",
                        });
                        onClose();
                        refetch(false);
                    },
                    onError(error) {
                        handlerError(gridUpdateForm, error);
                    },
                });
            }
        });
    }

    return (
        <div class="dark:text-white">
            <span class="font-bold uppercase text-lg">Banner {i}</span>
            <br />
            <Form {...gridUpdateForm} onSubmit={onGridBannerUpdate}>
                <Form.control
                    title="Title"
                    name={"title" as keyof GridBannerUpdateDto}
                    placeholder="Titulo"
                />
                <Form.control.editorJS
                    type="html"
                    title="HTML"
                    question="Customiza el banner agregando html, data-label='1',, para customizar texto"
                    name={"html" as keyof GridBannerUpdateDto}
                    className={`grid-banner-${i}`}
                />
                <Form.control.toggle
                    title="Habilitar"
                    name={"enabled" as keyof GridBannerUpdateDto}
                />
                <Form.button.submit
                    isLoading={gridUpdateMutation.isLoading || false}
                    disabled={gridUpdateMutation.isLoading || false}
                    title="Actualizar"
                />
            </Form>
        </div>
    );
}

export default BannersIndex;
