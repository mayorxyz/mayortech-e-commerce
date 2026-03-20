const categories = [
  { key: "all", label: "All" },
  { key: "phones", label: "📱 Phones" },
  { key: "laptops", label: "💻 Laptops" },
  { key: "earphones", label: "🎧 Earphones" },
  { key: "powerbanks", label: "🔋 Power Banks" },
  { key: "accessories", label: "🔌 Accessories" },
  { key: "others", label: "Others" },
];

interface Props {
  active: string;
  onSelect: (cat: string) => void;
}

export default function CategoryFilter({ active, onSelect }: Props) {
  return (
    <div className="flex gap-2.5 px-7 py-5 overflow-x-auto scrollbar-hide">
      {categories.map((c) => (
        <button
          key={c.key}
          onClick={() => onSelect(c.key)}
          className={`shrink-0 py-[9px] px-[18px] rounded-full text-[13px] font-medium cursor-pointer border transition-all whitespace-nowrap
            ${
              active === c.key
                ? "bg-primary text-primary-foreground border-primary font-semibold"
                : "border-border bg-surface text-muted hover:text-foreground hover:border-[rgba(255,255,255,0.2)]"
            }
          `}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
