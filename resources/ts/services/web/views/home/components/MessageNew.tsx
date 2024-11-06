import useAuthStore from "@/auth/stores/auth.store";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
const hiStorage = localStorage.getItem("use_hi");

function MessageNew() {
    const authStore = useAuthStore();
    return (
        <>
            {authStore.state?.role_id === 1 && hiStorage !== "ok" ? (
                <div class="fixed top-20 right-4 w-[200px] dark:bg-background-dark bg-white  shadow p-2 rounded-md z-[999] ">
                    <span class="dark:text-white  text-center font-semibold text-xs  tracking-widest">
                        Agrega productos{" "}
                        {storageEmpresa?.tipo_empresa.tipo_servicio_id === 3
                            ? ", Servicios"
                            : ""}{" "}
                        y categorías, Personaliza tu web para que se vea mejor
                        tu tienda virtual en{" "}
                        <i class="fa-solid fa-face-smile-wink text-yellow-400" />
                        .
                        <a
                            href="/admin/settings"
                            type="button"
                            class="bg-primary px-6 py-2 rounded-lg font-bold text-white mt-2 block"
                            aria-label="OK"
                            onClick={() => {
                                localStorage.setItem("use_hi", "ok");
                            }}
                        >
                            VAMOS
                        </a>
                    </span>
                </div>
            ) : null}
        </>
    );
}

export default MessageNew;
