import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1762664220711 implements MigrationInterface {
  name = ' $npmConfigName1762664220711';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("userId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "avatar" character varying NOT NULL, CONSTRAINT "PK_d72ea127f30e21753c9e229891e" PRIMARY KEY ("userId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "conversation" ("conversationId" uuid NOT NULL DEFAULT uuid_generate_v4(), "members" jsonb NOT NULL, "message" jsonb NOT NULL, CONSTRAINT "PK_03a1f787084f38eabbeb1c8dfcb" PRIMARY KEY ("conversationId"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "conversation"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
