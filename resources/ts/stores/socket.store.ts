import { signal } from "@preact/signals";
import type { Socket } from "socket.io-client";
import socket from "socket.io-client";
import { authStorage } from "@/auth/stores/auth.store";
import { generateId } from "@vigilio/express-core/helpers";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { useEffect } from "preact/hooks";

export function getId() {
    const key = `${storageEmpresa?.slug}:chatUserId`;
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, generateId());
    }

    return localStorage.getItem(key);
}

const io = signal<Socket | null>(null);
const isConnect = signal<boolean>(false);

export function useSocketStore() {
    /* contectar socket */
    function connectSocket() {
        const socketio = socket({
            query: {
                "x-user": authStorage ? authStorage?.id : "null",
                "x-token": getId() ?? "null",
                "x-empresa": storageEmpresa ? storageEmpresa.slug : "null",
            },
            autoConnect: true,
            forceNew: true,
        });
        io.value = socketio;

        return () => socketio.disconnect();
    }

    useEffect(() => {
        io.value?.on("connect", () => {
            isConnect.value = true;
        });
    }, [io.value]);
    useEffect(() => {
        io.value?.on("disconnect", () => {
            isConnect.value = false;
        });
    }, [io.value]);
    return {
        io: io.value,
        connectSocket,
        isConnect: isConnect.value,
    };
}
export default useSocketStore;
