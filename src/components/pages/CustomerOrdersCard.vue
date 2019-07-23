<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="productCard card border-0 rounded shadow-sm">
      <div
        class="card-img-top"
        style="height: 250px; background-size: cover; background-repeat: no-repeat; background-position: center center"
        :style="{backgroundImage:`url(${item.imageUrl})`}"
      ></div>
      <div class="card-body">
        <span class="badge badge-primary float-right">{{item.category}}</span>
        <h5 class="card-title">
          <span class="text-dark productTitle">{{item.title}}</span>
        </h5>
        <p class="card-text productContent">{{item.content}}</p>
        <div class="d-flex justify-content-between align-items-baseline">
          <div class="h5" v-if="!item.price">{{item.origin_price}}</div>
          <del class="h6" v-if="item.origin_price">原價{{item.origin_price}}</del>
          <div class="h5" v-if="item.price">現在只要{{item.price}}</div>
        </div>
      </div>
      <div class="card-footer d-flex" v-if="item.is_enabled">
        <button
          type="button"
          class="btn btn-outline-secondary btn-sm"
          @click=" prodctInfo(item.id)"
        >查看更多</button>
        <button
          type="button"
          class="btn btn-outline-danger btn-sm ml-auto"
          @click="addtoCart(item.id)"
        >
          <i class="fas fa-spinner fa-spin mr-1" v-if="status.loadingItem === item.id"></i>加到購物車
        </button>
      </div>
      <div class="card-footer d-flex" v-else>
        <button type="button" class="btn btn-outline-secondary btn-lg btn-block" disabled>敬請期待</button>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: {
    item: {
      type: Object,
      default: function() {
        return {};
      }
    },
    status: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      isLoading: false
    };
  },
  methods: {
    addtoCart(id, qty = 1) {
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      const vm = this;

      const cart = {
        product_id: id,
        qty
      };
      vm.status.loadingItem = id;
      vm.isLoading = true;
      this.$http.post(url, { data: cart }).then(response => {
        console.log(response.data);
        vm.isLoading = false;
        vm.status.loadingItem = "";
        this.$bus.$emit("cart:update");
        $("#productModal").modal("hide");
      });
    },
    prodctInfo(id) {
      const vm = this;
      // console.log(id);
      vm.$router.push(`/cardDetail/${id}`);
    }
  }
};
</script>

<style scoped>
.productTitle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.productContent {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.productCard {
  box-shadow: 0px 0px 5px black ;
  transition: all 0.5s;
}
.productCard:hover {
  transform: scale(1.01);
  box-shadow: 1px 1px 10px black !important;
}
</style>
