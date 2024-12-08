import { useMutation, useQuery } from "@vigilio/preact-fetching";
import { fileIoApi } from "~/libs/helpers";

const facebook =
    "EAAHxLd4NokgBO2fnQQp9ZCvI60ga2viUxnBa7eGpVBMxGrlw4L208rTlKpDsfDITDVH40EEnvfJiZAZAsXsRYbZCtpS2twHWPxPpvAfNguZC3p0ljM0RwXrpraACIMEHXIKSBaXuTt4oDnwsz7mPgLZA99b17uZAH5CvcbextDeVJxVp4VL6SWksUOuzt9wZBVD9RAZDZD";

export function getConversations(nextpage: string | null) {
    return useQuery<
        ConversationMessengerAPI,
        { success: false; message: string }
    >("", async () => {
        const nextPage = nextpage ? `&after=${nextpage}` : "";
        const responseName = await fetch(
            `https://graph.facebook.com/v21.0/me/conversations?access_token=${facebook}&fields=participants{picture,name,email},message_count,updated_time,last_message,unread_count,is_group${nextPage}`
        );
        const resultName: ConversationMessengerAPI = await responseName.json();
        // if (!responseName.ok) throw resultName;
        // const result = await Promise.all(
        //     resultName.data.map(async (chat) => {
        //         console.log({ chat });

        //         const participants = await Promise.all(
        //             chat.participants.data.map(async (participant) => {
        //                 console.log({ participant });

        //                 const responseName = await fetch(
        //                     `https://graph.facebook.com/v21.0/${participant.id}?fields=picture&access_token=${facebook}`
        //                 );
        //                 const resultName: {
        //                     data: { picture: { data: { url: string } } };
        //                 } = await responseName.json();

        //                 return {
        //                     ...participant,
        //                     photo: resultName.data.picture.data.url,
        //                 };
        //             })
        //         );
        //         return {
        //             ...chat,
        //             participants,
        //         };
        //     })
        // );
        return resultName;
    });
}
interface Participant {
    name?: string;
    id?: string;
    photo?: string;
}

export interface Conversation {
    participants: { data: Participant[] };
    message_count: number;
    updated_time: string; // Date string in ISO format
    id: string;
    unread_count: number;
}

interface PagingCursors {
    after: string;
    before: string;
}

interface Paging {
    cursors: PagingCursors;
    next?: string;
    previous?: string;
}

interface ConversationMessengerAPI {
    data: Conversation[];
    paging: Paging;
}
export function getMessages(conversationId: string) {
    return useQuery<MessagesResponse, { success: boolean; message: string }>(
        "",
        async () => {
            const response = await fetch(
                `https://graph.facebook.com/v21.0/${conversationId}/messages?access_token=${facebook}&fields=message,from,created_time,attachments`
            );
            const data = await response.json();
            if (!response.ok) throw data;
            return data;
        }
    );
}

export interface Message {
    created_time: string;
    from: Participant;
    message: string | null;
    attachments: {
        data: {
            id: string;
            mime_type: string;
            name: string;
            image_data: {
                url: string;
                preview_url: string;
                render_as_sticker: boolean;
            };
            size: number;
            file_url: string;
        }[];
    } | null;
}

interface MessagesResponse {
    data: Message[];
    paging?: {
        cursors: {
            before: string;
            after: string;
        };
    };
    error?: {
        message: string;
        type: string;
        code: number;
        fbtrace_id: string;
    };
}

export function sendMessageMessenger() {
    return useMutation<
        { success: boolean; message: string },
        {
            recipientId: string;
            messageText: string | null;
            file: File | null;
        },
        { success: boolean; message: string }
    >("https://graph.facebook.com/v21.0", async (url, body) => {
        let attachment = {};
        if (body.file) {
            const result = await fileIoApi(body.file);
            attachment = {
                type: body.file.type,
                payload: {
                    url: result.link,
                },
            };
        }
        const messageData = {
            recipient: { id: body.recipientId },
            message: { text: body.messageText },
            attachment,

            tag: "CONFIRMED_EVENT_UPDATE",
        };

        const response = await fetch(
            `${url}/me/messages?access_token=${facebook}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(messageData),
            }
        );
        const result = await response.json();
        if (!response.ok) throw result;
        return result;
    });
}
export function sendSeenMessenger() {
    return useMutation<
        { success: boolean; message: string },
        {
            conversationId: string;
        },
        { success: boolean; message: string }
    >("https://graph.facebook.com/v21.0", async (url, body) => {
        const response = await fetch(
            `${url}/${body.conversationId}/messages?access_token=${facebook}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipient: { id: body.conversationId },
                    sender_action: "mark_seen",
                }),
            }
        );
        const result = await response.json();
        if (!response.ok) throw result;
        return result;
    });
}
