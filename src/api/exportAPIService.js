import * as API_JSON_SERVER_SERVICES from "@src/api/apiJsonServer";
import * as API_FIREBASE from "@src/api/apiFireBase";

const SERVICES_API = {
  "json-server": API_JSON_SERVER_SERVICES,
  firebase: API_FIREBASE,
};

const ACTIVE_SERVICE = "firebase";

const APIService = SERVICES_API[ACTIVE_SERVICE] || API_JSON_SERVER_SERVICES;

export default APIService;
