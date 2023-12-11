<template>
  <div>
    <div
      class="xt-player-outter"
      ref="xtPlayerOutter"
      id="xt-player"
      style="width: 800px; height: 450px"
    ></div>

    <el-button type="primary" @click="onTap">ADD</el-button>
    <el-button type="primary" @click="onTapR">TEST EVENT</el-button>
    <el-button type="primary" @click="onTapG">TEST EVENT</el-button>
  </div>
</template>

<script setup name="CXTPlayer">
import { onMounted, onUnmounted, ref } from "vue";
import { Question } from "./question/question.js";
import Xtplayer from "../utils/Xtplayer.min.js";
const xtPlayerOutter = ref(null);
let player;
let que = null;

const intiPalyer = () => {
  player = new Xtplayer(window.$("#xt-player"), {
    id: "xxx", //旧主站、新学堂云2.0、3.0、军职青海网络干部学院web端及浙江网络干部学院web端视频id【可选】
    sku_id: "xxx", //sku是班级+服务等级 【可选】
    classroom_id: "xxxx", //班级id  【可选】
    cid: "xxx", //课程id 【可选】
    cc: "yyyy", //金山上传id,ccid 【可选】
    userId: "3445", //心跳打点用user_id 【可选】，如果开始心跳打点，建议传userid，方便统计
    isDrag: true, //是否可以拖拽进度条 【必须： true,false】
    isAbleOcclusion: true, //是否可以遮挡，默认true可以遮挡 【必须： true,false】
    lob: "plat2", //plat/主站、cloud2/学堂云2.0、cloud3/学堂云3.0、cloud4/学堂云4.0、plat2/新主站、zyk_web/资源库端、ytk_web/雨课堂web、junzhi/军职web、mtc/(定制化-医学教指委) 【必须】
    autoplay: true, //【必须： true,false】
    poster: "", //"https://static-cdn.xuetangx.com/xtassets/frontedn-developer-img.jpg", //【可选】
    server: "vod", //【必须】live-直播、vlive-伪直播、vod-点播、playback-直播回放
    serverType: "video", //【必须】音视频类型：video-视频，audio-音频
    language: "zh", //语言：zh、en、es、fr、ja
    hiddenQuestion: true, //【固定值：true or false】是否隐藏小木提问
    hiddenKnowledgePoint: true, //【固定值：true or false】是否隐藏小木知识点导航
    isShowPicInPic: true, //是否开启画中画
    isShowCSSFullScreen: true, //是否开启样式全屏
    duration: 30000, //【可选】接口提供-视频播放时长
    volume: {
      //【必须】默认初始化音量，范围：0～1
      value: 0.8,
    },
    speed: {
      //【必须】初始化播放器速率
      show: true, //如果不显示播放速率选项，就设置为false
      value: 1.0, //默认值
      speedValue: [2.0, 1.5, 1.25, 1.0, 0.5], //可选范围，最大2.0
    },
    isShowControls: true, //【必须】是否显示控制栏
    isShowProgress: true, //【必须】是否显示进度条
    urls: {
      liveUrls: {
        url_default: "url_270P",
        url_270P: "https://vjs.zencdn.net/v/oceans.mp4",
        url_480P: "https://vjs.zencdn.net/v/oceans.mp4",
        url_720P: "",
      },
      vodUrls: {
        url_default: "url_270P",
        url_270P: "https://vjs.zencdn.net/v/oceans.mp4",
        url_480P: "https://vjs.zencdn.net/v/oceans.mp4",
        url_720P: "",
      },
      CDNUrls: [],
    },
    setting: {
      // 设置
      isTurns: true, // 自动连播
    },
    zh: ["中文", "Chinese"],
    caption: {
      //字幕配置: zh、en、ru、fr、es、ja、ar
      show: false, //是否显示字幕：字幕switch按钮状态
      src: [
        {
          lang: "en",
          name: "English",
          src: "https://vjs.zencdn.net/v/oceans.mp4", //获取字幕的接口
          availableSrc:
            "./src/doc/videoPlayer/XtPlayer-V2.0.0/en-caption00.json", //可选字幕，一般情况下不用考虑
        },
        {
          lang: "zh",
          name: "简体中文",
          src: "./src/doc/videoPlayer/XtPlayer-V2.0.0/zh-caption.json", //获取字幕的接口
          availableSrc: "", //可选字幕，一般情况下不用考虑
          default: true, //默认字幕
        },
      ],
    },
    //  isHeart: true, //【必须： true,false】
    //  heartSrc: '/heartbeat', //【可选】如果 isHeart=true,那么此项为必填
    heartBeat: {
      //规整：心跳打点配置
      isHeart: false, //【必须： true,false】
      url: "/heartbeat", //【可选】如果 isHeart=true,那么此项为必填
      headers: {
        "classroom-id": 689,
        "uv-id": 5467890,
      },
    },
    iskipOpen: true, //是否跳转片头
    openTime: 1, //片头时间，(秒)
    endTime: 46, //片尾时间， (秒)
    startTime: 12, //点播：设置开始播放时间， 直播：设置直播已经播放时间(秒)，此值会根据播放进度而变化，其中直播为了统计打点
    debug: true, //开发调试
  });
  initQue();
  player.$video.on("seeked.event", function () {
    player.$video.trigger("pause");
    return false;
  });
  player.$video.on("timeupdate", function () {
    const time = parseInt(this.currentTime);
    // paipingyixia, question 得到的是一个数组，因为可能有多个试题
    // 因此，在 insert 的时候，需要判断是否已经存在，如果存在，就不再插入
    const question = que.mark.get(time);
    const skim = que.mark.getSkim(time);

    if (!skim && question) {
      que.mark.setSkim(time, question);
      que.board.open(question);
      player.$video.trigger("pause");
    }
  });
};

