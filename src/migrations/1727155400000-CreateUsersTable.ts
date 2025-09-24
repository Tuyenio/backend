import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsersTable1727155400000 implements MigrationInterface {
    name = 'CreateUsersTable1727155400000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create users table
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "255",
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: "password",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "fullName",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "role",
                        type: "enum",
                        enum: ["admin", "director", "manager", "employee"],
                        default: "'employee'",
                    },
                    {
                        name: "phone",
                        type: "varchar",
                        length: "20",
                        isNullable: true,
                    },
                    {
                        name: "isActive",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "resetPasswordToken",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "resetPasswordExpires",
                        type: "timestamp",
                        isNullable: true,
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

        // Insert 5 sample users with password "123456"
        const hashedPassword = '$2b$10$ejl2shkGMjImxq3O1p9kEu1H3vaBKGbBY3Hg53J4UiRFM/MzgcwuC';
        
        await queryRunner.query(`
            INSERT INTO users (email, password, "fullName", role, phone, "isActive") VALUES 
            ('admin@company.com', '${hashedPassword}', 'System Administrator', 'admin', '+84901234567', true),
            ('director@company.com', '${hashedPassword}', 'John Director', 'director', '+84901234568', true),
            ('manager@company.com', '${hashedPassword}', 'Jane Manager', 'manager', '+84901234569', true),
            ('employee1@company.com', '${hashedPassword}', 'Mike Employee', 'employee', '+84901234570', true),
            ('employee2@company.com', '${hashedPassword}', 'Sarah Employee', 'employee', '+84901234571', true)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
    }
}