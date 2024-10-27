import { readdir } from "node:fs/promises";

const routeObject = {};
const routes = await readdir("./routes", { recursive: true });
// console.log(routes);

for (const file of routes) {
    const routeFile = Bun.file('./routes/' + file);
    const routeData = await routeFile.text();
    const trainLine = file.slice(file.indexOf('-') + 1, file.indexOf('.txt'));
    routeObject[trainLine] = routeData;
}

var jsFile = "function getRouteObject() {\nreturn `" + JSON.stringify(routeObject) + "`\n}";

Bun.write("./scripts/routeout.js", jsFile);
// routes.;forEach(async (file) => {
//     const routeFile = Bun.file('./routes/' + file);
//     const routeData = await routeFile.text();
//     const trainLine = file.slice(file.indexOf('-') + 1, file.indexOf('.txt'));
//     routeObject[trainLine] = routeData;
// })