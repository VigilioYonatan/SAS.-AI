import useEmpresastore from "@/empresas/stores/empresa.store";
import { useEffect } from "preact/hooks";

function holiday() {
	const fechaActual = new Date();
	const mesActual = fechaActual.getMonth() + 1;
	switch (mesActual) {
		// February
		case 2:
			return "/images/settings/holidays/heart.webp";
		// July
		case 11:
			return "/images/settings/holidays/rosa.png";
		// October
		case 10:
			return "/images/settings/holidays/pumpin.webp";
		// December
		case 12:
			return "/images/settings/holidays/christmas-snow.webp";
		default:
			return null;
	}
}

function Animations() {
	const empresaStore = useEmpresastore();

	useEffect(() => {
		if (!empresaStore.state!.enabledAnimation || !holiday()) return;

		const body = document.body;
		const footer = document.querySelector("footer"); // Seleccionamos el footer
		const footerTop = footer?.offsetTop || window.innerHeight; // Obtenemos la posición superior del footer o la altura de la ventana si no hay footer

		const quantitySnow = 50;
		const widthSnowQuery = window.matchMedia("(max-width: 600px)").matches
			? 20
			: 30;

		for (let i = 0; i < quantitySnow; i++) {
			const leftNow = Math.floor(Math.random() * body.scrollWidth - 100);
			const topNow = Math.floor(Math.random() * (footerTop - 100));
			const widthNow = Math.floor(Math.random() * widthSnowQuery);
			const timeSNow = Math.floor(Math.random() * 50 + 5);

			const snowflake = document.createElement("div");
			snowflake.style.left = `${leftNow}px`;
			snowflake.style.top = `${topNow}px`;
			snowflake.style.width = `${widthNow}px`;
			snowflake.style.height = `${widthNow}px`;
			snowflake.style.animationDuration = `${timeSNow}s`;
			snowflake.className = "snow";

			body.appendChild(snowflake);
		}
	}, []);

	return (
		<div>
			<style jsx>{`
                .snow {
                    position: absolute;
                    background-image: url(${holiday()});
                    background-size: cover;
                    animation: animationSnow 4s ease-in-out infinite;
                    pointer-events: none;
                    z-index: 9;
                }

                @keyframes animationSnow {
                    0% {
                        transform: translateY(-100px);
                        opacity: 0;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(100vh);
                    }
                }
            `}</style>
		</div>
	);
}

export default Animations;
