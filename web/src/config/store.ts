import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authSlice from "src/pages/auth/store/authSlice";
import discussionsSlice from "src/pages/discussions/store/discussionsSlice";
import systemsSlice from "src/pages/systems/store/systemsSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    systems: systemsSlice,
    discussions: discussionsSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
