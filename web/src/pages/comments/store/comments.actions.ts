import { createAsyncThunk } from "@reduxjs/toolkit";
import { commentsApi } from "../comment.api";

export interface CreateCommentDto {
  system: string;
  content: string;
  discussionId: string;
  date: string;
  extra: {
    [key: string]: string;
  };
}
export const fetchComments = createAsyncThunk(
  "comments/fetch",
  async (
    {
      offset,
      limit,
      query,
    }: {
      offset: number;
      limit: number;
      query?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const comments = await commentsApi.fetchComments(offset, limit, query);
      return comments;
    } catch (e: any) {
      throw rejectWithValue(e?.response?.data?.message ?? e);
    }
  }
);
export const createComment = createAsyncThunk(
  "comments/create",
  async (createCommentDto: CreateCommentDto, { dispatch, rejectWithValue }) => {
    try {
      await commentsApi.createComment(createCommentDto);
      dispatch(fetchComments({ offset: 0, limit: 100 }));
    } catch (e: any) {
      throw rejectWithValue(e?.response?.data?.message ?? e);
    }
  }
);
export const updateComment = createAsyncThunk(
  "comments/update",
  async (
    {
      id,
      updateCommentDto,
    }: { id: string; updateCommentDto: Partial<CreateCommentDto> },
    { dispatch }
  ) => {
    await commentsApi.updateComment(id, updateCommentDto);
    dispatch(fetchComments({ offset: 0, limit: 100 }));
  }
);
export const deleteComment = createAsyncThunk(
  "comments/delete",
  async (id: string, { dispatch }) => {
    await commentsApi.deleteComment(id);
    dispatch(fetchComments({ offset: 0, limit: 100 }));
  }
);
