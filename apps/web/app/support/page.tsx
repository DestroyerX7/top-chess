import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const faqs = [
  {
    question: "Does the app collect any of my personal data?",
    answer: (
      <>
        No. Top Chess does not require an account and does not collect personal
        information. See our{" "}
        <Link
          href="/privacy-policy"
          className="font-medium text-primary hover:underline"
        >
          Privacy Policy
        </Link>{" "}
        for full details.
      </>
    ),
  },
  {
    question: "I found a bug. How do I report it?",
    answer:
      "Email us at the address below with a description of what happened, the steps to reproduce it, and your device model and OS version if possible. Screenshots help a lot.",
  },
  {
    question: "Can I request a feature?",
    answer:
      "Yes — send your idea to the email below. We read every message, though we can't promise every request will be implemented.",
  },
  {
    question: "How do I delete my data?",
    answer:
      "There's nothing to delete—the app doesn't create an account or store personal data on our servers. Uninstalling the app removes everything stored locally on your device.",
  },
  {
    question: "The app isn't working / won't load.",
    answer:
      "Try closing and reopening the app, and make sure you're on the latest version from the App Store. If the issue continues, email us with details and we'll look into it.",
  },
];

export default function Support() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Support</h1>
          <p className="text-muted-foreground">
            Need help with Top Chess? You&apos;re in the right place.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>

          {faqs.map((faq) => (
            <Card key={faq.question}>
              <CardContent className="space-y-2 p-6">
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {faq.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Contact Us</h2>

          <Card>
            <CardContent className="space-y-1 p-6">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <a
                href="mailto:destroyerincdev@gmail.com"
                className="font-medium text-primary hover:underline"
              >
                destroyerincdev@gmail.com
              </a>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
