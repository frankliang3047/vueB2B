<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <!-- checkout info -->
    <section class="row" v-if="isInform">
      <!-- 購物籃有商品 start -->
      <div class="col-md-8 col-10 mt-0 mt-md-5 mx-auto" v-if="cart.length !== 0">
        <div class="d-none d-md-block">
          <div class="card">
            <div class="card-header" id="headingOne">
              <h6 class="d-flex align-items-center">
                <a data-toggle="collapse" href="#collapseOne">
                  顯示購物車細節
                  <i class="fa fa-angle-down" aria-hidden="true"></i>
                </a>
                <span class="ml-auto mt-2 text-muted" style="font-size:0.8rem;">共 {{cart.length}}項</span>
                <span class="h3 ml-2 mb-0">${{finalTotal}}</span>
              </h6>
            </div>
          </div>
          <div id="collapseOne" class="collapse show mt-3">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th width="100"></th>
                  <th>商品名稱</th>
                  <th width="100" class="text-right">數量</th>
                  <th width="100" class="text-right">單價</th>
                  <th width="80" class="text-right">小計</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in cart" :key="index">
                  <td class="align-middle">
                    <div
                      class="card"
                      style="height: 100px; background-size: cover; background-repeat: no-repeat; background-position: center"
                      :style="{backgroundImage:`url(${item.product.imageUrl})`}"
                    ></div>
                  </td>
                  <td class="align-middle">
                    <span v-if="item.coupon" class="badge badge-success">套用優惠卷</span>
                    {{item.product.title}}
                  </td>
                  <td class="align-middle text-right">{{item.qty}} {{item.product.unit}}</td>
                  <td class="align-middle text-right">{{item.product.price | currency}}</td>
                  <td class="align-middle text-right">{{item.final_total | currency}}</td>
                </tr>
                <tr v-if="finalTotal == total">
                  <td colspan="4" class="text-right font-weight-bold mt-1">結帳總金額</td>
                  <td class="text-right font-weight-bold">
                    <strong>{{total | currency}}</strong>
                  </td>
                </tr>
                <tr v-if="finalTotal !== total" class="text-success">
                  <td colspan="4" class="text-right font-weight-bold mt-1">折扣價</td>
                  <td class="text-right font-weight-bold">
                    <strong>{{finalTotal | currency}}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- 購物車細節mobile size start -->
        <div class="d-block d-md-none col-12">
          <div class="card">
            <div class="card-header" id="headingOne">
              <h6 class="mb-0 d-flex align-items-center justify-content-center">
                <a data-toggle="collapse" href="#collapseMobile">
                  收合購物車
                  <i class="fa fa-angle-down" aria-hidden="true"></i>
                </a>
              </h6>
            </div>
          </div>
          <div id="collapseMobile" class="collapse show mt-1">
            <table class="table table-sm">
              <tbody>
                <tr v-for="(item,index) in cart" :key="index">
                  <td class="align-middle" width="60">
                    <div
                      class="card"
                      style="height: 100px; background-size: cover; background-repeat: no-repeat; background-position: center"
                      :style="{backgroundImage:`url(${item.product.imageUrl})`}"
                    ></div>
                  </td>
                  <td class="align-middle" width="100">
                    <span class="h5">{{item.product.title}}</span>
                    <div class="mt-1">
                      <tr class="text-muted">數量：{{item.qty}} {{item.product.unit}}</tr>
                      <tr class="text-muted">單價：{{item.product.price | currency}}</tr>
                      <tr class="text-muted">總價：{{item.final_total | currency}}</tr>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="3" class="text-right font-weight-bold">
                    <strong>合計 &nbsp; ${{finalTotal}}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- 購物車細節mobile size end -->

        <h5 class="py-3 mt-5 mb-2 text-center bg-light">訂購人資訊</h5>
        <form id="needs-validation" novalidate>
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="username">姓名</label>
              <input
                type="text"
                class="form-control"
                id="username"
                name="name"
                placeholder="姓名"
                v-validate="'required'"
                :class="{'is-invalid': errors.has('name')}"
                v-model="userdata.user.name"
              >
              <span class="text-danger" v-if="errors.has('name')">姓名不能留空。</span>
            </div>
            <div class="form-group col-md-6">
              <label for="email">Email</label>
              <input
                type="email"
                class="form-control"
                id="email"
                placeholder="Email"
                name="email"
                :class="{'is-invalid': errors.has('email')}"
                v-validate="'required|email'"
                v-model="userdata.user.email"
              >
              <span class="text-danger" v-if="errors.has('email')">{{errors.first('email')}}</span>
            </div>
          </div>
          <div class="form-group">
            <label for="tel">電話</label>
            <input
              type="tel"
              class="form-control"
              id="tel"
              placeholder="0912345678"
              name="tel"
              v-validate="'required|numeric'"
              :class="{'is-invalid': errors.has('tel')}"
              v-model="userdata.user.tel"
            >
            <span class="text-danger" v-if="errors.has('tel')">電話不能留空。</span>
          </div>
          <div class="form-group">
            <label for="address">地址</label>
            <input
              type="text"
              class="form-control"
              id="address"
              placeholder="彰化縣幸福路520號"
              name="address"
              v-validate="'required'"
              :class="{'is-invalid': errors.has('address')}"
              v-model="userdata.user.address"
            >
            <span class="text-danger" v-if="errors.has('address')">地址不能留空。</span>
          </div>
          <div class="form-group">
            <label for="message">
              留言
              <span class="font-italic text-muted ml-1" style="font-size:13px">(選填)</span>
            </label>
            <textarea class="form-control" id="message" rows="3" v-model="userdata.message"></textarea>
          </div>
          <div class="text-right">
            <router-link to="/" class="btn btn-secondary mr-3">繼續選購</router-link>
            <button type="submit" class="btn btn-primary mr-3" @click.prevent="createOrder()">送出訂單</button>
          </div>
        </form>
      </div>
      <!-- 購物籃有商品 end -->

      <!-- 購物籃無商品 start -->
      <div class="col-md-8 mx-auto col-10" v-else>
        <h5 class="py-3 mt-2 mt-md-5 mb-2 text-center bg-light">購物車暫無商品</h5>
        <div class="text-right">
          <router-link to="/" class="btn btn-secondary mt-4">回商店選購</router-link>
        </div>
      </div>
      <!-- 購物籃無商品 end -->
    </section>
    <!-- checkout info -->

    <!-- checkout pay -->
    <section class="row justify-content-center mt-4 mt-md-5" v-if="ispay">
      <div class="col-10 col-md-8">
        <h4 class="text-center">總金額：{{orderTotal | currency}}</h4>
        <h5 class="py-3 mt-4 mt-md-5 mb-2 text-center bg-light">付款</h5>
        <div class="form-row">
          <div class="form-group col-md">
            <label for>姓名</label>
            <input
              type="text"
              class="form-control"
              placeholder="姓名"
              name="name"
              v-validate="'required'"
              :class="{'is-invalid': errors.has('name')}"
            >
            <span class="text-danger" v-if="errors.has('address')">姓名不能留空。</span>
          </div>
          <div class="form-group col-md">
            <label for>電話</label>
            <input
              type="text"
              class="form-control"
              placeholder="電話"
              name="tel"
              v-validate="'required|numeric'"
              :class="{'is-invalid': errors.has('tel')}"
            >
            <span class="text-danger" v-if="errors.has('address')">電話不能留空。</span>
          </div>
        </div>

        <div class="row d-flex justify-content-end mt-4">
          <button class="btn btn-outline-primary" @click.prevent="pay()">確認付款</button>
        </div>
      </div>
    </section>
    <!-- checkout pay -->
  </div>
