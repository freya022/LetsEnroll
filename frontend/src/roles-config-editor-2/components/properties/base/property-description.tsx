export default function PropertyDescription({
  description,
}: {
  description: string;
}) {
  return <span className="text-muted-foreground text-sm">{description}</span>;
}
