import { signal } from "@preact/signals";
import type { Socket } from "socket.io-client";
import socket from "socket.io-client";
import { authStorage } from "@/auth/stores/auth.store";
import { generateId } from "@vigilio/express-core/helpers";
import enviroments from "~/config";

function getId() {
	if (!localStorage.getItem(`${enviroments.VITE_URL}:chatUserId`)) {
		localStorage.setItem(`${enviroments.VITE_URL}:chatUserId`, generateId());
	}
	return localStorage.getItem(`${enviroments.VITE_URL}:chatUserId`);
}

const io = signal<Socket | null>(null);

export function useSocketStore() {
	/* contectar socket */
	function connectSocket() {
		const socketio = socket({
			query: {
				"x-user": authStorage ? authStorage?.id : null,
				"x-token": getId(),
			},
			autoConnect: true,
			forceNew: true,
		});
		io.value = socketio;
		return () => socketio.disconnect();
	}

	return {
		io: io.value,
		connectSocket,
	};
}
export default useSocketStore;
