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
import { familiesAllApi } from "../apis/families/families.all.api";

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
        defaultValues: { subcategories: [] },
    });
    const couponsStoreMutation = couponsStoreApi();
    // categories
    const familiesAllQuery = familiesAllApi();
    const subcategories = couponsStoreDtoForm.watch("subcategories");

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
            `COUPON-${dayjs().format("MMMM").toUpperCase()}-${Math.random()
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
                    <Form.control.toggle
                        title="Solo clientes registrados"
                        name={"onlyRegister" as keyof CouponsStoreDto}
                    />
                </div>

                <div class="w-full mb-2">
                    <label
                        class="text-xs dark:text-secondary-light text-secondary-dark capitalize font-semibold mb-2 block"
                        htmlFor={"categories" as keyof CouponsStoreDto}
                    >
                        Subcategorías
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
                                                            onChange={(e) => {
                                                                const id =
                                                                    Number(
                                                                        (
                                                                            e.target as HTMLInputElement
                                                                        ).value
                                                                    );
                                                                const existID =
                                                                    subcategories.some(
                                                                        (cat) =>
                                                                            cat ===
                                                                            id
                                                                    );
                                                                if (existID) {
                                                                    const filterCategory =
                                                                        subcategories.filter(
                                                                            (
                                                                                cat
                                                                            ) =>
                                                                                cat !==
                                                                                id
                                                                        );
                                                                    couponsStoreDtoForm.setValue(
                                                                        "subcategories",
                                                                        filterCategory
                                                                    );
                                                                } else {
                                                                    couponsStoreDtoForm.setValue(
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
                    {couponsStoreDtoForm.formState.errors?.subcategories ? (
                        <p class="text-xs text-red-600">
                            {
                                couponsStoreDtoForm.formState.errors
                                    ?.subcategories.message
                            }
                        </p>
                    ) : null}
                </div>
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
