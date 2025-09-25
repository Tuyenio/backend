import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAllEntities1758708014852 implements MigrationInterface {
    name = 'CreateAllEntities1758708014852'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "departmentId" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "departmentId"`);
    }

}
