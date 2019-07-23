<template>
  <div class="container swiper-container mb-3 d-none d-md-block">
    <swiper :options="swiperOption" class="topSwiper">
      <swiper-slide>
        <div class="slide slide1"></div>
      </swiper-slide>
      <swiper-slide>
        <div class="slide slide2"></div>
      </swiper-slide>
      <swiper-slide>
        <div class="slide slide3"></div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>


<script>
import $ from "jquery";
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  name: "topSilder",
  data() {
    return {
      swiperOption: {
        loop: true,
        spaceBetween: 30,

        autoplay: {
          delay: 10000,
          disableOnInteraction: false
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        }
      }
    };
  },
  components: {
    swiper,
    swiperSlide
  },
  mounted() {
    $(".topSwiper").on("mouseenter", function() {
      this.swiper.autoplay.stop();
    });
    $(".topSwiper").on("mouseleave", function() {
      this.swiper.autoplay.start();
    });
  }
};
</script>

<style lang="scss" scoped>
.swiper-container {
  height: 300px;
}
.slide {
  height: 100%;
  background-position: center center;
  background-size: cover;
}
.slide1 {
  background-image: url("../assets/image/clark-street-mercantile-33919-unsplash-ex.jpg");
}
.slide2 {
  background-image: url("../assets/image/clark-street-mercantile-33931-unsplash-ex.jpg");
}
.slide3 {
  background-image: url("../assets/image/david-lezcano-225889-unsplash-ex.jpg");
}
</style>
