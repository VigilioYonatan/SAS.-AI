import type { NewSchema } from "@/empresas/schemas/new.schema";
import { useSignal } from "@preact/signals";
import enviroments from "~/config";
import useCountDown from "~/hooks/useCountDown";
import dayjs, { NOW } from "~/libs/helpers";
import { printFileWithDimension } from "~/libs/upload";

// mostrar noticia cada cierto tiempo
function initialStorage() {
    const noticiaStorage = localStorage.getItem("noticia") ?? null;
    return !noticiaStorage || !NOW().isBefore(dayjs(noticiaStorage));
}

interface NoticiaProps {
    noticia: NewSchema | null;
}

function Noticia({ noticia }: NoticiaProps) {
    if (!noticia?.enabled) return null;
    const initial = useSignal(initialStorage());
    if (!initial.value) return null;
    function onClose() {
        localStorage.setItem(
            "noticia",
            // cada 2 horas para que guarde
            NOW().add(2, "hour").toISOString()
        );
        initial.value = false;
    }
    return (
        <>
            {noticia.image ? (
                <>
                    {(() => {
                        return (
                            <div
                                onClick={onClose}
                                class="fixed inset-0 bg-black bg-opacity-80 z-[999] flex justify-center items-center  "
                            >
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    class={`w-[800px] mx-4 h-[500px] flex justify-center relative items-end  ${
                                        enviroments.TYPE_BORDER === "circle"
                                            ? "rounded-md overflow-hidden"
                                            : ""
                                    }`}
                                >
                                    <img
                                        class="w-full h-full object-cover absolute inset-0 -z-1"
                                        width={800}
                                        height={800}
                                        src={
                                            printFileWithDimension(
                                                noticia.image,
                                                800
                                            )[0]
                                        }
                                        alt=""
                                    />
                                    <div class="relative flex flex-col gap-2 rounded-md bg-black bg-opacity-50 p-2 w-full mx-2 md:w-7/12 mb-2">
                                        {" "}
                                        <span class="font-bold text-3xl text-center text-white">
                                            {noticia.title}
                                        </span>
                                        <p class="font-semibold text-center text-terciary">
                                            {noticia.subtitle}
                                        </p>{" "}
                                        {noticia.date ? (
                                            <>
                                                {(() => {
                                                    const count = useCountDown(
                                                        noticia.date
                                                    );
                                                    return (
                                                        <div class="grid grid-cols-4 gap-2 w-full text-primary">
                                                            <span class="flex gap-2 text-3xl items-center font-bold">
                                                                {count.days}
                                                                <span class="text-sm font-normal ">
                                                                    DIAS
                                                                </span>
                                                            </span>
                                                            <span class="flex gap-2 text-3xl items-center font-bold">
                                                                {count.hours}
                                                                <span class="text-sm font-normal">
                                                                    HORAS
                                                                </span>
                                                            </span>
                                                            <span class="flex gap-2 text-3xl items-center font-bold">
                                                                {count.minutes}
                                                                <span class="text-sm font-normal">
                                                                    MIN.
                                                                </span>
                                                            </span>
                                                            <span class="flex gap-2 text-3xl items-center font-bold">
                                                                {count.seconds}
                                                                <span class="text-sm font-normal">
                                                                    SEG.
                                                                </span>
                                                            </span>
                                                        </div>
                                                    );
                                                })()}
                                            </>
                                        ) : null}
                                        {noticia.link ? (
                                            <a
                                                href={noticia.link}
                                                class="bg-primary text-white px-6 py-2 rounded-md self-start mx-auto font-bold"
                                            >
                                                Más información
                                            </a>
                                        ) : null}
                                    </div>{" "}
                                    <button
                                        class="absolute right-0 top-0 text-3xl shadow rounded-full w-[15px] m-2 h-[15px] text-black  font-bold flex justify-center items-center "
                                        type="button"
                                        aria-label="close"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onClose();
                                        }}
                                    >
                                        x
                                    </button>
                                </div>
                            </div>
                        );
                    })()}
                </>
            ) : (
                <div
                    class="fixed z-[99] top-24 w-[300px] m-2 p-2 left-0 bg-gradient-to-b from-primary to-gray-700 rounded-md flex flex-col gap-2"
                    onClick={() => {
                        if (!noticia.link) return;

                        window.location.href = noticia.link;
                    }}
                >
                    <button
                        class="absolute -right-2 -top-2 text-xs shadow rounded-full w-[15px] h-[15px] text-primary bg-white dark:bg-paper-dark dark:text-white font-bold flex justify-center items-center"
                        type="button"
                        aria-label="close"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                    >
                        x
                    </button>
                    <span class="font-bold text-sm text-center line-clamp-2 text-white">
                        {noticia.title}
                    </span>
                    <p class="text-sm font-semibold text-center text-terciary">
                        {noticia.subtitle}
                    </p>{" "}
                    {noticia.date ? (
                        <>
                            {(() => {
                                const count = useCountDown(noticia.date);
                                return (
                                    <div class="grid grid-cols-4 gap-2 w-full text-white">
                                        <span class="flex gap-2 text-xl items-center font-bold">
                                            {count.days}
                                            <span class="text-xs font-normal">
                                                DIAS
                                            </span>
                                        </span>
                                        <span class="flex gap-2 text-xl items-center font-bold">
                                            {count.hours}
                                            <span class="text-xs font-normal">
                                                HORAS
                                            </span>
                                        </span>
                                        <span class="flex gap-2 text-xl items-center font-bold">
                                            {count.minutes}
                                            <span class="text-xs font-normal">
                                                MIN.
                                            </span>
                                        </span>
                                        <span class="flex gap-2 text-xl items-center font-bold">
                                            {count.seconds}
                                            <span class="text-xs font-normal">
                                                SEG.
                                            </span>
                                        </span>
                                    </div>
                                );
                            })()}
                        </>
                    ) : null}
                </div>
            )}
        </>
    );
}

export default Noticia;
