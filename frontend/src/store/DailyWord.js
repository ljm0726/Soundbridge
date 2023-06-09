import { defineStore } from "pinia";
import {
  getMyDailyWord,
  getMySentence,
  addMyDailyWord,
  deleteDailyWord,
  saveOrUpdateTryHistory,
  updateSuccessCount,
} from "@/api/dailyword";
import { ref } from "vue";
import { useMember } from "./Member";
import Swal from "sweetalert2";

export const useMyDailyWord = defineStore("mydailyword", () => {
  const mydailyword = ref();
  const sentenceList = ref();
  const memberStore = useMember();

  // GET
  async function getmydailyword() {
    await getMyDailyWord(memberStore.accessToken, ({ data }) => {
      mydailyword.value = data;
      console.log("Get word responses", mydailyword.value);
    });
  }

  async function getmysentence() {
    await getMySentence(memberStore.accessToken, ({ data }) => {
      sentenceList.value = data;
      console.log("Get sentence responses", sentenceList.value);
    });
  }

  async function addmydailyword(newWord, type) {
    await addMyDailyWord(
      newWord,
      memberStore.getMemberInfo.memberId,
      type,
      memberStore.accessToken,
      ({ data }) => {
        console.log(data, " add new word");
        if (type == "DAILY_WORD") {
          getMyDailyWord(memberStore.accessToken, ({ data }) => {
            mydailyword.value = data;
            console.log("Get method responses", mydailyword.value);
          });
        } else {
          getMySentence(memberStore.accessToken, ({ data }) => {
            console.log(data);
            sentenceList.value = data;
            console.log("Get method responses", sentenceList.value);
          });
        }
      }
    );
  }

  async function saveorupdatetryhistory(wordMemberId, index, type) {
    console.log("savehistory 호출");
    console.log(memberStore.accessToken);
    await saveOrUpdateTryHistory(
      wordMemberId,
      memberStore.accessToken,
      ({ data }) => {
        console.log(data, " update tryHistory");

        if (type == "DAILY_WORD") {
          mydailyword.value[index].tryCount++;
        } else {
          sentenceList.value[index].tryCount++;
        }
      }
    );
  }

  async function updatesuccesscount(wordMemberId, index, type) {
    await updateSuccessCount(
      wordMemberId,
      memberStore.accessToken,
      ({ data }) => {
        console.log(data, " update successCount");
        if (type == "DAILY_WORD") {
          mydailyword.value[index].successCount++;
          Swal.fire({
            title: "성공!",
            html:
              "성공횟수 : " +
              mydailyword.value[index].successCount +
              "<br/>" +
              "시도 횟수 : " +
              mydailyword.value[index].tryCount,
            position: "bottom-end",
          });
        } else {
          sentenceList.value[index].successCount++;
          Swal.fire({
            title: "성공!",
            html:
              "성공횟수 : " +
              sentenceList.value[index].successCount +
              "<br/>" +
              "시도 횟수 : " +
              sentenceList.value[index].tryCount,
            position: "bottom-end",
          });
        }
      }
    );
  }

  async function deletedailyword(wordMemberId, type) {
    await deleteDailyWord(wordMemberId, memberStore.accessToken, ({ data }) => {
      console.log("delete dailyWord");

      console.log(type);

      if (type == "DAILY_WORD") {
        getMyDailyWord(memberStore.accessToken, ({ data }) => {
          mydailyword.value = data;
          console.log("Get word responses", mydailyword.value);
        });
      } else {
        getMySentence(memberStore.accessToken, ({ data }) => {
          sentenceList.value = data;
          console.log("Get sentence responses", sentenceList.value);
        });
      }
    });
  }

  // getters == computed()  랜더링 될때 실행되는 함수 -
  // api 불러오는 함수 선언하고, response 값 state에 저장
  //
  return {
    getmydailyword,
    getmysentence,
    addmydailyword,
    saveorupdatetryhistory,
    updatesuccesscount,
    deletedailyword,
    mydailyword,
    sentenceList,
  };
});
