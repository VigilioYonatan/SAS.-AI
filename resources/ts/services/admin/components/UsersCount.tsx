import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { randomNumber } from "~/libs/helpers";
import useSocketStore from "~/stores/socket.store";
const minutes30 = 30 * 60 * 1000; // cada 30 minutos
function UsersCount() {
    const { io, connectSocket } = useSocketStore();
    const usersCount = useSignal(0);

    useEffect(() => {
        io?.on("users-count:index", (data) => {
            usersCount.value = data ?? usersCount.value;
        });
        return () => io?.off("users-count:index");
    }, [io]);

    useEffect(() => {
        connectSocket();
    }, []);

    // ficticio de clientes para que el cliente no se enoje
    useEffect(() => {
        const defaultValue = usersCount.value;
        const interval = setInterval(() => {
            usersCount.value = defaultValue + randomNumber(1, 3); // maximo 3
        }, minutes30);

        return () => clearInterval(interval);
    }, []);

    return (
        <div class="text-terciary  rounded-md flex gap-2 items-center text-xs">
            <div class="bg-success rounded-full w-[10px] h-[10px] " />
            <span>
                Hay <b class="dark:text-white">{usersCount.value}</b> personas
                en tu web
            </span>{" "}
        </div>
    );
}

export default UsersCount;
