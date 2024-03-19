import { workSpaceFolder } from '@/beforeNest';
import { join } from 'path';

export const joinWorkPath = (rootFolderName: string) => {
  return join(workSpaceFolder, rootFolderName);
};
