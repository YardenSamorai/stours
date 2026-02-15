import { setRequestLocale } from 'next-intl/server';
import Destinations from '@/components/Destinations';

export default async function DestinationsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="pt-20">
      <Destinations />
    </div>
  );
}
