import FormData from 'form-data';
import Mailgun from 'mailgun.js';

const sendMail = async ({ name, email, message }: { name: string, email: string, message: string }) => {
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
        username: "api",
        key: process.env.MAILGUN_API || "",
        url: "https://api.mailgun.net"
    });
    try {
        const data = await mg.messages.create("zadescoxp.com", {
            from: "Mailgun Sandbox <postmaster@zadescoxp.com>",
            to: ["Zade <zadescoxp@gmail.com>"],
            subject: `New message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        });
        return data;
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();
        const result = await sendMail({ name, email, message });
        return new Response(JSON.stringify({ success: true, result }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error?.toString() }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
