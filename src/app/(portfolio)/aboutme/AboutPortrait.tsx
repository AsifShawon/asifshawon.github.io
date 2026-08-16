import Image from "next/image";

/**
 * Real photo when `avatar_url` is set (cropped 4:5, `object-fit: cover`).
 * Otherwise falls back to an abstract illustration — ported from the design
 * reference, recoloured onto Mint Ledger tokens via CSS classes rather than
 * hardcoded fill hex — and says so in its own caption rather than pretending
 * to be a real photo.
 */
export default function AboutPortrait({
  avatarUrl,
  fullName,
}: {
  avatarUrl: string | null;
  fullName: string;
}) {
  return (
    <div
      className="about-portrait"
      data-has-photo={avatarUrl ? true : undefined}
      aria-label={avatarUrl ? undefined : "Placeholder illustration"}
    >
      <div className="about-portrait__meta">
        <span>Portrait</span>
        <span>Operator + Builder</span>
      </div>

      {avatarUrl ? (
        <div className="about-portrait__photo">
          <Image
            src={avatarUrl}
            alt={`Portrait of ${fullName}`}
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 32rem"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="about-portrait__art" aria-hidden="true">
          <svg viewBox="0 0 400 500" role="presentation">
            <circle cx="208" cy="196" r="95" className="about-portrait__fill-mint" />
            <path
              d="M131 190c0-62 34-108 87-108 54 0 91 43 91 105 0 44-20 74-44 94-10 8-14 18-13 31l3 36H162l4-37c1-12-4-23-15-31-26-20-40-51-40-90h20z"
              className="about-portrait__fill-green"
            />
            <path
              d="M88 475c8-82 55-133 121-133 70 0 115 51 124 133H88z"
              className="about-portrait__fill-ink"
            />
            <path
              d="M173 189c10 9 19 13 32 13 15 0 25-5 36-14M205 222c8 0 15-2 21-6"
              fill="none"
              className="about-portrait__stroke-canvas"
              strokeWidth="5"
              strokeLinecap="round"
              opacity=".88"
            />
            <circle cx="165" cy="173" r="5" className="about-portrait__fill-canvas" />
            <circle cx="240" cy="173" r="5" className="about-portrait__fill-canvas" />
            <path
              d="M108 129c24-58 65-88 121-86 40 2 73 22 96 61-44-18-82-19-116 2-34 21-68 28-101 23z"
              className="about-portrait__fill-indigo"
            />
          </svg>
        </div>
      )}

      <div className="about-portrait__caption">
        <strong>{fullName}</strong>
        <span>{avatarUrl ? null : "Illustration placeholder — swap for a real portrait"}</span>
      </div>
    </div>
  );
}
