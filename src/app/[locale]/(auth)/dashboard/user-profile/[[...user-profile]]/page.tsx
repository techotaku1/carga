import { UserProfile } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getI18nPath } from '@/utils/Helpers';

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

type UserProfilePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: UserProfilePageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'UserProfile',
  });

  return {
    title: t('meta_title'),
  };
}

export default async function UserProfilePage(props: UserProfilePageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="my-6 lg:-ml-12">
      <UserProfile path={getI18nPath('/dashboard/user-profile', locale)} />
    </div>
  );
}
