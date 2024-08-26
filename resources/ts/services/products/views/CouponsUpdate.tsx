import { useForm } from "react-hook-form";
import useAuthstore from "@/auth/stores/auth.store";
import { valibotVigilio } from "~/libs/valibot";
import { useMemo } from "preact/hooks";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import dayjs, { formatDateTwo, handlerError } from "~/libs/helpers";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import {
    couponsUpdateDto,
    type CouponsUpdateDto,
} from "../dtos/coupons.update.dto";
import { couponsShowApi } from "../apis/coupons/coupons.show.api";
import { couponsUpdateApi } from "../apis/coupons/coupons.update.api";
import Form from "~/components/form";
import { familiesAllApi } from "../apis/families/families.all.api";

interface CouponUpdateProps {
    id: number;
    refetch: (clean?: boolean) => void;
}
function CouponsUpdate({ id, refetch }: CouponUpdateProps) {
    const { guards } = useAuthstore();
    if (!guards.permissionAdminGuard()) {
        window.history.back();
        return null;
    }
    const couponsQuery = couponsShowApi(id);

    let component: JSX.Element | JSX.Element[] | null = null;

    if (couponsQuery.isLoading) {
        component = <Loading />;
    }
    if (couponsQuery.isError) {
        component = <View404 message={`No se encontró un cupón: ${id}`} />;
    }
    if (couponsQuery.isSuccess) {
        const coupon = couponsQuery.data!.coupon;
        const couponsUpdateDtoForm = useForm<CouponsUpdateDto>({
            resolver: valibotVigilio(couponsUpdateDto),
            mode: "all",
            defaultValues: useMemo(() => {
                const {
                    date,
                    createdAt,
                    updatedAt,
                    subcategories,
                    id,
                    ...rest
                } = coupon;
                return {
                    ...rest,
                    subcategories,
                    date: formatDateTwo(date, "YYYY-MM-DDTHH:mm") as Date,
                };
            }, []),
        });
        const couponsUpdateMutation = couponsUpdateApi(id);
        // subcategories
        const familiesAllQuery = familiesAllApi();
        const subcategories = couponsUpdateDtoForm.watch("subcategories");

        function onUpdateCoupon(data: CouponsUpdateDto) {
            sweetModal({
                title: `¿Estás seguro de editar el cupón ${coupon.coupon}?`,
                customIcon:
                    "<i class='fa-solid fa-ticket dark:text-white text-3xl' ></i>",
                showCancelButton: true,
                showCloseButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    couponsUpdateMutation.mutate(data, {
                        onSuccess(data) {
                            sweetAlert({
                                icon: "success",
                                title: `Se realizó los cambios correctamente ${data.coupon.coupon}`,
                            });
                            refetch(false);
                        },
                        onError(error) {
                            handlerError(couponsUpdateDtoForm, error);
                        },
                    });
                }
            });
        }
        function generateCoupon() {
            couponsUpdateDtoForm.setValue(
                "coupon",
                `COUPON-${dayjs().format("MMMM").toUpperCase()}-${Math.random()
                    .toString(32)
                    .slice(7)
                    .toUpperCase()}`
            );
        }

        component = (
            <div class="text-start  mt-6">
                <Form {...couponsUpdateDtoForm} onSubmit={onUpdateCoupon}>
                    <div class="flex justify-between items-center">
                        <h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2 items-center">
                            <i class="fa-solid fa-ticket" />
                            Editar Cupón - {coupon.coupon}
                        </h3>
                        <Form.button.reset />
                    </div>

                    <div class="flex flex-col md:flex-row gap-2 items-center">
                        <div class="w-full flex gap-1 items-center">
                            <Form.control
                                title="Cupón"
                                name={"coupon" as keyof CouponsUpdateDto}
                                placeholder="XXXX-XXX-XXX"
                                disabled
                            />
                            <button
                                class="bg-primary w-[40px] text-white rounded-md h-[40px] mt-4"
                                type="button"
                                aria-label="generate cupon"
                                onClick={generateCoupon}
                            >
                                <i class="fa-solid fa-ticket" />
                            </button>
                        </div>

                        <Form.control
                            type="number"
                            title="Descuento"
                            name={"discount" as keyof CouponsUpdateDto}
                            placeholder="10%"
                            options={{ valueAsNumber: true }}
                        />
                    </div>
                    <div class="flex  flex-col md:flex-row gap-2 items-center">
                        <Form.control
                            type="datetime-local"
                            title="Fecha de Expiración"
                            name={"date" as keyof CouponsUpdateDto}
                            placeholder="10%"
                        />{" "}
                        <Form.control
                            type="number"
                            title="Máximo"
                            name={"max_use" as keyof CouponsUpdateDto}
                            placeholder="10"
                            options={{
                                setValueAs(value) {
                                    return !value.length ? null : Number(value);
                                },
                            }}
                            question="Máximo cuantas veces será usado este cupón. Si quieres que el cupon sea ilimitado dejar vacio este campo."
                        />
                        <Form.control.toggle
                            title="Solo clientes registrados"
                            name={"onlyRegister" as keyof CouponsUpdateDto}
                        />
                    </div>

                    <div class="w-full mb-2">
                        <label
                            class="text-xs dark:text-secondary-light text-secondary-dark capitalize font-semibold mb-2 block"
                            htmlFor={"categories" as keyof CouponsUpdateDto}
                        >
                            Categorias
                        </label>
                        <div class="flex gap-4 flex-wrap">
                            {familiesAllQuery.data?.data.map((family) => (
                                <div
                                    key={family.id}
                                    class="flex gap-1 text-xs dark:text-white flex-col"
                                >
                                    <span class="text-primary font-bold">
                                        {family.name}
                                    </span>
                                    {family.categories.map((cat) => (
                                        <div
                                            key={cat.id}
                                            class="flex flex-col gap-1"
                                        >
                                            <b>{cat.name}</b>
                                            <div>
                                                {cat.subcategories.map(
                                                    (subcategory) => (
                                                        <div
                                                            key={subcategory.id}
                                                            class="flex items-center gap-1"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                value={
                                                                    subcategory.id
                                                                }
                                                                checked={subcategories.some(
                                                                    (cat) =>
                                                                        cat ===
                                                                        subcategory.id
                                                                )}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const id =
                                                                        Number(
                                                                            (
                                                                                e.target as HTMLInputElement
                                                                            )
                                                                                .value
                                                                        );
                                                                    const existID =
                                                                        subcategories.some(
                                                                            (
                                                                                cat
                                                                            ) =>
                                                                                cat ===
                                                                                id
                                                                        );
                                                                    if (
                                                                        existID
                                                                    ) {
                                                                        const filterCategory =
                                                                            subcategories.filter(
                                                                                (
                                                                                    cat
                                                                                ) =>
                                                                                    cat !==
                                                                                    id
                                                                            );
                                                                        couponsUpdateDtoForm.setValue(
                                                                            "subcategories",
                                                                            filterCategory
                                                                        );
                                                                    } else {
                                                                        couponsUpdateDtoForm.setValue(
                                                                            "subcategories",
                                                                            [
                                                                                ...subcategories,
                                                                                id,
                                                                            ]
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                            {subcategory.name}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {couponsUpdateDtoForm.formState.errors
                            ?.subcategories ? (
                            <p class="text-xs text-red-600">
                                {
                                    couponsUpdateDtoForm.formState.errors
                                        ?.subcategories.message
                                }
                            </p>
                        ) : null}
                    </div>
                    <div class="flex justify-center">
                        <Form.button.submit
                            disabled={couponsUpdateMutation.isLoading || false}
                            isLoading={couponsUpdateMutation.isLoading || false}
                            title="Guardar"
                        />
                    </div>
                </Form>
            </div>
        );
    }
    return component;
}

export default CouponsUpdate;
