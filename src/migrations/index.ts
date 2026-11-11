import * as migration_20261111_191612_initial from './20261111_191612_initial';

export const migrations = [
  {
    up: migration_20261111_191612_initial.up,
    down: migration_20261111_191612_initial.down,
    name: '20261111_191612_initial'
  },
];
