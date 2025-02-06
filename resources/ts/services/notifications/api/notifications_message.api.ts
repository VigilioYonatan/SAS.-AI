import { useMutation } from "@vigilio/preact-fetching";
import { NotificationMessageDto } from "@/users/views/UsersIndex";

export function notificationsMessageApi() {
    return useMutation<
        NotificationsMessageAPI,
        NotificationMessageDto,
        NotificationsMessageErrorAPI
    >("/notifications/send-message", async (url, body) => {
        const response = await fetch(`/api${url}`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result: NotificationsMessageAPI = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface NotificationsMessageAPI {
    success: boolean;
    message: string;
}

export interface NotificationsMessageErrorAPI {
    success: boolean;
    message: string;
}
