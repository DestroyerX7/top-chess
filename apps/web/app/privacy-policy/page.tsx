import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: June 19, 2026
          </p>
        </header>

        <p className="leading-7 text-muted-foreground">
          This Privacy Policy explains how Top Chess (&quot;the App,&quot; &quot;we,&quot; &quot;us&quot;)
          handles information when you use the App. We&apos;e kept this short and
          direct because the App itself does not collect, store, or share any
          personal information about you.
        </p>

        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold">
              Information we don&apos;t collect
            </h2>

            <p className="leading-7 text-muted-foreground">
              The App does not require an account, does not ask you to enter
              personal information, and does not include analytics,
              advertising, or tracking software development kits (SDKs). We
              don&apos;t collect your name, email address, location, contacts,
              photos, or any other personal data through the App&apos;s features.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold">
              Information collected automatically by our infrastructure
            </h2>

            <p className="leading-7 text-muted-foreground">
              The App communicates with a backend service hosted on Cloudflare
              Workers. Like most web infrastructure, Cloudflare automatically
              generates basic technical logs for requests made to keep the
              service running reliably and to detect abuse. These logs may
              include:
            </p>

            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>IP address</li>
              <li>Timestamp of the request</li>
              <li>Request path and HTTP method</li>
              <li>
                Response status and basic performance metrics (such as request
                duration)
              </li>
            </ul>

            <p className="leading-7 text-muted-foreground">
              This information is generated automatically at the infrastructure
              level for operational monitoring and debugging. We do not use it
              to identify individual users, build profiles, or for advertising.
              We do not sell or share this information with third parties for
              marketing purposes.
            </p>

            <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
              These logs are retained according to Cloudflare&apos;s standard log
              retention settings and are only accessible to the developer of the
              App for troubleshooting purposes.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold">Third-party services</h2>

            <p className="leading-7 text-muted-foreground">
              The App&apos;s backend is hosted on Cloudflare Workers. Cloudflare may
              process limited technical data as described above as part of
              providing infrastructure services. You can review their privacy
              policy{" "}
              <Link
                href="https://www.cloudflare.com/privacypolicy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                here
              </Link>
              .
            </p>

            <p className="leading-7 text-muted-foreground">
              The App is distributed through the Apple App Store, which has its
              own privacy practices governing the download and update process.
              Apple&apos;s privacy policy is available{" "}
              <Link
                href="https://www.apple.com/legal/privacy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                here
              </Link>
              .
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold">Children&apos;s privacy</h2>

            <p className="leading-7 text-muted-foreground">
              The App is not directed at children under the age of 13, and we
              do not knowingly collect personal information from children.
              Because the App does not collect personal data in the first place,
              no personal data from children is collected through it.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold">Data retention</h2>

            <p className="leading-7 text-muted-foreground">
              We do not retain any personal data because none is collected by
              the App. Automatically generated infrastructure logs (described
              above) are retained only for the period necessary for operational
              and security purposes, per Cloudflare&apos;s log retention settings.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold">Your choices</h2>

            <p className="leading-7 text-muted-foreground">
              Because the App does not collect personal information, there is no
              account data, profile, or personal data for you to access, export,
              or delete. If you have questions about what infrastructure-level
              logs might exist, contact us using the details below.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold">Changes to this policy</h2>

            <p className="leading-7 text-muted-foreground">
              We may update this Privacy Policy from time to time, for example
              if the App&apos;s functionality changes. We&apos;ll update the &quot;Last
              updated&quot; date above when changes are made. Continued use of the
              App after changes are posted constitutes acceptance of the updated
              policy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6">
            <h2 className="text-xl font-semibold">Contact Us</h2>

            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, contact us
              at:
            </p>

            <a
              href="mailto:destroyerincdev@gmail.com"
              className="font-medium text-primary hover:underline"
            >
              destroyerincdev@gmail.com
            </a>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}