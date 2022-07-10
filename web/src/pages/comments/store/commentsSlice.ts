import {
  createSelector,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";
import { RootState } from "src/config/store";
import { IComment } from "../types/comment.model";
import {
  createComment,
  fetchComments,
  updateComment,
} from "./comments.actions";

export interface CommentsState {
  comments: IComment[];
  currentPage: number;
  pageCount: number;
  loadingStatus: {
    fetching: "idle" | "loading" | "error";
    saving: "idle" | "loading" | "error";
  };
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  currentPage: 1,
  pageCount: 1,
  loadingStatus: {
    fetching: "idle",
    saving: "idle",
  },
  error: null,
};

export const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearCommentState(state) {
      state.error = null;
      state.loadingStatus.fetching = "idle";
      state.loadingStatus.saving = "idle";
    },
    setCurrentPage(state, { payload }) {
      state.currentPage = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loadingStatus.fetching = "loading";
      })
      .addCase(fetchComments.fulfilled, (state, { payload }) => {
        state.loadingStatus.fetching = "idle";
        state.comments = payload.results;
        state.pageCount = payload.pageCount;
        state.error = null;
      })
      .addCase(fetchComments.rejected, (state, { payload }) => {
        state.loadingStatus.fetching = "idle";
        state.error = payload as string;
      })
      .addMatcher(isPending(createComment, updateComment), (state) => {
        state.loadingStatus.saving = "loading";
      })
      .addMatcher(isFulfilled(createComment, updateComment), (state) => {
        state.error = null;
        state.loadingStatus.saving = "idle";
      })
      .addMatcher(
        isRejected(createComment, updateComment),
        (state, { payload }) => {
          state.error = payload as string;
          state.loadingStatus.saving = "error";
        }
      );
  },
});

const selectCommentsSlice = (state: RootState) => state.comments;
export const selectComments = createSelector(
  selectCommentsSlice,
  (state) => state.comments
);
export const selectCommentsPageCount = createSelector(
  selectCommentsSlice,
  (state) => state.pageCount
);
export const selectIsLoadingComments = createSelector(
  selectCommentsSlice,
  (state) => state.loadingStatus.fetching
);
export const selectIsSavingComment = createSelector(
  selectCommentsSlice,
  (state) => state.loadingStatus.saving
);
export const selectSaveCommentError = createSelector(
  selectCommentsSlice,
  (state) => state.error
);
export const selectCommentsCurrentPage = createSelector(
  selectCommentsSlice,
  (state) => state.currentPage
);

export const { clearCommentState } = commentsSlice.actions;

export default commentsSlice.reducer;
