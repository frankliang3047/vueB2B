<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <topSilder></topSilder>
    <div class="container py-3">
      <h5 class="h1">關於這個網站</h5>
      <p class>這是一個練習 Vue 的作品，請各位前輩多多指教。</p>
      <p class>
        <span class="badge badge-success">85折優惠券</span> code85
      </p>
      <h2 class="text-center">本期熱銷商品</h2>
      <prodSilder></prodSilder>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import prodSilder from "@/components/prodsilder";
import topSilder from "@/components/topsilder";

export default {
  components: {
    prodSilder,
    topSilder
  },
  data() {
    return {
      isLoading: false
    };
  },
  created() {
    const vm = this;
    vm.isLoading = true;
  },
  mounted() {
    const vm = this;
    vm.isLoading = false;
  }
};
</script>

