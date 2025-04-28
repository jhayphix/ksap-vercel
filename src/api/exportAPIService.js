import * as API_JSON_SERVER_SERVICES from "@src/api/apiJsonServer";
import * as API_CUSTOM_SERVER_SERVICES from "@src/api/apiCustom";
import * as API_FIREBASE_SERVICES from "@src/api/apiFireBase";

const SERVICES_API = {
  "json-server": API_JSON_SERVER_SERVICES,
  custom: API_CUSTOM_SERVER_SERVICES,
  firebase: API_FIREBASE_SERVICES,
};

const ACTIVE_SERVICE = "custom";

const APIService = SERVICES_API[ACTIVE_SERVICE] || API_JSON_SERVER_SERVICES;

export default APIService;
