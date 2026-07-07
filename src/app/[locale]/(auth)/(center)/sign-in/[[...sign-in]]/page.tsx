import { SignIn } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { getI18nPath } from '@/utils/Helpers';

type SignInPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: SignInPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'SignIn',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function SignInPage(props: SignInPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'SignIn',
  });
  const dashboardUrl = getI18nPath('/dashboard', locale);

  return (
    <section className="flex w-full max-w-md flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-3 rounded-[2rem] border border-[#f5c518]/25 bg-white p-5 text-center shadow-xl shadow-[#0b2233]/10">
        <Image
          src="/logo-login.png"
          width={136}
          height={136}
          alt="Carga"
          className="h-28 w-28 rounded-3xl object-contain sm:h-[8.5rem] sm:w-[8.5rem]"
          preload
        />
        <div className="space-y-1">
          <p className="text-xl font-bold tracking-tight text-[#0c2434]">{t('brand_title')}</p>
          <p className="text-sm font-semibold tracking-[0.18em] text-[#64748b] uppercase">
            {t('form_title')}
          </p>
        </div>
      </div>

      <SignIn
        path={getI18nPath('/sign-in', locale)}
        fallbackRedirectUrl={dashboardUrl}
        appearance={{
          options: {
            animations: true,
            elevation: 'raised',
            socialButtonsPlacement: 'bottom',
            socialButtonsVariant: 'blockButton',
          },
          variables: {
            borderRadius: '0.95rem',
            colorBackground: '#ffffff',
            colorBorder: 'rgba(12, 36, 52, 0.14)',
            colorForeground: '#0c2434',
            colorInput: '#ffffff',
            colorInputForeground: '#0c2434',
            colorMuted: '#f7f8fb',
            colorMutedForeground: '#64748b',
            colorPrimary: '#f5c518',
            colorPrimaryForeground: '#0c1117',
            colorRing: '#f5c518',
            colorShadow: 'rgba(12, 36, 52, 0.18)',
            fontFamily: 'inherit',
          },
          elements: {
            cardBox: 'border border-[#0c2434]/10 shadow-2xl shadow-[#0c2434]/15',
            footer: 'hidden',
            formButtonPrimary:
              'bg-[#f5c518] text-[#0c1117] shadow-md shadow-[#f5c518]/25 hover:bg-[#e3b512] focus:bg-[#e3b512]',
            headerSubtitle: 'hidden',
            headerTitle: 'hidden',
            logoBox: 'hidden',
            rootBox: 'w-full',
          },
        }}
      />
    </section>
  );
}
