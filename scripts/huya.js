const axios = require('axios')
const fs = require('fs');

baseUrl = 'http://www.huya.com/cache.php?m=LiveList&do=getLiveListByPage&gameId=2135&tagAll=0&page=';

tplString = `
#EXTINF:-1 tvg-id="" tvg-name="" tvg-language="Chinese" tvg-logo="channel_avatar" group-title="BGV",HY-> channel_title
channel_url
`

for (let index = 1; index < 5; index++) {
  axios({
    method: 'get',
    url: baseUrl + index,
    timeout: 60000
  }).then(res => {
    var m3u8String = processList(res.data.data.datas);
    fs.appendFileSync('./channels/cn.m3u', m3u8String);
  })
}

var processList = (list) => {
  var allM3U8 = "";
  list.forEach(item => {
    var channel = {};
    channel.title = item.roomName;
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

