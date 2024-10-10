import { useSignal } from "@preact/signals";

/**
 *
 * @param timer
 * @returns
 * seconds 1,2
 */
function usePressTimeOut(time = 2) {
    const touchTimer = useSignal<NodeJS.Timeout | null>(null);

    function handleTouchStart(cb: () => void) {
        // Iniciar un temporizador cuando el usuario presiona la pantalla
        const timer = setTimeout(() => {
            cb();
        }, time * 1000); //  segundos
        touchTimer.value = timer as NodeJS.Timeout;
    }

    function handleTouchEnd() {
        clearTimeout(touchTimer.value as NodeJS.Timeout);
    }
    return { handleTouchStart, handleTouchEnd };
}

export default usePressTimeOut;
