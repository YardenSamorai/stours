import { Shield, Clock, Award, CreditCard } from 'lucide-react';

export default function TrustBadges({ isHebrew = true }: { isHebrew?: boolean }) {
  const badges = [
    {
      icon: Shield,
      text: isHebrew ? 'הזמנה מאובטחת' : 'Secure Booking',
    },
    {
      icon: Clock,
      text: isHebrew ? 'ביטול חינם עד 48 שעות' : 'Free cancellation up to 48h',
    },
    {
      icon: Award,
      text: isHebrew ? '15+ שנות ניסיון' : '15+ years experience',
    },
    {
      icon: CreditCard,
      text: isHebrew ? 'תשלום בכל האמצעים' : 'All payment methods',
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
      {badges.map((badge, i) => (
        <div key={i} className="flex items-center gap-2 text-slate-500 text-sm">
          <badge.icon className="w-4 h-4 text-green-500 flex-shrink-0" />
          <span>{badge.text}</span>
        </div>
      ))}
    </div>
  );
}
