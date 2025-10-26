"use client";

export function Pub({
  authors,
  year,
  title,
  venue,
  link,
}: {
  authors: string;
  year: string;
  title: string;
  venue: string;
  link?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-neutral-500 w-14 shrink-0">{year}</div>
      <div>
        <div className="text-neutral-900">{authors}</div>
        <div className="font-medium">{title}</div>
        <div className="text-neutral-700 italic text-sm">{venue}</div>
        {link && (
          <a href={link} className="text-sm underline mt-1 inline-block">
            {link}
          </a>
        )}
      </div>
    </div>
  );
}
