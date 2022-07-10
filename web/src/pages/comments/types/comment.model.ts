interface CommentClass extends IComment {}
class CommentClass {}

export interface IComment {
  id: string;
  system: string;
  discussionId: string;
  date: string | null;
  content: string;
  extra: {
    [key: string]: string;
  };
}
export class Comment extends CommentClass {}
