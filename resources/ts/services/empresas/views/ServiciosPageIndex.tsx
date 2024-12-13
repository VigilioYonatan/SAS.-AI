import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import Container from "@/admin/components/Container";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { GridBannerSchema } from "../schemas/grid_banner.schema";
import { useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import Form from "~/components/form";
import { Fragment } from "preact/jsx-runtime";
import { getParams, handlerError } from "~/libs/helpers";
import useMediaQuery, { ResponsiveWidth } from "~/hooks/useMediaQuery";
import AlertInfo from "~/components/Alerts/AlertInfo";
import { useMemo } from "preact/hooks";
import { formSelectNumber } from "~/components/form/FormSelect";
import { useSignal } from "@preact/signals";
import { gridBannerServiceIndexApi } from "../apis/grid_banner_service/grid_banner_service.index.api";
import {
    gridBannerServiceUpdateDto,
    GridBannerServiceUpdateDto,
} from "../dtos/grid_banner_service.update.dto";
import { gridBannerServiceUpdateApi } from "../apis/grid_banner_service/grid_banner_service.update.api";
import { gridBannerIndexApi } from "../apis/grid_banner/grid_banner.index.api";
import TitleSection from "@/web/components/TitleSection";
export const HTMLSHOW = JSON.parse(localStorage.getItem("show-html") || "true");
function ServiciosPageIndex() {
    const gridBannerIndexQuery = gridBannerServiceIndexApi();
    const widthResponsive = ResponsiveWidth();
    const showHtml = useSignal(HTMLSHOW);
    const bannerParams = getParams().get("banner");
    let component: JSX.Element | JSX.Element[] | null = null;
    if (gridBannerIndexQuery.isLoading) {
        component = <Loading />;
    }
    if (gridBannerIndexQuery.isError) {
        component = <View404 />;
    }
    if (gridBannerIndexQuery.isSuccess) {
        component = (
            <Fragment>
                {gridBannerIndexQuery.data?.data.map((f, g) => {
                    const grid = f.grid_banner_id ? f.grid_banner : f;

                    return (
                        <div
                            key={grid!.id}
                            class={`grid-banner-${g} relative ${
                                bannerParams && Number(bannerParams) === g
                                    ? "border-4 border-primary shadow"
                                    : ""
                            }`}
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
                                                        grid={f}
                                                        i={g}
                                                        onClose={onClose}
                                                        refetch={
                                                            gridBannerIndexQuery.refetch
                                                        }
                                                    />
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
                                Se recomienda Editar los Banners en una
                                Laptop/PC
                            </span>
                        </AlertInfo>
                    ) : null}
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
    const gridUpdateMutation = gridBannerServiceUpdateApi(grid.id);

    const gridBannerIndexQuery = gridBannerIndexApi();
    const gridUpdateForm = useForm<GridBannerServiceUpdateDto>({
        resolver: valibotVigilio(gridBannerServiceUpdateDto),
        defaultValues: grid,
    });
    const gridBannerSelect = useMemo(() => {
        if (gridBannerIndexQuery.isSuccess && gridBannerIndexQuery.data) {
            return gridBannerIndexQuery.data.data.map((value, i) => ({
                key: value.id,
                value: `Banner-${i}`,
            }));
        }
        return [];
    }, [gridBannerIndexQuery.data, gridBannerIndexQuery.isSuccess]);

    function onGridBannerUpdate(data: GridBannerServiceUpdateDto) {
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
                <>
                    <Form.control
                        title="Title"
                        name={"title" as keyof GridBannerServiceUpdateDto}
                        placeholder="Titulo"
                    />
                    <Form.control.editorJS
                        type="html"
                        title="HTML"
                        question="Customiza el banner agregando html, data-label='1',, para customizar texto"
                        name={"html" as keyof GridBannerServiceUpdateDto}
                        className={`grid-banner-${i}`}
                    />{" "}
                    <Form.control.toggle
                        title="Habilitar"
                        name={"enabled" as keyof GridBannerServiceUpdateDto}
                    />
                    <Form.control.select
                        array={gridBannerSelect}
                        title="Grid Banner"
                        placeholder="Escoger Grid Banner"
                        name={
                            "grid_banner_id" as keyof GridBannerServiceUpdateDto
                        }
                        options={{
                            setValueAs: formSelectNumber,
                        }}
                    />
                </>
                <Form.button.submit
                    isLoading={gridUpdateMutation.isLoading || false}
                    disabled={gridUpdateMutation.isLoading || false}
                    title="Actualizar"
                />
            </Form>
        </div>
    );
}

export default ServiciosPageIndex;
