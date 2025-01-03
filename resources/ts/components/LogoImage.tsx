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
                <>
                    <img
                        class="object-contain image-logo"
                        width={width}
                        height={height}
                        style={{ width, height }}
                        src={printLogoempresa(state.logo, 300)[0]}
                        alt={state.name_empresa}
                        title={state.name_empresa}
                        onLoad={() =>
                            printLogoempresa(state.logo!, 300)[0]?.startsWith(
                                "blob:"
                            )
                                ? URL.revokeObjectURL(
                                      printLogoempresa(state.logo!, 300)[0]!
                                  )
                                : null
                        }
                    />
                    <style jsx>{`
                        .auth-page .image-logo,
                        app .image-logo,
                        .vigilio-modal .image-logo {
                            filter: drop-shadow(1px 1px black);
                        }
                    `}</style>
                </>
            ) : (
                <span class="text-primary text-4xl font-bold">
                    {state?.name_empresa[0]}
                </span>
            )}
        </a>
    );
}

export default LogoImage;
