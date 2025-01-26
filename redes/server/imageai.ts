import * as fs from "node:fs";
import openai from "openai";
import FormData from "form-data";
import axios from "axios";
// Configuración de OpenAI
const client = new openai.OpenAI({
    apiKey: "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",
});

// Función para procesar una imagen
async function interpretarImagen(rutaImagen: string): Promise<void> {
    try {
        // Configuración del formulario para enviar la imagen
        const imageFile = fs.readFileSync(rutaImagen);
        const APIKEY = "297b2552dd5f443160e85a1dbe2b8e60";
        // Crear el FormData para enviar la solicitud
        const formData = new FormData();
        formData.append("image", imageFile.toString("base64")); // Convertir la imagen a base64
        formData.append("key", APIKEY);
        formData.append("expiration", 600); // Opcional: Expiración en segundos (10 minutos)

        // Hacer la solicitud POST con Axios
        const response = await axios.post(
            "https://api.imgbb.com/1/upload",
            formData,
            {
                headers: {
                    ...formData.getHeaders(), // Encabezados necesarios para FormData
                },
            }
        );

        const result = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Que imagen es y describeme algo breve (max 100 letras) - lo importante lo que es?",
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: "https://i.ibb.co//71xSy39//a2dfff0ebd55.png",
                            },
                        },
                    ],
                },
            ],
            max_tokens: 300,
        });
        console.log(result.choices[0].message.content);

        return;
    } catch (error) {
        console.error("Error interpretando la imagen:", error);
    }
}

// Llamada a la función con la ruta de la imagen

interpretarImagen("./samsung2.jpg");
