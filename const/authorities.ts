enum AUTHORIZATIONS {
  ROLE_ADMIN = "ROLE_ADMIN",
  ROLE_USER = "ROLE_USER",
  ROLE_ANONYMOUS = "ROLE_ANONYMOUS",
  ROLE_EMPLOYEE = "ROLE_EMPLOYEE",
  ROLE_MANAGER = "ROLE_MANAGER",
}

const ROLE_PREFIXES = {
  [AUTHORIZATIONS.ROLE_MANAGER]: "/manager",
  [AUTHORIZATIONS.ROLE_ADMIN]: "/admin",
  [AUTHORIZATIONS.ROLE_EMPLOYEE]: "/employee",
  [AUTHORIZATIONS.ROLE_USER]: "/user",
};
const authorityConst = { AUTHORIZATIONS, ROLE_PREFIXES };
export default authorityConst;
