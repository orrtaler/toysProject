const indexR = require("./index");
const userR = require("./users");
const toyR = require("./toys");

exports.routesInit = (app) => {
    app.use("/",indexR);
    app.use("/users", userR);
    app.use("/toys", toyR);
}