const initQue = () => {
  que = new Question(
    player,
    [
      {
        id: 1,
        label: "1",
        duration: 10,
      },
      {
        id: 2,
        label: 2,
        duration: 20,
      },
    ],
    {
      duration: 46,
    }
  );

  que.mark.on("on-click", (data) => {
    console.log("on-click", data, 1);
  });

  que.board.on("on-tap-confirm", (data) => {
    console.log("ontap", data);
  });

  que.board.on("on-tap-skip", (data) => {
    console.log("ontap-skip", data);
  });
};

// import Xtplayer from "../utils/Xtplayer.min.js";

// let player;
// const intiPalyer = () => {
//   player = new Xtplayer(window.$("#xt-player"), {
//     id: "xxx", //旧主站、新学堂云2.0、3.0、军职青海网络干部学院web端及浙江网络干部学院web端视频id【可选】
//     sku_id: "xxx", //sku是班级+服务等级 【可选】
//     classroom_id: "xxxx", //班级id  【可选】
//     cid: "xxx", //课程id 【可选】
//     cc: "yyyy", //金山上传id,ccid 【可选】
//     userId: "3445", //心跳打点用user_id 【可选】，如果开始心跳打点，建议传userid，方便统计
//     isDrag: true, //是否可以拖拽进度条 【必须： true,false】
//     isAbleOcclusion: true, //是否可以遮挡，默认true可以遮挡 【必须： true,false】
//     lob: "plat2", //plat/主站、cloud2/学堂云2.0、cloud3/学堂云3.0、cloud4/学堂云4.0、plat2/新主站、zyk_web/资源库端、ytk_web/雨课堂web、junzhi/军职web、mtc/(定制化-医学教指委) 【必须】
//     autoplay: true, //【必须： true,false】
//     poster: "", //"https://static-cdn.xuetangx.com/xtassets/frontedn-developer-img.jpg", //【可选】
//     server: "vod", //【必须】live-直播、vlive-伪直播、vod-点播、playback-直播回放
//     serverType: "video", //【必须】音视频类型：video-视频，audio-音频
//     language: "zh", //语言：zh、en、es、fr、ja
//     hiddenQuestion: true, //【固定值：true or false】是否隐藏小木提问
//     hiddenKnowledgePoint: true, //【固定值：true or false】是否隐藏小木知识点导航
//     isShowPicInPic: true, //是否开启画中画
//     isShowCSSFullScreen: true, //是否开启样式全屏
//     duration: 30000, //【可选】接口提供-视频播放时长
//     volume: {
//       //【必须】默认初始化音量，范围：0～1
//       value: 0.8,
//     },
//     speed: {
//       //【必须】初始化播放器速率
//       show: true, //如果不显示播放速率选项，就设置为false
//       value: 1.0, //默认值
//       speedValue: [2.0, 1.5, 1.25, 1.0, 0.5], //可选范围，最大2.0
//     },
//     isShowControls: true, //【必须】是否显示控制栏
//     isShowProgress: true, //【必须】是否显示进度条
//     urls: {
//       liveUrls: {
//         url_default: "url_270P",
//         url_270P: "https://vjs.zencdn.net/v/oceans.mp4",
//         url_480P: "https://vjs.zencdn.net/v/oceans.mp4",
//         url_720P: "",
//       },
//       vodUrls: {
//         url_default: "url_270P",
//         url_270P: "https://vjs.zencdn.net/v/oceans.mp4",
//         url_480P: "https://vjs.zencdn.net/v/oceans.mp4",
//         url_720P: "",
//       },
//       CDNUrls: [],
//     },
//     setting: {
//       // 设置
//       isTurns: true, // 自动连播
//     },
//     zh: ["中文", "Chinese"],
//     caption: {
//       //字幕配置: zh、en、ru、fr、es、ja、ar
//       show: false, //是否显示字幕：字幕switch按钮状态
//       src: [
//         {
//           lang: "en",
//           name: "English",
//           src: "https://vjs.zencdn.net/v/oceans.mp4", //获取字幕的接口
//           availableSrc:
//             "./src/doc/videoPlayer/XtPlayer-V2.0.0/en-caption00.json", //可选字幕，一般情况下不用考虑
//         },
//         {
//           lang: "zh",
//           name: "简体中文",
//           src: "./src/doc/videoPlayer/XtPlayer-V2.0.0/zh-caption.json", //获取字幕的接口
//           availableSrc: "", //可选字幕，一般情况下不用考虑
//           default: true, //默认字幕
//         },
//       ],
//     },
//     //  isHeart: true, //【必须： true,false】
//     //  heartSrc: '/heartbeat', //【可选】如果 isHeart=true,那么此项为必填
//     heartBeat: {
//       //规整：心跳打点配置
//       isHeart: false, //【必须： true,false】
//       url: "/heartbeat", //【可选】如果 isHeart=true,那么此项为必填
//       headers: {
//         "classroom-id": 689,
//         "uv-id": 5467890,
//       },
//     },
//     iskipOpen: true, //是否跳转片头
//     openTime: 1, //片头时间，(秒)
//     endTime: 46, //片尾时间， (秒)
//     startTime: 12, //点播：设置开始播放时间， 直播：设置直播已经播放时间(秒)，此值会根据播放进度而变化，其中直播为了统计打点
//     debug: true, //开发调试
//   });
//   player.$video.on("seeked.event", function () {
//     player.$video.trigger("pause");
//     return false;
//   });
// };
// let questionLine;
// let questionBoard;

