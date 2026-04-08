import { createKey, sortByCreatedAt } from "../utils";
import { CheckListCard } from "./CheckListCard";
import type { Dispatch, SetStateAction } from "react";
import type { CheckList, Item } from "../types/task";

interface CheckListsProps {
  checklists: CheckList[];
  setChecklists: Dispatch<SetStateAction<CheckList[]>>;
}

const createItem = (message: string): Item => ({
  id: createKey(),
  message,
  done: false,
  created_at: new Date(),
});

export function CheckLists({ checklists, setChecklists }: CheckListsProps) {
  const deleteChecklistFrom = (id: string) => {
    setChecklists((current) =>
      current.filter((checklist) => checklist.id !== id),
    );
  };

  const updateChecklistTitleIn = (id: string, title: string) => {
    setChecklists((current) =>
      current.map((checklist) =>
        checklist.id === id ? { ...checklist, title } : checklist,
      ),
    );
  };

  const addItemIn = (checklistId: string, message: string) => {
    setChecklists((current) =>
      current.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              items: [...checklist.items, createItem(message)],
            }
          : checklist,
      ),
    );
  };

  const updateItemMessageIn = (
    checklistId: string,
    itemId: string,
    message: string,
  ) => {
    setChecklists((current) =>
      current.map((checklist) => {
        if (checklist.id !== checklistId) {
          return checklist;
        }

        return {
          ...checklist,
          items: checklist.items.map((item) =>
            item.id === itemId ? { ...item, message } : item,
          ),
        };
      }),
    );
  };

  const toggleItemIn = (checklistId: string, itemId: string) => {
    setChecklists((current) =>
      current.map((checklist) =>
        checklist.id !== checklistId
          ? checklist
          : {
              ...checklist,
              items: checklist.items.map((item) =>
                item.id === itemId ? { ...item, done: !item.done } : item,
              ),
            },
      ),
    );
  };

  const deleteItemFrom = (checklistId: string, itemId: string) => {
    setChecklists((current) =>
      current.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              items: checklist.items.filter((item) => item.id !== itemId),
            }
          : checklist,
      ),
    );
  };

  const orderedChecklists = sortByCreatedAt(checklists);

  return (
    <section className={styles.section} aria-label="Task lists">
      {orderedChecklists.length === 0 ? (
        <p className={styles.empty}>No lists have been created yet.</p>
      ) : (
        orderedChecklists.map((checklist) => (
          <CheckListCard
            key={checklist.id}
            checklist={checklist}
            onDeleteChecklist={deleteChecklistFrom}
            onUpdateChecklistTitle={updateChecklistTitleIn}
            onAddItem={addItemIn}
            onUpdateItemMessage={updateItemMessageIn}
            onToggleItem={toggleItemIn}
            onDeleteItem={deleteItemFrom}
          />
        ))
      )}
    </section>
  );
}

const styles = {
  section: "flex flex-wrap justify-center items-start gap-6 ",
  empty:
    "rounded-2xl border border-dashed border-zinc-300 bg-white/70 px-5 py-8 text-center text-zinc-600",
};
