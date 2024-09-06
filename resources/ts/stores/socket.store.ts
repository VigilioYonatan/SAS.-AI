import { signal } from "@preact/signals";
import type { Socket } from "socket.io-client";
import socket from "socket.io-client";
import { authStorage } from "@/auth/stores/auth.store";
import { generateId } from "@vigilio/express-core/helpers";
import { storageEmpresa } from "@/empresas/stores/empresa.store";

function getId() {
    const key = `${storageEmpresa?.slug}:chatUserId`;
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, generateId());
    }
    return localStorage.getItem(key);
}

const io = signal<Socket | null>(null);

export function useSocketStore() {
    /* contectar socket */
    function connectSocket() {
        const socketio = socket({
            query: {
                "x-user": authStorage ? authStorage?.id : null,
                "x-token": getId(),
                "x-empresa": storageEmpresa ? storageEmpresa.id : "null",
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
