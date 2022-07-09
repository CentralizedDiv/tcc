import { createAsyncThunk } from "@reduxjs/toolkit";
import { discussionsApi } from "../discussions.api";

export interface CreateDiscussionDto {
  system: string;
  label: string;
  description: string;
  extra: {
    [key: string]: string;
  };
}
export const fetchDiscussions = createAsyncThunk(
  "discussions/fetch",
  ({ offset, limit }: { offset: number; limit: number }) => {
    return discussionsApi.fetchDiscussions(offset, limit);
  }
);
export const createDiscussion = createAsyncThunk(
  "discussions/create",
  async (
    createDiscussionDto: CreateDiscussionDto,
    { dispatch, rejectWithValue }
  ) => {
    try {
      await discussionsApi.createDiscussion(createDiscussionDto);
      dispatch(fetchDiscussions({ offset: 0, limit: 100 }));
    } catch (e: any) {
      throw rejectWithValue(e?.response?.data?.message ?? e);
    }
  }
);
export const updateDiscussion = createAsyncThunk(
  "discussions/update",
  async (
    {
      id,
      updateDiscussionDto,
    }: { id: string; updateDiscussionDto: Partial<CreateDiscussionDto> },
    { dispatch }
  ) => {
    await discussionsApi.updateDiscussion(id, updateDiscussionDto);
    dispatch(fetchDiscussions({ offset: 0, limit: 100 }));
  }
);
export const deleteDiscussion = createAsyncThunk(
  "discussions/delete",
  async (id: string, { dispatch }) => {
    await discussionsApi.deleteDiscussion(id);
    dispatch(fetchDiscussions({ offset: 0, limit: 100 }));
  }
);
