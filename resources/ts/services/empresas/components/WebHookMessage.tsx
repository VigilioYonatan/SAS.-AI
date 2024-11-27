import { c, sweetModal } from "@vigilio/sweet";
import { webHookMessageApi } from "../apis/webHookMessage.api";

function WebHookMessage() {
	const vigilioQuery = webHookMessageApi();
	let component: JSX.Element | null = null;

	if (vigilioQuery.isSuccess && vigilioQuery.data) {
		component = vigilioQuery.data.message ? (
			<button
				class="relative text-primary"
				type="button"
				aria-label="to add webhook"
				onClick={() =>
					sweetModal({
						html: c("div", null, vigilioQuery.data!.message),
						isCloseInBackground: false,
						showCloseButton: true,
					})
				}
			>
				<i class="fas fa-star bg " />
			</button>
		) : null;
	}
	return component;
}

export default WebHookMessage;
