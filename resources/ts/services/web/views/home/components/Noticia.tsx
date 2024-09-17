import type { NewSchema } from "@/empresas/schemas/new.schema";
import { useSignal } from "@preact/signals";
import useCountDown from "~/hooks/useCountDown";
import dayjs, { NOW } from "~/libs/helpers";

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

	return (
		<div
			class="fixed z-[99] top-24 w-[300px] m-2 p-2 left-0 bg-gradient-to-b from-primary to-black rounded-md flex flex-col gap-2"
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
					localStorage.setItem(
						"noticia",
						// cada 2 horas para que guarde
						NOW()
							.add(2, "hour")
							.toISOString(),
					);
					initial.value = false;
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
									<span class="text-xs font-normal">DIAS</span>
								</span>
								<span class="flex gap-2 text-xl items-center font-bold">
									{count.hours}
									<span class="text-xs font-normal">HORAS</span>
								</span>
								<span class="flex gap-2 text-xl items-center font-bold">
									{count.minutes}
									<span class="text-xs font-normal">MIN.</span>
								</span>
								<span class="flex gap-2 text-xl items-center font-bold">
									{count.seconds}
									<span class="text-xs font-normal">SEG.</span>
								</span>
							</div>
						);
					})()}
				</>
			) : null}
		</div>
	);
}

export default Noticia;
