// import express from "express";
// import bodyParser from "body-parser";

// const app = express();
// app.use(bodyParser.json());

// const PAGE_ACCESS_TOKEN = "TU_TOKEN_DE_ACCESO";

// app.get("/webhook", (req, res) => {
//     const verifyToken = req.query["hub.verify_token"];
//     console.log({ verifyToken });

//     if (verifyToken === "mi_token_secreto") {
//         res.status(200).send(req.query["hub.challenge"]);
//     } else {
//         res.sendStatus(403);
//     }
// });
// app.post("/webhook", (req, res) => {
//     const body = req.body;

//     if (body.object === "page") {
//         body.entry.forEach((entry: any) => {
//             const webhook_event = entry.messaging[0];
//             const senderID = webhook_event.sender.id;
//             const messageText = webhook_event.message.text;

//             console.log(`Mensaje recibido: ${messageText} de ${senderID}`);
//         });

//         res.status(200).send("EVENT_RECEIVED");
//     } else {
//         res.sendStatus(404);
//     }
// });

// app.listen(3000, () => {
//     console.log("Servidor en marcha en el puerto 3000");
// });
