<template>
  <div class="cat__modal">
    <div class="close__button" @click="emit('closemodal')">
      <font-awesome-icon icon="fa-solid fa-xmark" />
    </div>
    <p>내 카테고리</p>
    <div class="del__container" v-if="freqUsedCat[0]">
      <div class="del__list" v-for="(cat, index) in freqUsedCat" :key="index">
        <p>{{ cat.categoryName }}</p>
        <font-awesome-icon
          icon="fa-solid fa-xmark"
          @click="delCatHandler(cat)"
        />
      </div>
    </div>

    <p>카테고리 추가하기</p>
    <div>
      <input
        class="input__box"
        type="text"
        placeholder="카테고리 이름 입력하세요"
        v-model="newCategory"
        @keyup.enter="
          () => {
            categoryHandler(newCategory);
          }
        "
      />
    </div>
    <div class="addbutton__container">
      <button
        @click="
          () => {
            categoryHandler();
          }
        "
      >
        추가하기 +
      </button>
    </div>
  </div>
</template>

<script setup>
//ref
import { ref, watch, defineEmits } from "vue";
//store import
import { usePronounce } from "@/store/Pronounce";
import { storeToRefs } from "pinia";
import Swal from "sweetalert2";

const emit = defineEmits(["reUpload", "closemodal"]);

const store = usePronounce();
const { freqUsedCat } = storeToRefs(store);

const callCategoryAPI = async () => {
  await store.readCategories;
  console.log(freqUsedCat, "callcatAPI");
};

watch(freqUsedCat, () => {
  console.log("watch category from modal", freqUsedCat);
});

const newCategory = ref("");

const delCatHandler = (data) => {
  Swal.fire({
    title: "삭제 하시겠습니까?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
  }).then((result) => {
    if (result.isConfirmed) {
      store.delCategory(data.categoryId);
      emit("reUpload");
    }
  });

  console.log("????????????");
};

const categoryHandler = async () => {
  if (newCategory.value.length < 5) {
    await store.addCategory(newCategory.value);
    emit("reUpload");
    emit("closemodal");
  } else {
    alert("카테고리는 4글자 이하여야 합니다.");
  }
};

// defineEmits([]);
</script>

<style scoped>
.cat__modal {
  background-color: var(--maincolor2);
  border-radius: 8px;
  box-shadow: 4px 4px 4px 4px var(--black4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  padding-inline: 5%;
  padding-block: 5%;
  margin: auto;
  align-self: center;
  position: fixed;
  top: 30vh;
  left: 5vw;
  width: 80%;
  z-index: 12;
}
.close__button {
  display: flex;
  justify-content: end;
}
.addbutton__container {
  margin-top: 10%;
  align-self: center;
}
.input__box {
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  padding: 5px;

  margin-left: 2%;
  margin-right: 2%;
  /* Black/200 / */
  width: 90%;
  border-top: 2px solid #f1f1f1;
  border-right: 2px solid #f1f1f1;
  border-bottom: 2px solid #f1f1f1;
  border-left: 1px solid #f1f1f1;

  /* filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)); */
  border-radius: 8px;

  font-size: 1.1rem;

  /* / Inside auto layout */

  flex: none;
  order: 0;
  flex-grow: 0;
}

.del__container {
  padding-block: 10%;
  padding-inline: 10%;
  border-radius: 32px;
  background-color: var(--black1);
}
.del__list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: var(--black2) solid;
  padding: 7px;
}
.del__list p {
  margin: 0;
}
</style>
