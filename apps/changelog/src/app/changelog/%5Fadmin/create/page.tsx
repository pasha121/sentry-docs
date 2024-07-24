import {Fragment} from 'react';
import Link from 'next/link';
import {prismaClient} from '@/server/prisma-client';
import {createChangelog} from '@/server/actions/changelog';
import {TitleSlug} from '@/client/components/titleSlug';
import {FileUpload} from '@/client/components/fileUpload';
import {Select} from '@/client/components/ui/Select';
import {ForwardRefEditor} from '@/client/components/forwardRefEditor';
import {Button} from '@/client/components/ui/Button';
import {getServerSession} from 'next-auth/next';
import {notFound} from 'next/navigation';
import {authOptions} from '@/server/authOptions';

export default async function ChangelogCreatePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return notFound();
  }

  const categories = await prismaClient.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <section className="overflow-x-auto col-start-3 col-span-8">
      <form action={createChangelog} className="px-2 w-full">
        <TitleSlug />
        <FileUpload />
        <div className="my-6">
          <label htmlFor="summary" className="block text-xs font-medium text-gray-700">
            Summary
            <Fragment>
              &nbsp;<span className="font-bold text-secondary">*</span>
            </Fragment>
          </label>
          <textarea name="summary" className="w-full" required />
          <span className="text-xs text-gray-500 italic">
            This will be shown in the list
          </span>
        </div>
        <div>
          <Select
            name="categories"
            className="mt-1 mb-6"
            label="Category"
            placeholder="Select Category"
            options={categories.map(category => ({
              label: category.name,
              value: category.name,
            }))}
            isMulti
          />
        </div>

        <ForwardRefEditor name="content" className="w-full" />

        <footer className="flex items-center justify-between mt-2">
          <Link href="/changelog/_admin" className="underline text-gray-500">
            Return to Changelogs list
          </Link>
          <div>
            <Button type="submit">Create (not published yet)</Button>
            <br />
            <span className="text-xs text-gray-500 italic">You can publish it later</span>
          </div>
        </footer>
      </form>
    </section>
  );
}
