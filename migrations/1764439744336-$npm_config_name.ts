import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1764439744336 implements MigrationInterface {
    name = ' $npmConfigName1764439744336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_f8c996f451b3af18dc374210d71"`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_f8c996f451b3af18dc374210d71" FOREIGN KEY ("conversationConversationId") REFERENCES "conversation"("conversationId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_f8c996f451b3af18dc374210d71"`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_f8c996f451b3af18dc374210d71" FOREIGN KEY ("conversationConversationId") REFERENCES "conversation"("conversationId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
