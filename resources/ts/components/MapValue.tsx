import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    type MapContainerProps,
} from "react-leaflet";
import { markerImage } from "~/config/settings";
import L from "leaflet";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
export const typeMap = {
    normal: {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    satelite: {
        url: "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg",
        attribution:
            '&copy; CNES, Distribution Airbus DS, &copy; Airbus DS, &copy; PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    secondary: {
        url: "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
        attribution:
            '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
};
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
    scrollWheelZoom?: boolean;
    url?: string;
    attribution?: string;
    zoomControl?: boolean;
    height?: string;
}
function MapValue({
    value,
    zoom = 13,
    style = {},
    scrollWheelZoom = true,
    attribution,
    zoomControl = true,
    height = "300px",
    url,
}: MapProps) {
    return (
        <MapContainer
            center={value}
            style={{ height, width: "100%", zIndex: -0, ...style }}
            zoom={zoom}
            scrollWheelZoom={scrollWheelZoom}
            zoomControl={zoomControl}
            attributionControl={false}
        >
            <TileLayer
                url={
                    url ||
                    typeMap[
                        storageEmpresa!.setting.type_map as keyof typeof typeMap
                    ].url
                }
                attribution={
                    attribution ||
                    typeMap[
                        storageEmpresa!.setting.type_map as keyof typeof typeMap
                    ].attribution
                }
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
