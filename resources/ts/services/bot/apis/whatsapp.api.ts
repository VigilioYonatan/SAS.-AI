import { useMutation, useQuery } from "@vigilio/preact-fetching";
import type { MessageSendOptions } from "whatsapp-web.js";
import WAWebJS from "whatsapp-web.js";
import enviroments from "~/config";
export const BASE_URL_WHATSAPP = "";
export function whatsappSendMessageApi() {
	return useMutation<
		{ success: boolean; message: string },
		{
			telephone: string;
			message: string;
			options?: WAWebJS.MessageSendOptions;
		},
		{ success: false; message: string }
	>("/whatsapp/send-message", async (url, body) => {
		const { telephone, ...rest } = body;
		const response = await fetch(
			`${BASE_URL_WHATSAPP}/api${url}?telephone=${telephone}`,
			{
				method: "POST",
				body: JSON.stringify(rest),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${enviroments.VITE_TOKEN_VIGILIO_SERVICES}`,
				},
			},
		);
		const result = await response.json();
		return result;
	});
}
export function whatsappSendFileApi() {
	return useMutation<
		{ success: boolean; message: string },
		{
			telephone: string;
			url?: string;
			file?: File;
			name?: string;
			option?: MessageSendOptions;
		},
		{ success: boolean; message: string }
	>("/whatsapp/send-file", async (url, body) => {
		const { telephone, ...rest } = body;
		const formdata = new FormData();
		if (rest.name) {
			formdata.append("name", rest.name);
		}
		if (rest.file) {
			formdata.append("file", rest.file);
		}
		if (rest.url) {
			formdata.append("url", rest.url);
		}
		if (rest.option) {
			formdata.append("option", JSON.stringify(rest.option));
		}

		const response = await fetch(
			`${BASE_URL_WHATSAPP}/api${url}?telephone=${telephone}`,
			{
				method: "POST",
				body: formdata,
				headers: {
					Authorization: `Bearer ${enviroments.VITE_TOKEN_VIGILIO_SERVICES}`,
				},
			},
		);
		const result = await response.json();
		return result;
	});
}

export function whatsappSendSeenApi() {
	return useMutation<
		{ success: boolean; message: string },
		{ telephone: string },
		{ success: boolean; message: string }
	>("/whatsapp/send-seen", async (url, body) => {
		const { telephone } = body;
		const response = await fetch(
			`${BASE_URL_WHATSAPP}/api${url}?telephone=${telephone}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${enviroments.VITE_TOKEN_VIGILIO_SERVICES}`,
				},
			},
		);
		const result = await response.json();
		return result;
	});
}
export function whatsappSendTypingApi() {
	return useMutation<
		{ success: boolean; message: string },
		{ telephone: string; delay: number },
		{ success: boolean; message: string }
	>("/whatsapp/send-typing", async (url, body) => {
		const { telephone } = body;
		const response = await fetch(
			`${BASE_URL_WHATSAPP}/api${url}?telephone=${telephone}&delay=${body.delay}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${enviroments.VITE_TOKEN_VIGILIO_SERVICES}`,
				},
			},
		);
		const result = await response.json();
		return result;
	});
}

export function whatsappGetQrApi() {
	return useQuery("/whatsapp/qr", async (url) => {
		const response = await fetch(`/api${url}`, {
			headers: {
				Authorization: `Bearer ${enviroments.VITE_TOKEN_VIGILIO_SERVICES}`,
			},
		});
		const result = await response.blob();
		return result;
	});
}
export function whatsappLogout() {
	return useMutation("/whatsapp/logout", async (url) => {
		const response = await fetch(`${BASE_URL_WHATSAPP}/api${url}`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${enviroments.VITE_TOKEN_VIGILIO_SERVICES}`,
			},
		});
		const result = await response.blob();
		return result;
	});
}
export function whatsappRestart() {
	return useMutation<{ success: true; message: string }, unknown, unknown>(
		"/whatsapp/restart",
		async (url) => {
			const response = await fetch(`/api${url}`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${enviroments.VITE_TOKEN_VIGILIO_SERVICES}`,
				},
			});
			const result = await response.json();
			return result;
		},
	);
}
export function whatsappStop() {
	return useMutation<{ success: true; message: string }, unknown, unknown>(
		"/whatsapp/stop",
		async (url) => {
			const response = await fetch(`${BASE_URL_WHATSAPP}/api${url}`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${enviroments.VITE_TOKEN_VIGILIO_SERVICES}`,
				},
			});
			const result = await response.json();
			return result;
		},
	);
}
export function whatsappStart() {
	return useMutation<{ success: true; message: string }, unknown, unknown>(
		"/whatsapp/start",
		async (url) => {
			const response = await fetch(`${BASE_URL_WHATSAPP}/api${url}`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${enviroments.VITE_TOKEN_VIGILIO_SERVICES}`,
				},
			});
			const result = await response.json();
			return result;
		},
	);
}
