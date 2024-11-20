import {
    LayersControl,
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
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution:
            "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
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
const { BaseLayer } = LayersControl;

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
            <LayersControl>
                {storageEmpresa?.setting.type_map === "satelite" ? (
                    <>
                        <BaseLayer name="OpenStreetMap">
                            <TileLayer
                                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="© OpenStreetMap"
                            />
                        </BaseLayer>
                        <BaseLayer name="OpenStreetMap.HOT">
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                                attribution="© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France"
                            />
                        </BaseLayer>
                    </>
                ) : null}
                <BaseLayer checked name="Esri_WorldImagery">
                    <TileLayer
                        url={
                            url ||
                            typeMap[
                                storageEmpresa?.setting
                                    .type_map as keyof typeof typeMap
                            ].url
                        }
                        attribution={
                            attribution ||
                            typeMap[
                                storageEmpresa?.setting
                                    .type_map as keyof typeof typeMap
                            ].attribution
                        }
                    />
                </BaseLayer>{" "}
                {value === null ? null : (
                    <Marker position={value} icon={customIcon}>
                        <Popup>
                            Longitud: {value.lng}
                            <br />
                            Latitud: {value.lat}
                        </Popup>
                    </Marker>
                )}
            </LayersControl>
        </MapContainer>
    );
}
export default MapValue;
