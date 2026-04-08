import type { Dispatch, SetStateAction } from "react";
import type { CheckList } from "./types/task";
import { CheckListsHeader, CheckLists } from "./components";
import useLocalStorage from "./hooks/useLocalStorage";

const styles = {
  page: "min-h-screen px-4 py-8 md:px-6",
  shell: "mx-auto flex w-full max-w-6xl flex-col gap-6",
};

function App() {
  const [storedChecklists, setStoredChecklists] = useLocalStorage<CheckList[]>(
    "checklists",
    [],
  );

  const parseChecklists = (values: CheckList[]): CheckList[] =>
    values.map((checklist) => ({
      ...checklist,
      created_at: new Date(checklist.created_at),
      items: checklist.items.map((item) => ({
        ...item,
        created_at: new Date(item.created_at),
      })),
    }));

  const checklists = parseChecklists(storedChecklists);

  const setChecklists: Dispatch<SetStateAction<CheckList[]>> = (value) => {
    setStoredChecklists((current) => {
      const parsedCurrent = parseChecklists(current);
      return value instanceof Function ? value(parsedCurrent) : value;
    });
  };

  return (
    <div className={styles.page}>
      <main className={styles.shell}>
        <CheckListsHeader
          checklists={checklists}
          setChecklists={setChecklists}
        />
        <CheckLists checklists={checklists} setChecklists={setChecklists} />
      </main>
    </div>
  );
}

export default App;
