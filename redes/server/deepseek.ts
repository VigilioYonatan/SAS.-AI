import openai from "openai";
const DEEPSEEK_API_KEY = "sk-790c7bd8e0504c9c811015cc57155947"; // Reemplaza con tu clave API de DeepSeek
const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/v1/chat/completions"; // Endpoint de DeepSeek
interface DeepSeekMessage {
    role: string;
    content: string;
}

interface DeepSeekRequest {
    model: string;
    messages: DeepSeekMessage[];
}

interface DeepSeekResponse {
    choices: {
        message: {
            content: string;
            reasoning_content?: string;
        };
    }[];
}

async function queryDeepSeekReasoner(prompt: string): Promise<void> {
    try {
        const requestData: DeepSeekRequest = {
            model: "deepseek-reasoner", // Especifica el modelo
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        };

        // const response = await fetch(DEEPSEEK_ENDPOINT, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: `Bearer ${DEEPSEEK_API_KEY}`, // Autenticación
        //     },
        //     body: JSON.stringify(requestData),
        // });

        // if (!response.ok) {
        //     throw new Error(`Error: ${response.status} ${response.statusText}`);
        // }

        // const data: DeepSeekResponse = await response.json();
        const openAiClient = new openai.OpenAI({
            apiKey: DEEPSEEK_API_KEY,
            baseURL: "https://api.deepseek.com",
        });
        const data = await openAiClient.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                { role: "user", content: "Eres un asistente útil." },
                {
                    role: "assistant",
                    content: "¿Qué modelo de ia eres, modelo?",
                },
            ],
        });

        const content = data.choices[0].message.content;
    } catch (error) {
        console.error("Error al hacer la solicitud a DeepSeek:", error);
    }
}
queryDeepSeekReasoner("hola");
// // Ejemplo de uso
// queryDeepSeekReasoner("9.11 and 9.8, which is greater?");

// const openai = new openAi({
//     apiKey: DEEPSEEK_API_KEY, // Reemplaza con tu clave de API
//     baseURL: "https://api.deepseek.com", // Cambia el endpoint base si DeepSeek lo requiere
// });

// (async () => {
//     try {
//         console.log("hola");

//         // Ronda 1
//         const messages: ChatCompletionMessageParam[] = [
//             { role: "user", content: "9.11 and 9.8, which is greater?" },
//         ];

//         const response = await openai.chat.completions.create({
//             model: "deepseek-reasoner", // Cambia el modelo según sea necesario
//             messages,
//         });
//         console.log({ response });

//         const reasoningContent =
//             response.data.choices[0].message.reasoning_content;
//         console.log({ reasoningContent });
//     } catch (error) {
//         console.error("Error:", error.response?.data || error.message);
//     }
// })();
