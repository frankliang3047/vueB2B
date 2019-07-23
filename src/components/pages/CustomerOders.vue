<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <topSilder></topSilder>

    <!-- 選購區 start-->
    <div class="container" id="position">
      <p class="text-center font-weight-bold h3 my-3">購物專區</p>
      <div class="row justify-content-end">
        <div class="col-md-8 col-lg-4">
          <div class="input-group mb-3">
            <input
              type="text"
              class="form-control border border-main text-main"
              placeholder="Search something..."
              v-model.trim="searchFilter"
              @input="searchProducts"
            >
            <div class="input-group-append">
              <button
                class="btn btn-becare text-main border border-main border-left-0"
                type="button"
                @click="searchProducts"
              >
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-lg-2 col-md-3 mb-3">
          <div class="sticky-top rounded-lg" style="top:20px">
            <div class="list-group list-group">
              <a
                class="list-group-item list-group-item-action active"
                data-toggle="list"
                href="#"
                @click.prevent="changeTab('')"
              >
                <img class="img-fluid" src="@/assets/image/file.svg" alt width="20">
                <span class="ml-3">全部</span>
              </a>
              <a
                href="#"
                class="list-group-item list-group-item-action"
                data-toggle="list"
                @click.prevent="changeTab('帽子')"
              >
                <img class="img-fluid" src="@/assets/image/hat.svg" alt width="20">
                <span class="ml-3">帽子</span>
              </a>
              <a
                href="#"
                class="list-group-item list-group-item-action"
                data-toggle="list"
                @click.prevent="changeTab('服飾')"
              >
                <img class="img-fluid" src="@/assets/image/tshirt.svg" alt width="20">
                <span class="ml-3">服飾</span>
              </a>
              <a
                class="list-group-item list-group-item-action"
                data-toggle="list"
                href="#"
                @click.prevent="changeTab('褲子')"
              >
                <img class="img-fluid" src="@/assets/image/jeans.svg" alt width="20">
                <span class="ml-3">褲子</span>
              </a>
              <a
                class="list-group-item list-group-item-action"
                data-toggle="list"
                href="#"
                @click.prevent="changeTab('鞋子')"
              >
                <img class="img-fluid" src="@/assets/image/shoe.svg" alt width="20">
                <span class="ml-3">鞋子</span>
              </a>
            </div>
          </div>
        </div>
        <div class="col-lg-10 col-md-9 d-none d-sm-block">
          <div
            v-if="(searchFilter || searchResult.length) && searchResult.length == 0"
            class="alert alert-secondary h-100 d-flex justify-content-center align-items-center"
          >Sorry,依您的關鍵字「{{searchFilter}}」搜尋不到產品呢...</div>
          <template v-else>
            <div class="row">
              <div v-for="(item,key) in filterPager" class="col-lg-4 col-sm-6 mb-4" :key="key">
                <CustomerOrdersCard :item="item" :status="status"/>
              </div>
            </div>
            <!-- 分頁 -->
            <pagination
              :page-data="pagination"
              @changepage="getPage"
              class="d-flex justify-content-center"
              v-if="pagination.total_pages"
            ></pagination>
            <!-- 分頁 -->
          </template>
        </div>
        <div class="col d-sm-none">
          <div
            v-if="(searchFilter || searchResult.length) && searchResult.length == 0"
            class="alert alert-warning"
          >Sorry,依您的關鍵字「{{searchFilter}}」搜尋不到產品呢...</div>
          <prodSilder
            :prod-category="prodCategory"
            :search-result="searchResult"
            :search-filter="searchFilter"
            v-else
          ></prodSilder>
        </div>
      </div>
      <!-- 選購區 end-->
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import Pagination from "@/components/Pagination.vue";
import CustomerOrdersCard from "@/components/pages/CustomerOrdersCard.vue";

import prodSilder from "@/components/prodsilder";
import topSilder from "@/components/topsilder";

export default {
  data() {
    return {
      allProducts: [],
      prodCategory: "",
      searchFilter: "",
      searchResult: [],
      pagination: {
        page_Size: 6,
        total_pages: 1,
        current_page: 1,
        has_pre: false,
        has_next: false
      },
      status: {
        loadingItem: "",
        loadingIcon: false
      },
      isLoading: false
    };
  },
  components: {
    Pagination,
    CustomerOrdersCard,
    prodSilder,
    topSilder
  },
  methods: {
    getAllProducts() {
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/products`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        vm.allProducts = response.data.products;
        // console.log(vm.allProducts);
        vm.isLoading = false;
      });
    },
    getPage(page = 1) {
      const vm = this;
      //點擊分頁跳回頁首
      $("html, body").scrollTop($("#position").offset().top);
      vm.pagination.current_page = page;
    },
    searchProducts() {
      const vm = this;
      // 重製&清除狀態
      vm.pagination.current_page = 1;
      vm.prodCategory = "";
      if (vm.searchFilter) {
        vm.searchResult = vm.allProducts.filter(item => {
          return item.title.match(vm.searchFilter);
        });
      } else {
        // 清除搜尋結果
        vm.searchResult = [];
      }
    },
    changeTab(prodCategory) {
      const vm = this;
      vm.prodCategory = prodCategory;
      // console.log(vm.prodCategory);
      vm.pagination.current_page = 1;
      vm.searchFilter = "";
      vm.searchResult = [];
    }
  },
  created() {
    this.getAllProducts();
  },
  computed: {
    filterProducts() {
      const vm = this;
      if (vm.searchFilter || vm.searchResult.length) {
        return vm.searchResult;
      } else {
        return vm.allProducts.filter(item => {
          return vm.prodCategory === ""
            ? item
            : item.category === vm.prodCategory;
        });
      }
    },
    filterPager() {
      const vm = this;
      let dataSize = vm.filterProducts.length;
      const pageSize = vm.pagination.page_Size;
      vm.pagination.total_pages = Math.ceil(dataSize / pageSize);
      let nowPage = vm.pagination.current_page;
      // 上一頁與下一頁邏輯
      nowPage > 1
        ? (vm.pagination.has_pre = true)
        : (vm.pagination.has_pre = false);
      nowPage < vm.pagination.total_pages && (vm.pagination.has_next = true);
      nowPage + 1 > vm.pagination.total_pages &&
        (vm.pagination.has_next = false);
      return vm.filterProducts.filter((item, index) => {
        // 資料區間
        return index < nowPage * pageSize && index >= (nowPage - 1) * pageSize;
      });
    }
  }
};
</script>
