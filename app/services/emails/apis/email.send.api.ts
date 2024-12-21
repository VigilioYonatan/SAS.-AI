import { InternalServerErrorException } from "@vigilio/express-core";
import enviroments from "~/config/enviroments.config";
let accessToken: number | null = null;
let tokenExpiryTime: number | null = null;

export async function getAccessToken() {
	try {
		const response = await fetch(
			`https://accounts.zoho.com/oauth/v2/token?refresh_token=${enviroments.ZOHO_REFRESH_TOKEN}&client_id=${enviroments.ZOHO_CLIENT_ID}&client_secret=${enviroments.ZOHO_CLIENT_SECRET}&grant_type=refresh_token`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		const result = await response.json();
		accessToken = result.access_token;
		// Calcula el tiempo de expiración. La mayoría de los tokens expiran en 3600 segundos (1 hora).
		tokenExpiryTime = Date.now() + result.expires_in * 1000;
		return result;
	} catch (error) {
		throw new InternalServerErrorException(
			`Error de servidor ${(error as Error).message}`,
		);
	}
}

// https://www.zoho.com/mail/help/api/post-send-email-attachment.html
interface EmailSendApiProps {
	fromAddress: string;
	toAddress: string;
	subject: string;
	content?: string;
	ccAddress?: string;
	bccAddress?: string;
	mailFormat?: "html" | "plaintext";
	attachments?: {
		storeName: string;
		attachmentPath: string;
		attachmentName: string;
	}[];
}
async function generateToken() {
	// Verifica si el token ha expirado o está cerca de expirar
	if (
		!accessToken ||
		!tokenExpiryTime ||
		Date.now() >= tokenExpiryTime - 300000
	) {
		// 5 minutos antes de la expiración
		await getAccessToken();
	}
}

export async function emailSendApi(body: EmailSendApiProps) {
	const payload: EmailSendApiProps = {
		fromAddress: body.fromAddress,
		toAddress: body.toAddress,
		subject: body.subject,
		content: body.content,
	};
	if (body.ccAddress) {
		payload.ccAddress = body.ccAddress;
	}

	if (body.bccAddress) {
		payload.bccAddress = body.bccAddress;
	}

	if (body.attachments) {
		payload.attachments = body.attachments;
	}
	await generateToken();
	const response = await fetch(
		`https://mail.zoho.com/api/accounts/${enviroments.ZOHO_ACCOUNT_ID}/messages`,
		{
			method: "POST",
			body: JSON.stringify(payload),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Zoho-oauthtoken ${accessToken}`,
			},
		},
	);
	const result = await response.json();
	if (!response.ok)
		throw new InternalServerErrorException(JSON.stringify(result));
	return result;
}
// https://mail.zoho.com/api/accounts
export async function emailsAccountsAPI() {
	await generateToken();
	const response = await fetch("https://mail.zoho.com/api/accounts", {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Zoho-oauthtoken ${accessToken}`,
		},
	});
	const result = await response.json();
	if (!response.ok)
		throw new InternalServerErrorException(JSON.stringify(result));
	return result;
}
export async function emailsAccountAPI(accountId: string) {
	await generateToken();
	const response = await fetch(
		`https://mail.zoho.com/api/accounts/${accountId}`,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Zoho-oauthtoken ${accessToken}`,
			},
		},
	);
	const result = await response.json();
	if (!response.ok)
		throw new InternalServerErrorException(JSON.stringify(result));
	return result;
}
