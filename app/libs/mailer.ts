import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
export async function sendMail(
	props: { email: string; password: string },
	mailOptions: Mail.Options,
) {
	try {
		const transporter = nodemailer.createTransport({
			host: "smtp.zoho.com",
			secure: true,
			port: 465,
			auth: {
				user: props.email,
				pass: props.password,
			},
		});
		const message = await transporter.sendMail(mailOptions);
		return message;
	} catch (error) {
		return false;
	}
}
