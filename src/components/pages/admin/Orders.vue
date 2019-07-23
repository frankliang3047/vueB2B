<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="table-responsive my-3" v-if="orders.length != 0">
      <table class="table table-hover">
        <thead class="table-becare">
          <tr class="text-nowrap bg-light">
            <th width="100">下單時間</th>
            <th width="300">訂購人資訊</th>
            <th width="200">購買品項</th>
            <th>備註</th>
            <th width="100" class="text-right">總金額</th>
            <th width="160">是否付款</th>
            <th width="80">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr v-for="item in orders" :key="item.id">
            <td>{{item.create_at | timeTamps}}</td>
            <td>
              <ul class="list-group">
                <li class="list-group-item">
                  訂單ID
                  <br>
                  {{item.id}}
                </li>
                <li class="list-group-item">訂購人：{{item.user.name}}</li>
                <li class="list-group-item">信箱：{{item.user.email}}</li>
                <li class="list-group-item">住址：{{item.user.address}}</li>
                <li class="list-group-item">電話：{{item.user.tel}}</li>
              </ul>
            </td>
            <td>
              <ul class="list-group">
                <li v-for="prod in item.products" :key="prod.id" class="list-group-item">
                  <div class="text-nowrap">
                    {{prod.product.title}}
                    <br>
                    <span
                      class="text-dark"
                      v-if="prod.final_total >= prod.total"
                    >{{prod.product.price | currency}}</span>
                    <span
                      class="text-success"
                      v-if="prod.final_total < prod.total"
                    >{{((prod.product.price * prod.coupon.percent) / 100) | currency}}({{prod.coupon.title}})</span>
                    /{{prod.product.unit}}
                    <br>
                    <span
                      class="text-dark"
                      v-if="prod.final_total >= prod.total"
                    >{{prod.final_total | currency}}</span>
                    <span
                      class="text-success"
                      v-if="prod.final_total < prod.total"
                    >{{prod.final_total | currency}} ({{prod.coupon.title}})</span>
                    - 共{{prod.qty}} {{prod.product.unit}}
                  </div>
                </li>
              </ul>
            </td>
            <td>{{item.message}}</td>
            <td class="text-right">{{item.total | currency}}</td>
            <td>
              <ul v-if="item.is_paid">
                <li class="text-success font-weight-bold">已付款</li>
                <li>{{item.paid_date | timeTamps}}</li>
              </ul>
              <span v-else>未付款</span>
            </td>
            <td>
              <button
                class="btn btn-outline-primary btn-sm"
                @click="openModal(item)"
                v-if="option.editFunction"
              >編輯</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 分頁 start-->

    <Pagination
      :page-data="pagination"
      @changepage="getPage"
      class="d-flex justify-content-center"
      v-if="pagination.total_pages"
    />
    <!-- 分頁 end-->

    <!-- 修改訂單 start-->
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
              <span>修改訂單</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
              <a
                class="nav-item nav-link active"
                id="nav-orderinfo-tab"
                data-toggle="tab"
                href="#nav-orderinfo"
                role="tab"
                aria-controls="nav-orderinfo"
                aria-selected="true"
              >訂購人資料</a>
              <a
                class="nav-item nav-link"
                id="nav-prodlist-tab"
                data-toggle="tab"
                href="#nav-prodlist"
                role="tab"
                aria-controls="nav-prodlist"
                aria-selected="false"
              >訂購清單</a>
            </div>
          </nav>
          <div class="tab-content" id="nav-tabContent">
            <div
              class="tab-pane fade show active"
              id="nav-orderinfo"
              role="tabpanel"
              aria-labelledby="nav-orderinfo-tab"
            >
              <div class="container">
                <div class="row">
                  <div class="col-md-12">
                    <div class="form-row">
                      <div class="form-group col-md-6">
                        <label for="orderName">*訂購人</label>
                        <input
                          type="text"
                          class="form-control"
                          id="orderName"
                          name="Name"
                          v-model="tempOrder.user.name"
                          placeholder="請輸入姓名"
                          v-validate="'required'"
                          :class="{'is-invalid': errors.has('Name')}"
                        >
                        <span class="text-danger" v-if="errors.has('Name')">請輸入訂購人姓名</span>
                      </div>
                      <div class="form-group col-md-6">
                        <label for="orderEmail">*信箱</label>
                        <input
                          type="email"
                          class="form-control"
                          :class="{'is-invalid': errors.has('email')}"
                          name="email"
                          id="orderEmail"
                          v-model="tempOrder.user.email"
                          placeholder="請輸入 Email"
                          v-validate="'required|email'"
                        >
                        <span
                          class="text-danger"
                          v-if="errors.has('email')"
                        >{{errors.first('email')}}</span>
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group col-md-6">
                        <label for="orderAddress">*住址</label>
                        <input
                          type="text"
                          class="form-control"
                          id="orderAddress"
                          name="address"
                          :class="{'is-invalid': errors.has('address')}"
                          v-model="tempOrder.user.address"
                          placeholder="請輸入住址"
                          v-validate="'required'"
                        >
                        <span class="text-danger" v-if="errors.has('address')">地址欄位不得留空</span>
                      </div>
                      <div class="form-group col-md-6">
                        <label for="orderTel">*電話</label>
                        <input
                          type="tel"
                          class="form-control"
                          id="orderTel"
                          name="regex"
                          v-model="tempOrder.user.tel"
                          v-validate="{ required: true, regex: /^([0-9]+)$/ }"
                          placeholder="請輸入電話"
                          :class="{'is-invalid': errors.has('regex')}"
                        >
                        <span class="text-danger" v-if="errors.has('regex')">僅接受純數字</span>
                      </div>
                    </div>
                    <div class="form-group">
                      <label for="textarea">備註</label>
                      <textarea
                        class="form-control"
                        id="textarea"
                        rows="3"
                        v-model="tempOrder.message"
                        placeholder="請輸入備註"
                      ></textarea>
                    </div>
                    <div class="form-group">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="is_paid"
                          v-model="tempOrder.is_paid"
                        >
                        <label class="form-check-label" for="is_paid">是否付款</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="tab-pane fade"
              id="nav-prodlist"
              role="tabpanel"
              aria-labelledby="nav-prodlist-tab"
            >
              <div class="container">
                <div class="row mt-3">
                  <div class="col-md-12">
                    <div
                      class="form-row"
                      v-for="(item,key, index) in tempOrder.products"
                      :key="item.id"
                    >
                      <div class="form-group col-md-9">
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <span
                              class="input-group-text bg-main text-white"
                              id="basic-addon1"
                            >產品項目 {{index +1}}</span>
                          </div>
                          <input
                            type="text"
                            class="form-control"
                            aria-label="prodName"
                            style="cursor:default;"
                            readonly
                            v-model="item.product.title"
                          >
                        </div>
                        <p v-if="item.coupon" class="text-danger font-weight-bold mb-0">
                          <span>*套用{{item.coupon.title}} 中 -</span>
                          <span>{{(item.product.price * item.coupon.percent) / 100 | currency}} 1/套</span>
                        </p>
                        <p v-else class="text-dontcare mb-0">
                          <span>未套用酷碰優惠 -</span>
                          <span>{{item.product.price | currency}} 1/{{item.product.unit}}</span>
                        </p>
                      </div>
                      <div class="form-group col-md-3">
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <span class="input-group-text bg-main text-white" id="basic-addon1">*數量</span>
                          </div>
                          <input
                            type="number"
                            class="form-control"
                            aria-label="num"
                            v-model="item.qty"
                            :name="`num${index}`"
                            v-validate="{ required: true, regex: /^([0-9]+)$/ }"
                            placeholder="請輸入數量"
                            :class="{'is-invalid': errors.has('num' + index)}"
                          >
                        </div>
                        <p class="mb-0 text-dontcare text-right">
                          <span
                            v-if="item.coupon"
                          >小計 {{((item.product.price * item.coupon.percent) / 100) * item.qty | currency}}</span>
                          <span v-else>小計 {{(item.product.price * item.qty) | currency}}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="updateOrder">確認</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 修改訂單 start-->
  </div>
