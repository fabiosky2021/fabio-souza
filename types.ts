export enum AppMode {
  CREATE = 'CREATE',
  EDIT = 'EDIT',
}

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export interface GeneratedImage {
    id: string;
    b64: string;
    prompt: string;
    favorite: boolean;
}