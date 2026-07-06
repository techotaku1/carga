import { getTranslations, setRequestLocale } from 'next-intl/server';

const GRID_CELL_COUNT = 78;

const PULSE_DELAYS: Record<number, string> = {
  3: '0s',
  10: '1.4s',
  16: '2.8s',
  23: '0.7s',
  31: '3.5s',
  38: '2.1s',
  44: '4.9s',
  52: '1.05s',
  59: '4.2s',
  67: '5.6s',
  74: '3.15s',
};

export default async function CenteredLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'AuthLayout',
  });

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-[#14161b] lg:flex lg:flex-col lg:justify-end lg:p-12">
        <div className="absolute inset-0 grid grid-cols-6">
          {Array.from({ length: GRID_CELL_COUNT }, (_, index) => (
            <div
              key={index}
              className={`aspect-square border-r border-b border-[#f5c518]/10 ${
                PULSE_DELAYS[index] ? 'auth-cell-pulse' : ''
              }`}
              style={PULSE_DELAYS[index] ? { animationDelay: PULSE_DELAYS[index] } : undefined}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#14161b] via-[#14161b]/40 to-transparent" />

        <div className="relative flex flex-col gap-6">
          <p className="text-sm font-semibold tracking-[0.25em] text-[#f5c518] uppercase">
            {t('eyebrow')}
          </p>
          <h2 className="max-w-md text-4xl leading-tight font-bold text-[#f7f5ef]">{t('title')}</h2>
          <p className="max-w-md text-lg text-[#f7f5ef]/70">{t('description')}</p>
        </div>
      </aside>

      <main className="flex items-center justify-center px-4 py-10">{props.children}</main>
    </div>
  );
}
