"use client";

export function ArticleCard({
  title,
  desc,
  tags,
}: {
  title: string;
  desc: string;
  tags: string[];
}) {
  return (
    <article className="group relative rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-lg transition shadow-neutral-200/70">
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition"
        style={{ background: "linear-gradient(135deg, rgba(0,33,165,0.15), rgba(250,70,22,0.15))" }}
      />
      <div className="relative">
        <h3 className="font-semibold text-lg tracking-tight">{title}</h3>
        <p className="mt-2 text-neutral-700 text-sm">{desc}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-1 rounded-full border border-neutral-200 bg-white/80 backdrop-blur shadow-sm"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
