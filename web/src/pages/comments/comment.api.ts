import api from "src/config/api";
import { ArrayResponse } from "src/utils/util.types";
import { CreateCommentDto } from "./store/comments.actions";
import { IComment } from "./types/comment.model";

async function fetchComments(offset: number, limit: number, query?: string) {
  let endpoint = `comments?offset=${offset}&limit=${limit}`;
  if (query) {
    endpoint += `&query=${query}`;
  }
  const response = await api.get<ArrayResponse<IComment>>(endpoint);
  return response.data;
}
async function createBatchComments(createCommentDto: CreateCommentDto[]) {
  const response = await api.post<IComment>("comments/batch", createCommentDto);
  return response.data;
}
async function createComment(createCommentDto: CreateCommentDto) {
  const response = await api.post<IComment>("comments", createCommentDto);
  return response.data;
}
async function updateComment(
  id: string,
  updateCommentDto: Partial<CreateCommentDto>
) {
  const response = await api.patch<ArrayResponse<IComment>>(
    `comments/${id}`,
    updateCommentDto
  );
  return response.data;
}
function deleteComment(id: string) {
  return api.delete(`comments/${id}`);
}
const endpoints = {
  fetchComments,
  createComment,
  createBatchComments,
  updateComment,
  deleteComment,
};
const commentsApi = endpoints;

export { commentsApi };
