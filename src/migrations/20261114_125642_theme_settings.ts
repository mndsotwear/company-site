import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_default_palette" AS ENUM('ocean', 'midnight', 'classic', 'coral', 'custom');
  CREATE TYPE "public"."enum_site_settings_default_mode" AS ENUM('dark', 'light');
  ALTER TABLE "site_settings" ADD COLUMN "default_palette" "enum_site_settings_default_palette" DEFAULT 'ocean';
  ALTER TABLE "site_settings" ADD COLUMN "custom_color" varchar DEFAULT '#22d3ee';
  ALTER TABLE "site_settings" ADD COLUMN "default_mode" "enum_site_settings_default_mode" DEFAULT 'dark';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "default_palette";
  ALTER TABLE "site_settings" DROP COLUMN "custom_color";
  ALTER TABLE "site_settings" DROP COLUMN "default_mode";
  DROP TYPE "public"."enum_site_settings_default_palette";
  DROP TYPE "public"."enum_site_settings_default_mode";`)
}
