//Container for all environmets
const environments = {};

//Staging environments (default)
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  name: "staging",
};

//Production environments
environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  name: "productiom",
};

//Determine which environment was pass from command line as argument
const currentEnvironment =
  typeof process.env.NODE_ENV === "string"
    ? process.env.NODE_ENV.toLocaleLowerCase()
    : "";

//Check the current environment is one of environment above, if not default to staging
const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

//Export the module
module.exports = environmentToExport;
