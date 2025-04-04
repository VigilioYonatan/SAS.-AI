import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { useEffect } from "preact/hooks";

function LanguageWidget() {
    if (!storageEmpresa?.setting?.multi_lenguaje) return null;
    useEffect(() => {
        if (storageEmpresa?.setting?.multi_lenguaje) {
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (window as any).gtranslateSettings = {
                default_language: storageEmpresa?.setting?.multi_lenguaje.type,
                languages: storageEmpresa?.setting?.multi_lenguaje.languages,
                wrapper_selector: ".gtranslate_wrapper",
            };
            const script = document.createElement("script");
            const type = storageEmpresa?.setting?.multi_lenguaje.type;
            script.src = `https://cdn.gtranslate.net/widgets/latest/${
                type === "globe"
                    ? "globe"
                    : type === "normal"
                    ? "float"
                    : "popup"
            }.js`;
            script.defer = true;
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        }
    }, []);

    return (
        <>
            <div class="gtranslate_wrapper" />
            {storageEmpresa?.setting.multi_lenguaje?.type === "normal" ? (
                <style jsx>{`
                    #gt_float_wrapper {
                        bottom: 4.5rem !important;
                        left: 0.5rem !important;
                    }
                `}</style>
            ) : null}
            {storageEmpresa?.setting.multi_lenguaje?.type === "globe" ? (
                <style jsx>{`
                    .gtranslate_wrapper {
                        position: fixed !important;
                        bottom: 4.5rem !important;
                        left: 0.5rem !important;
                    }

                    @media (min-width: 1080px) {
                        .gtranslate_wrapper {
                            left: 2.5rem !important;
                        }
                    }
                `}</style>
            ) : null}
            {storageEmpresa?.setting.multi_lenguaje?.type === "emergente" ? (
                <style jsx>{`
                    .gtranslate_wrapper .gt_switcher-popup span {
                        display: none !important;
                    }
                `}</style>
            ) : null}
        </>
    );
}

export default LanguageWidget;
