const express = require("express")
const app = express()
const port = 3000
const request = require("request")
const cheerio = require("cheerio")
const axios = require("axios")
const sqlite3 = require('sqlite3').verbose()
const proxyhost = "gw.cloudbypass.com"
const proxyport = "1288"
const username = "67091105-dat"
const password = "mwmtakht"
const proxyurl = "https://example.com/"
let firstDialogId = 0

// 初始化数据库连接
const db = new sqlite3.Database('config.db', (err) => {
  if (err) {
    console.error('数据库连接失败:', err)
  } else {
    console.log('成功连接到数据库')
    // 创建配置表
    db.run(`CREATE TABLE IF NOT EXISTS configs (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`)
  }
})

// 读取配置函数
async function getConfig(key) {
  return new Promise((resolve, reject) => {
    db.get('SELECT value FROM configs WHERE key = ?', [key], (err, row) => {
      if (err) {
        reject(err)
      } else {
        resolve(row ? row.value : null)
      }
    })
  })
}

// 保存配置函数
async function saveConfig(key, value) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT OR REPLACE INTO configs (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
      [key, value],
      (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      }
    )
  })
}

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
app.get("/test", async (req, res) => {
  var proxyUrl =
    "http://" + username + ":" + password + "@" + proxyhost + ":" + proxyport

  var proxiedRequest = request.defaults({ proxy: proxyUrl })
  const headers = {
    "authority": "www.binance.com",
    "method": "GET",
    "path":
      "/cn/support/announcement/new-cryptocurrency-listing?c=48&navId=48",
    "scheme": "https",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    Connection: "keep-alive",
    "Cache-Control": "max-age=0",
    "Sec-Ch-Ua":
      '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": getUserAgent(),
    Cookie:
      'BNC-Location=BINANCE; BNC_FV_KEY=334105cad3feae728472e6ff4e54a85fdde50b58; changeBasisTimeZone=; OptanonAlertBoxClosed=2024-02-01T04:04:10.450Z; _ga_MEG0BSW76K=GS1.1.1706769733.1.0.1706769734.0.0.0; fiat-prefer-currency=CNY; campaign=transactional; source=lp; _ga_9XQG87E8PF=GS1.2.1712539869.6.0.1712539869.0.0.0; theme=dark; userPreferredCurrency=USD_USD; _ga_3WP50LGEEC=deleted; _gcl_au=1.1.1148571041.1728368532; futures-layout=pro; language=zh-CN; userId=; __BNC_USER_DEVICE_ID__={"bf70d191aef232406c0b3a77e70489cc":{"date":1731662095156,"value":""}}; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%2210268215%22%2C%22first_id%22%3A%2218bb2b7544ac97-0a4ecd38ad9dd08-16525634-1764000-18bb2b7544bf7e%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%2C%22%24latest_utm_source%22%3A%22lp%22%2C%22%24latest_utm_medium%22%3A%22email%22%2C%22%24latest_utm_campaign%22%3A%22transactional%22%2C%22%24latest_utm_content%22%3A%22pay_payment_successful_email%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMThiYjJiNzU0NGFjOTctMGE0ZWNkMzhhZDlkZDA4LTE2NTI1NjM0LTE3NjQwMDAtMThiYjJiNzU0NGJmN2UiLCIkaWRlbnRpdHlfbG9naW5faWQiOiIxMDI2ODIxNSJ9%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%2210268215%22%7D%2C%22%24device_id%22%3A%2218bb2b7544ac97-0a4ecd38ad9dd08-16525634-1764000-18bb2b7544bf7e%22%7D; bnc-uuid=187b5074-8b1f-43bd-97c4-ac25f6e3bc7b; _gid=GA1.2.2020617402.1734341286; language=en; aws-waf-token=d929e51d-788d-45e4-ad8a-bb8d76861309:AAoAihwOFe8YAAAA:58Erf2tgxMSkLqJVz50vGUVDtXRLdPMZYZwkyyExqMqb54YdSpiTjts/12RK30ED2Gcln9D5r/OmPW+G9zLNbETMvBc1fazVXZr5DazaLQ6Gvh8+FcRQAkyKE3jCWDjzntItyKeaPHMRfsr/CB5KTKqubzcjtruYqGCwWCJdLfpNqbBFW4QblQtVC8Wz5CPDUjU=; BNC_FV_KEY_T=101-pYNkS29oEESl2TRQlwjyYSxYHslNAFEDKQnHvYhGn6F%2BZeV8WqriBhdxhkGfnMb3n1O0ETVLhBX41SSI6kXyEg%3D%3D-7iS4o1qFeqzyA3KRK2uoow%3D%3D-d7; BNC_FV_KEY_EXPIRE=1734449664376; lang=zh-CN; se_sd=AJVVlWg8aQFDQ9R4aGwwgZZBhUloXEXUlMX9bV0BVVQUQFlNWUAQ1; se_gd=RZVGlXBEVRJCFIKUJVVEgZZUhBxUSBXUlIO9bV0BVVQUQGlNWUMK1; se_gsd=Zyg1Kzt8NigiIyc1JQg7MDkzUhMYBAcBVFpKUVxRUFVWM1NT1; _uetsid=5cea31f0bb9011efa10c7d63af1f39e3; _uetvid=5f3a8050b96211ed8d4ca1b015c0c4cf; OptanonConsent=isGpcEnabled=0&datestamp=Tue+Dec+17+2024+18%3A16%3A40+GMT%2B0800+(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)&version=202411.2.0&browserGpcFlag=0&geolocation=HK%3B&isIABGlobal=false&hosts=&consentId=68c3254a-4a29-4c6c-8c17-b08c1f5bb03d&interactionCount=2&landingPath=NotLandingPage&groups=C0001%3A1%2CC0003%3A1%2CC0004%3A1%2CC0002%3A1&AwaitingReconsent=false&isAnonUser=1; _gat_UA-162512367-1=1; _ga_3WP50LGEEC=GS1.1.1734430598.358.1.1734430601.57.0.0; _ga=GA1.1.1355352560.1672711636',
  }
  console.log("start resueqs ...")
  let options = {
    url: "https://www.binance.com/cn/support/announcement/new-cryptocurrency-listing?c=48&navId=48",
    method: "get",
    gzip: true,
    headers: {
      ...headers,
      referer:
        "https://www.binance.com/cn/support/announcement/new-cryptocurrency-listing?c=48&navId=48",
    },
  }
  // console.log("options...",options);
  proxiedRequest(options, async (err, response, body) => {
    console.log("response finnesd ...", err)
    CoinDetailDealing = false
    const $ = cheerio.load(body)
    const dataJsonStr = `${$("#__APP_DATA").text()}`
    if (!dataJsonStr) {
      res.end("{code:500,msg:'error'}")
      return
    }
    const resultJson = JSON.parse(dataJsonStr)
    const firstDialogId = await getConfig("firstDialogId")
    console.log("firstDialogId...", firstDialogId)
    // console.log(resultJson.appState.loader.dataByRouteId.d34e.catalogDetail.articles)
    const firstDialog =
      resultJson.appState.loader.dataByRouteId.d34e?.catalogDetail?.articles[0]
    console.log("request time ..", new Date())
    console.log("find result...", firstDialog)
    if (Number(firstDialogId) !== firstDialog.id)
    {
     await saveConfig("firstDialogId", firstDialog.id)
    }else{
      res.end(JSON.stringify({ ...firstDialog }, 2))
      return
    }
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
      headers: { ...headers, referer: url },
    }
    console.log("request detail...")
    proxiedRequest(options2, function (err, response, detailbody) {
      const $2 = cheerio.load(detailbody)
      const dataJsonStr = `${$2("#__APP_DATA").text()}`
      const resultJson = JSON.parse(dataJsonStr)
      // console.log(resultJson.appState.loader.dataByRouteId.d34e.catalogDetail.articles)
      const detail =
        resultJson.appState.loader.dataByRouteId?.d34e?.articleDetail?.body
      if(!detail){
        res.end(JSON.stringify({ ...firstDialog }, 2))
        return
      }
      const addresse = extractAddresses(detail)
      console.log("addresses ...", addresse)
      res.end(JSON.stringify({ ...firstDialog, contractAddress: addresse }, 2))
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// 确保程序退出时关闭数据库连接
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('关闭数据库时出错:', err)
    } else {
      console.log('数据库连接已关闭')
    }
    process.exit(0)
  })
})
