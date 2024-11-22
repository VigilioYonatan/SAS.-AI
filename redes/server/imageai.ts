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
        const formData = new FormData();
        formData.append("file", fs.createReadStream(rutaImagen));
        const resultFile = await axios.post("https://file.io", formData, {
            headers: formData.getHeaders(),
        });

        // Llamada a la API de OpenAI
        const response = await client.chat.completions.create({
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
                                url: resultFile.data.link,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 300,
        });

        return;
    } catch (error) {
        console.error("Error interpretando la imagen:", error);
    }
}

// Llamada a la función con la ruta de la imagen

interpretarImagen("./samsung.jpg");
