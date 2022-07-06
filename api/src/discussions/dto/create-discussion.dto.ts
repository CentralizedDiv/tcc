export class CreateDiscussionDTO {
  readonly system: string;
  readonly label: string;
  readonly description: string;
  readonly extra: {
    [key: string]: string;
  };
}
