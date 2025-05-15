import fs from 'fs';
import {Server} from 'http';

type ExpressServerOptions = Pick<
  Server,
  | 'keepAliveTimeout'
  | 'maxHeadersCount'
  | 'timeout'
  | 'maxConnections'
  | 'headersTimeout'
  | 'requestTimeout'
>;

export interface Configuration {
  readonly apiUrl: {
    [key: string]: string; // Erlaubt beliebige String-Keys
  };
  readonly port?: number; // Optional, falls in der Konfiguration vorhanden
  readonly expressServerOptions?: ExpressServerOptions;
}

export const readConfiguration = (file: string): Configuration => {
  const configuration: Configuration = JSON.parse(
    fs.readFileSync(file, 'utf-8'),
  );

  return configuration;
};
