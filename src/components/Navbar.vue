
<template>
  <div>
    <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">後台管理區</a>

      <ul class="navbar-nav px-3">
        <li class="nav-item text-nowrap">
          <a class="nav-link" href="#" @click.prevent="signout">登 出</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: "Narbar",
  methods: {
    signout() {
      const url = `${process.env.APIPATH}/logout`;
      const vm = this;
      this.$http.post(url).then(response => {
        console.log(response.data);
        if (response.data.success) {
          vm.$router.push("/signin");
        }
      });
    }
  }
};
</script>
