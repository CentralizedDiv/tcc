import {
  createSelector,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";
import { RootState } from "src/config/store";
import { ISystem } from "../types/system.model";
import { createSystem, fetchSystems, updateSystem } from "./systems.actions";

export interface SystemsState {
  systems: ISystem[];
  pageCount: number;
  loadingStatus: {
    fetching: "idle" | "loading" | "error";
    saving: "idle" | "loading" | "error";
  };
  error: string | null;
}

const initialState: SystemsState = {
  systems: [],
  pageCount: 1,
  loadingStatus: {
    fetching: "idle",
    saving: "idle",
  },
  error: null,
};

export const systemsSlice = createSlice({
  name: "systems",
  initialState,
  reducers: {
    clearSystemState(state) {
      state.error = null;
      state.loadingStatus.fetching = "idle";
      state.loadingStatus.saving = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSystems.pending, (state) => {
        state.loadingStatus.fetching = "loading";
      })
      .addCase(fetchSystems.fulfilled, (state, { payload }) => {
        state.loadingStatus.fetching = "idle";
        state.systems = payload.results;
        state.pageCount = payload.pageCount;
      })
      .addMatcher(isPending(createSystem, updateSystem), (state) => {
        state.loadingStatus.saving = "loading";
      })
      .addMatcher(isFulfilled(createSystem, updateSystem), (state) => {
        state.error = null;
        state.loadingStatus.saving = "idle";
      })
      .addMatcher(
        isRejected(createSystem, updateSystem),
        (state, { payload }) => {
          state.error = payload as string;
          state.loadingStatus.saving = "error";
        }
      );
  },
});

const selectSystemsSlice = (state: RootState) => state.systems;
export const selectSystems = createSelector(
  selectSystemsSlice,
  (state) => state.systems
);
export const selectSystemsPageCount = createSelector(
  selectSystemsSlice,
  (state) => state.pageCount
);
export const selectIsLoadingSystems = createSelector(
  selectSystemsSlice,
  (state) => state.loadingStatus.fetching
);
export const selectIsSavingSystem = createSelector(
  selectSystemsSlice,
  (state) => state.loadingStatus.saving
);
export const selectSaveSystemError = createSelector(
  selectSystemsSlice,
  (state) => state.error
);

export const { clearSystemState } = systemsSlice.actions;

export default systemsSlice.reducer;
