import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'password', type: 'varchar' },
          { name: 'role', type: 'varchar' },
          { name: 'isVerified', type: 'boolean', default: 'false' },
          { name: 'createdAt', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
    );
    await queryRunner.createTable(
      new Table({
        name: 'user_profiles',
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'firstName', type: 'varchar' },
          { name: 'lastName', type: 'varchar' },
          { name: 'phone', type: 'varchar', length: '30', isNullable: true },
          {
            name: 'businessName',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          { name: 'userId', type: 'varchar', isUnique: true },
        ],
        foreignKeys: [
          {
            columnNames: ['userId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'name', type: 'varchar' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'priceInCents', type: 'integer' },
          { name: 'stock', type: 'integer', default: '0' },
          { name: 'category', type: 'varchar' },
          { name: 'createdAt', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
    );
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'buyerId', type: 'varchar' },
          { name: 'status', type: 'varchar' },
          { name: 'totalInCents', type: 'integer' },
          { name: 'createdAt', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
        ],
        foreignKeys: [
          {
            columnNames: ['buyerId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
          },
        ],
      }),
    );
    await queryRunner.createTable(
      new Table({
        name: 'order_items',
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'orderId', type: 'varchar' },
          { name: 'productId', type: 'varchar' },
          { name: 'quantity', type: 'integer' },
          { name: 'unitPriceInCents', type: 'integer' },
        ],
        foreignKeys: [
          {
            columnNames: ['orderId'],
            referencedTableName: 'orders',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['productId'],
            referencedTableName: 'products',
            referencedColumnNames: ['id'],
          },
        ],
      }),
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    for (const table of [
      'order_items',
      'orders',
      'products',
      'user_profiles',
      'users',
    ])
      await queryRunner.dropTable(table);
  }
}
