import { server } from './__utilities__/app';

import { port } from "./config";

// console.log(server)


server.listen(port, () => console.log(`Server is running on port ${port}`));