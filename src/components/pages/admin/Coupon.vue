<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="text-right mt-4">
      <button class="btn btn-primary" @click="openModal(true)">新增的優惠卷</button>
    </div>

    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">優惠卷名稱</th>
          <th width="100">折扣百分比</th>
          <th>折扣代碼</th>
          <th width="120">折扣到期日</th>
          <th width="100">是否已使用</th>
          <th width="120">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in coupons" :key="item.id">
          <td>{{item.title}}</td>
          <td>{{item.percent}}%</td>
          <td>{{item.code}}</td>
          <td>{{item.due_date}}</td>
          <td>
            <span v-if="item.is_enabled" class="badge badge-danger">已使用</span>
            <span v-else>未使用</span>
          </td>
          <td>
            <div class="btn-group" role="group" aria-label="Basic example">
              <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">編輯</button>
              <button class="btn btn-outline-danger btn-sm" @click="deleteModal(item)">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 分頁 -->
    <Pagination
      :page-data="pagination"
      @changepage="getPage"
      class="d-flex justify-content-center"
      v-if="pagination.total_pages"
    />

    <!-- 新增/修改優惠卷 -->

    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span v-if="isNew">新增優惠卷</span>
              <span v-if="!isNew">修改優惠卷</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col">
                <div class="form-group">
                  <label for="title">優惠卷名稱</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="tempCoupon.title"
                    id="title"
                    placeholder="請設定優惠卷名稱"
                  >
                </div>
                <div class="form-group">
                  <label for="title">折扣百分比</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    v-model="tempCoupon.percent"
                    placeholder="請設定折扣百分比"
                  >
                </div>
                <div class="form-group">
                  <label for="title">折扣代碼</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    v-model="tempCoupon.code"
                    placeholder="請設定折扣代碼"
                  >
                </div>
                <div class="form-group">
                  <label for="title">折扣到期日</label>
                  <input
                    type="date"
                    class="form-control"
                    id="date"
                    v-model="tempCoupon.due_date"
                    placeholder="請設定折扣到期日"
                  >
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="is_enabled"
                      v-model="tempCoupon.is_enabled"
                      :true-value="1"
                      :false-value="0"
                    >
                    <label class="form-check-label" for="is_enabled">是否已使用</label>
                    <span v-if="tempCoupon.is_enabled" class="badge badge-danger">已使用</span>
                    <span v-else class="badge badge-success">未使用</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="updataCoupon">確認</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 刪除優惠卷 -->
    <div
      class="modal fade"
      id="delProductModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ tempCoupon.title }}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="deleteCoupon()">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import Pagination from "@/components/Pagination.vue";
export default {
  data() {
    return {
      coupons: [],
      tempCoupon: {},
      isNew: false,
      isLoading: false,
      pagination: {}
    };
  },
  components: {
    Pagination
  },
  methods: {
    getCoupons(page = 1) {
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/coupons?page=${page}`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        console.log(response);
        vm.isLoading = false;
        vm.coupons = response.data.coupons;
        vm.pagination = response.data.pagination;
        // console.log(vm.pagination);
      });
    },
    getPage(page = 1) {
      const vm = this;
      $("html, body").scrollTop($("#position").offset().top);
      vm.pagination.current_page = page;
    },
    openModal(isNew, item) {
      if (isNew) {
        this.tempCoupon = {};
        this.isNew = true;
      } else {
        this.tempCoupon = Object.assign({}, item);
        this.isNew = false;
      }

      //   console.log(this.tempOrder);
      $("#productModal").modal("show");
    },
    updataCoupon() {
      let api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/coupon`;
      let httpMethod = "post";
      const vm = this;
      if (!vm.isNew) {
        api = `${process.env.APIPATH}/api/${
          process.env.CUSTOMPATH
        }/admin/coupon/${vm.tempCoupon.id}`;
        httpMethod = "put";
      }
      this.$http[httpMethod](api, { data: vm.tempCoupon }).then(response => {
        // console.log(response.data);
        if (response.data.success) {
          $("#productModal").modal("hide");
          vm.getCoupons();
        } else {
          $("#productModal").modal("hide");
          vm.getCoupons();
          console.log("新增失敗");
        }
      });
    },
    deleteModal(item) {
      this.tempCoupon = Object.assign({}, item);
      $("#delProductModal").modal("show");
      // console.log(item);
    },
    deleteCoupon() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/coupon/${vm.tempCoupon.id}`;

      this.$http.delete(api).then(response => {
        $("#delProductModal").modal("hide");
        vm.getCoupons();
      });
    }
  },
  created() {
    this.getCoupons();
  }
};
</script>