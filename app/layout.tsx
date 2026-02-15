import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Passforge | Premium Password Generator",
    description: "High-security, RAM-only cryptographic password generator.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body suppressHydrationWarning={true}>
                <div className="bg-glow-top" />
                <div className="bg-glow-bottom" />
                {children}
            </body>
        </html>
    );
}
