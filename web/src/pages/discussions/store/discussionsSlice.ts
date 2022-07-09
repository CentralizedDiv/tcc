import {
  createSelector,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";
import { RootState } from "src/config/store";
import { IDiscussion } from "../types/discussion.model";
import {
  createDiscussion,
  fetchDiscussions,
  updateDiscussion,
} from "./discussions.actions";

export interface DiscussionsState {
  discussions: IDiscussion[];
  currentPage: number;
  pageCount: number;
  loadingStatus: {
    fetching: "idle" | "loading" | "error";
    saving: "idle" | "loading" | "error";
  };
  error: string | null;
}

const initialState: DiscussionsState = {
  discussions: [],
  currentPage: 1,
  pageCount: 1,
  loadingStatus: {
    fetching: "idle",
    saving: "idle",
  },
  error: null,
};

export const discussionsSlice = createSlice({
  name: "discussions",
  initialState,
  reducers: {
    clearDiscussionState(state) {
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
      .addCase(fetchDiscussions.pending, (state) => {
        state.loadingStatus.fetching = "loading";
      })
      .addCase(fetchDiscussions.fulfilled, (state, { payload }) => {
        state.loadingStatus.fetching = "idle";
        state.discussions = payload.results;
        state.pageCount = payload.pageCount;
      })
      .addMatcher(isPending(createDiscussion, updateDiscussion), (state) => {
        state.loadingStatus.saving = "loading";
      })
      .addMatcher(isFulfilled(createDiscussion, updateDiscussion), (state) => {
        state.error = null;
        state.loadingStatus.saving = "idle";
      })
      .addMatcher(
        isRejected(createDiscussion, updateDiscussion),
        (state, { payload }) => {
          state.error = payload as string;
          state.loadingStatus.saving = "error";
        }
      );
  },
});

const selectDiscussionsSlice = (state: RootState) => state.discussions;
export const selectDiscussions = createSelector(
  selectDiscussionsSlice,
  (state) => state.discussions
);
export const selectDiscussionsPageCount = createSelector(
  selectDiscussionsSlice,
  (state) => state.pageCount
);
export const selectIsLoadingDiscussions = createSelector(
  selectDiscussionsSlice,
  (state) => state.loadingStatus.fetching
);
export const selectIsSavingDiscussion = createSelector(
  selectDiscussionsSlice,
  (state) => state.loadingStatus.saving
);
export const selectSaveDiscussionError = createSelector(
  selectDiscussionsSlice,
  (state) => state.error
);
export const selectDiscussionsCurrentPage = createSelector(
  selectDiscussionsSlice,
  (state) => state.currentPage
);

export const { clearDiscussionState } = discussionsSlice.actions;

export default discussionsSlice.reducer;
