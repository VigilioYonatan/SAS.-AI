import AssistantVirtual from "@/admin/components/AssistantVirtual";
import { useSignal } from "@preact/signals";

function ChatAi() {
	const isOpen = useSignal(false);
	function onClose() {
		isOpen.value = false;
	}
	function onOpen() {
		isOpen.value = true;
	}

	return (
		<div class="fixed bottom-32 right-10 z-[99]">
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
