import { Pencil } from "lucide-react";
import { Input } from "./Input";

interface RenderTitleProps {
  title: string;
  isEditing: boolean;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onUpdateTitle: (title: string) => void;
}

export function RenderTitle({
  title,
  isEditing,
  onStartEditing,
  onStopEditing,
  onUpdateTitle,
}: RenderTitleProps) {
  return (
    <div className={styles.row}>
      {isEditing ? (
        <Input
          autoFocus
          className={styles.input}
          value={title}
          onChange={onUpdateTitle}
          onBlur={onStopEditing}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Escape") {
              onStopEditing();
            }
          }}
          ariaLabel={`Edit name of ${title}`}
        />
      ) : (
        <span className={styles.text}>{title}</span>
      )}

      <button
        type="button"
        className={styles.iconButton}
        onClick={onStartEditing}
        aria-label={`Edit list ${title}`}
        title="Edit list"
      >
        <Pencil size={16} />
      </button>
    </div>
  );
}

const styles = {
  row: "mt-2 flex items-center gap-2",
  text: "text-2xl font-semibold tracking-tight text-card-foreground",
  input: `w-full border border-zinc-300 bg-white text-zinc-900 outline-none transition focus:border-primary rounded-xl px-4 py-2`,
  iconButton:
    "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-300 text-zinc-700 transition hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
};
