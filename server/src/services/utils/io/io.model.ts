export interface FileModel {
  path: string;
  fileName: string;
  fileExtension?: string;
}

export interface writeFileModel extends FileModel {
  data: any;
}

export interface IsFileExistModel extends FileModel {
  log?: boolean;
}
