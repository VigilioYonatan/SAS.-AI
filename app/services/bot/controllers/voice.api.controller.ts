// import { Empresas } from "@/empresas/entities/empresas.entity";
// import { Controller, Get, Req, Res } from "@vigilio/express-core";
// import twilio from "twilio";
// import fs from "node:fs";
// import path from "node:path";
// import { exec } from "node:child_process";
// import gtts from "gtts";
// import { pathUploads } from "@/uploads/libs/helpers";
// import { BASE_URL } from "@/empresas/libs";
// import type { Response } from "express";

// @Controller("/voice")
// export class VoiceApiController {
//     @Get("/")
//     async index(@Req("empresa") empresa: Empresas, @Res() res: Response) {
//         try {
//             const twiml = new twilio.twiml.VoiceResponse();

//             // Redirige la llamada a otro número
//             twiml.say("Por favor, espere mientras lo conecto.");
//             twiml.dial("+51959884398"); // Reemplaza con el número al que deseas redirigir

//             res.type("text/xml");
//             res.send(twiml.toString());
//             const emp = await Empresas.findOne({
//                 where: { id: empresa.id },
//                 attributes: ["twilio"],
//             })!;
//             const client = twiml(
//                 "AC4694b15a578fee4be2ca807f0541cd00",
//                 "95c77b9d85aae67a110c8a5c43545a8e"
//             );
//             function getAudio(
//                 text: string,
//                 lang: "es" | "pt"
//             ): Promise<{ fileAudio: string; publicPath: string }> {
//                 return new Promise((res, rej) => {
//                     const gttsInstance = new gtts(text, lang);
//                     const audio = `${empresa.slug}/audios`;
//                     const filePath = `${pathUploads()}/${audio}`;
//                     if (!fs.existsSync(`${pathUploads()}/${empresa.slug}`)) {
//                         fs.mkdirSync(`${pathUploads()}/${empresa.slug}`);
//                     }
//                     if (!fs.existsSync(filePath)) {
//                         fs.mkdirSync(filePath);
//                     }
//                     const nameAudio = `${Date.now()
//                         .toString(32)
//                         .slice(3, 12)}.mp3`;
//                     const dirAudio = `${audio}/${nameAudio}`;
//                     const fileAudio = `${filePath}/${nameAudio}`;

//                     const publicPath = `${BASE_URL(
//                         empresa
//                     )}/empresas/${dirAudio}`;
//                     console.log({ fileAudio, publicPath });
//                     gttsInstance.save(fileAudio, (err) => {
//                         if (err) {
//                             return rej(err);
//                         }
//                         return res({ fileAudio, publicPath });
//                     });
//                 });
//             }
//             const { publicPath, fileAudio } = await getAudio(
//                 "¿Hola como estás?, soy de la ajajaj",
//                 "es"
//             );
//             const ola = await client.calls.create({
//                 url: publicPath,
//                 to: "+51959884398",
//                 from: "+15013800907",
//             });
//             fs.unlinkSync(fileAudio);

//             return "ok";
//         } catch (error) {
//             console.log({ err: error });
//         }
//     }
// }
