import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Recruitment Fit Scorer",
  description: "Score candidates against weighted hiring rubrics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <aside className="sidebar" aria-label="Primary navigation">
            <Link className="brand" href="/">
              <span>RFS</span>
              <strong>Recruitment Fit</strong>
            </Link>
            <nav>
              <Link href="/candidates">Candidates</Link>
              <Link href="/rubrics">Rubrics</Link>
              <Link href="/evaluations/new">New evaluation</Link>
            </nav>
          </aside>
          <details className="mobile-nav">
            <summary aria-label="Open navigation">Menu</summary>
            <nav>
              <Link href="/candidates">Candidates</Link>
              <Link href="/rubrics">Rubrics</Link>
              <Link href="/evaluations/new">New evaluation</Link>
            </nav>
          </details>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
