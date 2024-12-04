import { storageEmpresa } from "@/empresas/stores/empresa.store";

interface TitleSectionProps {
    children: JSX.Element | JSX.Element[] | string;
    isFooter?: boolean;
}
function TitleSectionTwo({ children, isFooter = false }: TitleSectionProps) {
    const title = storageEmpresa?.setting.border_title_type;
    return (
        <div
            class={`w-full flex   title-section-2    ${
                title === "border" && !isFooter
                    ? "title-container-2"
                    : `${isFooter ? "" : "justify-center"} `
            } items-center`}
        >
            <h3
                class={`uppercase inline-block dark:text-white  font-bold my-4  ${
                    title === "border"
                        ? "border-b-[3px] border-primary mb-2 self-start "
                        : title === "normal"
                        ? "title-container-2"
                        : ""
                }`}
            >
                {children}
            </h3>
            {title === "normal" ? (
                <style jsx>
                    {`
                        .title-container-2 {
                            position: relative;
                        }

                        .title-container-2::before {
                            content: "";
                            position: absolute;
                            display: inline-block;
                            bottom: -5px;
                            left: 0;
                            width: 50%;
                            height: 2px;
                            background-color: var(--primary);
                        }
                    `}
                </style>
            ) : title === "border" ? (
                <style jsx>
                    {`
                        .title-container-2 {
                            position: relative;
                        }

                        .title-container-2::before {
                            content: "";
                            position: absolute;
                            display: inline-block;
                            bottom: 7px;
                            // left: 45%;
                            // width: 10%;
                            width: 100%;
                            height: 1.5px;
                            background-color: #ebebeb;
                        }
                    `}
                </style>
            ) : null}
        </div>
    );
}

export default TitleSectionTwo;
