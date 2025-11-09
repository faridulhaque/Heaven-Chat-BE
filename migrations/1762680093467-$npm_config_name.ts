import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1762680093467 implements MigrationInterface {
    name = ' $npmConfigName1762680093467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation" DROP COLUMN "members"`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD "senderId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD "recipientId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "conversation" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "conversation" DROP COLUMN "recipientId"`);
        await queryRunner.query(`ALTER TABLE "conversation" DROP COLUMN "senderId"`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD "members" jsonb NOT NULL`);
    }

}
