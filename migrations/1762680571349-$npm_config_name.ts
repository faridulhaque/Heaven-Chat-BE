import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1762680571349 implements MigrationInterface {
    name = ' $npmConfigName1762680571349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation" ADD "members" jsonb NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation" DROP COLUMN "members"`);
    }

}
