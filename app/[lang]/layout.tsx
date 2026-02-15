import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
    title: "Passforge | Premium Password Generator",
    description: "High-security, RAM-only cryptographic password generator.",
};

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    return (
        <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
            <body suppressHydrationWarning={true}>
                {children}
            </body>
        </html>
    );
}
