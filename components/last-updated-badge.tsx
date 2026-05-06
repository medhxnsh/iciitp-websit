import { useTranslations } from "next-intl";

interface LastUpdatedBadgeProps {
  date: string; // ISO 8601 e.g. "2025-09-01"
}

export function LastUpdatedBadge({ date }: LastUpdatedBadgeProps) {
  const t = useTranslations("a11y");
  const formatted = new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <p className="text-sm text-[--color-muted]">
      <time dateTime={date}>
        {t("lastUpdatedOn")}: {formatted}
      </time>
    </p>
  );
}
