<template>
  <div id="app">
    <div class="ruler">
      <div class="scal-line">
        <div class="exactly-ten"></div>
        <div class="scal-txt" id="txt"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, reactive } from "vue";

onMounted(() => {
  let str = "";
  for (let i = 1; i < 10; i++) {
    str += `<span class="num">${i}</span>`;
  }
  let allTxt =
    '<span class="zero-num">0</span>' +
    str +
    '<span class="full-num">10</span>';
  document.getElementById("txt").innerHTML = allTxt;
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
.ruler {
  width: 500px;
  height: 140px;
  background-color: #f1f1f1;
  margin: 100px auto;
  border-radius: 5px;
}
.ruler .scal-line {
  position: relative;
  width: 500px;
  height: 140px;
  margin: 0 auto;
  background: linear-gradient(
    90deg,
    transparent 37%,
    #bbb 63%,
    transparent 63%
  );
  background-repeat: repeat-x;
  background-size: 10px 10px;
  background-position: -5px 0;
}
.ruler .scal-line .exactly-ten {
  position: absolute;
  left: 0;
  top: 0;
  width: 500px;
  height: 16px;
  background: linear-gradient(
    90deg,
    transparent 47%,
    #aaa 53%,
    transparent 53%
  );
  background-repeat: repeat-x;
  background-size: 50px 40px;
  background-position: -25px 0;
}
.ruler .scal-line .scal-txt .num {
  display: inline-block;
  width: 10px;
  height: 1px;
  padding-top: 10px;
  text-align: center;
}

.ruler .scal-line .scal-txt .zero-num {
  display: inline-block;
  width: 5px;
  height: 10px;
  padding-top: 10px;
}
.ruler .scal-line .scal-txt .full-num {
  display: inline-block;
  width: 5px;
  height: 10px;
  padding-top: 10px;
  text-align: right;
}
</style>
