/**
 * Decorative barcode — premium / luxury style.
 * Fixed bar widths to avoid hydration mismatch.
 */
export default function Barcode({ className = '' }: { className?: string }) {
  const bars = [
    3, 1, 2, 3, 1, 1, 3, 2, 1, 3,
    1, 2, 1, 3, 2, 1, 1, 3, 1, 2,
    3, 1, 3, 1, 2, 1, 3, 2, 1, 1,
    3, 2, 1, 3, 1, 2, 3, 1, 1, 2,
    1, 3, 2, 1, 2, 3, 1, 2, 1, 3,
  ];

  return (
    <div className={`flex items-end justify-center gap-[1.5px] ${className}`}>
      {bars.map((w, i) => (
        <div
          key={i}
          className="bg-slate-800 rounded-[0.5px]"
          style={{
            width: `${w}px`,
            height: i % 4 === 0 ? '32px' : i % 3 === 0 ? '28px' : '24px',
          }}
        />
      ))}
    </div>
  );
}
