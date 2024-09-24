import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { useForm } from "react-hook-form";
import { linkVigilio } from "~/config/settings";
import { delay } from "~/libs/helpers";
import useSocketStore from "~/stores/socket.store";

interface AssistantVirtualProps {
	onClose: () => void;
	isOpen: boolean;
}
function AssistantVirtual({ onClose, isOpen }: AssistantVirtualProps) {
	const chats = useSignal<["user" | "assistant", string][]>([]);
	const messageForm = useForm<{ message: string }>();
	const chatBox = useRef<HTMLDivElement | null>(null);
	const { io, connectSocket } = useSocketStore();
	const message = messageForm.watch("message");
	const isLoading = useSignal(false);

	async function onSendMessage(data: { message: string }) {
		if (isLoading.value) return;
		isLoading.value = true;
		messageForm.reset();
		chats.value = [...chats.value, ["user", data.message]];
		const between = Math.floor(Math.random() * (6 - 3 + 1)) + 3;
		io?.emit("chat:send-message", data);
		await delay(between);
	}
	function onScrolling() {
		const chatContainer = chatBox.current;
		if (chatContainer) {
			setTimeout(() => {
				chatContainer.scrollTop = chatContainer.scrollHeight;
			}, 100);
		}
	}
	useEffect(() => {
		onScrolling();
		connectSocket();
	}, []);

	useEffect(() => {
		onScrolling();
	}, [message]);

	useEffect(() => {
		io?.on("chat:ai", (data: ["user" | "assistant", string][]) => {
			chats.value = data ?? [];
			onScrolling();
		});
		return () => io?.off("chat:ai");
	}, [io]);

	useEffect(() => {
		io?.on("chat:send-message", (data: ["user" | "assistant", string]) => {
			chats.value = [...chats.value, data];
			onScrolling();
			isLoading.value = false;
		});
		return () => io?.off("chat:send-message");
	}, [io]);

	return (
		<div
			class={`${
				isOpen ? "block" : "hidden"
			} p-2  rounded-md overflow-hidden bg-white dark:bg-paper-dark w-[300px] h-[405px] absolute bottom-12 z-[99] m-4 right-0  shadow`}
		>
			<div class="flex flex-col">
				<h3 class=" dark:text-white text-primary font-bold text-center text-xl">
					<i class="fas fa-user-robot mr-2" /> Asistente Virtual
				</h3>
				<a
					href={linkVigilio()}
					target="_blank"
					rel="noreferrer"
					class="text-[11px] opacity-70  text-black text-center dark:text-white"
				>
					Powered by{" "}
					<b class=" text-primary dark:text-white">Vigilio Services</b>
				</a>
			</div>

			<button
				class="absolute right-0 m-2 top-0 dark:text-white"
				type="button"
				onClick={onClose}
			>
				X
			</button>
			<div class="bg-primary w-full h-[1px]" />
			<div
				ref={chatBox}
				class="flex flex-col h-[320px] gap-1.5 m-1 overflow-auto form-chat mb-12  p-3"
			>
				{chats.value.map(([key, message], i) => (
					<Fragment key={`${message}${i + 1}`}>
						{key === "assistant" ? (
							<div class=" font-normal bg-background-light dark:bg-background-dark dark:text-white shadow  p-2 rounded-md flex flex-col ">
								<div
									class="text-sm font-semibold"
									dangerouslySetInnerHTML={{
										__html: message,
									}}
								/>
							</div>
						) : (
							<div class="text-[0.6rem] font-normal bg-[#E1FEC4] px-2 py-1 rounded-md self-end flex flex-col">
								<p class="text-sm font-semibold">{message}</p>
							</div>
						)}
					</Fragment>
				))}
				{isLoading.value ? (
					<div class=" font-normal bg-paper-light  dark:bg-background-dark dark:text-white px-4 py-1 rounded-md  self-start">
						<div class="mensaje-tipeando">
							<span class="punto">.</span>
							<span class="punto">.</span>
							<span class="punto">.</span>
						</div>
					</div>
				) : null}
			</div>
			<form
				onSubmit={messageForm.handleSubmit(onSendMessage)}
				class="absolute bottom-0 right-0 left-0  flex   overflow-auto  h-[38px]  rounded-md dark:bg-paper-dark bg-background-light"
			>
				<input
					class="w-full  outline-none px-1  bg-transparent text-xs dark:text-white"
					type="text"
					{...messageForm.register("message", {
						required: {
							value: true,
							message: "Este campo es obligatorio",
						},
						maxLength: {
							value: 300,
							message: "Máximo 300 carácteres",
						},
					})}
					placeholder="Enviar mensaje"
				/>
				<button
					class="px-4 py-2 flex justify-center items-center text-white  text-xs font-light bg-primary"
					type="submit"
					aria-label="send message"
				>
					<i class="fa-solid fa-paper-plane-top" />
				</button>
			</form>

			<style jsx>{`
                .form-chat {
                    scrollbar-color: black;
                    scrollbar-width: thin;
                }
                .mensaje-tipeando {
                    display: inline-block;
                }

                .punto {
                    animation: moverPunto 1s infinite;
                    opacity: 0;
                    display: inline-block;
                }

                @keyframes moverPunto {
                    0% {
                        opacity: 0;
                    }
                    25% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0;
                    }
                    75% {
                        opacity: 1;
                    }
                    100% {
                        opacity: 0;
                    }
                }

                .punto:nth-child(2) {
                    animation-delay: 0.2s;
                }

                .punto:nth-child(3) {
                    animation-delay: 0.4s;
                }
            `}</style>
		</div>
	);
}
export default AssistantVirtual;
