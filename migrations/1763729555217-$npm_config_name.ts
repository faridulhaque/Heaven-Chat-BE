import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1763729555217 implements MigrationInterface {
    name = ' $npmConfigName1763729555217'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation" ADD "lastMessage" character varying`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "conversation" DROP COLUMN "lastMessage"`);
    }

}
