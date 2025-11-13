import { Injectable } from "@nestjs/common";
import Mailgun from "mailgun.js";
import { INTRO_EMAIL } from "src/util/emails";

const FROM = "Your Google Ads Co-Pilot <info@addyai.net>";

@Injectable()
export class MailgunService {
    private mg;

    constructor() {
        const mailgun = new Mailgun(FormData);
        this.mg = mailgun.client({
            username: "api",
            key: process.env.MAILGUN_API_KEY || "API_KEY",
        });
    }

    async sendEmail(name: string, email: string, subject: string, text: string, html: string): Promise<void> {
        try {
            console.log("Sending email via Mailgun...");

            const data = await this.mg.messages.create(process.env.MAILGUN_DOMAIN, {
            from: FROM,
            to: [name + " <" + email + ">"],
            subject: subject,
            text: text,
            html: INTRO_EMAIL({ name: name }),
            });

            console.log("Email sent:", data);
        } catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    }
}
