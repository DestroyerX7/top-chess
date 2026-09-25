import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <div>
      <Header className="fixed left-0 right-0" />

      <section className="h-screen flex items-center justify-between mx-32">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">
            Track the world&apos;s best chess players. Live ratings, rankings, rating
            history, and player bios — all in one clean app.
          </h1>

          <p className="text-muted-foreground">
            Whether you&apos;re following your favorite grandmaster, scouting
            up-and-coming talent, or just curious who&apos;s #1 right now, Top Chess
            gives you a fast, clean way to follow the competitive chess world.
            No clutter. No noise. Just rankings, ratings, and the players behind
            them.
          </p>

          <Link
            href="https://apps.apple.com/us/app/top-chess-live-ratings/id6782492624"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/download-on-the-app-store-badge.svg"
              alt="Download on the App Store"
              width={180}
              height={60}
              className="h-12 w-auto"
            />
          </Link>
        </div>

        <Image
          src="/iphones.png"
          alt="iphones"
          width={800}
          height={600}
          priority
          className="w-200 h-auto"
        />
      </section>
    </div>
  );
}
