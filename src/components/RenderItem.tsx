import { Pencil, X } from "lucide-react";
import type { Item } from "../types/task";
import { Input } from "./Input";

interface RenderItemProps {
  item: Item;
  completed?: boolean;
  isEditing: boolean;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onUpdateMessage: (message: string) => void;
  onToggle: () => void;
  onDelete: () => void;
}

export function RenderItem({
  item,
  completed = false,
  isEditing,
  onStartEditing,
  onStopEditing,
  onUpdateMessage,
  onToggle,
  onDelete,
}: RenderItemProps) {
  return (
    <article className={styles.item} role="listitem">
      <div className={styles.itemRow}>
        <label className={styles.itemMain}>
          <input
            className={styles.checkbox}
            type="checkbox"
            checked={item.done}
            onChange={onToggle}
          />

          {isEditing ? (
            <Input
              autoFocus
              className={`${styles.inputInline} ${completed ? styles.inputDone : ""}`}
              value={item.message}
              onChange={onUpdateMessage}
              onBlur={onStopEditing}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape") {
                  onStopEditing();
                }
              }}
              ariaLabel={`Edit task ${item.message}`}
            />
          ) : (
            <span
              className={`${styles.itemText} ${completed ? styles.inputDone : ""}`}
            >
              {item.message}
            </span>
          )}
        </label>

        <div className={styles.itemActions}>
          <button
            type="button"
            className={styles.iconButton}
            onClick={onStartEditing}
            aria-label={`Edit task ${item.message}`}
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            onClick={onDelete}
            aria-label={`Delete task ${item.message}`}
            title="Delete"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <hr className={styles.itemSeparator} />
    </article>
  );
}

const styles = {
  item: "grid gap-2",
  itemRow: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
  itemMain: "flex min-w-0 flex-1 items-center gap-2",
  checkbox: "h-4 w-4 accent-primary",
  inputInline: `w-full border border-zinc-300 bg-white text-zinc-900 outline-none transition focus:border-primary rounded-lg px-3 py-2`,
  inputDone: "line-through text-zinc-500",
  itemText: "text-zinc-800",
  itemActions: "flex items-center gap-2 self-end sm:self-auto",
  iconButton:
    "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-300 text-zinc-700 transition hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
  itemSeparator: "border-zinc-200",
};
