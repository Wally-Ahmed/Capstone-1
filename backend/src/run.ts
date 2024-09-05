import { server } from './__utilities__/namespace';

import { port, dbStr } from "./config";

// console.log(server)


server.listen(port, () => console.log(dbStr, `Server is running on port ${port}`));