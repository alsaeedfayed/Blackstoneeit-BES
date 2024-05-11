export interface IAttachmentFile {
  id?: number;
  file: File;
  name?: string;
  fileName?: string;
  size: number;
  extension: string;
  isLoading?: boolean;
}
