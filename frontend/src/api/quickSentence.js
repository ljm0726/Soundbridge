import { apiInstance } from "./index.js";

const api = apiInstance();
//PUT
async function updateQuickSentence(
  quickSentenceId,
  quickSentence,
  accessToken,
  success,
  fail
) {
  await api
    .put(
      `/api/quick-sentences`,
      {
        quickSentenceId: quickSentenceId,
        quickSentence: quickSentence,
      },
      {
        headers: {
          "access-token": accessToken,
        },
      }
    )
    .then(success)
    .catch(fail);
}
//POST
async function saveQuickSentence(
  sentence,
  categoryId,
  accessToken,
  success,
  fail
) {
  await api
    .post(
      `/api/quick-sentences`,
      {
        sentence: sentence,
        categoryId: categoryId,
      },
      {
        headers: {
          "access-token": accessToken,
        },
      }
    )
    .then(success)
    .catch(fail);
}

//GET
async function getQuickSentence(categoryId, accessToken, success, fail) {
  await api
    .get(`/api/quick-sentences/${categoryId}`, {
      headers: {
        "access-token": accessToken,
      },
    })
    .then(success)
    .catch(fail);
}
//PUT count
async function countQuickSentenceAndCategory(
  quickSentenceId,
  accessToken,
  success,
  fail
) {
  await api
    .put(`/api/quick-sentences/${quickSentenceId}`, {
      headers: {
        "access-token": accessToken,
      },
    })
    .then(success)
    .catch(fail);
}
// DELETE
async function delQuickSentence(quickSentenceId, accessToken, success, fail) {
  await api
    .delete(`/api/quick-sentences/${quickSentenceId}`, {
      headers: {
        "access-token": accessToken,
      },
    })
    .then(success)
    .catch(fail);
}

export {
  updateQuickSentence,
  saveQuickSentence,
  getQuickSentence,
  countQuickSentenceAndCategory,
  delQuickSentence,
};
