import Link from 'next/link';
import { buttonVariants } from '../components/ui/button';

export default async function Page() {
  return (
    <section className="py-10 max-w-xl mx-auto px-8">
      <div>
        <h1 className="text-gray-700 font-bold mb-5 text-3xl">
          Welcome to RockHills Portal
        </h1>
      </div>

      <ul className="flex gap-3.5 items-center">
        <HomeLink href="portal" text="Portal" />
        <HomeLink href="admin/portal" text="Admin Portal" />
        <HomeLink href="auth/login" text="Login" />
      </ul>
    </section>
  );
}

function HomeLink({ href, text }: { href: string; text: string }) {
  return (
    <li>
      <Link
        className={buttonVariants({ variant: 'outline' })}
        href={`/${href}`}
      >
        {text}
      </Link>
    </li>
  );
}
