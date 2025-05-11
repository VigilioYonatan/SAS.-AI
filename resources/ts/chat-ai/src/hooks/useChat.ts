import { signal, useSignal } from "@preact/signals";
import { aiChatApi, aiChatTestApi } from "../apis/chat-ai";
import { useEffect } from "preact/hooks";
import { type Props } from "../types";
import configVigilio from "../config";
import { getId } from "../helpers";
export type ChatIA = ["user" | "assistant", string];

const isConnect = signal<boolean>(false);
const isPlus = signal<boolean>(false);
const chats = signal<ChatIA[]>([]);

interface UseChatStoreProps {
    props: Props;
}
function useChatStore({ props }: UseChatStoreProps) {
    const chatsMutation = aiChatApi({ base_url: props.base_url });
    const aiChatTestMutation = aiChatTestApi();
    const errorMessageServer = useSignal<string | null>(null);
    useEffect(() => {
        const initial_message = props.custom_greet_chat!.replaceAll(
            "{{name_ai}}",
            props.name_ai!
        );
        if (
            props.test_url &&
            window.location.origin.includes(configVigilio.vigilio_services_url)
        ) {
            isPlus.value = true;

            aiChatTestMutation.mutate(
                {
                    test_url: props.test_url,
                    token: getId() as string,
                    initial_message,
                },
                {
                    onSuccess(data) {
                        isConnect.value = true;
                        chats.value = data.chats;
                        errorMessageServer.value = null;
                    },
                    onError(error) {
                        console.error(error.message);
                        isConnect.value = false;
                        errorMessageServer.value = error.message;
                    },
                }
            );
            return;
        }
        if (!props.api_key || !props.base_url) {
            return;
        }
        chatsMutation.mutate(
            {
                token: getId() as string,
                initial_message,
                api_key: props.api_key,
            },
            {
                onSuccess(data) {
                    isConnect.value = true;
                    chats.value = data.chats;
                    errorMessageServer.value = null;
                    isPlus.value = data.isPlus;
                },
                onError(error) {
                    console.error(error.message);
                    isConnect.value = false;
                    errorMessageServer.value = error.message;
                    isPlus.value = false;
                },
            }
        );
    }, []);
    function updateAssistantChat(newContent: string) {
        if (
            chats.value.length > 0 &&
            chats.value[chats.value.length - 1][0] === "assistant"
        ) {
            chats.value = [
                ...chats.value.slice(0, -1),
                ["assistant", newContent] as ChatIA,
            ];
        } else {
            chats.value = [...chats.value, ["assistant", newContent] as ChatIA];
        }
    }
    function insertAssistantChat(chat: ChatIA) {
        chats.value = [...chats.value, chat];
    }

    return {
        isConnect: isConnect.value,
        chats,
        token: getId() as string,
        updateAssistantChat,
        insertAssistantChat,
        errorMessageServer,
        isPlus: isPlus.value,
    };
}
export default useChatStore;
