const basicInfo = require("./basicInfo");
const servers = require("./servers");
const components = require("./components")
const userRoutes = require("./userRoutes")
const complaintRoutes = require("./complaintRoutes")

module.exports = {
    ...basicInfo,
    ...servers,
    ...userRoutes,
    ...complaintRoutes,
    ...components
}