import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1762684641508 implements MigrationInterface {
    name = ' $npmConfigName1762684641508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "message" ("messageId" uuid NOT NULL DEFAULT uuid_generate_v4(), "senderId" uuid NOT NULL, "recipientId" uuid NOT NULL, "message" jsonb NOT NULL, "type" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "conversationConversationId" uuid, CONSTRAINT "PK_b664c8ae63d634326ce5896cecc" PRIMARY KEY ("messageId"))`);
        await queryRunner.query(`ALTER TABLE "conversation" DROP COLUMN "message"`);
        await queryRunner.query(`ALTER TABLE "conversation" DROP COLUMN "senderId"`);
        await queryRunner.query(`ALTER TABLE "conversation" DROP COLUMN "recipientId"`);
        await queryRunner.query(`ALTER TABLE "conversation" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_f8c996f451b3af18dc374210d71" FOREIGN KEY ("conversationConversationId") REFERENCES "conversation"("conversationId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_f8c996f451b3af18dc374210d71"`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD "recipientId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD "senderId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD "message" jsonb NOT NULL`);
        await queryRunner.query(`DROP TABLE "message"`);
    }

}
