import useEmpresastore, {
	storageEmpresa,
} from "@/empresas/stores/empresa.store";
import TitleSection from "@/web/components/TitleSection";
import WebBreadCrumb from "@/web/components/WebBreadCrumb";
import WebLayout, { type HeaderType } from "@/web/components/WebLayout";
import { printFileWithDimension } from "~/libs/upload";
import IsTemplate from "../home/components/IsTemplate";

interface PrivacidadPageProps {
	header: HeaderType;
}
function PrivacidadPage({ header }: PrivacidadPageProps) {
	const empresaStore = useEmpresastore();
	return (
		<WebLayout header={header}>
			{storageEmpresa?.isTemplate ? (
				<IsTemplate />
			) : (
				<>
					<div class="mt-6  max-w-6xl mx-auto">
						<WebBreadCrumb current="Politicas de privacidad" />
					</div>
					<section class="max-w-6xl mx-auto dark:text-white my-12 lg:my-4 bg-background-light rounded-md dark:bg-background-dark p-4 relative overflow-hidden">
						<TitleSection>Política de privacidad</TitleSection>
						{storageEmpresa?.logo ? (
							<img
								class="absolute -bottom-20 -right-20 opacity-30"
								src={printFileWithDimension(storageEmpresa?.logo, 300)[0]}
								width={300}
								height={300}
								alt={storageEmpresa.name_empresa}
							/>
						) : null}
						<br />
						<div class="px-4  prose relative  text-sm">
							{empresaStore.state!.logo ? (
								<img
									src={printFileWithDimension(empresaStore.state!.logo, 300)[0]}
									width={300}
									height={300}
									class="absolute right-20 -z-10 opacity-10  bottom-20"
									alt={empresaStore.state!.name_empresa}
								/>
							) : null}
							<p>
								En cumplimiento de lo dispuesto por la Ley, Ley de Protección de
								Datos Personales y su reglamento aprobado por Decreto Supremo,{" "}
								{empresaStore.state!.name_empresa} desea poner en conocimiento
								de sus usuarios, los siguientes aspectos relacionados con sus
								datos personales:
							</p>
							<br />
							<h2 class="font-semibold">1. OBJETIVO.</h2>
							<p>
								El objetivo de la presente política es la declaración y
								compromiso formal de la EMPRESA{" "}
								{empresaStore.state!.name_empresa} con , en informar a los
								usuarios de los diferentes servicios prestados a través de su
								portal web, acerca del tratamiento y usos a los que se someten
								los datos de carácter personal que se obtengan.
							</p>
							<br />

							<h2 class="font-semibold">2. REFERENCIAS NORMATIVAS.</h2>
							<ul>
								<li>2.1. Ley de Protección de Datos Personales.</li>
							</ul>
							<br />

							<h2 class="font-semibold">3. PRINCIPIOS.</h2>
							<p>
								En la empresa {empresaStore.state!.name_empresa} respetamos los
								principios de protección de datos personales
							</p>
							<ul>
								<li>
									3.1. Principio de legalidad, se rechaza la recopilación de los
									datos personales de los usuarios por medios ilegales y
									fraudulentos.
								</li>
								<li>
									3.2. Principio de consentimiento, se obtendrá el
									consentimiento de los usuarios de manera libre, informado,
									expreso, inequívoco y previo al tratamiento de sus datos
									personales.
								</li>
								<li>
									3.3. Principio de finalidad, los datos personales de nuestros
									usuarios se recopilarán para una finalidad determinada,
									explícita y lícita, y no se extenderá a otra finalidad que no
									haya sido la establecida de manera inequívoca como tal al
									momento de su recopilación.
								</li>
								<li>
									3.4. Principio de proporcionalidad, todo tratamiento de datos
									personales de nuestros usuarios será adecuado, relevante y no
									excesivo a la finalidad para la que estos hubiesen sido
									recopilados.
								</li>
								<li>
									3.5. Principio de calidad, los datos personales que vayan a
									ser tratados serán veraces, exactos y, en la medida de lo
									posible, actualizados, necesarios, pertinentes y adecuados
									respecto de la finalidad para la que fueron recopilados. Se
									conservarán de forma tal que se garantice su seguridad y solo
									por el tiempo necesario para cumplir con la finalidad del
									tratamiento.
								</li>
								<li>
									3.6. Principio de seguridad, la empresa{" "}
									{empresaStore.state!.name_empresa}. adopta las medidas
									técnicas, organizativas y legales necesarias para garantizar
									la seguridad y confidencialidad de los datos personales. La
									empresa {empresaStore.state!.name_empresa}
									cuenta con las medidas de seguridad apropiadas, y acordes con
									el tratamiento que se vaya a efectuar y con la categoría de
									datos personales de que se trate.
								</li>
							</ul>
							<br />

							<h2 class="font-semibold">4. DEFINICIÓN DE DATOS PERSONALES.</h2>
							<p>
								4.1. De acuerdo con la ley, se define el término Datos
								Personales como "aquella información numérica, alfabética,
								gráfica, fotográfica, acústica, sobre hábitos personales, o de
								cualquier otro tipo concerniente a las personas naturales que
								las identifica o las hace identificables a través de medios que
								puedan ser razonablemente utilizados." La empresa{" "}
								{empresaStore.state!.name_empresa}. considera como datos
								personales, a toda aquella información que el Usuario ingrese
								voluntariamente a través de cualquiera de nuestros formularios
								en nuestros sitios web o la que se envía por correo electrónico.
							</p>
							<br />

							<h2 class="font-semibold">5. TITULARIDAD DE LA BASE DE DATOS.</h2>
							<p>
								5.1. Los datos personales que puedan ser suministrados a través
								del sitio web u otro medio serán incorporados a los bancos de
								datos bajo la titularidad de la empresa{" "}
								{empresaStore.state!.name_empresa}.
							</p>
							<br />

							<h2 class="font-semibold">
								6. FINALIDADES DEL TRATAMIENTO DE LA INFORMACIÓN.
							</h2>
							<p>
								6.1. Ley de Protección de Datos Personales, el interesado
								otorgará su consentimiento expreso para que los datos personales
								que facilite queden incorporados en el Banco de Datos Personales
								de Personas Interesadas en la empresa{" "}
								{empresaStore.state!.name_empresa}. y sean tratados por esta con
								la finalidad de poder almacenarla, procesarla y absolver sus
								consultas; dándoles usos que incluyen temas referidos al
								análisis de perfiles, publicidad (boletín de noticias),
								prospección comercial y fines estadísticos. El usuario autoriza
								a que la empresa {empresaStore.state!.name_empresa}. mantenga
								sus datos personales en el banco de datos referido en tanto sean
								útiles para la finalidad y usos antes mencionados.
							</p>
							<p>
								El titular de datos personales tiene derecho a ser informado en
								forma detallada, sencilla, expresa, inequívoca y de manera
								previa a su recopilación, sobre la finalidad para la que sus
								datos personales serán tratados; quiénes son o pueden ser sus
								destinatarios, la existencia del banco de datos en que se
								almacenarán, así como la identidad y domicilio de su titular y,
								de ser el caso, del encargado del tratamiento de sus datos
								personales; el carácter obligatorio o facultativo de sus
								respuestas al cuestionario que se le proponga, en especial en
								cuanto a los datos sensibles; la transferencia de los datos
								personales; las consecuencias de proporcionar sus datos
								personales y de su negativa a hacerlo; el tiempo durante el cual
								se conserven sus datos personales; y la posibilidad de ejercer
								los derechos que la ley le concede y los medios previstos para
								ello. Si los datos personales son recogidos en línea a través de
								redes de comunicaciones electrónicas, las obligaciones del
								presente artículo pueden satisfacerse mediante la publicación de
								políticas de privacidad, las que deben ser fácilmente accesibles
								e identificables
							</p>
							<br />

							<h2 class="font-semibold">7. DECLARACIÓN DE PRIVACIDAD.</h2>
							<p>
								7.1. La empresa {empresaStore.state!.name_empresa} no recopila
								datos personales sobre el Usuario, excepto cuando él mismo
								brinde información voluntariamente, al registrarse en el sitios
								web o cuando envíe un correo electrónico u otra comunicación
								dirigida a la empresa {empresaStore.state!.name_empresa}. La{" "}
								{empresaStore.state!.name_empresa} no procesará ni transferirá
								los datos personales sin previo consentimiento del Usuario.
							</p>
							<br />

							<h2 class="font-semibold">
								8. SEGURIDAD Y CONFIDENCIALIDAD DE LOS DATOS.
							</h2>
							<p>
								8.1. La empresa {empresaStore.state!.name_empresa} se compromete
								a cumplir con los estándares de seguridad y confidencialidad
								necesarios para asegurar la confiabilidad, integridad y
								disponibilidad de la información recopilada de los usuarios. El
								Usuario es el único responsable de suministrar sus datos
								personales a la empresa {empresaStore.state!.name_empresa}.
							</p>
							<br />

							<h2 class="font-semibold">9. DERECHOS DE LOS USUARIOS.</h2>
							<p>
								9.1. De conformidad con la Ley, el Usuario podrá solicitar, en
								cualquier momento, sus derechos de acceso, actualización,
								rectificación, inclusión, oposición y supresión o cancelación de
								datos personales enviando una solicitud firmada a la dirección
								de correo electrónico
								{empresaStore.state!.name_empresa} .
							</p>
							<h2 class="font-semibold">
								DEL CONSENTIMIENTO DEL USUARIO Y ACEPTACIÓN DE LOS TÉRMINOS
							</h2>
							<p>
								10.1. Esta declaración de privacidad y confidencialidad descrita
								en la presente política constituye un acuerdo válido entre el
								Usuario y la empresa {empresaStore.state!.name_empresa}. , que
								confirma el conocimiento, entendimiento y aceptación por parte
								del Usuario de lo expuesto con los fines expresados. Si lo
								autorizas, podremos incluir tu información en nuestras bases de
								datos personales para poder almacenarla y procesarla; así mismo,
								podremos ofrecerte cualquiera de los productos o servicios de{" "}
								{empresaStore.state!.name_empresa} a través de cualquier medio
								verbal, escrito o electrónico. En caso no estar de acuerdo, el
								usuario no deberá proporcionar ninguna información personal, ni
								utilizar el servicio o cualquier información relacionada con los
								sitios web de la empresa {empresaStore.state!.name_empresa}.
							</p>
							<br />
							<h3 class="font-semibold">Características del consentimiento</h3>
							<ul>
								<li>
									Libre: Sin que medie error, mala fe, violencia o dolo que
									puedan afectar la manifestación de voluntad del titular de los
									datos personales. La entrega de obsequios o el otorgamiento de
									beneficios al titular de los datos personales con ocasión de
									su consentimiento no afectan la condición de libertad que
									tiene para otorgarlo, salvo en el caso de menores de edad, en
									los supuestos en que se admite su consentimiento, en que no se
									considerará libre el consentimiento otorgado mediando
									obsequios o beneficios. El condicionamiento de la prestación
									de un servicio, o la advertencia o amenaza de denegar el
									acceso a beneficios o servicios que normalmente son de acceso
									no restringido, sí afecta la libertad de quien otorga
									consentimiento para el tratamiento de sus datos personales, si
									los datos solicitados no son indispensables para la prestación
									de los beneficios o servicios.
								</li>
								<li>
									Previo: Con anterioridad a la recopilación de los datos o en
									su caso, anterior al tratamiento distinto a aquel por el cual
									ya se recopilaron.
								</li>
								<li>
									Expreso e Inequívoco: Cuando el consentimiento haya sido
									manifestado en condiciones que no admitan dudas de su
									otorgamiento. Se considera que el consentimiento expreso se
									otorgó verbalmente cuando el titular lo exterioriza oralmente
									de manera presencial o mediante el uso de cualquier tecnología
									que permita la interlocución oral. Se considera consentimiento
									escrito a aquél que otorga el titular mediante un documento
									con su firma autógrafa, huella dactilar o cualquier otro
									mecanismo autorizado por el ordenamiento jurídico que queda o
									pueda ser impreso en una superficie de papel o similar.
								</li>
								<li>
									Informado: Cuando al titular de los datos personales se le
									comunique clara, expresa e indubitablemente, con lenguaje
									sencillo, cuando menos de lo siguiente:
									<ul>
										<li>
											La identidad y domicilio o dirección del titular del banco
											de datos personales o del responsable del tratamiento al
											que puede dirigirse para revocar el consentimiento o
											ejercer sus derechos.
										</li>
										<li>
											La finalidad o finalidades del tratamiento a las que sus
											datos serán sometidos.
										</li>
										<li>
											La identidad de los que son o pueden ser sus
											destinatarios, de ser el caso.
										</li>
										<li>
											La existencia del banco de datos personales en que se
											almacenarán, cuando corresponda.
										</li>
										<li>
											El carácter obligatorio o facultativo de sus respuestas al
											cuestionario que se le proponga, cuando sea el caso.
										</li>
										<li>
											Las consecuencias de proporcionar sus datos personales y
											de su negativa a hacerlo.
										</li>
										<li>
											En su caso, la transferencia nacional e internacional de
											datos que se efectúen.
										</li>
									</ul>
								</li>
							</ul>
						</div>
					</section>
				</>
			)}
		</WebLayout>
	);
}

export default PrivacidadPage;
