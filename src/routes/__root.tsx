/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import type * as React from "react";
import { DefaultCatchBoundary } from "~/components/default-catch-boundary";
import { NotFound } from "~/components/not-found";
import { seo } from "~/lib/seo";
import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "icon-gen.ras.sh | Web & Mobile Icon Generator",
        description:
          "🖼️ Generate all essential icon sizes for web and mobile from a single image. Drag, drop, download.",
      }),
    ],
    scripts: [
      {
        src: "https://u.tronite.com/script.js",
        defer: true,
        "data-website-id": "8f62c60f-2fdb-4756-bfae-e6ba62afa036",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="dark min-h-dvh font-sans text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
