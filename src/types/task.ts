// The id was added to the checklist for better identification
export interface Item {
  id: string;
  message: string;
  done: boolean;
  created_at: Date;
}

// The id was added to the checklist for better identification
// also because a slug could be repeated if the user creates two checklists 
// with the same title
export interface CheckList {
  id: string;
  slug: string;
  title: string;
  items: Array<Item>;
  created_at: Date;
}

export interface DataItem {
  message: string;
  done: boolean;
  created_at: Date | string;
}

export interface DataCheckList {
  slug?: string;
  title: string;
  items: Array<DataItem>;
  created_at: Date | string;
}

export interface Data {
  lists: Array<DataCheckList>;
}