import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1763791298388 implements MigrationInterface {
    name = ' $npmConfigName1763791298388'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "blocked" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "blocked"`);
    }

}
