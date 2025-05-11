import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { GridBannerSchema } from "../schemas/grid_banner.schema";
import { useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import Form from "~/components/form";
import { handlerError } from "~/libs/helpers";
import { formSelectNumber } from "~/components/form/FormSelect";
import { gridBannerIndexApi } from "../apis/grid_banner/grid_banner.index.api";
import TitleSection from "@/web/components/TitleSection";
import { gridBannerPageUpdateApi } from "../apis/grid_banner_page/grid_banner_page.update.api";
import {
    gridBannerPageUpdateDto,
    GridBannerPageUpdateDto,
} from "../dtos/grid_banner_service.update.dto";
import { GridBannerPageSchemaFromServer } from "../schemas/grid-banner-page.schema";
import { useMemo } from "preact/hooks";
import FormControlEditorJS from "~/components/form/FormControlEditorJS";
export const HTMLSHOW = JSON.parse(localStorage.getItem("show-html") || "true");
interface ServiciosPageIndexProps {
    data: GridBannerPageSchemaFromServer[];
    refetch: (clean?: boolean) => Promise<void>;
    bannerParams: string | null;
}
function ServiciosPageIndex({
    data,
    refetch,
    bannerParams,
}: ServiciosPageIndexProps) {
    return data.map((f, g) => {
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
                    <span class="font-semibold text-sm">Banner {g}</span>

                    <div class="flex gap-2 items-center">
                        <button
                            type="button"
                            class="bg-primary px-4 py-1 rounded-md"
                            onClick={() => {
                                sweetModal(() => ({
                                    html: reactComponent(
                                        <GridBannerUpdate
                                            grid={f}
                                            i={g}
                                            refetch={refetch}
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
                {grid.title ? <TitleSection>{grid.title}</TitleSection> : null}
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
    });
}
interface GridBannerEditProps {
    grid: GridBannerSchema;
    i: number;
    refetch: (clean?: boolean) => void;
}
export function GridBannerUpdate({
    grid,
    i,

    refetch,
}: GridBannerEditProps) {
    const gridUpdateMutation = gridBannerPageUpdateApi(grid.id);

    const gridBannerIndexQuery = gridBannerIndexApi();
    const gridUpdateForm = useForm<GridBannerPageUpdateDto>({
        resolver: valibotVigilio(gridBannerPageUpdateDto),
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

    function onGridBannerUpdate(data: GridBannerPageUpdateDto) {
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
                        name={"title" as keyof GridBannerPageUpdateDto}
                        placeholder="Titulo"
                    />
                    <FormControlEditorJS
                        type="html"
                        title="HTML"
                        question="Customiza el banner agregando html, data-label='1',, para customizar texto"
                        name={"html" as keyof GridBannerPageUpdateDto}
                        className={`grid-banner-${i}`}
                    />{" "}
                    <Form.control.toggle
                        title="Habilitar"
                        name={"enabled" as keyof GridBannerPageUpdateDto}
                    />
                    <Form.control.select
                        array={gridBannerSelect}
                        title="Grid Banner"
                        placeholder="Escoger Grid Banner"
                        name={"grid_banner_id" as keyof GridBannerPageUpdateDto}
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
