import { Models } from '@rematch/core';
import { count } from './count';
import { user } from './user';
import { note } from './note';
export interface RootModel extends Models<RootModel> {
  count: typeof count;
  user: typeof user;
  note: typeof note;
}

export const models: RootModel = {
  count,
  user,
  note
};
