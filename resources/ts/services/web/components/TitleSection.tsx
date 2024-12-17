import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { getColorPrimary } from "~/libs/helpers";

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
        <div
            class={`w-full flex  title-section     ${
                title === "border" ? "title-container-1" : " justify-center"
            } items-center`}
        >
            <h2
                class={`text-xl my-6 md:text-2xl uppercase pb-2 ${
                    title === "border"
                        ? "border-b-[4px] border-primary self-start "
                        : title === "normal"
                        ? "title-container-1 text-center"
                        : " text-center"
                }   font-bold  dark:text-white flex justify-center flex-col items-center `}
            >
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
                                left: 25%;
                                width: 50%;
                                height: 4px;
                                background-color: ${getColorPrimary()};
                            }
                        `}
                    </style>
                ) : title === "circle" ? (
                    <div class="flex items-center">
                        <div class="w-[20px] h-[20px] rounded-full bg-primary" />
                        <div class="w-[20px] h-[20px] rounded-full bg-primary" />
                        <div class="w-[20px] h-[20px] rounded-full bg-primary" />
                    </div>
                ) : title === "border" ? (
                    <>
                        <style jsx>
                            {`
                                .title-container-1 {
                                    position: relative;
                                }

                                .title-container-1::before {
                                    content: "";
                                    position: absolute;
                                    display: inline-block;
                                    bottom: 24px;
                                    // left: 45%;
                                    // width: 10%;
                                    width: 100%;
                                    height: 1.5px;
                                    ${title === "border"
                                        ? "background-color: #ebebeb;"
                                        : ""}
                                }
                            `}
                        </style>
                    </>
                ) : null}
            </h2>
        </div>
    );
}

export default TitleSection;
