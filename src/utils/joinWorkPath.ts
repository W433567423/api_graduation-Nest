import { workSpaceFolder } from '@/scripts/beforeNest';
import { join } from 'path';

export const joinWorkPath = (rootFolderName: string) => {
  return join(workSpaceFolder, rootFolderName);
};
