interface YouTubeEmbedProps {
  youtubeId: string;
  title: string;
  className?: string;
}

export function YouTubeEmbed({ youtubeId, title, className = '' }: YouTubeEmbedProps) {
  if (!youtubeId) return null;
  const src = `https://www.youtube.com/embed/${encodeURIComponent(youtubeId)}?rel=0&modestbranding=1`;
  return (
    <iframe
      className={`w-full aspect-video rounded ${className}`}
      src={src}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      loading="lazy"
    />
  );
}
