import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1763915537599 implements MigrationInterface {
    name = ' $npmConfigName1763915537599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
    }

}
