export interface Note {
  noteId: number;
  parentId?: number;
  userId: number;
  title?: string;
  content?: string;
  createTime: string;
  modifyTime: string;
}

export type NotesTree = [
  Note & {
    childNodes?: [];
  },
];

export interface activeNote {
  noteId: number;
  parentId?: number;
  title?: string;
  content?: string;
};