import { storageEmpresa } from "@/empresas/stores/empresa.store";

interface HamburguerProps {
	isOpen: boolean;
}
function Hamburguer({ isOpen }: HamburguerProps) {
	return (
		<>
			<div class={`hamburger hamburger--collapse ${isOpen ? "is-active" : ""}`}>
				<i
					class={`${storageEmpresa?.setting.hamburger.replace(
						"fas",
						storageEmpresa?.setting.type_icons_bars === "normal"
							? "fas"
							: "far",
					)} ${
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
