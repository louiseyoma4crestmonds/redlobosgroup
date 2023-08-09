export type NoteItemProps = {
  id: string;
  title: string;
  summary: string;
  timestamp: string;
  viewCallback: (id: string) => void;
  deleteCallback: (id: string) => void;
};
