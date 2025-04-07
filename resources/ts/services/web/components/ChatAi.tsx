import AssistantVirtual from "@/admin/components/AssistantVirtual";
import { useSignal } from "@preact/signals";

function ChatAi() {
    const isOpen = useSignal(
        JSON.parse(localStorage.getItem("bot-open") || "false") || false
    );

    function onClose() {
        isOpen.value = false;
        localStorage.removeItem("bot-open");
    }
    function onOpen() {
        isOpen.value = true;
        localStorage.setItem("bot-open", "true");
    }

    return (
        <div class="vigilio-chat-ai buttons-pages-custom fixed bottom-32 right-10 z-[99] ">
            <AssistantVirtual isOpen={isOpen.value} onClose={onClose} />
            <button
                class="vigilio-button-ai bg-primary w-[55px] h-[45px] flex justify-center items-center rounded-md text-white"
                type="button"
                aria-label="open chat ai"
                onClick={onOpen}
            >
                <i class="fas fa-message-bot text-xl" />
            </button>
        </div>
    );
}

export default ChatAi;
