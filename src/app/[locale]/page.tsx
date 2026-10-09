import { setRequestLocale } from 'next-intl/server';
import { redirect } from '@/libs/I18nNavigation';

export default async function IndexPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  redirect({ href: '/dashboard', locale });
}
