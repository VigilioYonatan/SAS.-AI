import { storageEmpresa } from "@/empresas/stores/empresa.store";

interface TitleSectionProps {
    children: JSX.Element | JSX.Element[] | string;
    titleExample?: string;
}
function TitleSection({ children, titleExample }: TitleSectionProps) {
    const title = titleExample
        ? titleExample
        : storageEmpresa?.setting.border_title_type;
    storageEmpresa?.setting.border_title_type;
    return (
        <>
            <h3 class="text-xl md:text-2xl  font-bold text-center  dark:text-white my-4 title-container-1 flex justify-center flex-col items-center">
                {children}
                {title === "normal" ? (
                    <style jsx>
                        {`
                            .title-container-1 {
                                position: relative;
                            }

                            .title-container-1::before {
                                content: "";
                                position: absolute;
                                display: inline-block;
                                bottom: -9px;
                                left: 45%;
                                width: 10%;
                                height: 4px;
                                background-color: var(--primary);
                            }
                        `}
                    </style>
                ) : title === "circle" ? (
                    <div class="flex items-center">
                        <div class="w-[20px] h-[20px] rounded-full bg-primary" />
                        <div class="w-[20px] h-[20px] rounded-full bg-primary" />
                        <div class="w-[20px] h-[20px] rounded-full bg-primary" />
                    </div>
                ) : null}
            </h3>
        </>
    );
}

export default TitleSection;
