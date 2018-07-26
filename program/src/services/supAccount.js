import lyRequest from '../utils/lyRequest';
import { USERS_SERVER } from '../constant/config';
import { sha256 } from 'js-sha256';


export async function querySuppliers(params) {
  const { offset = 0, limit = 10, ...others } = params;
  return lyRequest(`${USERS_SERVER}/operation/suppliers`, {
    params: {
      offset,
      limit,
      ...others,
    },
  });
}
export async function queryDetail({ id }) {
  return lyRequest(`${USERS_SERVER}/operation/audit/${id}`);
}

export async function disableAccount({ id, active_status }) {
  return lyRequest(`${USERS_SERVER}/operation/suppliers/${id}/active_status`, {
    method: 'put',
    data: { active_status },
  });
}
export async function passwordChange({ id, password }) {
  return lyRequest(`${USERS_SERVER}/operation/suppliers/${id}/password`, {
    method: 'put',
    data: { password: sha256(password) },
  });
}