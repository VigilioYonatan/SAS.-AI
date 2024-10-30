import {
    type CouponsStoreDto,
    couponsStoreDto,
} from "../dtos/coupons.store.dto";
import { useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { handlerError } from "~/libs/helpers";
import dayjs from "dayjs";
import Form from "~/components/form";
import useAuthstore from "@/auth/stores/auth.store";
import { couponsStoreApi } from "../apis/coupons/coupons.store.api";
import { categoriesIndexApi } from "../apis/categories/categories.index.api";
import { storageEmpresa } from "@/empresas/stores/empresa.store";

interface CouponStoreProps {
    refetch: (clean?: boolean) => void;
}
function CouponsStore({ refetch }: CouponStoreProps) {
    const { guards } = useAuthstore();
    if (!guards.permissionAdminGuard()) {
        window.history.back();
        return null;
    }
    const couponsStoreDtoForm = useForm<CouponsStoreDto>({
        resolver: valibotVigilio(couponsStoreDto),
        mode: "all",
        defaultValues: {
            categories: [],
            empresa_id: storageEmpresa!.id,
        },
    });
    const couponsStoreMutation = couponsStoreApi();
    // categories
    const categoriesAllQuery = categoriesIndexApi(false);
    const ServicesAllQuery = categoriesIndexApi(true);
    const categories = couponsStoreDtoForm.watch("categories");

    function onAddCoupon(body: CouponsStoreDto) {
        sweetModal({
            title: "¿Estás seguro de agregar un cupón?",
            customIcon:
                "<i class='fa-solid fa-ticket text-3xl dark:text-white' ></i>",
            showCloseButton: true,
            showCancelButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                couponsStoreMutation.mutate(body, {
                    onSuccess(data) {
                        refetch(false);
                        couponsStoreDtoForm.reset();
                        sweetAlert({
                            icon: "success",
                            title: `<p class="text-center">Nuevo cupón insertado correctamente <b>${data.coupon.coupon}</b></p>`,
                        });
                    },
                    onError(error) {
                        handlerError(couponsStoreDtoForm, error);
                    },
                });
            }
        });
    }
    function generateCoupon() {
        couponsStoreDtoForm.setValue(
            "coupon",
            `C-${dayjs().format("MMMM").toUpperCase()}-${Math.random()
                .toString(32)
                .slice(7)
                .toUpperCase()}`
        );
    }
    return (
        <div class="text-start">
            <Form {...couponsStoreDtoForm} onSubmit={onAddCoupon}>
                <div class="flex justify-between items-center">
                    <h3 class="dark:text-white  lg:text-xl font-bold uppercase text-center flex gap-2 items-center">
                        <i class="fa-solid fa-ticket" />
                        Cupón de Descuento
                    </h3>
                    <Form.button.reset />
                </div>

                <div class="flex flex-col md:flex-row gap-2 items-center">
                    <div class="w-full flex gap-1 items-center">
                        <Form.control
                            title="Cupón"
                            name={"coupon" as keyof CouponsStoreDto}
                            placeholder="XXXX-XXX-XXX"
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
                        name={"discount" as keyof CouponsStoreDto}
                        placeholder="10%"
                        options={{ valueAsNumber: true }}
                    />
                </div>
                <div class="flex  flex-col md:flex-row gap-2 items-center">
                    <Form.control
                        type="datetime-local"
                        title="Fecha de Expiración"
                        name={"date" as keyof CouponsStoreDto}
                        placeholder="10%"
                    />
                    <Form.control
                        type="number"
                        title="Máximo de usos"
                        name={"max_use" as keyof CouponsStoreDto}
                        placeholder="10"
                        options={{
                            setValueAs(value) {
                                return !value.length ? null : Number(value);
                            },
                        }}
                        question="Máximo cuantas veces será usado este cupón."
                    />
                </div>

                <div class="w-full mb-2">
                    <label
                        class="text-xs dark:text-secondary-light text-secondary-dark capitalize font-semibold mb-2 block"
                        htmlFor={"categories" as keyof CouponsStoreDto}
                    >
                        categorías
                    </label>
                    <div class="flex gap-4 flex-wrap">
                        {categoriesAllQuery.data?.data.map((category) => (
                            <div
                                key={category.id}
                                class="flex gap-1 text-xs dark:text-white flex-col"
                            >
                                <span class="text-primary font-bold">
                                    {category.name}
                                </span>
                                <input
                                    type="checkbox"
                                    value={category.id}
                                    onChange={(e) => {
                                        const id = Number(
                                            (e.target as HTMLInputElement).value
                                        );
                                        const existID = categories.some(
                                            (cat) => cat === id
                                        );
                                        if (existID) {
                                            const filterCategory =
                                                categories.filter(
                                                    (cat) => cat !== id
                                                );
                                            couponsStoreDtoForm.setValue(
                                                "categories",
                                                filterCategory
                                            );
                                        } else {
                                            couponsStoreDtoForm.setValue(
                                                "categories",
                                                [...categories, id]
                                            );
                                        }
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    {couponsStoreDtoForm.formState.errors?.categories ? (
                        <p class="text-xs text-red-600">
                            {
                                couponsStoreDtoForm.formState.errors?.categories
                                    .message
                            }
                        </p>
                    ) : null}
                </div>
                <br />
                {storageEmpresa?.tipo_empresa.tipo_servicio_id === 3 ? (
                    <div class="w-full mb-2">
                        <label
                            class="text-xs dark:text-secondary-light text-secondary-dark capitalize font-semibold mb-2 block"
                            htmlFor={"categories" as keyof CouponsStoreDto}
                        >
                            Servicios
                        </label>
                        <div class="flex gap-4 flex-wrap">
                            {ServicesAllQuery.data?.data.map((category) => (
                                <div
                                    key={category.id}
                                    class="flex gap-1 text-xs dark:text-white flex-col"
                                >
                                    <span class="text-primary font-bold">
                                        {category.name}
                                    </span>
                                    <input
                                        type="checkbox"
                                        value={category.id}
                                        onChange={(e) => {
                                            const id = Number(
                                                (e.target as HTMLInputElement)
                                                    .value
                                            );
                                            const existID = categories.some(
                                                (cat) => cat === id
                                            );
                                            if (existID) {
                                                const filterCategory =
                                                    categories.filter(
                                                        (cat) => cat !== id
                                                    );
                                                couponsStoreDtoForm.setValue(
                                                    "categories",
                                                    filterCategory
                                                );
                                            } else {
                                                couponsStoreDtoForm.setValue(
                                                    "categories",
                                                    [...categories, id]
                                                );
                                            }
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                        {couponsStoreDtoForm.formState.errors?.categories ? (
                            <p class="text-xs text-red-600">
                                {
                                    couponsStoreDtoForm.formState.errors
                                        ?.categories.message
                                }
                            </p>
                        ) : null}
                    </div>
                ) : (
                    <></>
                )}

                <div class="flex justify-center">
                    <Form.button.submit
                        disabled={couponsStoreMutation.isLoading || false}
                        isLoading={couponsStoreMutation.isLoading || false}
                        title="Guardar"
                    />
                </div>
            </Form>
        </div>
    );
}

export default CouponsStore;
