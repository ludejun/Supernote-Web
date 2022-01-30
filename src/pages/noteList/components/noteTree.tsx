import React, { useState, useEffect, useMemo } from 'react';
import { NoteItem } from '.';
import './noteTree.less';

export interface INoteTree {
  dataSource: []; // 数据源
  hasOffical?: boolean; // 是否含有辰记官网笔记，默认有
  onNoteClick?: (note: {}) => void; // 点击某个笔记的回调
  // initActiveId?: string | null | undefined; // 初始active的笔记ID
  // createNewNote?: {} | undefined; // 新增笔记时的被选中笔记id，即为父笔记
  activeNote?: {} | undefined; // 当前选中的笔记，如果新增，则activeNote.id为null
}
export const NoteTree = (props: INoteTree) => {
  const { dataSource = [], hasOffical = true, onNoteClick, activeNote } = props;
  // const [activeId, setActiveId] = useState(initActiveId);
  // const noteClick = (note) => {
  //   setActiveId(note.id);
  //   console.log(note);
  //   onNoteClick(note);
  // }

  const noteLoop = (note, parentId) => {
    const { id, title, children = [] } = note;
    console.log(note, parentId, activeNote);
    return (
      <>
        <NoteItem
          key={id}
          title={title}
          onClick={() => onNoteClick(note)}
          active={activeNote && activeNote.id === id}
        />
        <div className="note-children">
          {children.length > 0 ? children.map(child => noteLoop(child, id)) : null}
          <NoteItem
            active={activeNote && activeNote.id === null}
            show={!!activeNote && activeNote.id === null && activeNote.parentId === id}
          />
        </div>
      </>
    );
  };

  return (
    <div className="note-container">
      {hasOffical ? <NoteItem title="辰记官方" active={activeNote === undefined} /> : null}
      {dataSource && dataSource.length > 0 ? (
        <>
          {useMemo(() => dataSource.map(note => noteLoop(note, null)), [dataSource, activeNote])}
          <NoteItem
            active={activeNote && activeNote.id === null}
            show={!!activeNote && activeNote.id === null && activeNote.parentId === undefined}
          />
        </>
      ) : (
        <div>+ 点击新增笔记</div>
      )}
    </div>
  );
};
