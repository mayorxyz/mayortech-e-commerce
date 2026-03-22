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
    <div className="cats">
      {categories.map((c) => (
        <button
          key={c.key}
          onClick={() => onSelect(c.key)}
          className={`cpill${active === c.key ? " active" : ""}`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
