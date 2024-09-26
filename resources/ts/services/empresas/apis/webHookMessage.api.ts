import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";

export function webHookMessageApi() {
    return useQuery<{ success: true; message: string }, unknown>(
        `/webs/${enviroments.VITE_VIGILIO_TOKEN}`,
        async (url) => {
            const responseGobal = await fetch(
                `${enviroments.VITE_VIGILIO_WEB}/api/global/latest`
            );
            const resultGlobal = await responseGobal.json();
            if (resultGlobal.success) {
                return {
                    success: true,
                    message: resultGlobal.global.message,
                };
            }
            const response = await fetch(
                `${enviroments.VITE_VIGILIO_WEB}/api${url}`
            );
            const result = await response.json();
            if (!result.success) throw result;
            return {
                success: true,
                message: result.web.message,
            };
        },
        { retry: 1, isCaching: 1 * 3600 }
    );
}
