import express from "express";
import { IgApiClient } from "instagram-private-api";
import cors from "cors";
import path from "node:path";

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

const ig = new IgApiClient();
const BASE_URL = "https://e526-201-218-157-99.ngrok-free.app";
const CLIENT_ID = "1995984660825359";
const CLIENT_SECRET = "48d7fbc0d06932cb9b266c30201c46a0";
ig.state.generateDevice("yon.1666");
await ig.account.login("yon.1666", "dokixd123");

const inboxFeed = ig.feed.directInbox();
const threads = await inboxFeed.items();
const ids = threads.map((ig) => ig);
for (const thread of threads) {
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/auth/facebook", async (_, res) => {
    const REDIRECT_URI = `${BASE_URL}/auth/facebook/callback`;
    const fbAuthUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
    res.redirect(fbAuthUrl);
});
app.get("/auth/facebook/callback", async (req, res) => {
    const { code } = req.query as { code: string };
    if (!code) {
        return res.status(400).send("No authorization code provided.");
    }
    const REDIRECT_URI = `${BASE_URL}/auth/facebook/callback`;

    try {
        // Intercambia el código por un token de acceso
        const tokenResponse = await fetch(
            `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&client_secret=${CLIENT_SECRET}&code=${code}`
        );
        const tokenResult = await tokenResponse.json();
        console.log({ tokenResult });

        const accessToken = tokenResult.access_token;

        // Aquí puedes almacenar el `accessToken` en tu base de datos o devolverlo al frontend
        res.send({ accessToken });
    } catch (error) {
        console.error(
            "Error al obtener el token de acceso:",
            (error as Error).message
        );
        res.status(500).send("Error al obtener el token de acceso.");
    }
});
app.get("/web");

app.get("/webhook", () => {});
const facebook =
    "EAAHxLd4NokgBO2fnQQp9ZCvI60ga2viUxnBa7eGpVBMxGrlw4L208rTlKpDsfDITDVH40EEnvfJiZAZAsXsRYbZCtpS2twHWPxPpvAfNguZC3p0ljM0RwXrpraACIMEHXIKSBaXuTt4oDnwsz7mPgLZA99b17uZAH5CvcbextDeVJxVp4VL6SWksUOuzt9wZBVD9RAZDZD";

export async function getConversations() {
    const responseName = await fetch(
        `https://graph.facebook.com/v21.0/me/conversations?access_token=${facebook}&fields=participants{picture,name,email},message_count,updated_time,last_message,unread_count,is_group`
    );
    const resultName: ConversationMessengerAPI = await responseName.json();
    console.log({});
    
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
getConversations();
app.listen(5000, () => {
    console.log(`Corriendo en puerto 5000`);
});
