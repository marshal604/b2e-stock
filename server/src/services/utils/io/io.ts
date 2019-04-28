import fs from 'fs';

import { FileModel, IsFileExistModel, writeFileModel } from './io.model';

const rootPath = 'src/assets';
export const IsFileExist = ({
  path,
  fileName,
  fileExtension = 'json',
  log = true
}: IsFileExistModel): Promise<never> => {
  return new Promise((resolve, reject) => {
    fs.readFile(`${rootPath}/${path}/${fileName}.${fileExtension}`, 'utf-8', (err, data) => {
      if (err) {
        if (log) {
          console.log(`not have ${path}/${fileName}.${fileExtension} file, will download it.`);
        }
        reject(err);
        return;
      }
      resolve();
    });
  });
};

export const IsFileExistSync = ({
  path,
  fileName,
  fileExtension = 'json',
  log = true
}: IsFileExistModel): boolean => {
  try {
    fs.readFileSync(`${rootPath}/${path}/${fileName}.${fileExtension}`, 'utf-8');
    return true;
  } catch {
    if (log) {
      console.log(`not have ${path}/${fileName}.${fileExtension} file, will download it.`);
    }
    return false;
  }
};

export const writeFile = ({
  path,
  fileName,
  data,
  fileExtension = 'json'
}: writeFileModel): void => {
  fs.writeFile(`${rootPath}/${path}/${fileName}.${fileExtension}`, data, 'utf-8', err => {
    if (err) {
      console.log(`write ${path}/${fileName}.${fileExtension} has err`, err);
      return;
    }
    console.log(`write ${path}/${fileName}.${fileExtension}`);
  });
};

export const readFile = ({ path, fileName, fileExtension = 'json' }: FileModel): Promise<any> => {
  return new Promise((resolve, reject) => {
    fs.readFile(`${rootPath}/${path}/${fileName}.${fileExtension}`, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
};

export const readFileSync = ({ path, fileName, fileExtension = 'json' }: FileModel): {} => {
  return fs.readFileSync(`${rootPath}/${path}/${fileName}.${fileExtension}`, 'utf-8');
};

export const removeFile = ({
  path,
  fileName,
  fileExtension = 'json'
}: FileModel): Promise<never> => {
  return new Promise((resolve, reject) => {
    fs.unlink(`${rootPath}/${path}/${fileName}.${fileExtension}`, err => {
      if (err) {
        console.log(`remove ${path}/${fileName}.${fileExtension} error.`);
        reject(err);
        return;
      }
      console.log(`remove ${path}/${fileName}.${fileExtension} success`);
      resolve();
    });
  });
};

export const removeFileSync = ({ path, fileName, fileExtension = 'json' }: FileModel): void => {
  console.log(`remove ${path}/${fileName}`);
  return fs.unlinkSync(`${rootPath}/${path}/${fileName}.${fileExtension}`);
};

export const mkdirIfNotExist = (dir: string) => {
  const path = `${rootPath}/${dir}`;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};

// 111,000 => 111000
export const formatNumberSymbol = (data: string): string => {
  return data.split(',').join('');
};
