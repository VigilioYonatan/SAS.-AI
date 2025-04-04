import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import { ScrappingUpdateDto } from "../dtos/scrapping.update.dto";
import { ScrappingSchema } from "../schemas/scrapping.schema";
export function empresaScrappingUpdateApi(): UseMutation<
    EmpresaScrappingUpdateApi,
    ScrappingUpdateDto,
    EmpresaScrappingUpdateApiError
> {
    return useMutation("/empresas/scrapping", async (url, body) => {
        const response = await fetch(`/api${url}`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "content-type": "application/json",
            },
        });
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

interface EmpresaScrappingUpdateApi {
    success: true;
    message: string;
}
interface EmpresaScrappingUpdateApiError {
    success: true;
    message: string;
    body: keyof ScrappingUpdateDto;
}

export function empresaScrappingTestCategoriesApi(): UseMutation<
    EmpresaScrappingUpdateApi,
    Pick<ScrappingSchema, "categories">,
    EmpresaScrappingUpdateApiError
> {
    return useMutation(
        "/empresas/scrapping/test-categories",
        async (url, body) => {
            const response = await fetch(`/api${url}`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "content-type": "application/json",
                },
            });
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

interface EmpresaScrappingUpdateApi {
    success: true;
    message: string;
}
interface EmpresaScrappingUpdateApiError {
    success: true;
    message: string;
    body: keyof ScrappingUpdateDto;
}
