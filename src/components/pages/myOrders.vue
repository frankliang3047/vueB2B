<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="container py-3" id="position">
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
              <th width="80"></th>
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
                  @click="gopay(option.gopayPath,item.id)"
                  v-if="!item.is_paid&&!option.editFunction"
                >結帳</button>
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
    </div>
  </div>
</template>


<script>
import $ from "jquery";
import Pagination from "@/components/Pagination.vue";
export default {
  components: {
    Pagination
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
      pagination: {},
      option: {
        editFunction: false,
        gopayPath: "/checkoutPay/"
      }
    };
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
    gopay(path, orderID) {
      const vm = this;
      this.$router.push(`${path}${orderID}`);
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
