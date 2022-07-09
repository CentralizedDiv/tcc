import { createAsyncThunk } from "@reduxjs/toolkit";
import { systemsApi } from "../systems.api";

export interface CreateSystemDto {
  label: string;
}
export const fetchSystems = createAsyncThunk("systems/fetch", () => {
  return systemsApi.fetchSystems();
});
export const createSystem = createAsyncThunk(
  "systems/create",
  async (createSystemDto: CreateSystemDto, { dispatch, rejectWithValue }) => {
    try {
      await systemsApi.createSystem(createSystemDto);
      dispatch(fetchSystems());
    } catch (e: any) {
      throw rejectWithValue(e?.response?.data?.message ?? e);
    }
  }
);
export const updateSystem = createAsyncThunk(
  "systems/update",
  async (
    {
      id,
      updateSystemDto,
    }: { id: string; updateSystemDto: Partial<CreateSystemDto> },
    { dispatch }
  ) => {
    await systemsApi.updateSystem(id, updateSystemDto);
    dispatch(fetchSystems());
  }
);
export const deleteSystem = createAsyncThunk(
  "systems/delete",
  async (id: string, { dispatch }) => {
    await systemsApi.deleteSystem(id);
    dispatch(fetchSystems());
  }
);
