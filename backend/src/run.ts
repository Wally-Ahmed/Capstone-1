import { server } from './__utilities__/namespace';

import { port } from "./config";

// console.log(server)


server.listen(port, () => console.log(`Server is running on port ${port}`));