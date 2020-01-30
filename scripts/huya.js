const axios = require('axios')
const fs = require('fs');

baseUrl = 'http://www.huya.com/cache.php?m=LiveList&do=getLiveListByPage&gameId=2135&tagAll=0&page=';
const tagList = [
  'http://www.huya.com/cache.php?m=LiveList&do=getTmpLiveByPage&gameId=2135&tmpId=2067&page=',//movies
  'http://www.huya.com/cache.php?m=LiveList&do=getTmpLiveByPage&gameId=2135&tmpId=2079&page=',//tvshows
  'http://www.huya.com/cache.php?m=LiveList&do=getTmpLiveByPage&gameId=2135&tmpId=1161&page=',//new year
  'http://www.huya.com/cache.php?m=LiveList&do=getTmpLiveByPage&gameId=2135&tmpId=1011&page=',//entertainment
  'http://www.huya.com/cache.php?m=LiveList&do=getTmpLiveByPage&gameId=2135&tmpId=987&page=',//up
  'http://www.huya.com/cache.php?m=LiveList&do=getTmpLiveByPage&gameId=2135&tmpId=1223&page='//positive energy
]
const tagNameList = [
  '电影',
  '电视剧',
  '贺岁',
  '综艺',
  '原创',
  '正能量',
]

tplString = `
#EXTINF:-1 tvg-id="" tvg-name="" tvg-language="Chinese" tvg-logo="channel_avatar" group-title="BGV",> channel_title
channel_url
`
huyaPlayListPath = './channels/huya.m3u';

fs.writeFileSync(huyaPlayListPath, `#EXTM3U x-tvg-url="http://epg.51zmt.top:8000/e.xml.gz"
`);
for (let indexOfTag = 0; indexOfTag < tagList.length; indexOfTag++) {
  for (let index = 1; index < 3; index++) {
    axios({
      method: 'get',
      url: tagList[indexOfTag] + index,
      timeout: 60000
    }).then(res => {
      var m3u8String = processList(res.data.data.datas, tagNameList[indexOfTag]);
      fs.appendFileSync(huyaPlayListPath, m3u8String);
    })
  }
}

var processList = (list, tagPrefix) => {
  var allM3U8 = "";
  list && list.forEach((item, index) => {
    var channel = {};
    if (item.introduction && item.introduction !== 'null') {
      channel.title = item.introduction;
    } else if (item.roomName && item.roomName !== 'null') {
      channel.title = item.roomName;
    } else {
      channel.title = item.nick;
    }
    channel.title = tagPrefix + ' |' + index + '| ' + channel.title
    var urlCom = item.screenshot.replace("live-cover.msstatic.com", "aldirect.hls.huya.com");
    urlCom = urlCom.replace(/\/[0-9]*.jpg$/gm, ".m3u8");
    channel.url = urlCom;
    channel.avatar = item.avatar180;
    var m3u8 = composeChannel(channel);
    allM3U8 = allM3U8 + m3u8;
  });
  return allM3U8;
}

var composeChannel = (channel) => {
  var m3u8 = tplString.replace("channel_avatar", channel.avatar);
  m3u8 = m3u8.replace("channel_title", channel.title);
  m3u8 = m3u8.replace("channel_url", channel.url);
  return m3u8;
}

