import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";

export function vigilioServicesQuery() {
    return useQuery(
        `${enviroments.VITE_VIGILIO_WEB}/api/empresa/client`,
        async (url) => {
            const response = await fetch(url);
            const result: {
                success: true;
                empresa: {
                    whatsappVersion: string;
                    modelai: string;
                    facebook: string;
                    instagram: string;
                    youtube: string;
                    tiktok: string;
                    linkedin: string;
                    twitter: string;
                };
            } = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}
