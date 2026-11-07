import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUsersSoftDelete1700000000001 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'deletedAt',
        type:
          queryRunner.connection.options.type === 'postgres'
            ? 'timestamp'
            : 'datetime',
        isNullable: true,
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'deletedAt');
  }
}
