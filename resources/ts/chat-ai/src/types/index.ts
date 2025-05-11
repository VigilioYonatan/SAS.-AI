export interface Props {
    base_url: string;
    api_key: string;
    name_ai?: string;
    color?: string; // color primary
    height?: number; //  height del chat
    button_width?: number;
    type_button?: "chat-gpt" | "bot" | "deepseek" | string; // imagen del boton
    chat_image?: string; // imagen del boton
    rounded_button?: number;
    lang?: "es" | "en"; // idioma del chat
    mobile_mode?: "normal" | "chat"; // mobile chat toda pantalla
    chat_width?: number;
    init_with_form?: boolean; // iniciar con el formulario
    form_title?: string;
    custom_greet_cloud?: string;
    custom_greet_chat?: string;
    isShowCloud?: boolean;
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"; // agregar position start, bottom-left, top-right
    zIndex?: number;
    test_url?: string | null;
}
