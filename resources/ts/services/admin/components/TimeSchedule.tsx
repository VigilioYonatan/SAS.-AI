import useEmpresastore from "@/empresas/stores/empresa.store";
import { NOW, formatTime } from "~/libs/helpers";

function TimeSchedule() {
    const empresa = useEmpresastore();
    const findDay = empresa.state!.schedule.find(
        (day) => day.id === NOW().day()
    );
    const isOpen =
        NOW().isAfter(formatTime(findDay!.openTime)) &&
        NOW().isBefore(formatTime(findDay!.closeTime));
    if (isOpen)
        return (
            <div class="bg-success text-xs ml-1 px-1 py-1 rounded-md text-white font-bold text-center">
                <i class="fas fa-store" /> Abierto
            </div>
        );
    return (
        <div class="bg-danger text-xs px-2 py-1 rounded-md text-white font-bold text-center  ml-1">
            <i class="fas fa-store-slash" /> Cerrado
        </div>
    );
}

export default TimeSchedule;
