import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { useForm } from "react-hook-form";
import { delay, showTime } from "~/libs/helpers";
import useSocketStore from "~/stores/socket.store";
import { subWhatsappIA } from "~/config/guards";
import { sweetAlert } from "@vigilio/sweet";

function AssistantVirtualAdmin() {
	if (!subWhatsappIA()) {
		sweetAlert({
			icon: "danger",
			title:
				"Necesitar tener whatsapp plus activado o no tienes tokens, ve a plus",
		});
		return null;
	}
	const chats = useSignal<["user" | "assistant", string, number][]>([]);
	const messageForm = useForm<{ message: string }>();
	const chatBox = useRef<HTMLDivElement | null>(null);
	const isLoading = useSignal(false);
	const { io, connectSocket } = useSocketStore();
	const message = messageForm.watch("message");
	async function onSendMessage(data: { message: string }) {
		isLoading.value = true;
		messageForm.reset();
		chats.value = [...chats.value, ["user", data.message, Date.now()]];
		const between = Math.floor(Math.random() * (6 - 3 + 1)) + 3;
		io?.emit("chat-assistant:send-message", data);
		await delay(between);
	}
	useEffect(() => {
		onScrolling();
	}, [message]);

	function onScrolling() {
		const chatContainer = chatBox.current;
		if (chatContainer) {
			setTimeout(() => {
				chatContainer.scrollTop = chatContainer.scrollHeight;
			}, 100);
		}
	}

	useEffect(() => {
		io?.on(
			"chat-assistant:ai",
			(data: ["user" | "assistant", string, number][]) => {
				chats.value = data ?? [];
			},
		);
		return () => io?.off("chat-assistant:ai");
	}, [io]);

	useEffect(() => {
		io?.on(
			"chat-assistant:send-message",
			(data: ["user" | "assistant", string, number]) => {
				chats.value = [...chats.value, data];
				isLoading.value = false;
				onScrolling();
			},
		);
		return () => io?.off("chat-assistant:send-message");
	}, [io]);

	useEffect(() => {
		onScrolling();

		connectSocket();
	}, []);
	return (
		<div class="">
			<h3 class="text-xl text-primary font-bold text-center">
				<i class="fas fa-user-robot mr-2" /> Asistente Virtual
			</h3>

			<div class="bg-terciary w-full h-[1px]" />
			<div
				class="flex flex-col h-[300px] gap-1.5 m-1 overflow-y-auto form-chat mb-12  p-3"
				ref={chatBox}
			>
				{chats.value.map(([key, message, date], i) => (
					<Fragment key={`${message}${i + 1}`}>
						{key === "assistant" ? (
							<div class=" font-normal bg-background-light dark:bg-admin-terciary dark:text-white shadow  p-2 rounded-md flex flex-col ">
								<div
									class="text-sm font-semibold"
									dangerouslySetInnerHTML={{
										__html: message,
									}}
								/>
								<span class="text-xs  self-end">{showTime(date)}</span>
							</div>
						) : (
							<div class="text-[0.6rem] font-normal bg-[#E1FEC4] px-2 py-1 rounded-md self-end flex flex-col">
								<p class="text-sm font-semibold">{message}</p>
								<span class="text-xs ">{showTime(date)}</span>
							</div>
						)}
					</Fragment>
				))}
				{isLoading.value ? (
					<div class=" font-normal bg-paper-light dark:bg-admin-terciary px-4 py-1 rounded-md  self-start dark:text-white">
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
				class="absolute bottom-0 right-0 left-0  flex   overflow-auto  h-[38px] shadow rounded-md"
			>
				<input
					class="w-full  outline-none px-1  bg-transparent border-t dark:text-white"
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
					disabled={isLoading.value || false}
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
export default AssistantVirtualAdmin;
