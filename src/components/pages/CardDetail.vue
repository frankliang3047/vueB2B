<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="container mt-4">
      <div class="row no-gutters" v-if="product.id">
        <div class="col-md-8 card">
          <img :src="product.imageUrl" class="img-fluid">
        </div>
        <div class="col-md-4 mt-3 mt-md-0 pl-md-3">
          <div class="card">
            <div class="card-header h5">{{product.title}}</div>
            <div class="card-body">
              <div class="card-text h6 d-flex justify-content-between align-items-baseline">
                <del>原價 {{product.origin_price | currency}}</del>
                <h4>特價 {{product.price | currency}}</h4>
              </div>
              <select class="form-control mb-3" v-model="product.buyNum">
                <option :value="num" v-for="num in 10" :key="num">選購 {{num}} {{product.unit}}</option>
              </select>
              <div class="border border-muted border-top-1 mb-3"></div>
              <p
                class="text-right text-main font-weight-bold mb-1"
              >小計 {{product.buyNum * product.price | currency}}</p>
              <button
                type="button"
                class="btn btn-success btn-block mt-4"
                @click="addtoCart(product.id,product.buyNum)"
                :disabled="status.loadingIcon"
              >
                <i class="fas fa-spinner fa-spin mr-1" v-if="status.loadingIcon"></i>放入購物車
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row mt-3">
        <div class="col-md-8" v-if="product.id">
          <h3>產品描述</h3>
          <div class="border border-muted border-top-1 mb-3"></div>
          <p class="text-left wordBreak">
            {{ product.description }}
            <em class="blockquote-footer text-right">{{ product.content }}</em>
          </p>
        </div>
      </div>
    </div>
    <div class="col-md-12" v-if="product.id">
      <h3 class="my-3 text-center">同類別商品</h3>
      <prodSilder :prod-category="product.category"></prodSilder>
    </div>
  </div>
</template>
<script>
import prodSilder from "@/components/prodsilder";
export default {
  data() {
    return {
      productID: "",
      product: {},
      status: {
        loadingIcon: false
      },
      isLoading: false
    };
  },
  components: {
    prodSilder
  },
  methods: {
    getProduct(id) {
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/product/${id}`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        vm.product = response.data.product;
        vm.$set(vm.product, "buyNum", 1);
        vm.isLoading = false;
      });
    },
    addtoCart(id, qty = 1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      const vm = this;
      const cart = {
        product_id: id,
        qty
      };
      vm.status.loadingIcon = true;
      vm.$http.post(api, { data: cart }).then(response => {
        if (response.data.success) {
          this.$bus.$emit("cart:update");
        }
        vm.status.loadingIcon = false;
      });
    }
  },
  created() {
    const vm = this;
    vm.productID = vm.$route.params.prodId;
    vm.getProduct(vm.productID);
  },
  watch: {
    "$route.params.prodId": function() {
      const vm = this;
      vm.productID = vm.$route.params.prodId;
      vm.getProduct(vm.productID);
    }
  }
};
</script>

<style>
.wordBreak {
  word-break: break-all;
  min-width: 50px;
}
</style>