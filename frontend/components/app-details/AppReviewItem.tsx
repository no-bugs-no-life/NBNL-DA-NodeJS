interface AppReviewItemProps {
  name: string;
  initials: string;
  time: string;
  text: string;
  rating: number;
}

export default function AppReviewItem({
  name,
  initials,
  time,
  text,
  rating,
}: AppReviewItemProps) {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary">
            {initials}
          </div>
          <div>
            <h4 className="font-bold">{name}</h4>
            <div className="flex text-primary text-sm">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className="material-symbols-outlined text-[16px]"
                  style={{
                    fontVariationSettings: `'FILL' ${n <= rating ? 1 : 0}`,
                  }}
                >
                  star
                </span>
              ))}
            </div>
          </div>
        </div>
        <span className="text-sm text-on-surface-variant">{time}</span>
      </div>
      <p className="text-on-surface-variant leading-relaxed">{text}</p>
    </div>
  );
}
