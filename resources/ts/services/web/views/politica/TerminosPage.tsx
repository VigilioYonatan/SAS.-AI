import useEmpresastore, {
	storageEmpresa,
} from "@/empresas/stores/empresa.store";
import TitleSection from "@/web/components/TitleSection";
import WebBreadCrumb from "@/web/components/WebBreadCrumb";
import type { HeaderType } from "@/web/components/WebLayout";
import WebLayout from "@/web/components/WebLayout";
import { printFileWithDimension } from "~/libs/upload";

interface TerminosPageProps {
	header: HeaderType;
}
function TerminosPage({ header }: TerminosPageProps) {
	const empresa = useEmpresastore();
	return (
		<WebLayout header={header}>
			<div class="mt-6  max-w-6xl mx-auto">
				<WebBreadCrumb current="Terminos y condiciones" />
			</div>
			<section class="max-w-6xl mx-auto  my-12 lg:my-4 p-4 bg-background-light rounded-md dark:bg-background-dark  text-sm relative overflow-hidden">
				<TitleSection>Términos y condiciones</TitleSection>
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
				<div class="dark:text-white">
					<div class="container px-4 py-8 prose">
						<h1 class="font-semibold">MEDIOS DE PAGO</h1>
						<p>
							La plataforma online de {empresa.state!.name_empresa} el pago
							desde diversas pasarelas de pago entre ellas el pago online con
							tarjetas de crédito, débito de las marcas Visa y MasterCard
							tambien es posible realizar pagos con billeteras digitales y pago
							contraentrega.
						</p>
						<h2>TARJETAS DE CRÉDITO Y DÉBITO</h2>
						<p>
							Podrás realizar tus compras online con las tarjetas de crédito y
							débito, de las marcas Visa y MasterCard.
						</p>
						{storageEmpresa?.enabledClientPayComision ? (
							<p>
								Estas aplican un recargo del{" "}
								{empresa.state!.mercado_pago_comision.comision}% en caso use
								mercardo Pago ambos son adicionales al costo del producto, al
								finalizar tu compra por internet recibirás una confirmación de
								tu pedido donde podrás visualizar el detalle de la compra para
								que puedas verificar el monto final cobrado por la entidad
								bancaria.
							</p>
						) : null}

						<p>
							El producto será despachado una vez confirmado el abono de la
							entidad bancaria.
						</p>
						<p>
							El pago online es a través de la pasarela de mercado pago y paypal
							estas pasarela cumple con el certificado de PCI Compliance, el
							cual asegura el estándar de seguridad para uso de tarjetas de
							crédito y débito y así, reducir la probabilidad de fraudes.
						</p>
						<p>
							El uso de esta pasarela de pagos y los términos de uso se ajustan
							a los publicados en su web oficial
							<a href="https://www.mercadopago.com">Mercado Pago</a> y
						</p>
						<p>
							En el caso de las tarjetas Visa y MasterCard aceptadas en esta
							página transaccional, aspectos relacionados a estas como la fecha
							de emisión, caducidad, bloqueos, monto de línea de crédito, entre
							otros, se regirán por el respectivo Contrato de Apertura y
							Reglamento de Uso firmado entre el usuario y la entidad financiera
							correspondiente.
							{empresa.state!.name_empresa} no tendrá responsabilidad en
							cualquiera de los puntos señalados.
						</p>
						<br />
						<p class="font-semibold">IMPORTANTE</p>
						<p>
							{empresa.state!.name_empresa} se reserva el derecho de modificar
							su oferta de medios de pago sin previo aviso.
						</p>
						<h2 class="font-semibold">
							Precios, productos, promociones y stocks.
						</h2>
						<p>
							De existir algún error en la comunicación de nuestras promociones
							u ofertas, {empresa.state!.name_empresa} se comunicará con el
							usuario antes de que el pedido sea procesado y se procederá a
							cancelar el pedido o se emitirá una nota de crédito como
							devolución de efectivo a la cuenta de origen si fue una
							transferencia o se reembolsará al titular que figure en el voucher
							del abono para subsanar el inconveniente.
						</p>
						<br />

						<h3 class="font-semibold">
							MEDIDAS TOMADAS SI NO SE ENTREGA EL PAQUETE EN PRIMERA INSTANCIA :
						</h3>
						<p>
							En caso de que no se encuentre una persona para la entrega de
							pedido en la dirección brindada, se le notificará al cliente y el
							pedido retornará al centro de distribución de{" "}
							{empresa.state!.name_empresa}.
						</p>
						<p>
							Desde aquí, se contactará al cliente para coordinar a partir de
							qué fecha y en qué tienda {empresa.state!.name_empresa} deberá
							recoger su pedido. Esta situación anulará la promesa de envío.
						</p>
						<br />

						<h2 class="font-semibold">ZONAS DE REPARTO Y COSTO DE ENVÍOS</h2>
						<p>
							Con respecto a las zonas de reparto se encuentra contemplado todos
							las ciudades de {storageEmpresa?.money.money} el costo de delivery
							varian según la zona de reparto, consulte previamente con su
							Asesor de ventas:
						</p>
						<br />

						<h3 class="font-semibold">PROMESA DE ENTREGA</h3>
						<p>
							El delivery sólo es válido en el primer intento de entrega y hasta
							la puerta principal del condominio o edificio y en caso de
							empresas: hasta la zona de recepción.
						</p>
						<br />

						<h2 class="font-semibold">POLÍTICAS DE GARANTÍAS</h2>
						<p>
							El delivery sólo es válido en el primer intento de entrega y hasta
							la puerta principal del condominio o edificio y en caso de
							empresas: hasta la zona de recepción.
						</p>
						<br />

						<h3 class="font-semibold">Condiciones Generales</h3>
						<p>
							La garantía se aplica solo al cliente de{" "}
							{empresa.state!.name_empresa}. y no se extiende a terceros.
						</p>
						<p>
							Los tiempos de garantía varían sus términos de acuerdo a las
							políticas manejadas por cada fabricante.
						</p>

						<p>
							Se reciben productos presentando debidamente su comprobante de
							compra "se requiere una copia junto al producto para su
							seguridad."
						</p>

						<p>
							en caso de requerir delivery para el recojo del producto,
							comunicarse a los números de atención del cliente. "Solo se
							cobrara un envío el cual deberá ser cancelado antes del recojo del
							producto"
						</p>
						<br />

						<h3 class="font-semibold">NO APLICA GARANTÍA</h3>
						<p>
							El producto no hará uso de su garantía en las siguientes
							condiciones:
						</p>
						<ul>
							<li>Manipulación o señales de haber sido abierto</li>
							<li>Error de compra</li>
							<li>
								Daños Físicos, por sobrecargas eléctricas, golpes, químicos
								líquidos, insectos u óxido.
							</li>
							<li>Removido etiquetas de seguridad del fabricante</li>
							<li>Adulteración del numero de serie</li>
							<li>
								No aplican: Copias de seguridad, mantenimientos, instalaciones,
								restauraciones de programas o fallas ocasionadas por virus.
							</li>
							<li>
								En el caso de productos en promoción, se requiere la entrega de
								todos los productos incluidos en la promoción correspondiente.
							</li>
						</ul>
					</div>
				</div>
			</section>
		</WebLayout>
	);
}

export default TerminosPage;
