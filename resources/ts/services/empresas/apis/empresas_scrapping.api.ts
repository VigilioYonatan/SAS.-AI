import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import { ScrappingUpdateDto } from "../dtos/scrapping.update.dto";
import {
    CategoryIA,
    ProductIA,
    ScrappingSchema,
} from "../schemas/scrapping.schema";
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
    data: CategoryIA[];
}
interface EmpresaScrappingUpdateApiError {
    success: true;
    message: string;
    body: keyof ScrappingUpdateDto;
}
//
export function empresaScrappingTestProductsApi(): UseMutation<
    EmpresaScrappingProductsUpdateApi,
    Pick<ScrappingSchema, "products"> & {
        categories: { id: string | null; url: string }[];
        categoria_url: string | null;
        web_url: string;
    },
    EmpresaScrappingProductsUpdateApiError
> {
    return useMutation(
        "/empresas/scrapping/test-products",
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

interface EmpresaScrappingProductsUpdateApi {
    success: true;
    data: ProductIA[][];
}
interface EmpresaScrappingProductsUpdateApiError {
    success: true;
    message: string;
    body: keyof ScrappingUpdateDto;
}
//
export function empresaScrappingTestPagesApi(): UseMutation<
    EmpresaScrappingProductsUpdateApi,
    Pick<ScrappingSchema, "pages">,
    EmpresaScrappingProductsUpdateApiError
> {
    return useMutation("/empresas/scrapping/test-pages", async (url, body) => {
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
    });
}

interface EmpresaScrappingProductsUpdateApi {
    success: true;
    data: ProductIA[][];
}
interface EmpresaScrappingProductsUpdateApiError {
    success: true;
    message: string;
    body: keyof ScrappingUpdateDto;
}
