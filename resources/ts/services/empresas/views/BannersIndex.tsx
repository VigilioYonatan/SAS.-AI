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
import { gridBannerServiceIndexApi } from "../apis/grid_banner_service/grid_banner_service.index.api";
import { useEffect } from "preact/hooks";
import ServiciosPageIndex from "./ServiciosPageIndex";
import { storageEmpresa } from "../stores/empresa.store";
export const HTMLSHOW = JSON.parse(localStorage.getItem("show-html") || "true");

function BannersIndex() {
    const typeBanner = useSignal<"home" | "service" | "about" | "shop">("home");
    const gridBannerIndexQuery =
        typeBanner.value === "home"
            ? gridBannerIndexApi()
            : gridBannerServiceIndexApi({ type: typeBanner });
    const widthResponsive = ResponsiveWidth();
    const showHtml = useSignal(HTMLSHOW);
    let component: JSX.Element | JSX.Element[] | null = null;

    const bannerParams = getParams().get("banner");

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
                                    <div class="h-[200px] w-full bg-paper-light dark:bg-admin-terciary" />
                                )}
                            </div>
                        );
                    })}
                </Fragment>
            ) : (
                <ServiciosPageIndex type={typeBanner} />
            );
    }

    return (
        <Container className="p-2 dark:text-white">
            <div className="flex flex-col gap-4 mx-1 ">
                <AdminBreadCrumb current="Banners" />
            </div>
            <div class="flex flex-col gap-4 [&>header]:relative">
                <div>
                    <div class="flex gap-2 mb-2">
                        <div class="flex gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    typeBanner.value = "home";
                                }}
                                class={`${
                                    typeBanner.value === "home"
                                        ? "bg-primary"
                                        : ""
                                } border border-primary px-4 py-2 rounded-md shadow font-semibold text-xs`}
                            >
                                <i class="fas fa-home" /> Home Page
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    typeBanner.value = "shop";
                                }}
                                class={`${
                                    typeBanner.value === "shop"
                                        ? "bg-primary"
                                        : ""
                                } border border-primary px-4 py-2 rounded-md shadow font-semibold text-xs`}
                            >
                                <i class="fas fa-shopping-cart" /> Shop Page
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    typeBanner.value = "about";
                                }}
                                class={`${
                                    typeBanner.value === "about"
                                        ? "bg-primary"
                                        : ""
                                } border border-primary px-4 py-2 rounded-md shadow font-semibold text-xs`}
                            >
                                <i class="fab fa-blogger-b" /> Blog Page
                            </button>
                            {storageEmpresa?.setting.is_service_page ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        typeBanner.value = "service";
                                    }}
                                    class={`${
                                        typeBanner.value === "service"
                                            ? "bg-primary"
                                            : ""
                                    } border border-primary px-4 py-2 rounded-md shadow font-semibold text-xs`}
                                >
                                    <i class="fas fa-handshake-alt" /> Servicios
                                    Page
                                </button>
                            ) : null}
                        </div>
                        {useMediaQuery("(max-width:1000px)") ? (
                            <AlertInfo>
                                <span class=" text-sm font-semibold">
                                    Se recomienda Editar los Banners en una
                                    Laptop/PC
                                </span>
                            </AlertInfo>
                        ) : null}
                    </div>

                    <div class="flex justify-between">
                        <span class="font-bold text-sm">
                            Ancho Actual: <b>{widthResponsive}PX</b>{" "}
                        </span>
                        <label class="text-xs dark:text-white font-semibold">
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
                            Show HTML
                        </label>
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
