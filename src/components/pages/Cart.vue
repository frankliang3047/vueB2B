<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="container" v-if="cart.total!=0">
      <div class="row">
        <div class="d-none d-md-block col-md-8 col-lg-9">
          <div class="card">
            <div class="card-header" id="headingOne">
              <h6 class="mb-0 d-flex align-items-center justify-content-center">
                <a data-toggle="collapse" href="#collapseOne">
                  收合購物車
                  <i class="fa fa-angle-down" aria-hidden="true"></i>
                </a>
              </h6>
            </div>
          </div>
          <div id="collapseOne" class="collapse show mt-3">
            <table class="table table-sm table-borderless">
              <thead>
                <tr>
                  <th width="100"></th>
                  <th>
                    <span class="ml-2">商品名稱</span>
                  </th>
                  <th width="60" class="text-right">數量</th>
                  <th width="60" class="text-right">小計</th>
                  <th width="60"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in cart.carts" :key="item.id">
                  <td class="align-middle">
                    <div
                      class="card"
                      style="height: 100px; background-size: cover; background-repeat: no-repeat; background-position: center"
                      :style="{backgroundImage:`url(${item.product.imageUrl})`}"
                    ></div>
                  </td>
                  <td class="align-middle">
                    <span class="ml-2 h6">
                      <span v-if="item.coupon" class="badge badge-success">套用優惠卷</span>
                      {{ item.product.title }}
                    </span>
                  </td>
                  <td class="align-middle text-right">{{ item.qty }}</td>
                  <td class="align-middle text-right">{{ item.product.price | currency }}</td>
                  <td class="align-middle text-right">
                    <button
                      type="button"
                      class="btn btn-outline-danger btn-sm"
                      @click="removeFromCart(item.id)"
                    >
                      <i class="far fa-trash-alt"></i>
                    </button>
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
          <div id="collapseMobile" class="collapse show mt-3">
            <table class="table table-sm">
              <tbody>
                <tr v-for="(item,index) in cart.carts" :key="index">
                  <td class="align-middle" width="100">
                    <div
                      class="card"
                      style="height: 100px; background-size: cover; background-repeat: no-repeat; background-position: center"
                      :style="{backgroundImage:`url(${item.product.imageUrl})`}"
                    ></div>
                  </td>
                  <td class="align-middle">
                    <span class="h6">{{item.product.title}}</span>
                    <div class="mt-1">
                      <tr class="text-muted">數量：{{item.qty}} {{item.product.unit}}</tr>
                      <tr class="text-muted">單價：{{item.product.price | currency}}</tr>
                      <tr class="text-muted">總價：{{item.final_total | currency}}</tr>
                    </div>
                  </td>
                  <td class="align-middle text-center" width="60">
                    <button
                      type="button"
                      class="btn btn-outline-danger btn-sm"
                      @click="removeFromCart(item.id)"
                    >
                      <i class="far fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- 購物車細節mobile size end -->

        <div class="col-12 col-md-4 col-lg-3">
          <div class="card">
            <div class="card-header h5">訂單摘要</div>
            <div class="card-body">
              <p class="card-text h6 d-flex">
                <span>商品總計</span>
                <span class="ml-auto">{{ cart.total | currency }}</span>
              </p>

              <div class="input-group my-4 input-group-sm">
                <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="code">
                <div class="input-group-append">
                  <button class="btn btn-outline-secondary" type="button" @click="applyCoupon">套用優惠碼</button>
                </div>
              </div>

              <div class="border border-muted border-top-1 mb-3"></div>

              <p class="card-text h6 d-flex" v-if="cart.total == cart.final_total">
                <span>結帳總金額</span>
                <span class="ml-auto">{{ cart.final_total | currency }}</span>
              </p>
              <p class="card-text text-success h6 d-flex" v-if="cart.total !== cart.final_total">
                <span>折扣價</span>
                <span class="ml-auto">{{ cart.final_total | currency }}</span>
              </p>

              <router-link class="btn btn-danger btn-block mt-4" to="/checkout">結帳去</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center">
      <div class="empty-title">您的購物車內沒有商品</div>
      <div>
        <button class="btn btn-outline-dark mt-4" @click.prevent="$router.push('/')">回去逛逛</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      cart: {},
      code: ""
    };
  },
  methods: {
    getCart() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        vm.cart = response.data.data;
        vm.isLoading = false;
        // console.log(response);
      });
    },
    removeFromCart(id) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/cart/${id}`;
      vm.isLoading = true;
      this.$http.delete(api).then(response => {
        vm.isLoading = false;
        if (response.data.success) {
          vm.getCart();
          this.$bus.$emit("cart:update");
        }
      });
    },
    applyCoupon() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
      vm.isLoading = true;
      this.$http.post(api, { data: { code: vm.code } }).then(response => {
        vm.isLoading = false;
        console.log(response);
        if (response.data.success) {
          vm.getCart();
        } else {
          alert(response.data.message);
        }
      });
    }
  },
  created() {
    this.getCart();
  }
};
</script>