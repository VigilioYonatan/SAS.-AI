import dotenv from "dotenv";
dotenv.config({ path: ".env" });

interface Enviroments {
	NODE_ENV: "production" | "development";
	VITE_URL: string;
	PORT: string;
	DB_HOST: string;
	DB_PORT: number;
	DB_NAME: string;
	DB_USER: string;
	DB_PASS: string;
	DB_CONTAINER: string;
	VITE_VIGILIO_WEB: string;
	VITE_VIGILIO_TOKEN: string;
	VITE_VIGILIO_SUNAT: string;
	SECRET_SESSION_KEY: string;
	VITE_TOKEN_VIGILIO_SERVICES: string;
	VITE_DIASFACTURASBOLETA: number;
	// NOTIFICATIONS PUSH
	VITE_PLUBIC_VAPID_EMAIL: string;
	VITE_PLUBIC_VAPID_KEY: string;
	VITE_PRIVATE_VAPID_KEY: string;
	PM2_ID: string;
	PAYPAL_SANDBOX: string;
	VITE_PAYPAL_COMISION: number;
	VITE_PAYPAL_TRANSACTION: number;
	CLIENT: string;
	DOCKER_IMAGE_WHATSAPP: string;
}
const enviroments: Enviroments = {
	NODE_ENV: process.env.NODE_ENV! as "development" | "production",
	VITE_URL: process.env.VITE_URL!,
	PORT: process.env.PORT!,
	// db
	DB_HOST: process.env.DB_HOST!,
	DB_PORT: Number(process.env.DB_PORT)!,
	DB_NAME: process.env.DB_NAME!,
	DB_USER: process.env.DB_USER!,
	DB_PASS: process.env.DB_PASS!,
	DB_CONTAINER: process.env.DB_CONTAINER!,
	// VIGILIO
	VITE_VIGILIO_WEB: process.env.VITE_VIGILIO_WEB!,
	VITE_VIGILIO_TOKEN: process.env.VITE_VIGILIO_TOKEN!,
	VITE_VIGILIO_SUNAT: process.env.VITE_VIGILIO_SUNAT!,
	VITE_TOKEN_VIGILIO_SERVICES: process.env.VITE_TOKEN_VIGILIO_SERVICES!,
	SECRET_SESSION_KEY: process.env.SECRET_SESSION_KEY!,
	VITE_DIASFACTURASBOLETA: Number(process.env.VITE_DIASFACTURASBOLETA)!,
	// notifications push
	VITE_PLUBIC_VAPID_EMAIL: process.env.VITE_PLUBIC_VAPID_KEY!,
	VITE_PLUBIC_VAPID_KEY: process.env.VITE_PLUBIC_VAPID_KEY!,
	VITE_PRIVATE_VAPID_KEY: process.env.VITE_PRIVATE_VAPID_KEY!,
	// izipay
	PM2_ID: process.env.PM2_ID!,
	PAYPAL_SANDBOX: process.env.PAYPAL_SANDBOX!,
	VITE_PAYPAL_COMISION: Number(process.env.VITE_PAYPAL_COMISION)!,
	VITE_PAYPAL_TRANSACTION: Number(process.env.VITE_PAYPAL_TRANSACTION)!,
	CLIENT: process.env.CLIENT!,
	DOCKER_IMAGE_WHATSAPP: process.env.DOCKER_IMAGE_WHATSAPP!,
};

export default enviroments;
