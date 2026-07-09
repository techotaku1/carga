import { ClerkProvider } from '@clerk/nextjs';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/libs/I18nRouting';
import { ClerkLocalizations } from '@/utils/AppConfig';

export default async function AuthLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const clerkLocale =
    ClerkLocalizations.supportedLocales[locale] ?? ClerkLocalizations.defaultLocale;
  const t = await getTranslations({ locale, namespace: 'SignIn' });
  const localization = {
    ...clerkLocale,
    signIn: {
      ...clerkLocale.signIn,
      start: {
        ...clerkLocale.signIn?.start,
        subtitle: '',
        title: t('form_title'),
        titleCombined: t('form_title'),
      },
    },
  };
  let signInUrl = '/sign-in';
  let dashboardUrl = '/dashboard';

  if (locale !== routing.defaultLocale) {
    signInUrl = `/${locale}${signInUrl}`;
    dashboardUrl = `/${locale}${dashboardUrl}`;
  }

  return (
    <ClerkProvider
      appearance={{
        cssLayerName: 'clerk', // Ensure Clerk is compatible with Tailwind CSS v4
      }}
      localization={localization}
      signInUrl={signInUrl}
      signInFallbackRedirectUrl={dashboardUrl}
    >
      {props.children}
    </ClerkProvider>
  );
}
