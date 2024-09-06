import TitleSection from "@/web/components/TitleSection";
import type { HeaderType } from "@/web/components/WebLayout";
import WebLayout from "@/web/components/WebLayout";

export interface HomePageProps {
	header: HeaderType;
}
function AboutPage({ header }: HomePageProps) {
	return (
		<>
			<WebLayout header={header}>
				<TitleSection>Nosotros</TitleSection>
			</WebLayout>
		</>
	);
}

export default AboutPage;
