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
    <div className="flex w-full max-w-md flex-col items-center gap-12">
      <div className="flex items-end gap-1">
        <p className="bg-gradient-to-br from-[#0c2434] to-[#f5c518] bg-clip-text pb-2 text-center text-5xl leading-[1.2] font-extrabold tracking-tight text-transparent sm:text-6xl">
          {t('brand_title')}
        </p>
        <Image
          alt=""
          className="mb-2 h-11 w-11 object-contain sm:h-14 sm:w-14"
          height={56}
          src="/logo-login-mini.png"
          width={56}
        />
      </div>

      <SignIn
        path={getI18nPath('/sign-in', locale)}
        fallbackRedirectUrl={dashboardUrl}
        appearance={{
          options: {
            animations: true,
            elevation: 'raised',
            logoImageUrl: '/logo-login.png',
            logoPlacement: 'inside',
            socialButtonsPlacement: 'bottom',
            socialButtonsVariant: 'blockButton',
          },
          variables: {
            borderRadius: '0.95rem',
            colorBackground: '#ffffff',
            colorBorder: 'rgba(12, 36, 52, 0.35)',
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
            cardBox: 'w-full max-w-md border border-[#0c2434]/10 shadow-2xl shadow-[#0c2434]/15',
            footer: 'hidden',
            formButtonPrimary:
              'bg-[#f5c518] text-[#0c1117] shadow-md shadow-[#f5c518]/25 hover:bg-[#e3b512] focus:bg-[#e3b512]',
            formFieldInput: 'border border-[#0c2434]/35 focus:border-[#f5c518]',
            header:
              'flex flex-col items-center text-center [&>div:last-of-type]:text-sm [&>div:last-of-type]:font-semibold [&>div:last-of-type]:tracking-[0.18em] [&>div:last-of-type]:text-[#64748b] [&>div:last-of-type]:uppercase',
            logoBox: 'h-28 w-28 items-center justify-center sm:h-[8.5rem] sm:w-[8.5rem]',
            logoImage: 'h-28 w-28 rounded-3xl object-contain sm:h-[8.5rem] sm:w-[8.5rem]',
            rootBox: 'w-full max-w-md',
          },
        }}
      />
    </div>
  );
}
