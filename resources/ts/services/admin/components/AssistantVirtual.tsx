import { printLogoempresa } from "@/empresas/libs/helpers";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { useSignal } from "@preact/signals";
import { sweetAlert } from "@vigilio/sweet";
import { useEffect, useRef } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { useForm } from "react-hook-form";
import LoaderSubmit from "~/components/LoaderSubmit";
import { linkVigilio } from "~/config/settings";
import useCopyToClipboard from "~/hooks/useCopyToClipboard";
import usePressTimeOut from "~/hooks/usePressTimeOut";
import { removeTextHTML } from "~/libs/helpers";
import useSocketStore from "~/stores/socket.store";

interface AssistantVirtualProps {
    onClose: () => void;
    isOpen: boolean;
}
export type ChatIA = [string, "user" | "assistant", string];

function AssistantVirtual({ onClose, isOpen }: AssistantVirtualProps) {
    return (
        <div
            class={`vigilio-button-container-ai ${
                isOpen ? "visible opacity-100" : "invisible  opacity-0"
            } delay-custom-1  p-2  rounded-md overflow-hidden  shadow-primary bg-background-light dark:bg-paper-dark  w-[280px] xs:w-[380px] md:w-[400px] h-[calc(100dvh_-_230px)] md:h-[520px] absolute -bottom-1 md:bottom-8 z-[99] -right-4  shadow`}
        >
            {isOpen ? (
                <>
                    {(() => {
                        const chats = useSignal<ChatIA[]>([]);
                        const messageForm = useForm<{ message: string }>();
                        const chatBox = useRef<HTMLDivElement | null>(null);
                        const { io, connectSocket, isConnect } =
                            useSocketStore();
                        const message = messageForm.watch("message");
                        const isLoading = useSignal(false);
                        const [cp] = useCopyToClipboard();
                        const { handleTouchEnd, handleTouchStart } =
                            usePressTimeOut();

                        async function onSendMessage(data: {
                            message: string;
                        }) {
                            if (isLoading.value) return;
                            isLoading.value = true;
                            messageForm.reset();
                            const id = Date.now().toString(32).slice(4);
                            chats.value = [
                                ...chats.value,
                                [id, "user", data.message],
                            ];
                            io?.emit("chat:send-message", { ...data, id });
                        }
                        function onScrolling() {
                            const chatContainer = chatBox.current;
                            if (chatContainer) {
                                setTimeout(() => {
                                    chatContainer.scrollTop =
                                        chatContainer.scrollHeight;
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
                            io?.on(
                                "chat:ai",
                                (
                                    data: [
                                        string,
                                        "user" | "assistant",
                                        string
                                    ][]
                                ) => {
                                    chats.value = data ?? [];
                                    onScrolling();
                                }
                            );
                            return () => {
                                io?.off("chat:ai");
                            };
                        }, [io]);
                        useEffect(() => {
                            io?.on("chat:send-message", (chat: ChatIA) => {
                                onScrolling();
                                isLoading.value = false;
                                chats.value = chats.value.some(
                                    (ch) => ch[0] === chat[0]
                                )
                                    ? chats.value.map((ch) =>
                                          ch[0] === chat[0]
                                              ? [ch[0], chat[1], chat[2]]
                                              : ch
                                      )
                                    : [...chats.value, chat];
                            });
                            return () => {
                                io?.off("chat:send-message");
                            };
                        }, [io]);
                        return (
                            <>
                                {" "}
                                <div class="flex flex-col relative py-1">
                                    <div
                                        className={`w-[15px] h-[15px] rounded-full absolute ${
                                            isConnect
                                                ? "bg-primary"
                                                : "bg-red-600"
                                        }`}
                                    />
                                    <h3 class="vigilio-title dark:text-white text-primary font-bold text-center text-xl">
                                        <i class="fas fa-user-robot mr-2" />{" "}
                                        Asistente Virtual
                                    </h3>
                                    <a
                                        href={linkVigilio()}
                                        target="_blank"
                                        rel="noreferrer"
                                        class="text-[11px] opacity-70   text-center dark:text-white"
                                    >
                                        Powered by{" "}
                                        <b class=" text-primary dark:text-white">
                                            Vigilio Services
                                        </b>
                                    </a>
                                </div>
                                <button
                                    class="vigilio-close-button absolute right-0 m-2 top-0 text-primary font-bold  "
                                    type="button"
                                    onClick={onClose}
                                >
                                    X
                                </button>
                                <div class="bg-primary w-full h-[1px]" />
                                {isConnect ? (
                                    <>
                                        {" "}
                                        <div
                                            ref={chatBox}
                                            class="flex flex-col h-[calc(100dvh_-_330px)] md:h-[420px]  gap-2 m-1 overflow-auto form-chat mb-12  p-3 "
                                        >
                                            {chats.value.map(
                                                ([key, role, message]) => (
                                                    <Fragment key={key}>
                                                        {role ===
                                                        "assistant" ? (
                                                            <div className="flex gap-2">
                                                                {storageEmpresa!
                                                                    .logo ? (
                                                                    <img
                                                                        src={
                                                                            printLogoempresa(
                                                                                storageEmpresa!
                                                                                    .logo,
                                                                                100
                                                                            )[0]
                                                                        }
                                                                        width={
                                                                            30
                                                                        }
                                                                        height={
                                                                            30
                                                                        }
                                                                        className="vigilio-image-logo object-contain w-[30px] h-[30px] self-start rounded-full border border-primary hidden md:block"
                                                                        alt="cear"
                                                                    />
                                                                ) : null}

                                                                <div
                                                                    class=" font-normal bg-paper-light border dark:bg-background-dark dark:!text-white shadow  p-2 rounded-md flex flex-col "
                                                                    onTouchStart={() =>
                                                                        handleTouchStart(
                                                                            () => {
                                                                                cp(
                                                                                    removeTextHTML(
                                                                                        message
                                                                                    )
                                                                                ).then(
                                                                                    () => {
                                                                                        sweetAlert(
                                                                                            {
                                                                                                icon: "success",
                                                                                                title: "Copiado correctamente",
                                                                                            }
                                                                                        );
                                                                                    }
                                                                                );
                                                                            }
                                                                        )
                                                                    }
                                                                    onTouchEnd={
                                                                        handleTouchEnd
                                                                    }
                                                                >
                                                                    <div
                                                                        class="text-sm font-semibold"
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: message.replace(
                                                                                /(^|\s)(https?:\/\/[^\s<]+)/g,
                                                                                (
                                                                                    _,
                                                                                    space,
                                                                                    url
                                                                                ) =>
                                                                                    `${space}<a href="${url}" class="text-primary hover:underline">Click aquí</a>`
                                                                            ),
                                                                        }}
                                                                        // Captura cuando se libera
                                                                    />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div class="text-[0.6rem] font-normal bg-[#E1FEC4] px-2 py-1 rounded-md self-end flex flex-col text-black shadow">
                                                                <p class="text-sm font-semibold">
                                                                    {message}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </Fragment>
                                                )
                                            )}
                                            {isLoading.value ? (
                                                <div class="vigilio-chat-loading font-normal bg-primary text-white px-4 py-1 rounded-md  self-start">
                                                    <div class="mensaje-tipeando">
                                                        <span class="punto">
                                                            .
                                                        </span>
                                                        <span class="punto">
                                                            .
                                                        </span>
                                                        <span class="punto">
                                                            .
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>{" "}
                                        <form
                                            onSubmit={messageForm.handleSubmit(
                                                onSendMessage
                                            )}
                                            class="vigilio-form absolute bottom-0 right-0 left-0  flex     h-[38px]  bg-white border-t-2"
                                            autoComplete="off"
                                        >
                                            <input
                                                class="w-full  outline-none px-1  bg-transparent text-xs dark:text-white"
                                                type="text"
                                                {...messageForm.register(
                                                    "message",
                                                    {
                                                        required: {
                                                            value: true,
                                                            message:
                                                                "Este campo es obligatorio",
                                                        },
                                                        maxLength: {
                                                            value: 300,
                                                            message:
                                                                "Máximo 300 carácteres",
                                                        },
                                                    }
                                                )}
                                                placeholder="Enviar mensaje"
                                            />
                                            <button
                                                class="px-4 py-2   flex justify-center items-center text-white  text-xs font-light bg-primary"
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
                                                animation: moverPunto 1s
                                                    infinite;
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
                                    </>
                                ) : (
                                    <div class="w-full h-full flex items-center justify-center">
                                        <LoaderSubmit color="var(--primary)" />
                                    </div>
                                )}
                            </>
                        );
                    })()}
                </>
            ) : null}
        </div>
    );
}
export default AssistantVirtual;
