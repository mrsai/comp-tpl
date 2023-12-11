import QuestionLine from "./marks-line.js";
import QuestionBoard from "./question-board.js";

/**
 * @class Question
 */
class Question {
  /**
   * Question 初始化的时候，必须保证视频播放器已经初始化完成，因为所有的元素要插入到视频播放器中
   * 并且能够获取到视频的duration，不过该duration可能在接口数据中存在
   * @param {*} player 视频播放器的实例
   * @param {*} questions  题目，目前是一个数组, 也可以是一个对象「对象的优点是可以在不同的节点插入同一个题目」
   * @param {*} options 配置项，目前看来只需要一个视频的时长
   * @param {*} options.duration 视频的时长
   * @returns
   */
  constructor(player, questions, options) {
    if (!player) {
      throw new Error("未找到关联的视频播放器，确认视频播放器已经初始化完成");
    }

    if (!options.duration) {
      throw new Error("未获取到视频的duration，无法进行初始化");
    }

    this.player = player;
    this.options = options;
    this.questions = questions || [];

    const markContainer = this.player.$controls.get(0);

    const maskContainer = this.player.$container
      .find(".xt_video_player_wrap")
      .get(0);

    this.board = new QuestionBoard(maskContainer, this.options);
    this.mark = new QuestionLine(markContainer, this.questions, this.options);

    this.mark.on("on-click", ({ questions }) => {
      this.board.open(questions);
    });
  }

  destroy() {
    this.board.destroy();
    this.mark.destroy();
    this.board = null;
    this.mark = null;
  }
}

export { Question };
