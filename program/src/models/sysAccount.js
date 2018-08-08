import {
  queryPositionList,
  editPosition,
  deletePosition,
  queryDepartmentList,
  editDepartment,
  deleteDepartment,
  editDepartmentName,
} from '../services/sysAccount';

export default {
  namespace: 'sysAccount',
  state: {
    positionList: [],
    departmentList: [],
    filterDataList: [], // 根据不同树节点传递不同数据
  },

  effects: {
    *fetchPositions({ success, error }, { call, put }) {
      const res = yield call(queryPositionList);
      const { rescode } = res;
      if (rescode >> 0 === 10000) {
        if (success) {
          success(res);
        }
      } else if (error) {
        error(res);
      }
      yield put({
        type: 'save',
        payload: res.data,
      });
    },
    *fetchEditPosition({ params, success, error }, { call }) {
      const res = yield call(editPosition, { params });
      const { rescode } = res;
      if (rescode >> 0 === 10000) {
        if (success) {
          success(res);
        }
      } else if (error) {
        error(res);
      }
    },
    *fetchDeletePostiton({ positionId, success, error }, { call }) {
      const res = yield call(deletePosition, { positionId });
      const { rescode } = res;
      if (rescode >> 0 === 10000) {
        if (success) {
          success(res);
        }
      } else if (error) {
        error(res);
      }
    },
    *fetchDepartmentList({ success, error }, { call, put }) {
      const res = yield call(queryDepartmentList);
      const { rescode } = res;
      if (rescode >> 0 === 10000) {
        if (success) {
          success(res);
        }
      } else if (error) {
        error(res);
      }
      yield put({
        type: 'saveDepartment',
        payload: res.data,
      });
    },
    *fetchEditDepartment({ params, success, error }, { call }) {
        const res = yield call(editDepartment, { params });
        const { rescode } = res;
        if (rescode >> 0 === 10000) {
          if (success) {
            success(res);
          }
        } else if (error) {
          error(res);
        }
      },
      *fetchDeleteDepartment({ id, success, error }, { call }) {
        const res = yield call(deleteDepartment, { id });
        const { rescode } = res;
        if (rescode >> 0 === 10000) {
          if (success) {
            success(res);
          }
        } else if (error) {
          error(res);
        }
      },
      *fetchEditDepartmentName({ id, name, success, error }, { call }) {
        const res = yield call(editDepartmentName, { id, name });
        const { rescode } = res;
        if (rescode >> 0 === 10000) {
          if (success) {
            success(res);
          }
        } else if (error) {
          error(res);
        }
      },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        positionList: action.payload,
      };
    },
    saveDepartment(state, action) {
      return {
        ...state,
        departmentList: action.payload,
        filterDataList: action.payload,
      };
    },
    saveFilterList(state, action) {
        return {
            ...state,
            filterDataList: action.payload,
        };
    },
  },
};
