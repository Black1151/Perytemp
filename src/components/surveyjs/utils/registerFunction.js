import { FunctionFactory } from "survey-core";
import { perygonApiRequest } from "./perygonApiRequest";
import { perygonArraySum } from "./perygonArraySum";
import { fetchPostcodeData } from "./fetchPostcodeData";
import { decodeJson } from "./decodeJson";
import { getObjectField } from "./getObjectField";
import { setImageField } from "./setImageField";
import { checkEqual } from "./checkEqual";
import { getObjectFieldFromDropdown } from "./getObjectFieldFromDropdown";
import { validateJson } from "./validateJson";

// !!!!!!! IMPORTANT
// ANY ASYNC FUNCTIONS MUST NOT. I REPEAT NOT!!! BE ARROW FUNCTIONS. THEY MAKE USE OF "THIS" WHICH NEEDS NORMAL FUNCTION SYNTAX

export async function registerSurveyFunctionsWithoutSurvey() {
  FunctionFactory.Instance.register(
    "fetchPostcodeData",
    fetchPostcodeData,
    true,
  );
  FunctionFactory.Instance.register(
    "perygonApiRequest",
    perygonApiRequest,
    true,
  );
  FunctionFactory.Instance.register("perygonArraySum", perygonArraySum);
  FunctionFactory.Instance.register("validateJson", validateJson);
  FunctionFactory.Instance.register("decodeJson", decodeJson);
}

export async function registerSurveyFunctionsWithSurvey(survey) {
  FunctionFactory.Instance.register(
    "getObjectFieldFromDropdown",
    getObjectFieldFromDropdown(survey),
  );
  FunctionFactory.Instance.register("getObjectField", getObjectField(survey));
  FunctionFactory.Instance.register("setImageField", setImageField(survey));
  FunctionFactory.Instance.register("checkEqual", checkEqual(survey));
}
