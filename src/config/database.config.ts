import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { ConfigService } from '@nestjs/config';

export const databaseConfig = (config: ConfigService): TypeOrmModuleOptions => {
  const type = config.get<'better-sqlite3' | 'postgres'>(
    'DATABASE_TYPE',
    'better-sqlite3',
  );
  const common = {
    autoLoadEntities: true,
    synchronize:
      config.get(
        'DATABASE_SYNCHRONIZE',
        config.get('NODE_ENV') === 'production' ? 'false' : 'true',
      ) === 'true',
  };
  if (type === 'postgres') {
    return {
      type,
      host: config.getOrThrow('DATABASE_HOST'),
      port: Number(config.get('DATABASE_PORT', 5432)),
      username: config.getOrThrow('DATABASE_USER'),
      password: config.getOrThrow('DATABASE_PASSWORD'),
      database: config.getOrThrow('DATABASE_NAME'),
      ...common,
    };
  }
  return {
    type: 'better-sqlite3',
    database: config.get('DATABASE_PATH', 'ibi.sqlite'),
    ...common,
  };
};
