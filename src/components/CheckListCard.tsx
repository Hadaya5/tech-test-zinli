import { useState } from "react";
import { X } from "lucide-react";
import { RenderItem } from "./RenderItem";
import { RenderTitle } from "./RenderTitle";
import { Input } from "./Input";
import type { CheckList } from "../types/task";

interface CheckListCardProps {
  checklist: CheckList;
  onDeleteChecklist: (id: string) => void;
  onUpdateChecklistTitle: (id: string, title: string) => void;
  onAddItem: (checklistId: string, message: string) => void;
  onUpdateItemMessage: (
    checklistId: string,
    itemId: string,
    message: string,
  ) => void;
  onToggleItem: (checklistId: string, itemId: string) => void;
  onDeleteItem: (checklistId: string, itemId: string) => void;
}

export function CheckListCard({
  checklist,
  onDeleteChecklist,
  onUpdateChecklistTitle,
  onAddItem,
  onUpdateItemMessage,
  onToggleItem,
  onDeleteItem,
}: CheckListCardProps) {
  const [newItemMessage, setNewItemMessage] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const pendingItems = checklist.items
    .filter((item) => !item.done)
    .sort(
      (left, right) => left.created_at.getTime() - right.created_at.getTime(),
    );

  const completedItems = checklist.items
    .filter((item) => item.done)
    .sort(
      (left, right) => left.created_at.getTime() - right.created_at.getTime(),
    );

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div>
          <p className={styles.label}>List</p>
          <RenderTitle
            title={checklist.title}
            isEditing={isEditingTitle}
            onStartEditing={() => setIsEditingTitle(true)}
            onStopEditing={() => setIsEditingTitle(false)}
            onUpdateTitle={(title) =>
              onUpdateChecklistTitle(checklist.id, title)
            }
          />
        </div>

        <button
          type="button"
          className={styles.iconButton}
          onClick={() => onDeleteChecklist(checklist.id)}
          aria-label={`Delete list ${checklist.title}`}
          title="Delete list"
        >
          <X size={16} />
        </button>
      </div>

      <form
        className={styles.createForm}
        onSubmit={(e) => {
          e.preventDefault();
          const message = newItemMessage.trim();
          if (!message) {
            return;
          }

          onAddItem(checklist.id, message);
          setNewItemMessage("");
        }}
      >
        <Input
          className={styles.input}
          value={newItemMessage}
          onChange={setNewItemMessage}
          placeholder="New task"
          ariaLabel={`Add task to ${checklist.title}`}
        />
        <button className={styles.primaryButton} type="submit">
          Add task
        </button>
      </form>

      <div className={styles.groups}>
        <section className={styles.group} aria-label="Pending tasks">
          <div className={styles.groupHeader}>
            <h3 className={styles.groupTitle}>Pending</h3>
            <span className={styles.groupCount}>{pendingItems.length}</span>
          </div>

          {pendingItems.length === 0 ? (
            <p className={styles.empty}>No pending tasks.</p>
          ) : (
            <div className={styles.list} role="list">
              {pendingItems.map((item) => (
                <RenderItem
                  key={item.id}
                  item={item}
                  isEditing={editingItemId === item.id}
                  onStartEditing={() => setEditingItemId(item.id)}
                  onStopEditing={() => setEditingItemId(null)}
                  onUpdateMessage={(message) =>
                    onUpdateItemMessage(checklist.id, item.id, message)
                  }
                  onToggle={() => onToggleItem(checklist.id, item.id)}
                  onDelete={() => onDeleteItem(checklist.id, item.id)}
                />
              ))}
            </div>
          )}
        </section>

        <section className={styles.group} aria-label="Completed tasks">
          <div className={styles.groupHeader}>
            <h3 className={styles.groupTitle}>Completed</h3>
            <span className={styles.groupCount}>{completedItems.length}</span>
          </div>

          {completedItems.length === 0 ? (
            <p className={styles.empty}>No completed tasks.</p>
          ) : (
            <div className={styles.list} role="list">
              {completedItems.map((item) => (
                <RenderItem
                  key={item.id}
                  item={item}
                  completed
                  isEditing={editingItemId === item.id}
                  onStartEditing={() => setEditingItemId(item.id)}
                  onStopEditing={() => setEditingItemId(null)}
                  onUpdateMessage={(message) =>
                    onUpdateItemMessage(checklist.id, item.id, message)
                  }
                  onToggle={() => onToggleItem(checklist.id, item.id)}
                  onDelete={() => onDeleteItem(checklist.id, item.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </article>
  );
}

const ui = {
  panel: "rounded-xl border border-zinc-200/80 bg-white/40",
  inputBase:
    "w-full border border-zinc-300 bg-white text-zinc-900 outline-none transition focus:border-primary",
  buttonBase:
    "rounded-xl px-4 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
};

const styles = {
  card: "rounded-lg bg-card p-4 shadow-xl md:p-6 min-w-full md:min-w-[70%] lg:min-w-[45%]",
  header:
    "mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
  label: `inline-flex w-fit rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary-foreground`,
  groupTitle: "text-base font-semibold text-card-foreground",
  groupCount: "text-sm text-zinc-500",
  createForm: "mt-3 flex flex-col gap-2 sm:flex-row",
  input: `${ui.inputBase} rounded-xl px-4 py-3`,
  primaryButton: `${ui.buttonBase} w-30 bg-primary text-primary-foreground hover:opacity-90`,
  iconButton:
    "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-300 text-zinc-700 transition hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
  groups: "mt-4 grid gap-4",
  group: `${ui.panel} grid gap-3 p-3`,
  groupHeader: "flex items-center justify-between",
  list: "grid gap-2",
  empty:
    "rounded-lg border border-dashed border-zinc-300 px-3 py-4 text-sm text-zinc-500",
};
