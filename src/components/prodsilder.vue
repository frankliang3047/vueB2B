<template>
  <div class="p-3">
    <loading :active.sync="isLoading"></loading>
    <swiper :options="swiperOption" class="prodSwiper" v-if="filterData.length > 0">
      <swiper-slide v-for="item in filterData" :key="item.id">
        <CustomerOrdersCard :item="item" :status="status"/>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
import $ from "jquery";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import CustomerOrdersCard from "@/components/pages/CustomerOrdersCard.vue";
export default {
  name: "prodSilder",
  components: {
    swiper,
    swiperSlide,
    CustomerOrdersCard
  },
  props: {
    prodCategory: {
      type: String,
      default: ""
    },
    searchResult: {
      type: Array,
      default: function() {
        return [];
      }
    },
    searchFilter: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        spaceBetween: 10,
        speed: 600,
        grabCursor: true,
        // autoplay: {
        //   delay: 5000
        // },
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        breakpoints: {
          480: {
            slidesPerView: 1,
            slidesPerGroup: 1,
            spaceBetween: 20
          },
          767: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            spaceBetween: 30
          },
          992: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 30
          }
        }
      },
      products: [],
      status: {
        loadingItem: "",
        loadingIcon: false
      },
      isLoading: false
    };
  },
  methods: {
    getProducts() {
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/products/all`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        if (response.data.success) {
          vm.products = response.data.products;
          vm.isLoading = false;
        }
      });
    },
    addtoCart(id, qty = 1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      const vm = this;
      vm.status.loadingItem = id;
      const prodSwiper = document.querySelector(".prodSwiper");
      prodSwiper.swiper.autoplay.stop();
      const cart = {
        product_id: id,
        qty
      };
      this.$http.post(api, { data: cart }).then(response => {
        if (response.data.success) {
          vm.$bus.$emit("shopCart:update");
          vm.status.loadingItem = "";
          prodSwiper.swiper.autoplay.start();
          vm.$bus.$emit(
            "message:push",
            `【${response.data.data.product.title}】
          ${response.data.data.qty} ${response.data.data.product.unit} 
          ${response.data.message}`,
            "success"
          );
        }
      });
    }
  },
  created() {
    const vm = this;
    vm.getProducts();
  },
  updated() {
    $(".prodSwiper").on("mouseenter", function() {
      this.swiper.autoplay.stop();
    });
    $(".prodSwiper").on("mouseleave", function() {
      this.swiper.autoplay.start();
    });
  },
  computed: {
    filterData() {
      const vm = this;
      if (vm.searchFilter || vm.searchResult.length) {
        return vm.searchResult;
      } else {
        return vm.products.filter(item => {
          if (vm.prodCategory === "") {
            return item;
          } else {
            return item.category === vm.prodCategory;
          }
        });
      }
    }
  },
  watch: {
    prodCategory() {
      const prodSwiper = document.querySelector(".prodSwiper");
      prodSwiper.swiper.slideTo(0, 600);
    }
  }
};
</script>

<style lang="scss" scoped>
.swiper-container {
  min-height: 550px;
}
</style>
