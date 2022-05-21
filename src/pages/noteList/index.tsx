import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
// import { useHistory } from 'react-router-dom';
import { message, Layout, Menu, Modal, Input } from 'antd';
// import RichTextEditor from 'quill-react-commercial';
import RichTextEditor from '../../components/RichTextEditor/dist/quill-react-commercial.min';
// import RichTextEditor from '../../components/RichTextEditor/index';
import { NoteTree } from './components';
import { DispatchPro, RootState } from '@/store';
import { request, stringSort, debance, throttle } from '@/utils';
import { ajaxFormPostOptions, apiURL } from '@/configs/api';
import './index.less';
import 'quill-react-commercial/dist/quill-react-commercial.min.css';
import { getUserInfo } from '@/utils/userInfo';
import { Note } from './note.interface';
import { updateFirstNotes } from './utils';

const NoteList = props => {
  const {
    saveNote,
    getNote,
    // saveLoading,
    // getLoading,
    activeNote,
    getUserNotes,
    // getFirstLoading,
    firstNotes,
    clearNoteContent,
    updateActiveNote,
    saveStatus,
  } = props;
  const [quill, setQuill] = useState(null);
  // const [activeNote, setActiveNote] = useState(undefined); // 选中的笔记树内容，默认为undefined，当为新增笔记时，{id: null, title: '无标题'}，当为activeNote.id为null时应该在新增笔记
  // const [editing, setEditing] = useState(false); // 是否有未被保存笔记内容
  // 笔记的编辑态存放在activeNote中
  const userId = getUserInfo().id;
  const editing = useRef(false); // 是否有未被保存笔记内容，这个值更新不需要重新渲染组件，在函数组件中保持值使用useRef
  const [title, setTitle] = useState(activeNote?.title); // activeNote的title
  const [initContent, setInitContent] = useState(null); // 富文本编辑器的初始化内容
  const lastSaveTime = useRef(null); // 上一个保存笔记时间，不代表保存成功，为在保存过程中有新增编辑但保存成功后会优先清楚编辑态导致点击其他笔记不会触发保存 [type: start/edit, timestamp]

  const { Header, Content, Footer } = Layout;

  const getQuill = quillIns => {
    setQuill(quillIns);
  };

  useEffect(() => {
    getNoteTree();
  }, []);
  useEffect(() => {
    setTitle(activeNote?.title);
  }, [activeNote]);

  const quillChange = (delta, old, source) => {
    console.log('quill-change:', delta, old, source, editing);
    if (!editing.current) {
      editing.current = true; // 标识编辑态，在切换笔记、新增时先保存
    }
    if (lastSaveTime.current && lastSaveTime.current[0] === 'start') {
      lastSaveTime.current[0] = 'edit'; // 保存过程中是否有编辑
    }
  };

  const getNoteById = noteId => {
    getNote({
      params: {
        noteId,
        userId,
      },
      apiName: 'getNote',
    }).then(data => {
      const { note } = data || {};
      note && note.content && setInitContent(JSON.parse(note.content));
    });
  };
  const getNoteTree = () => {
    getUserNotes({
      params: {
        userId,
      },
      apiName: 'getUserNotes',
    });
  };

  // 新建笔记
  const createContent = () => {
    editing.current = true;
    updateActiveNote({
      noteId: null,
      title: null,
      parentId: activeNote?.noteId,
    });
    setInitContent(null); // 初始化笔记内容，而不能直接使用activeNote.content，因为当更新或保存会重新渲染导致内容重置到保存时刻，光标变到开头
  };
  // 保存笔记，在某些新建笔记接口失败的情况下，也充当新建笔记作用
  const saveContent = () => {
    const content = quill?.getContents();
    // 标识是否在保存期间有编辑
    lastSaveTime.current = ['start', new Date().getTime()]; // 时间戳暂时没用

    return saveNote({
      params: {
        parentId: activeNote.parentId,
        title: activeNote.title,
        content: JSON.stringify(content),
        noteId: activeNote.noteId,
        userId,
      },
      apiName: activeNote.noteId === null ? 'createNote' : 'saveNote',
    })
      .then(data => {
        console.log(33333, data);
        if (lastSaveTime.current && lastSaveTime.current[0] !== 'edit') {
          editing.current = false;
        }
        // TODO 保存成功更新笔记树：first/second
        updateFirstNotes(data.note);
        return data.note; // 发布时用
      })
      .finally(() => {
        lastSaveTime.current = ['end', new Date().getTime()];
      });
  };
  // 当还有未保存笔记内容时的弹框
  const editingSaveConfirm = (type: string, note: Note | null) => {
    Modal.confirm({
      title: '您还有未保存笔记内容',
      content: '是否保存？',
      onOk() {
        saveContent().then(() => {
          type === 'create' ? createContent() : onNoteClick(note);
        });
      },
      onCancel() {
        editing.current = false; // 不保存说明编辑态取消
        type === 'create' ? createContent() : onNoteClick(note);
      },
    });
  };
  const addNewNote = () => {
    console.log('新增笔记！');
    if (editing.current) {
      editingSaveConfirm('create', null);
    } else {
      clearNoteContent();
      createContent();
    }
  };
  const onNoteClick = note => {
    // 当点击别的笔记，判断当前笔记改动是否保存
    if (activeNote && editing.current && note.noteId !== activeNote.noteId) {
      editingSaveConfirm('save', note);
    } else if (note.noteId !== activeNote?.noteId) {
      // 先拿Tree的数据显示在树上，防止出现点击左侧在接口很慢的情况下，左侧树等接口返回才有反应
      updateActiveNote(note);
      getNoteById(note.noteId);
    }
  };

  // // title更改防抖
  // const onTitleChangeHandle = useCallback(
  //   debance(title => updateActiveNote({ title }), 500),
  //   [],
  // );
  // const setTitle = e => {
  //   onTitleChangeHandle(e.target.value);
  // };
  const onTitleChange = e => {
    setTitle(e.target.value);
    editing.current = true; // 标题更改也是编辑
  };
  const onTilteBlur = () => {
    updateActiveNote({ title }); // 失焦再更新active.title
  };

  const publishNote = async () => {
    if (editing.current || saveStatus === 'failure') {
      try {
        const note = await saveContent();
        console.log('发布内容：', note);
        
      } catch (e) {
        console.log('发布失败');
      }
    } else {
      console.log('发布内容：', activeNote);
    }
  }

  return (
    <Layout className="main-layout">
      <Layout.Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={broken => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        className="sider"
      >
        <div className="logo">LOGO 辰记</div>
        <div className="add-note" onClick={addNewNote}>
          新增笔记
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['home']}
          defaultOpenKeys={['myNote']}
        >
          <Menu.Item key="home">首页</Menu.Item>
          <Menu.SubMenu key="myNote" title="我的笔记" className="first-note-tree">
            <NoteTree
              dataSource={firstNotes?.sort((a, b) => stringSort(a.title, b.title))}
              onNoteClick={onNoteClick}
              activeNote={activeNote}
            />
          </Menu.SubMenu>
          <Menu.Item key="6">我的收藏</Menu.Item>
          <Menu.Item key="7">回收站</Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout className="note-layout">
        <Header className="note-header" />
        <Content className="note-content">
          <div>
            <Input
              allowClear
              placeholder="无标题"
              onChange={onTitleChange}
              value={title}
              onBlur={onTilteBlur}
            />
            <RichTextEditor
              modules={{
                table: {},
                codeHighlight: true,
                imageHandler: {
                  imgUploadApi: formData =>
                    // console.log(apiURL('uploadImg'))
                    request(apiURL('uploadImg'), ajaxFormPostOptions(formData)).then(
                      response => response.url,
                    ),
                  uploadFailCB: () => message.error('图片上传失败'),
                },
              }}
              getQuill={getQuill}
              content={
                // activeNote && activeNote.content && typeof activeNote.content === 'string'
                //   ? JSON.parse(activeNote.content)
                //   : activeNote?.content
                initContent
              }
              onChange={quillChange}
            />
            {saveStatus === 'failure' ? (
              <button onClick={saveContent}>重新保存</button>
            ) : (
              <button onClick={saveContent}>保存</button>
            )}
            <div id="quillContent" />
            <button onClick={publishNote}>发布</button>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>辰记@2022</Footer>
      </Layout>
    </Layout>
  );
};

const mapStateToProps = ({ note }: RootState) => ({
  saveLoading: note.saveLoading,
  getLoading: note.getLoading,
  activeNote: note.activeNote,
  firstNotes: note.firstNotes,
  getFirstLoading: note.getFirstLoading,
  saveStatus: note.saveStatus,
});
const mapDispatchToProps = ({
  note: { createNote, saveNote, getNote, getUserNotes, clearNoteContent, updateActiveNote },
}: DispatchPro): any => ({
  createNote,
  saveNote,
  getNote,
  getUserNotes,
  clearNoteContent,
  updateActiveNote,
});

export default connect(mapStateToProps, mapDispatchToProps)(NoteList);
