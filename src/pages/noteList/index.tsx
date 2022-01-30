import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { message, Layout, Menu, Modal, Input } from 'antd';
import RichTextEditor from 'quill-react-commercial';
// import RichTextEditor from '../../components/RichTextEditor/dist/quill-react-commercial.min';
// import RichTextEditor from '../../components/RichTextEditor/index';
import { NoteTree } from './components';
import { Dispatch, RootState } from '../../store';
import { request, Storage, stringSort } from '../../utils';
import { ajaxFormPostOptions, apiURL } from '../../configs/api';
import './index.less';

const NoteList = props => {
  const {
    saveNote,
    saveStatus,
    getNote,
    saveLoading,
    getLoading,
    noteContent,
    getUserNotes,
    getFirstLoading,
    firstNotes,
    clearNoteContent
  } = props;
  const [quill, setQuill] = useState(null);
  const [activeNote, setActiveNote] = useState(undefined); // 选中的笔记树内容，默认为undefined，当为新增笔记时，{id: null, title: '无标题'}，当为activeNote.id为null时应该在新增笔记
  const [hasChange, setChage] = useState(false); // 是否有未被保存笔记内容

  const { Header, Content, Footer, Sider } = Layout;

  const getQuill = quillIns => {
    setQuill(quillIns);
  };

  useEffect(() => {
    getNoteTree();
    // getNoteById('133229697713573888');
  }, []);

  // 新建或者保存笔记成功后
  useEffect(() => {
    if (saveStatus === 'success') {
      message.success('保存成功');
      hasChange && setChage(false);
    } else {
      // TODO ? 在request中处理
    }
  }, [saveStatus]);
  // 当quill实例建立成功后，监听quill方法
  useEffect(() => {
    if (quill) {
      // 是否有未保存笔记
      quill.on('text-change', (delta, old, source) => {
        console.log('quill-change:', delta, old, source);
        if (quill.hasFocus()) setChage(true); // 切换笔记也会导致change
      });
    }
  }, [quill]);

  const getNoteById = id => {
    getNote({
      apiUrl: `${apiURL('getNote')}/${id}`,
      apiOptions: {
        method: 'GET'
      }
    });
  };
  const getNoteTree = () => {
    getUserNotes({
      apiUrl: `${apiURL('getUserNotes')}`,
      apiOptions: {
        method: 'GET'
      }
    });
  };
  const createContent = () => {
    const content = quill?.getContents();
    return saveNote({
      params: {
        parentId: activeNote?.id,
        title: '1.新人须知',
        content: JSON.stringify(content)
      },
      apiName: 'createNote'
    });
  };
  const addNewNote = () => {
    console.log('新增笔记！');
    if (hasChange) {
      Modal.confirm({
        title: '您还有未保存笔记内容',
        content: '是否保存？',
        onOk() {
          // TODO 这里先用新建笔记，应该用保存笔记
          // 保存笔记确保未保存笔记是当前active笔记，只要点击别的笔记时能保证未存储部分已成功保存
          createContent();

          // TODO 保存成功后去更新NoteTree
          // createContent()
        },
        onCancel() {
          clearNoteContent();
          setChage(false);
          setActiveNote({
            id: null,
            title: '无标题',
            parentId: activeNote?.id
          });
        }
      });
    } else {
      clearNoteContent();
      setActiveNote({
        id: null,
        title: '无标题',
        parentId: activeNote?.id
      });
    }
  };
  const onNoteClick = note => {
    // 当点击别的笔记，判断当前笔记改动是否保存
    if (hasChange && note.id !== activeNote.id) {
      // TODO 保存笔记
      Modal.confirm({
        title: '您还有未保存笔记内容',
        content: '是否保存？'
        // ... 和addNewNote中整合 TODO
      });
      // 保存成功 TODO
      getNoteById(note.id);
      setActiveNote(note);
    } else if (note.id !== activeNote?.id) {
      getNoteById(note.id);
      setActiveNote(note);
    }
  };

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
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
          <Menu.Item key="1">首页</Menu.Item>
          <Menu.SubMenu key="sub1" title="我的笔记" className="first-note-tree">
            {
              <NoteTree
                dataSource={firstNotes?.sort((a, b) => stringSort(a.title, b.title))}
                onNoteClick={onNoteClick}
                activeNote={activeNote}
              />
            }
          </Menu.SubMenu>
          <Menu.Item key="6">我的收藏</Menu.Item>
          <Menu.Item key="7">回收站</Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout className="note-layout">
        <Header className="note-header" />
        <Content className="note-content">
          <div>
            <Input value={activeNote?.title} />
            <RichTextEditor
              modules={{
                table: {},
                codeHighlight: true,
                imageHandler: {
                  imgUploadApi: formData => {
                    // console.log(apiURL('uploadImg'))
                    return request(apiURL('uploadImg'), ajaxFormPostOptions(formData)).then(
                      response => {
                        return {
                          response,
                          processRes: response => response.url
                        };
                      }
                    );
                  },
                  uploadFailCB: () => message.error('图片上传失败')
                }
              }}
              getQuill={getQuill}
              content={JSON.parse(noteContent)}
            />
            <button onClick={createContent}>保存</button>
            <div id="quillContent" />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>辰记@2022</Footer>
      </Layout>
    </Layout>
  );
};

const mapStateToProps = ({ note }: RootState) => ({
  saveStatus: note.saveStatus,
  saveLoading: note.saveLoading,
  getLoading: note.getLoading,
  noteContent: note.noteContent,
  firstNotes: note.firstNotes,
  getFirstLoading: note.getFirstLoading
});
const mapDispatchToProps = ({
  note: { saveNote, getNote, getUserNotes, clearNoteContent }
}: Dispatch) => ({
  saveNote,
  getNote,
  getUserNotes,
  clearNoteContent
});

export default connect(mapStateToProps, mapDispatchToProps)(NoteList);
