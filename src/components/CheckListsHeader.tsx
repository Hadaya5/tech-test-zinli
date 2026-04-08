import { useRef, useState } from "react";
import { slugify, createKey, normalizeText, toValidDate } from "../utils";
import type { CheckList, Data } from "../types/task";
import type { Dispatch, SetStateAction } from "react";
import { Input } from "./Input";

interface CheckListsHeaderProps {
  checklists: CheckList[];
  setChecklists: Dispatch<SetStateAction<CheckList[]>>;
}

export function CheckListsHeader({
  checklists,
  setChecklists,
}: CheckListsHeaderProps) {
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const createChecklistIn = (title: string) => {
    setChecklists((current) => [...current, createChecklist(title)]);
  };

  const downloadChecklists = () => {
    const data = toExportData(checklists);
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "checklists.json";
    anchor.click();

    window.URL.revokeObjectURL(url);
  };

  const uploadChecklists = async (file: File) => {
    try {
      const fileContent = await file.text();
      const parsedData = JSON.parse(fileContent) as Data;

      if (!isDataPayload(parsedData)) {
        setUploadError("Invalid JSON format. Expected { lists: [...] }.");
        return;
      }

      const importedChecklists = parsedData.lists.map(toChecklist);

      setChecklists((current) => [...current, ...importedChecklists]);
      setUploadError("");
    } catch {
      setUploadError("Could not parse JSON file.");
    }
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.heading}>Create and organize your tasks</h1>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          const title = newChecklistTitle.trim();
          if (!title) {
            return;
          }

          createChecklistIn(title);
          setNewChecklistTitle("");
        }}
      >
        <Input
          className={styles.input}
          value={newChecklistTitle}
          onChange={setNewChecklistTitle}
          placeholder="New checklist name"
          ariaLabel="Create a new checklist"
        />
        <button className={styles.button} type="submit">
          Create checklist
        </button>
      </form>

      <div className={styles.actions}>
        <input
          ref={fileInputRef}
          className={styles.hiddenInput}
          type="file"
          accept="application/json"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];

            if (selectedFile) {
              void uploadChecklists(selectedFile);
            }

            e.target.value = "";
          }}
        />

        <button
          type="button"
          className={styles.uploadButton}
          onClick={() => fileInputRef.current?.click()}
        >
          Subir tareas
        </button>
        <button
          type="button"
          className={styles.downloadButton}
          onClick={downloadChecklists}
        >
          Descargar
        </button>
      </div>

      {uploadError ? <p className={styles.errorText}>{uploadError}</p> : null}
    </header>
  );
}

const createChecklist = (title: string): CheckList => {
  const id = createKey();

  return {
    id,
    slug: `${slugify(title)}-${id}`,
    title,
    items: [],
    created_at: new Date(),
  };
};

const toExportData = (checklists: CheckList[]): Data => ({
  lists: checklists.map((checklist) => ({
    slug: checklist.slug,
    title: checklist.title,
    created_at: checklist.created_at,
    items: checklist.items.map((item) => ({
      message: item.message,
      done: item.done,
      created_at: item.created_at,
    })),
  })),
});

const isDataPayload = (value: unknown): value is Data => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const data = value as Record<string, unknown>;
  return Array.isArray(data.lists);
};

const toChecklist = (entry: Data["lists"][number]): CheckList => {
  const id = createKey();
  const title = normalizeText(entry.title, "Imported checklist");

  return {
    id,
    slug:
      typeof entry.slug === "string" && entry.slug.trim()
        ? entry.slug
        : `${slugify(title)}-${id}`,
    title,
    created_at: toValidDate(entry.created_at),
    items: (entry.items ?? []).map((item) => ({
      id: createKey(),
      message: normalizeText(item.message, "Imported task"),
      done: Boolean(item.done),
      created_at: toValidDate(item.created_at),
    })),
  };
};

const styles = {
  header:
    "relative overflow-hidden bg-secondary rounded-3xl shadow-sm backdrop-blur mt-8 p-4 md:p-8",
  heading:
    "mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-[#1A365D] md:text-4xl lg:text-5xl",
  form: "mt-5 flex flex-col gap-3 sm:flex-row",
  input:
    "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none ring-0 transition focus:border-amber-600",
  button:
    "w-full h-10 md:w-60 md:h-auto rounded-xl bg-zinc-900 px-10 font-medium text-white transition hover:bg-zinc-700",
  actions: "mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end",
  hiddenInput: "hidden",
  uploadButton:
    "h-10 rounded-xl bg-zinc-800 px-6 font-medium text-white transition hover:bg-zinc-700",
  downloadButton:
    "h-10 rounded-xl bg-[#1A365D] px-6 font-medium text-white transition hover:bg-[#153152]",
  errorText: "mt-2 text-sm text-red-600 sm:text-right",
};
