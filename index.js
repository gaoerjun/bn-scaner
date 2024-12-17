const express = require("express")
const app = express()
const port = 3000
const request = require("request")
const cheerio = require("cheerio")
const axios = require("axios")
const proxyhost = "gw.cloudbypass.com"
const proxyport = "1288"
const username = "67091105-dat"
const password = "mwmtakht"
const proxyurl = "https://example.com/"

app.get("/", (req, res) => {
  res.send("Hello World!")
})
function extractAddresses(inputString) {
  // 正则表达式：匹配以太坊合约地址（0x开头，40个十六进制字符）
  const ethRegex = /\b0x[a-fA-F0-9]{40}\b/g

  // 正则表达式：匹配Solana合约地址（Base58编码，44个字符）
  const solRegex = /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/g

  const ethMatches = inputString.match(ethRegex)
  const solMatches = inputString.match(solRegex)

  return {
    ethAddresses: ethMatches ? ethMatches : [],
    solAddresses: solMatches ? solMatches : [],
  }
}
let userAgentList = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:59.0) Gecko/20100101 Firefox/59.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36",
  "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.163 Safari/535.1",
  "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:6.0) Gecko/20100101 Firefox/6.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/602.2.14 (KHTML, like Gecko) Version/10.0.1 Safari/602.2.14",
  "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50",
  "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv,2.0.1) Gecko/20100101 Firefox/4.0.1",
]
function getUserAgent() {
  let len = userAgentList.length
  let index = parseInt(Math.random() * len)
  return userAgentList[index]
}
app.get("/test", (req, res) =>
{
  var proxyUrl = "http://" + username + ":" + password + "@" + proxyhost + ":" + proxyport;

  var proxiedRequest = request.defaults({'proxy': proxyUrl});

  console.log("start resueqs ...")
  let options = {
    url: "https://www.binance.com/cn/support/announcement/new-cryptocurrency-listing?c=48&navId=48",
    method: "get",
    gzip: true,
    // proxy: [
    //   {
    //     protocal:'http',
    //     host: proxyhost,
    //     port: proxyport,
    //     auth: {
    //       username: username,
    //       password: password,
    //     },
    //   },
    // ],
    headers: {
        Accept:
          "text/html,application/xhtml+xml,application/json,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Cache-Control": "max-age=0",
        Connection: "keep-alive",
        Host: "www.binance.com",
        Referer:
          "https://www.binance.com/cn/support/announcement/new-cryptocurrency-listing?c=48&navId=48",
        "User-Agent": getUserAgent(),
    },
  }
  // console.log("options...",options);
  proxiedRequest(options, async (err, response, body) => {
    console.log("response finnesd ...", err, body)
    CoinDetailDealing = false
    const $ = cheerio.load(body)
    const dataJsonStr = `${$("#__APP_DATA").text()}`
    console.log("dataJsonStr...", dataJsonStr)
    if (!dataJsonStr) {
      res.end("{code:500,msg:'error'}")
      return
    }
    const resultJson = JSON.parse(dataJsonStr)
    // console.log(resultJson.appState.loader.dataByRouteId.d34e.catalogDetail.articles)
    const firstDialog =
      resultJson.appState.loader.dataByRouteId.d34e.catalogDetail.articles[0]
    console.log("request time ..", new Date())
    console.log("find result...", firstDialog)
    const url =
      "https://www.binance.com/cn/support/announcement/" +
      encodeURIComponent(
        firstDialog.title.toLowerCase().replace(/\s+/g, "-") +
          "-" +
          firstDialog.code
      )
    let options2 = {
      url: url,
      method: "get",
      gzip: true,
      // proxy: [
      //   {
      //     protocal:'http',
      //     host: proxyhost,
      //     port: proxyport,
      //     auth: {
      //       username: username,
      //       password: password,
      //     },
      //   },
      // ],
      headers: {
          Accept:
            "text/html,application/xhtml+xml,application/json,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
          "Cache-Control": "max-age=0",
          Connection: "keep-alive",
          Host: "www.binance.com",
          "Upgrade-Insecure-Requests": 1,
          "User-Agent": getUserAgent(),
      },
    }
    proxiedRequest(options2, function (err, response, detailbody) {
      console.log("err....",err,detailbody)
      const $2 = cheerio.load(detailbody)
      const dataJsonStr = `${$2("#__APP_DATA").text()}`
      const resultJson = JSON.parse(dataJsonStr)
      // console.log(resultJson.appState.loader.dataByRouteId.d34e.catalogDetail.articles)
      const detail =
        resultJson.appState.loader.dataByRouteId.d34e.articleDetail.body
      const addresse = extractAddresses(detail)
      console.log("addresses ...", addresse)
      res.end(JSON.stringify({ ...firstDialog, contractAddress: addresse }, 2))
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