</template>

<script>
import $ from "jquery";

export default {
  props: ["step", "userdata"],
  data() {
    return {
      cart: [],
      finalTotal: 0,
      total: 0,
      orderTotal: 0,
      orderID: "",
      tempItem: {},
      isInform: true,
      ispay: false,
      isLoading: false,
      status: {
        del: false
      }
    };
  },
  methods: {
    getCartList() {
      var vm = this;
      vm.isLoading = true;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      this.$http.get(api).then(response => {
        vm.isLoading = false;
        vm.cart = response.data.data.carts;
        vm.finalTotal = response.data.data.final_total;
        vm.total = response.data.data.total;
        // console.log(response);
        // console.log(vm.cart);
      });
    },
    createOrder() {
      var vm = this;
      this.$validator.validate().then(result => {
        if (result) {
          const orderApi = `${process.env.APIPATH}/api/${
            process.env.CUSTOMPATH
          }/order`;
          vm.isLoading = true;
          vm.$http.post(orderApi, { data: vm.userdata }).then(response => {
            if (response.data.success) {
              vm.isLoading = false;
              vm.isInform = false;
              vm.ispay = true;
              vm.orderID = response.data.orderId;
              vm.getOrderInfo();
              this.$emit("step", (this.currentStep = "pay"));
              this.$bus.$emit("cart:update");
              this.$router.push(`/checkoutPay/${vm.orderID}`);
            } else {
              vm.isLoading = false;
              if (response.message) {
                alert(response.data.message);
              } else if (response.messages) {
                alert(response.data.messages);
              }
            }
          });
        } else {
          alert("資料有誤");
          // console.log("資料有誤")
        }
      });
    },
    getOrderInfo() {
      var vm = this;
      vm.isLoading = true;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order/${
        vm.orderID
      }`;
      this.$http.get(api).then(response => {
        if (response.data.success) {
          vm.isLoading = false;
          // console.log(response);
          vm.orderTotal = response.data.order.total;
        }
      });
    }
    // pay() {
    //   let vm = this;
    //   this.$validator.validate().then(result => {
    //     if (result) {
    //       const payApi = `${process.env.APIPATH}/api/${
    //         process.env.CUSTOMPATH
    //       }/pay/${vm.orderID}`;
    //       vm.$http.post(payApi).then(response => {
    //         if (response.data.success) {
    //           console.log(response);
    //           this.$emit("step", (this.currentStep = "finish"));
    //           this.$router.push(`/finish/${vm.orderID}`);
    //         } else {
    //           alert("付款失敗");
    //           // console.log(response);
    //         }
    //       });
    //     } else {
    //       alert("資料有誤");
    //       // console.log("資料有誤")
    //     }
    //   });
    // }
  },
  created() {
    this.getCartList();
    this.$emit("step", (this.currentStep = "info"));
    // $(".navbar-nav").css("marginRight", "0px");
  }
};
</script>

<style>
table a:hover {
  text-decoration: none;
}
.table-mobile-img {
  width: 100%;
  max-width: 120px;
  height: 80px;
  background-size: cover;
  background-position: center;
}
</style>
