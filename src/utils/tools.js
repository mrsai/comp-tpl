/**
 * 事件处理的静态方法
 */
function TimeTools(){}

/**
 * 将视频时长转换为 {} 格式
 * @param {number} duration 视频时长，单位秒
 * @returns {object} { hours, minutes, seconds }  
 */
TimeTools.formatDuration = function(duration){
  if (typeof duration !== 'number' || duration <= 0) {
    throw new Error('时间长度必须是一个大于零的数字');
  }
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);
  return {
    hours,
    minutes,
    seconds
  }
}
/**
 * 将 00:00:00 格式的时间转换为视频时长
 * @param {*} timeString 
 * @returns duration 视频时长，单位秒
 */
TimeTools.parseDuration = function(timeString){
  const timeParts = timeString.split(':');
  if (timeParts.length !== 3) {
    throw new Error('格式化时间必须符合 "hh:mm:ss" 的格式');
  }
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);
  const seconds = parseInt(timeParts[2], 10);
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    throw new Error('格式化时间必须由数字组成');
  }
  const duration = hours * 3600 + minutes * 60 + seconds;
  return duration;
}
/**
 * 将duration时间转换为 00:00:00 格式
 * @param {*} duration 
 * @returns 00:00:00
 */
TimeTools.formatTimeToString = function(duration){
  const {
    hours,
    minutes,
    seconds
  } = TimeTools.formatDuration(duration);
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

/**
 * 比较两个时间的大小
 * @param {*} time1 
 * @param {*} time2 
 * @returns boolean true: time1 < time2
 */
TimeTools.compareTime = function(time1, time2){
  console.log(time1, time2)
  let duration1 = String(time1).indexOf(':') > -1 ? TimeTools.parseDuration(time1) : time1;
  let duration2 = String(time2).indexOf(':') > -1 ? TimeTools.parseDuration(time2) : time2;
  return duration1 < duration2;
}

/**
 * 生成时间选项的数组
 * @param {*} n 
 * @returns [0,....n]
 */
TimeTools.generateTimeOptions = function(n){
  return Array.from({ length: n+1 }, (_, index) => index);
}

export {
  TimeTools
} ;