import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import type { ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'node:path';
import type { GraphQLContext } from '../loaders/data-loaders';
import type { LoadersFactory } from '../loaders/loaders.factory';

/** Запрос, который откроется в Apollo Sandbox при первом заходе. */
const SANDBOX_INITIAL_QUERY = `query Profile {
  profile {
    name
    title
    description
    links { label url }
    skills { name category note }
    experience { company position period achievements }
    projects { name url stack }
  }
}
`;

export function createGraphqlOptions(
  loadersFactory: LoadersFactory,
  isProduction: boolean,
): ApolloDriverConfig {
  return {
    // Схема строится из TypeScript-классов (code-first). Вне продакшена она пишется в schema.gql,
    // чтобы изменения API было видно в git diff.
    autoSchemaFile: isProduction ? true : join(process.cwd(), 'schema.gql'),
    sortSchema: true,
    // Apollo Sandbox - интерфейс визитки, поэтому он и интроспекция включены и в продакшене.
    playground: false,
    introspection: true,
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({
        embed: { runTelemetry: false, endpointIsEditable: false },
        document: SANDBOX_INITIAL_QUERY,
      }),
    ],
    // Новые загрузчики на каждый запрос: batching и кэш не выходят за его пределы.
    context: (): GraphQLContext => ({ loaders: loadersFactory.create() }),
  };
}
