import { dispatch } from "../cli/router.js";
import { closeRedisClient } from "../utils/redis.js";
import { loadEnv } from "../config/env.js";

loadEnv();

let exitCode = 0;
dispatch(process.argv.slice(2))
  .catch((e) => {
    console.error(e);
    exitCode = 1;
  })
  .finally(async () => {
    await closeRedisClient();
    process.exit(exitCode);
  });
