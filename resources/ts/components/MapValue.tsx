import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	type MapContainerProps,
} from "react-leaflet";
import { markerImage } from "~/config/settings";
import L from "leaflet";

const customIcon = new L.Icon({
	iconUrl: markerImage(),
	iconSize: [35, 35], // Establece el tamaño del icono
	iconAnchor: [17.5, 35], // Establece el punto del icono que corresponderá a la coordenada del marcador
	popupAnchor: [0, -35], // Establece el punto desde el que se mostrará el popup relativo al icono
});
interface MapProps {
	value: { lat: number; lng: number };
	zoom?: number;
	style?: MapContainerProps["style"];
}
function MapValue({ value, zoom = 13, style = {} }: MapProps) {
	return (
		<MapContainer
			center={value}
			style={{ height: "300px", width: "100%", zIndex: -0, ...style }}
			zoom={zoom}
		>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>
			{value === null ? null : (
				<Marker position={value} icon={customIcon}>
					<Popup>
						Longitud: {value.lng}
						<br />
						Latitud: {value.lat}
					</Popup>
				</Marker>
			)}
		</MapContainer>
	);
}
export default MapValue;
