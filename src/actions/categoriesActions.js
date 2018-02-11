import { callApi } from '../utils/ApiUtils';
import {
  REQUEST_FETCH_ALL_CATEGORIES,
  RECEIVE_FETCH_ALL_CATEGORIES,
  ERROR_FETCH_ALL_CATEGORIES,
  ADD_CATEGORY_LOCAL,
  REMOVE_CATEGORY_LOCAL,
  TOOGLE_SELECT_CATEGORY,
  TOOGLE_SELECT_CATEGORY_ALL,
} from '../constants/actionTypes';
import { fetchTodoArgumentsByCategory } from './todoArgumentsActions';
import { goNextStep } from './dialogAddActions';
import categoryAll from '../constants/config';

const requestFetchAllCategories = () => (
  {
    type: REQUEST_FETCH_ALL_CATEGORIES,
  }
);

const receiveFetchAllCategories = categories => (
  {
    type: RECEIVE_FETCH_ALL_CATEGORIES,
    categories,
  }
);

const errorFetchAllCategories = error => (
  {
    type: ERROR_FETCH_ALL_CATEGORIES,
    error,
  }
);

const addCategoryLocal = category => (
  {
    type: ADD_CATEGORY_LOCAL,
    category,
  }
);

const removeCategoryLocal = categoryIndex => (
  {
    type: REMOVE_CATEGORY_LOCAL,
    categoryIndex,
  }
);

export const toogleSelectCategory = selectedCategory => (
  {
    type: TOOGLE_SELECT_CATEGORY,
    selectedCategory,
  }
);

export const toogleSelectCategoryAll = () => (
  {
    type: TOOGLE_SELECT_CATEGORY_ALL,
  }
);


export const fetchAllCategories = () => (dispatch) => {
  dispatch(requestFetchAllCategories());
  const request = callApi('fetch-all-categories');
  return request.then(
    (response) => {
      if (response.success) {
        dispatch(receiveFetchAllCategories(response.categories));
        dispatch(fetchTodoArgumentsByCategory(categoryAll.id));
      }
      dispatch(errorFetchAllCategories(response.messageError));
    },
    error => ({ error }),
  );
};

export const deleteCategory = (categoryId = '') => (dispatch, getState) => {
  const request = callApi('delete-category', { categoryId });
  return request.then(
    (response) => {
      if (response.success) {
        const { items } = getState().categories;
        const categoryIndex = items.findIndex(category => category.id === categoryId);
        dispatch(removeCategoryLocal(categoryIndex));
      }
    },
    error => ({ error }),
  );
};

export const executeAddCategory = (name = '', nextStep = '') => (dispatch) => {
  const request = callApi('add-category', { name });
  return request.then(
    (response) => {
      if (response.success) {
        dispatch(addCategoryLocal(response.category));
        if (nextStep !== '') {
          dispatch(goNextStep(nextStep, { selectedCategory: response.category }));
        }
      }
    },
    error => ({ error }),
  );
};