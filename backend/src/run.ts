const { server } = require('./__utilities__/namespace');

const { port } = require("./config");

// console.log(server)


server.listen(port, () => console.log(`Server is running on port ${port}`));