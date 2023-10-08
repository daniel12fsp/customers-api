import { configure as serverlessExpress } from '@vendia/serverless-express';
import { setupNestApp } from 'src/main';

let cachedServer;

export const handler = async (event, context) => {
  if (!cachedServer) {
    const app = await setupNestApp();

    await app.init();
    cachedServer = serverlessExpress({
      app: app.getHttpAdapter().getInstance(),
    });
  }

  return cachedServer(event, context);
};
