import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1763889998209 implements MigrationInterface {
    name = ' $npmConfigName1763889998209'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "message" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "conversation" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "message" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
