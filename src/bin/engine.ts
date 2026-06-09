import { dispatch } from "../cli/router.js";
import { closeRedisClient } from "../utils/redis.js";

dispatch(process.argv.slice(2))
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await closeRedisClient(); });
