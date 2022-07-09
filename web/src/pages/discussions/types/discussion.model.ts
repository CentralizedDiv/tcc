interface DiscussionClass extends IDiscussion {}
class DiscussionClass {}

export interface IDiscussion {
  id: string;
  system: string;
  label: string;
  description: string;
  extra: {
    [key: string]: string;
  };
}
export class Discussion extends DiscussionClass {}
