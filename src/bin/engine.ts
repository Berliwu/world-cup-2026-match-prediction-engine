import { dispatch } from "../cli/router.js";
dispatch(process.argv.slice(2)).catch((e) => { console.error(e); process.exit(1); });
