import { useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
export interface ConverterBody {
    amount: string;
    from: string;
    to: string;
}
export function websConverterApi() {
    return useMutation<WebsConverterAPI, ConverterBody, unknown>(
        "/peru/converter-money",
        async (url, body) => {
            const data = new URLSearchParams();
            data.append("amount", body.amount);
            data.append("from", body.from);
            data.append("to", body.to);
            const response = await fetch(
                `${enviroments.VITE_VIGILIO_WEB}/api${url}?${data}`,
                {
                    headers: {
                        "access-token": enviroments.VITE_TOKEN_VIGILIO_SERVICES,
                    },
                }
            );
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        },
        { retry: 2, isCaching: 24 * 60 * 1000 * 60 }
    );
}
interface WebsConverterAPI {
    success: true;
    result: {
        resultado: string;
        today: string;
        resultadoNumber: string;
        todayNumber: string;
    };
}
