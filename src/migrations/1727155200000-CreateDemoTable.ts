import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateDemoTable1727155200000 implements MigrationInterface {
    name = 'CreateDemoTable1727155200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "demo",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "isActive",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true,
        );

        // Insert some test data
        await queryRunner.query(`
            INSERT INTO demo (name, description, "isActive") VALUES 
            ('Demo Item 1', 'This is a test demo item', true),
            ('Demo Item 2', 'Another test demo item', false),
            ('Demo Item 3', 'Third test demo item', true)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("demo");
    }
}