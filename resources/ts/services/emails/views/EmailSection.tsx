import TitleSection from "@/web/components/TitleSection";
import FormContact from "./FormContact";

function EmailSection() {
    return (
        <div class="contact-section max-w-6xl mx-auto ">
            <TitleSection>Contacto</TitleSection>
            <div>
                <FormContact />
            </div>
        </div>
    );
}

export default EmailSection;
