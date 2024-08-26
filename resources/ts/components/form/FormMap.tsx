import { useContext } from "preact/hooks";
import type { JSX } from "preact";
import type {
	FieldValues,
	Path,
	PathValue,
	RegisterOptions,
	UseFormReturn,
} from "react-hook-form";
import {
	MapContainer,
	TileLayer,
	Marker,
	useMapEvents,
	Popup,
} from "react-leaflet";
import L, { type LeafletMouseEvent } from "leaflet";
import { markerImage } from "~/config/settings";
import { FormControlContext } from "./Form";
import "leaflet/dist/leaflet.css";
import type { CSSProperties } from "preact/compat";
import { anidarPropiedades } from ".";
export const customIcon = new L.Icon({
	iconUrl: markerImage(),
	iconSize: [35, 35], // Establece el tamaño del icono
	iconAnchor: [17.5, 35], // Establece el punto del icono que corresponderá a la coordenada del marcador
	popupAnchor: [0, -35], // Establece el punto desde el que se mostrará el popup relativo al icono
});
type FormMapProps<T extends object> = {
	title: string;
	name: string;
	question?: JSX.Element | JSX.Element[] | string;
	options?: RegisterOptions<T, Path<T>>;
	style?: CSSProperties;
	zoom?: number;
	disabled?: boolean;
	defaultValue?: LeafletMouseEvent["latlng"] | null;
};
function FormMap<T extends object>({
	name,
	title,
	question,
	options,
	style = { height: "300px", width: "100%", zIndex: 0 },
	zoom = 14,
	disabled = false,
}: FormMapProps<T>) {
	const {
		register,
		formState: { errors },
		watch,
		setValue,
	} = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);
	const value = watch(name as Path<T>);

	function LocationMarker() {
		const map = useMapEvents({
			click(e) {
				if (disabled) return;
				setValue(name as Path<T>, e.latlng as PathValue<T, Path<T>>);
				map.flyTo(e.latlng, map.getZoom());
			},
		});

		return value === null ? null : (
			<Marker position={value} icon={customIcon}>
				<Popup>
					Longitud: {(value as LeafletMouseEvent["latlng"]).lng}
					<br />
					Latitud: {(value as LeafletMouseEvent["latlng"]).lat}
				</Popup>
			</Marker>
		);
	}

	function MyMap() {
		return (
			<MapContainer
				center={value}
				style={style}
				zoom={zoom}
				scrollWheelZoom={false}
			>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				/>
				<LocationMarker />
			</MapContainer>
		);
	}

	const err = anidarPropiedades(errors, (name as string).split("."));

	return (
		<div class="w-full mb-2">
			<label
				class="text-xs dark:text-secondary-light text-secondary-dark capitalize font-semibold"
				htmlFor={name as string}
			>
				{title}
			</label>
			<div class="flex items-center gap-2 w-full">
				<MyMap />
				<input
					type="hidden"
					{...register(name as unknown as Path<T>, options)}
				/>
				{question ? (
					<div class="relative group ">
						<i class="fa-solid fa-circle-question text-xs dark:text-white" />
						<div class="text-xs min-w-[100px] hidden group-hover:block -top-[35px] right-1 p-1 shadow text-center absolute rounded-md dark:bg-admin-background-dark bg-background-light dark:text-white z-10">
							{question}
						</div>
					</div>
				) : null}
			</div>
			{Object.keys(err).length ? (
				<p class="text-xs text-red-600">{err?.message}</p>
			) : null}
		</div>
	);
}

export default FormMap;
