import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1763806231478 implements MigrationInterface {
    name = ' $npmConfigName1763806231478'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation" ALTER COLUMN "deletedBy" SET DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation" ALTER COLUMN "deletedBy" DROP DEFAULT`);
    }

}
