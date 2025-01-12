import { storageEmpresa } from "@/empresas/stores/empresa.store";
import Root from "react-shadow";
import { isColorLight } from "~/libs/helpers";
import useThemeStore from "~/stores/theme.store";
interface QuillTextProps {
    text: string;
}
function QuillText({ text }: QuillTextProps) {
    const themeStore = useThemeStore();
    return (
        <Root.div>
            <div
                class=" overflow-auto ql-container ql-editor ql-snow"
                dangerouslySetInnerHTML={{
                    __html: text,
                }}
                style={{
                    color:
                        themeStore.state === "dark" &&
                        !isColorLight(storageEmpresa!.setting.bg_color)
                            ? "white"
                            : "black",
                }}
            />
            <style jsx>{`
                .ql-container {
                    box-sizing: border-box;
                    font-family: Helvetica, Arial, sans-serif;
                    font-size: 13px;
                    height: 100%;
                    margin: 0;
                    position: relative;
                }

                .ql-container.ql-disabled .ql-tooltip {
                    visibility: hidden;
                }

                .ql-container:not(.ql-disabled)
                    li[data-list="checked"]
                    > .ql-ui,
                .ql-container:not(.ql-disabled)
                    li[data-list="unchecked"]
                    > .ql-ui {
                    cursor: pointer;
                }

                .ql-clipboard {
                    left: -100000px;
                    height: 1px;
                    overflow-y: hidden;
                    position: absolute;
                    top: 50%;
                }

                .ql-clipboard p {
                    margin: 0;
                    padding: 0;
                }

                .ql-editor {
                    box-sizing: border-box;
                    counter-reset: list-0 list-1 list-2 list-3 list-4 list-5
                        list-6 list-7 list-8 list-9;
                    line-height: 1.42;
                    height: 100%;
                    outline: none;
                    overflow-y: auto;
                    padding: 12px 15px;
                    tab-size: 4;
                    text-align: left;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }

                .ql-editor > * {
                    cursor: text;
                }

                .ql-editor p,
                .ql-editor ol,
                .ql-editor pre,
                .ql-editor blockquote,
                .ql-editor h1,
                .ql-editor h2,
                .ql-editor h3,
                .ql-editor h4,
                .ql-editor h5,
                .ql-editor h6 {
                    margin: 0;
                    padding: 0;
                }

                .ql-editor table {
                    border-collapse: collapse;
                }

                .ql-editor td {
                    border: 1px solid #000;
                    padding: 2px 5px;
                }

                .ql-editor ol {
                    padding-left: 1.5em;
                }

                .ql-editor li {
                    list-style-type: none;
                    padding-left: 1.5em;
                    position: relative;
                }

                .ql-editor li > .ql-ui:before {
                    display: inline-block;
                    margin-left: -1.5em;
                    margin-right: 0.3em;
                    text-align: right;
                    white-space: nowrap;
                    width: 1.2em;
                }

                .ql-editor li[data-list="checked"] > .ql-ui:before {
                    content: "\u2611"; /* Casilla marcada */
                }

                .ql-editor li[data-list="unchecked"] > .ql-ui:before {
                    content: "\u2610"; /* Casilla sin marcar */
                }

                .ql-editor li[data-list="bullet"] > .ql-ui:before {
                    content: "\u2022"; /* Viñeta */
                }

                .ql-editor li[data-list="ordered"] > .ql-ui:before {
                    content: counter(list-0, decimal) ". ";
                }

                .ql-editor li[data-list="ordered"].ql-indent-1 > .ql-ui:before {
                    content: counter(list-1, lower-alpha) ". ";
                }

                .ql-editor li[data-list="ordered"].ql-indent-2 > .ql-ui:before {
                    content: counter(list-2, lower-roman) ". ";
                }

                .ql-editor li[data-list="ordered"].ql-indent-3 > .ql-ui:before {
                    content: counter(list-3, decimal) ". ";
                }

                .ql-editor img {
                    max-width: 100%;
                }

                .ql-editor code {
                    background-color: #f0f0f0;
                    border-radius: 3px;
                    font-size: 85%;
                    padding: 2px 4px;
                }

                .ql-editor blockquote {
                    border-left: 4px solid #ccc;
                    margin-bottom: 5px;
                    margin-top: 5px;
                    padding-left: 16px;
                }

                .ql-snow.ql-toolbar {
                    border: 1px solid #ccc;
                    padding: 8px;
                    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                }

                .ql-snow.ql-toolbar .ql-formats {
                    margin-right: 15px;
                }

                .ql-snow.ql-toolbar button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    display: inline-block;
                    float: left;
                    height: 24px;
                    padding: 3px 5px;
                    width: 28px;
                }

                .ql-snow.ql-toolbar button:hover {
                    color: #06c;
                }

                .ql-snow.ql-tooltip {
                    background-color: #fff;
                    border: 1px solid #ccc;
                    box-shadow: 0 0 5px #ddd;
                    padding: 5px 12px;
                }

                .ql-snow.ql-tooltip input[type="text"] {
                    border: 1px solid #ccc;
                    font-size: 13px;
                    height: 26px;
                    margin: 0;
                    padding: 3px 5px;
                    width: 170px;
                }

                .ql-snow a {
                    color: #06c;
                }
            `}</style>
        </Root.div>
    );
}

export default QuillText;
