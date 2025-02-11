import { createOpenAI, type OpenAIProvider, openai } from '@ai-sdk/openai'
import { createDeepSeek, type DeepSeekProvider  } from '@ai-sdk/deepseek'
import { generateText, } from 'ai'

const DEEPSEEK_API_KEY = "sk-790c7bd8e0504c9c811015@cc57155947"; // Reemplaza con tu clave API de DeepSeek
const OPENAI_KEY = "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@"; // Reemplaza con tu clave API de DeepSeek
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
const model :"open_ai"|"deepseek"="deepseek"
async function queryDeepSeekReasoner(prompt: string): Promise<void> {
    try {
        let modelo :OpenAIProvider|DeepSeekProvider|null=null
        if(model ==="open_ai"){
            modelo= createOpenAI({
                baseURL: 'https://api.groq.com/openai/v1',
                apiKey:OPENAI_KEY,
            })
        }
        if(model ==="deepseek"){
            modelo=createDeepSeek({
                baseURL: "https://api.deepseek.com",
                apiKey: DEEPSEEK_API_KEY,
            })
        }
        const data = await generateText({
            model: modelo!(model ==="open_ai" ?"gpt-4o-mini":"deepseek-chat") ,
            messages: [
                { role: "user", content: "Eres un asistente útil." },
                {
                    role: "assistant",
                    content: "¿Qué modelo de ia eres, modelo?",
                },
                {
                    role: "user",
                    content: "¿Qué em recomiendas?",
                },
                {
                    role: "assistant",
                    content: "¿Qué modelo de ia eres, modelo?",
                },
                {
                    role: "user",
                    content: "¿Qué em recomiendas?",
                },
            ],
        });
        console.error(JSON.stringify(data,null,3));

        const content = data.text;
        console.log({ content });
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
