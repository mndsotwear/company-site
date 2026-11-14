import * as migration_20261111_191612_initial from './20261111_191612_initial';
import * as migration_20261114_125642_theme_settings from './20261114_125642_theme_settings';
import * as migration_20261114_125837_theme_settings from './20261114_125837_theme_settings';

export const migrations = [
  {
    up: migration_20261111_191612_initial.up,
    down: migration_20261111_191612_initial.down,
    name: '20261111_191612_initial',
  },
  {
    up: migration_20261114_125642_theme_settings.up,
    down: migration_20261114_125642_theme_settings.down,
    name: '20261114_125642_theme_settings',
  },
  {
    up: migration_20261114_125837_theme_settings.up,
    down: migration_20261114_125837_theme_settings.down,
    name: '20261114_125837_theme_settings'
  },
];
