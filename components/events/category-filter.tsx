import type { Category } from "@/lib/types";

type CategoryFilterProps = {
  categories: Category[];
  selectedCategory?: Category | "All";
};

export function CategoryFilter({
  categories,
  selectedCategory = "All",
}: CategoryFilterProps) {
  const options = ["All", ...categories] as const;

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
      {options.map((category) => {
        const isSelected = category === selectedCategory;

        return (
          <button
            key={category}
            className={
              isSelected
                ? "h-9 shrink-0 rounded-full bg-[#1f3025] px-4 text-sm font-medium text-white shadow-sm"
                : "h-9 shrink-0 rounded-full border border-[#ddd3c6] bg-white px-4 text-sm font-medium text-[#48433d] transition-colors hover:bg-[#f0ebe3]"
            }
            type="button"
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
