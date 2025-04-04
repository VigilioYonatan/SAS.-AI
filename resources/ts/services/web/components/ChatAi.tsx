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
        <div class="buttons-pages-custom fixed bottom-32 right-10 z-[99] ">
            <AssistantVirtual isOpen={isOpen.value} onClose={onClose} />
            <button
                class=" bg-primary px-4 py-2 rounded-md text-white"
                type="button"
                aria-label="open chat ai"
                onClick={onOpen}
            >
                <i class="fas fa-message-bot" />
            </button>
        </div>
    );
}

export default ChatAi;
