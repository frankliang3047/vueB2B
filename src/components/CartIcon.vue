<template>
  <div>
    <div class="cart-icon-border">
      <i class="fas fa-shopping-cart text-dark fa-2x"></i>
      <span class="badge badge-pill badge-danger" v-if="cartLen !== 0">{{ cartLen }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartLen: 0
    };
  },
  methods: {
    getCart() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      this.$http.get(api).then(response => {
        vm.cart = response.data.data;
        vm.cartLen = response.data.data.carts.length;
      });
    }
  },
  created() {
    const vm = this;
    vm.getCart();
    vm.$bus.$on("cart:update", vm.getCart);
  }
};
</script>

<style scoped>
.cart-icon-border {
  position: relative;
}
.badge-pill {
  position: absolute;
  top: -10px;
  right: -10px;
}
</style>