// const initQuestionBoard = () => {
//   questionBoard = new QuestionBoard(document.getElementById("ql"));
//   questionBoard.on("on-tap-answer", (data) => {
//     console.log(data);
//     // questionBoard.close();
//   });
//   questionBoard.on("on-tap-answer", (data) => {
//     console.log("ontap", data);
//   });
// };
// const initQuestionLine = () => {
//   questionLine = new QuestionLine(
//     document.getElementById("ql"),
//     [
//       {
//         id: 1,
//         label: "1",
//         duration: 200,
//       },
//       {
//         id: 2,
//         label: 2,
//         duration: 500,
//       },
//     ],
//     {
//       duration: 1000,
//       onClick: (e, data) => {
//         console.log("on-mark-click", e, data);
//         questionBoard.open(data);
//       },
//     }
//   );

//   questionLine.on("on-click", (data) => {
//     console.log("on-click", data, 1);
//   });
//   questionLine.on("on-click", (data) => {
//     console.log("111111");
//   });
// };

// https://www.w3school.com.cn/example/html5/mov_bbb.mp4
onMounted(() => {
  intiPalyer();
  // initQuestionBoard();
  // initQuestionLine();
  // const child = Vue.extend(cQuestion);
  // const childComponent = new child({
  //   propsData: {
  //     question: {},
  //     onAnswer: (data) => {
  //       this.emit("on-tap-confirm", data);
  //     },
  //     onSkip: (data) => {
  //       this.emit("on-tap-skip", data);
  //     },
  //     loading: false,
  //   },
  // });

  // childComponent.$mount();
  // console.log(xtPlayerOutter.value, childComponent.$el);
  // xtPlayerOutter.value.appendChild(childComponent.$el);
});

const onTap = () => {
  console.log(que.mark.has(40));
  que.mark.insert({
    id: 3,
    label: 3,
    duration: 40,
  });
  que.mark.insert({
    id: 4,
    label: 4,
    duration: 40,
  });
  que.mark.insert({
    id: 5,
    label: 5,
    duration: 40,
  });
  // console.log(Que.mark.has(40));
  // console.log("onTap", player);
  // player.$video.trigger("play");
};
const onTapR = () => {
  // Que.mark.moveTo(40, 30);
  que.mark.clean();
  // Que.mark.remove({
  //   id: 4,
  //   label: 4,
  //   duration: 40,
  // });
  // Que.mark.remove({
  //   id: 5,
  //   label: 5,
  //   duration: 40,
  // });
  // Que.mark.move(40, 30);
  // Que.mark.set({
  //   id: 1,
  //   label: "喝的",
  //   duration: 800,
  // });
  // questionLine.set({
  //   id: 1,
  //   label: "喝的",
  //   duration: 800,
  // });
  // console.log("onTap", player);
  // player.$video.trigger("play");
};

const onTapG = () => {
  console.log(que.mark.get());
  console.log(que.mark.get(40));
  // console.log("onTap", player);
  // player.$video.trigger("play");
};

onUnmounted(() => {
  // player.value && player.value.destroy();
});
</script>
<style scoped>
#ql {
  width: 200px;
  height: 200px;
  background-color: gray;
  position: relative;
}
</style>
