import { PresentableError } from './util';

/**
 * This is a modified version of the ExtendsHook internally used utility type
 */
const extendsHookModified = `
declare type MapExtensionsToClientComposableType<T extends $Extensions.InternalArgs> = {
  [K in keyof T["client"]]: T["client"][K]
}& {
  [K in keyof Omit<T["model"],"$allModels">]: {
    [O in keyof T["model"][K]]:T["model"][K][O]
  } & (T["model"]["$allModels"] extends object?{[O in keyof T["model"]["$allModels"]]:T["model"]["$allModels"][O]}:unknown)
}

declare interface ExtendsHookModified<Variant extends 'extends' | 'define', TypeMapCb extends $Extensions.TypeMapCbDef, ExtArgs extends Record<string, any>, TypeMap extends $Extensions.TypeMapDef = $Utils.Call<TypeMapCb, {
  extArgs: ExtArgs;
}>, ClientOptions extends Prisma.PrismaClientOptions = {}> {
  extArgs: ExtArgs;
  <R_ extends {
      [K in TypeMap['meta']['modelProps'] | '$allModels']?: unknown;
  }, R, M_ extends {
      [K in TypeMap['meta']['modelProps'] | '$allModels']?: unknown;
  }, M, Q_ extends {
      [K in TypeMap['meta']['modelProps'] | '$allModels' | keyof TypeMap['other']['operations'] | '$allOperations']?: unknown;
  }, C_ extends {
      [K in string]?: unknown;
  }, C, Args extends $Extensions.InternalArgs = $Extensions.InternalArgs<R, M, {}, C>, MergedArgs extends $Extensions.InternalArgs = $Extensions.MergeExtArgs<TypeMap, ExtArgs, Args>>(extension: ((client: $Extensions.DynamicClientExtensionThis<TypeMap, TypeMapCb, ExtArgs, ClientOptions>) => {
      $extends: {
          extArgs: Args;
      };
  }) | {
      name?: string;
      query?: $Extensions.DynamicQueryExtensionArgs<Q_, TypeMap>;
      result?: $Extensions.DynamicResultExtensionArgs<R_, TypeMap> & R;
      model?: $Extensions.DynamicModelExtensionArgs<M_, TypeMap, TypeMapCb, ExtArgs, ClientOptions> & M;
      client?: $Extensions.DynamicClientExtensionArgs<C_, TypeMap, TypeMapCb, ExtArgs, ClientOptions> & C;
  }): {
      extends: PrismaClient<ClientOptions,'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never, MergedArgs> & MapExtensionsToClientComposableType<MergedArgs>;
      define: (client: any) => {
          $extends: {
              extArgs: Args;
          };
      };
  }[Variant];
}`;

/**
 * Inserts a string in another string at the end of a marker string with a provided offset
 * @param str the string we want to insert into
 * @param marker the marker string
 * @param offset the offset added to the end of the marker
 * @param toInsert the string we want to insert
 * @returns the newly formed string
 */
function insertIntoStringAfterMarker(
  str: string,
  marker: string,
  offset: number,
  toInsert: string,
) {
  const markerEndOffset = str.indexOf(marker) + marker.length + offset;
  return str.slice(0, markerEndOffset) + toInsert + str.slice(markerEndOffset);
}

/**
 * Inserts the patch into the prisma client declaration file
 * @param contents the contents of the prisma client type declarations
 * @returns the patched string
 */
export function patchPrisma(contents: string): string {
  if (contents.indexOf('$extends: ExtendsHookModified') != -1) {
    throw new PresentableError('This file is already patched', 'warn');
  }
  if (
    contents.indexOf('runtime.Types.Result') == -1 ||
    contents.indexOf('$extends: $Extensions.ExtendsHook') == -1 ||
    contents.indexOf('$transaction<R>(fn: (prisma: Omit<PrismaClient') == -1
  ) {
    throw new PresentableError(
      'The prisma version or file provided is not compatible with patching',
    );
  }
  const contentWithPatchType = insertIntoStringAfterMarker(
    contents,
    'runtime.Types.Result',
    1,
    extendsHookModified,
  );
  return contentWithPatchType
    .replace(
      '$extends: $Extensions.ExtendsHook',
      '$extends: ExtendsHookModified',
    )
    .replace(
      '$transaction<R>(fn: (prisma: Omit<PrismaClient',
      '$transaction<R>(fn: (prisma: Omit<this',
    );
}
