import { useForm } from "react-hook-form";
import { finanzasUpdateApi } from "../apis/finanzas.update.api";
import { valibotVigilio } from "~/libs/valibot";
import { sweetAlert } from "@vigilio/sweet";
import Form from "~/components/form";
import dayjs, { handlerError } from "~/libs/helpers";
import { useMemo } from "preact/hooks";
import { tiposIndexApi } from "../apis/tipos.index.api";
import { formSelectNumber } from "~/components/form/FormSelect";
import { categoriesIndexApi } from "../apis/categories.index.api";
import { FinanzasSchemaFromServer } from "../schemas/finanzas.schema";
import { FinanzasStoreDto, finanzasStoreDto } from "../dtos/finanzas.store.dto";

interface finanzasUpdateProps {
    refetch: (clean?: boolean) => void;
    onClose: () => void;
    finanza: FinanzasSchemaFromServer;
}
export function FinanzasUpdate({
    refetch,
    onClose,
    finanza,
}: finanzasUpdateProps) {
    const finanzasUpdateMutation = finanzasUpdateApi(finanza.id);
    const tiposIndexQuery = tiposIndexApi();
    const categoriesFinanzasShowQuery = categoriesIndexApi();

    const finanzasForm = useForm<FinanzasStoreDto>({
        resolver: valibotVigilio(finanzasStoreDto),
        defaultValues: {
            ...finanza,
            date: dayjs(finanza.date)
                .utc(false)
                .format("YYYY-MM-DD") as unknown as Date,
        },
    });
    const tipo_finanza_id = finanzasForm.watch("tipo_finanza_id");
    const tiposSelect = useMemo(() => {
        if (tiposIndexQuery.isSuccess && tiposIndexQuery.data) {
            return tiposIndexQuery.data.data.map((option) => ({
                key: option.id,
                value: option.name,
            }));
        }
        return [];
    }, [tiposIndexQuery.data, tiposIndexQuery.isSuccess]);
    const categoriesSelect = useMemo(() => {
        if (
            categoriesFinanzasShowQuery.isSuccess &&
            categoriesFinanzasShowQuery.data
        ) {
            return categoriesFinanzasShowQuery.data.data.map((option) => ({
                key: option.id,
                value: option.name,
                categoriesFinanzas: option.categoriesFinanzas,
            }));
        }
        return [];
    }, [
        categoriesFinanzasShowQuery.data,
        categoriesFinanzasShowQuery.isSuccess,
    ]);
    function finanzas(body: FinanzasStoreDto) {
        finanzasUpdateMutation.mutate(body, {
            onSuccess() {
                sweetAlert({
                    icon: "success",
                    title: "Agregado correctamente",
                });
                refetch(false);
                onClose();
            },
            onError(err) {
                handlerError(finanzasForm, err);
            },
        });
    }
    return (
        <div>
            <h1 class="font-semibold dark:text-white mb-2">
                <i class="fa-solid fa-face-tongue-money" /> Finanzas
            </h1>
            <Form {...finanzasForm} onSubmit={finanzas}>
                <div class="flex flex-col md:flex-row gap-2">
                    <Form.control
                        title="Presupuesto"
                        placeholder="100"
                        type="number"
                        name={"presupuesto" as keyof FinanzasStoreDto}
                        step={0.1}
                        options={{ setValueAs: Number }}
                    />
                    <Form.control
                        title="Monto"
                        type="number"
                        placeholder="100"
                        step={0.1}
                        name={"monto" as keyof FinanzasStoreDto}
                        options={{ setValueAs: Number }}
                    />
                </div>
                <Form.control
                    title="Fecha"
                    type="date"
                    name={"date" as keyof FinanzasStoreDto}
                />
                <Form.control.select
                    title="Tipo"
                    placeholder="Escoger Tipo"
                    array={tiposSelect}
                    options={{ setValueAs: formSelectNumber }}
                    isLoading={tiposIndexQuery.isLoading || false}
                    name={"tipo_finanza_id" as keyof FinanzasStoreDto}
                />
                {tipo_finanza_id ? (
                    <>
                        {(() => {
                            const choooseCategory = categoriesSelect.find(
                                (f) => f.key === tipo_finanza_id
                            );
                            return (
                                <Form.control.select
                                    title="Categoria"
                                    placeholder={`Escoger categoria de ${choooseCategory?.value}`}
                                    array={
                                        choooseCategory
                                            ? choooseCategory!.categoriesFinanzas.map(
                                                  (c) => ({
                                                      key: c.id,
                                                      value: c.value,
                                                  })
                                              )
                                            : []
                                    }
                                    options={{ setValueAs: formSelectNumber }}
                                    isLoading={
                                        tiposIndexQuery.isLoading || false
                                    }
                                    name={
                                        "category_finanza_id" as keyof FinanzasStoreDto
                                    }
                                />
                            );
                        })()}
                    </>
                ) : (
                    <></>
                )}

                <Form.button.submit
                    title="Guardar"
                    disabled={finanzasUpdateMutation.isLoading || false}
                    isLoading={finanzasUpdateMutation.isLoading || false}
                />
            </Form>
        </div>
    );
}
