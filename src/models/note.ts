export const note = {
  state: {
    saveLoading: false,
    saveStatus: null,
    getLoading: false,
    noteContent: null,
    getFirstLoading: false,
    firstNotes: null
  }, // initial state
  reducers: {
    // 保存笔记
    saveNote(
      state: Record<string, unknown>,
      payload: {
        loading: boolean;
        status: string;
        data: {
          note_id: string;
        };
      }
    ) {
      return {
        ...state,
        saveLoading: payload.loading,
        ...{
          saveStatus: payload.status === 'start' ? payload.status : null
        }
      };
    },
    // 获取笔记内容
    getNote(
      state: Record<string, unknown>,
      payload: {
        loading: boolean;
        status: string;
        data: {
          content: string;
        };
      }
    ) {
      return {
        ...state,
        getLoading: payload.loading,
        ...(payload.status === 'success' ? { noteContent: payload.data.content } : null)
      };
    },
    // 获取第一列笔记树
    getUserNotes(
      state: Record<string, unknown>,
      payload: {
        loading: boolean;
        status: string;
        data: {
          notes: [];
        };
      }
    ) {
      return {
        ...state,
        getFirstLoading: payload.loading,
        ...(payload.status === 'success' ? { firstNotes: payload.data.notes } : null)
      };
    },
    // 清空笔记内容
    clearNoteContent(state) {
      return {
        ...state,
        noteContent: null
      };
    }
  }
};
