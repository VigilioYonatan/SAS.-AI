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
        case 7:
            return "/images/settings/holidays/rosa.png";
        // October
        case 10:
            return "/images/settings/holidays/happy-halloween-pumpkin-99e149.webp";
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
        // si no tiene webstandard y está deshabilitado animaciones
        if (!empresaStore.state!.enabledAnimation || !holiday()) return;

        const body = document.body;
        const quantitySnow = window.matchMedia("(max-width: 600px)").matches
            ? 10
            : 20;
        const widthSnowQuery = window.matchMedia("(max-width: 600px)").matches
            ? 20
            : 30;

        const offset = 300; // máximo 300 píxeles de espacio arriba y abajo

        // Limitar el área para las animaciones
        const viewportHeight = window.innerHeight;
        const topLimit = offset;
        const bottomLimit = viewportHeight - offset;

        for (let i = 0; i < quantitySnow; i++) {
            const leftNow = Math.floor(Math.random() * body.clientWidth);
            const topNow =
                Math.floor(Math.random() * (bottomLimit - topLimit)) + topLimit;
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
                    z-index: 99;
                    background-image: url(${holiday()});
                    background-size: contain;
                    background-repeat: no-repeat;
                    animation: animationSnow 4s ease-in-out infinite;
                }

                @keyframes animationSnow {
                    0% {
                        transform: translate(0, 0);
                        opacity: 0;
                    }

                    50% {
                        opacity: 1;
                    }

                    100% {
                        opacity: 0;
                        transform: translate(100px, 50vh);
                    }
                }
            `}</style>
        </div>
    );
}

export default Animations;
