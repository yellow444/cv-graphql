import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { validateEnv, type Env } from './config/env.validation';
import { ExperienceModule } from './experience/experience.module';
import { createGraphqlOptions } from './graphql/graphql.options';
import { HealthModule } from './health/health.module';
import { LoadersFactory } from './loaders/loaders.factory';
import { LoadersModule } from './loaders/loaders.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, validate: validateEnv }),
    PrismaModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [LoadersModule],
      inject: [LoadersFactory, ConfigService],
      useFactory: (loadersFactory: LoadersFactory, config: ConfigService<Env, true>) =>
        createGraphqlOptions(
          loadersFactory,
          config.get('NODE_ENV', { infer: true }) === 'production',
        ),
    }),
    ProfileModule,
    ExperienceModule,
    HealthModule,
  ],
})
export class AppModule {}
