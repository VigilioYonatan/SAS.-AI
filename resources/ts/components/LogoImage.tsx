import { printLogoempresa } from "@/empresas/libs/helpers";
import useEmpresastore from "@/empresas/stores/empresa.store";

interface LogoImageProps {
    width?: string | number;
    height?: string | number;
}
function LogoImage({ height = "100", width = "100" }: LogoImageProps) {
    const { state } = useEmpresastore();

    return (
        <a href="/">
            {state?.logo ? (
                <img
                    class="object-contain"
                    width={width}
                    height={height}
                    style={{ width, height }}
                    src={printLogoempresa(state.logo, 300)[0]}
                    alt="auth Logo"
                />
            ) : (
                <span class="text-primary text-4xl font-bold">
                    {state?.name_empresa[0]}
                </span>
            )}
        </a>
    );
}

export default LogoImage;
