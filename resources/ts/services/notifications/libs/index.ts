import enviroments from "~/config";
import type { NotifcationType } from "../schemas/notifications.schema";
import { notificationsRegisterApi } from "../api/notifications.register.api";

export function iconByNotificationType(type: NotifcationType) {
	const icons = {
		register: "<i class='fa-solid fa-user'/>",
		order: "<i class='fas fa-store' />",
		comment: "<i class='fas fa-comment'/>",
	};
	return icons[type];
}
export function colorByNotificationType(type: NotifcationType) {
	const icons = {
		register: "bg-red-600",
		order: "bg-blue-600",
		comment: "bg-orange-600",
	};
	return icons[type];
}
interface ShowNotificationProps {
	title: string;
	body: string;
	icon: string;
	url: string;
}
export async function showNotification(props: ShowNotificationProps) {
	if (!("Notification" in window)) {
		console.error("This browser does not support desktop notification");
	}
	// Request permission to display notifications
	const permission = await Notification.requestPermission();
	if (permission !== "granted") {
		console.warn("Permission denied for notifications");
		return;
	}
	if (Notification.permission !== "granted") {
		console.warn("Permission denied for notifications");
		return;
	}

	// Create a notification object
	const notification = new Notification(props.title, {
		body: props.body,
		icon: props.icon, // URL to the icon image
	});
	notification.addEventListener("click", () => {
		window.location.href = props.url;
	});

	// // Close the notification after 3 seconds
	// setTimeout(notification.close.bind(notification), 3000);
}
// push notificacion server
export async function registerPushNotification() {
	if ("serviceWorker" in navigator && "PushManager" in window) {
		try {
			const registration = await navigator.serviceWorker.register(
				`${enviroments.VITE_URL}/js/service-worker.js`,
			);

			const permission = await Notification.requestPermission();

			if (permission === "granted") {
				const subscription = await registration.pushManager.getSubscription();
				if (!subscription) {
					const applicationServerKey = urlB64ToUint8Array(
						enviroments.VITE_PLUBIC_VAPID_KEY,
					);
					return registration.pushManager.subscribe({
						userVisibleOnly: true,
						applicationServerKey: applicationServerKey,
					});
				}
				await notificationsRegisterApi(subscription);
			}
		} catch (error) {
			// biome-ignore lint/suspicious/noConsoleLog: <explanation>
			console.log(error);
		}
	}
}

function urlB64ToUint8Array(base64String: string) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding)
		.replace(/\-/g, "+")
		.replace(/_/g, "/");

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}
