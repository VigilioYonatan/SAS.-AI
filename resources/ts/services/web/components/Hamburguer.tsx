import { storageEmpresa } from "@/empresas/stores/empresa.store";

interface HamburguerProps {
    isOpen: boolean;
}
function Hamburguer({ isOpen }: HamburguerProps) {
    return (
        <>
            <div
                class={`hamburger hamburger--collapse ${
                    isOpen ? "is-active" : ""
                }`}
                type="button"
            >
                <i
                    class={`${storageEmpresa?.setting.hamburger} ${
                        storageEmpresa?.setting.hamburger === "fas pizza-slice"
                            ? "rotate-[250deg]"
                            : ""
                    } text-3xl `}
                />
            </div>
        </>
    );
}

export default Hamburguer;