</template>

<script>
import $ from "jquery";
import Pagination from "@/components/Pagination.vue";
export default {
  props: {
    option: {
      type: Object,
      default: function() {
        return {
          editFunction: true,
          gopayPath: "/admin/orderCheckout/"
        };
      }
    }
  },
  data() {
    return {
      orders: [],
      tempOrder: {
        user: {}
      },
      isLoading: false,
      status: {
        loading: false
      },
      pagination: {}
    };
  },
  components: {
    Pagination
  },
  methods: {
    getOrders(page = 1) {
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/orders?page=${page}`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        console.log(response);
        vm.isLoading = false;
        vm.orders = response.data.orders;
        vm.pagination = response.data.pagination;
        // console.log(vm.pagination);
      });
    },
    getPage(page = 1) {
      const vm = this;
      //點擊分頁跳回頁首
      $("html, body").scrollTop($("#position").offset().top);
      vm.pagination.current_page = page;
    },
    openModal(item) {
      const vm = this;
      vm.tempOrder = Object.assign({}, item);
      //   console.log(this.tempOrder);
      $("#productModal").modal("show");
    },
    updateOrder() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/order/${vm.tempOrder.id}`;
      this.$validator.validate().then(result => {
        if (result) {
          vm.status.loading = true;
          if (vm.tempOrder.is_paid) {
            const nowDate = new Date();
            vm.tempOrder.paid_date = Math.floor(nowDate / 1000);
          } else {
            vm.tempOrder.paid_date = "";
          }
          let objectLength = Object.keys(vm.tempOrder.products).length;
          for (let i = 0; i < objectLength; i++) {
            let prodID = Object.keys(vm.tempOrder.products)[i];
            let prodObj = vm.tempOrder.products;
            if (prodObj[prodID].coupon) {
              prodObj[prodID].final_total =
                (prodObj[prodID].qty *
                  prodObj[prodID].product.price *
                  prodObj[prodID].coupon.percent) /
                100;
              prodObj[prodID].total =
                prodObj[prodID].qty * prodObj[prodID].product.price;
            } else {
              prodObj[prodID].total =
                prodObj[prodID].qty * prodObj[prodID].product.price;
              prodObj[prodID].final_total = prodObj[prodID].total;
            }
          }
          this.$http.put(api, { data: vm.tempOrder }).then(response => {
            if (response.data.success) {
              $("#editOrderModal").modal("hide");
              vm.status.loading = false;
              vm.getOrders(vm.pagination.current_page);
              vm.$bus.$emit("message:push", response.data.message, "success");
            }
          });
        } else {
          vm.$bus.$emit("message:push", `噢！表單內有欄位空白唷`, "danger");
        }
      });
    }
  },
  created() {
    this.getOrders();
  }
};
</script>

<style scoped>
ul {
  list-style: none;
  padding-left: 0;
}
</style>
