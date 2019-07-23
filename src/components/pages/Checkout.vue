<template>
  <div>
    <div class="container main-contant py-3">
      <h2 class="text-center mb-3 mt-3 mb-1 mb-md-3">結帳流程</h2>
      <section class="form-row align-items-center text-center d-none d-md-flex">
        <div class="col">
          <div
            class="alert alert-rounded mb-0"
            role="alert"
            :class="{'alert-success':currentStep == 'info','alert-light': currentStep!='info'}"
          >1.輸入訂單資料</div>
        </div>
        <div class="col">
          <div
            class="alert alert-rounded mb-0"
            role="alert"
            :class="{'alert-success':currentStep == 'pay','alert-light':currentStep !='pay'}"
          >2.金流付款</div>
        </div>
        <div class="col">
          <div
            class="alert alert-rounded mb-0"
            role="alert"
            :class="{'alert-success':currentStep == 'finish','alert-light':currentStep !='finish'}"
          >3.完成</div>
        </div>
      </section>

      <router-view
        :step="currentStep"
        :userdata="data"
        :propsOrderID="orderId"
        @step="currentStep = $event"
      ></router-view>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  data() {
    return {
      currentStep: "info",
      orderId: "123",
      data: {
        user: {
          name: "",
          email: "",
          address: "",
          tel: ""
        },
        message: ""
      }
    };
  },
  methods: {
    getOrderID(id) {
      // console.log(id);
      let vm = this;
      vm.orderId = id;
      // console.log(vm.orderId);
    }
  },
  created() {}
};
</script>
