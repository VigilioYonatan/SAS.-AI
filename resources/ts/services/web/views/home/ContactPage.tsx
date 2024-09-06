import TitleSection from "@/web/components/TitleSection";
import type { HeaderType } from "@/web/components/WebLayout";
import WebLayout from "@/web/components/WebLayout";

export interface HomePageProps {
	header: HeaderType;
}
function ContactPage({ header }: HomePageProps) {
	return (
		<>
			<WebLayout header={header}>
				<TitleSection>Contactános</TitleSection>
			</WebLayout>
		</>
	);
}

export default ContactPage;
