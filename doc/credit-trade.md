## QUERY
### marketCreditTradeList
#### query
```
query($req: GetMarketCreditTradeListInput) {
  marketCreditTradeList(req: $req) {
    date
    financing {
      buy
      sell
      cashRepayment
      yesterdayBalance
      todayBalance
    }
	selling {
      buy
      sell
      cashRepayment
      yesterdayBalance
      todayBalance
    }
	finacingCash {
      buy
      sell
      cashRepayment
      yesterdayBalance
      todayBalance
    }
  }
}
```
#### variable
```
{
  "req": {
    "dayCount": 2
  }
}
```
#### response
```
{
  "data": {
    "marketCreditTradeList": [
      {
        "date": "20190430",
        "financing": {
          "buy": "150204",
          "sell": "133315",
          "cashRepayment": "6095",
          "yesterdayBalance": "7447627",
          "todayBalance": "7458421"
        },
        "selling": {
          "buy": "30393",
          "sell": "38005",
          "cashRepayment": "548",
          "yesterdayBalance": "697763",
          "todayBalance": "704827"
        },
        "finacingCash": {
          "buy": "3703467",
          "sell": "3329610",
          "cashRepayment": "117785",
          "yesterdayBalance": "131013854",
          "todayBalance": "131269926"
        }
      },
      {
        "date": "20190429",
        "financing": {
          "buy": "195346",
          "sell": "264156",
          "cashRepayment": "4741",
          "yesterdayBalance": "7521181",
          "todayBalance": "7447630"
        },
        "selling": {
          "buy": "47452",
          "sell": "44758",
          "cashRepayment": "536",
          "yesterdayBalance": "700993",
          "todayBalance": "697763"
        },
        "finacingCash": {
          "buy": "4691570",
          "sell": "5906041",
          "cashRepayment": "88293",
          "yesterdayBalance": "132316614",
          "todayBalance": "131013850"
        }
      }
    ]
  }
}
```

## stockCreditTradeList
### query
```
query($req: GetStockCreditTradeListInput) {
  stockCreditTradeList(req: $req) {
    date
    list {
      code
      name
      financingBuy
      financingSell
      financingCashRepayment
      financingYesterdayBalance
      financingTodayBalance
      financingLimit
      sellingBuy
      sellingSell
      sellingCashRepayment
      sellingYesterdayBalance
      sellingTodayBalance
      sellingLimit
      payment
      remark
    }
  }
}
```
### variable
```
{
  "req": {
    "code": "1101"
  }
}
```
### response
```
{
  "data": {
    "stockCreditTradeList": [
      {
        "date": "20190430",
        "list": [
          {
            "code": "1101",
            "name": "台泥",
            "financingBuy": "195",
            "financingSell": "355",
            "financingCashRepayment": "0",
            "financingYesterdayBalance": "12289",
            "financingTodayBalance": "12129",
            "financingLimit": "1277014",
            "sellingBuy": "22",
            "sellingSell": "5",
            "sellingCashRepayment": "0",
            "sellingYesterdayBalance": "240",
            "sellingTodayBalance": "223",
            "sellingLimit": "1277014",
            "payment": "0",
            "remark": ""
          }
        ]
      },
      {
        "date": "20190429",
        "list": [
          {
            "code": "1101",
            "name": "台泥",
            "financingBuy": "539",
            "financingSell": "296",
            "financingCashRepayment": "0",
            "financingYesterdayBalance": "12046",
            "financingTodayBalance": "12289",
            "financingLimit": "1277014",
            "sellingBuy": "18",
            "sellingSell": "14",
            "sellingCashRepayment": "0",
            "sellingYesterdayBalance": "244",
            "sellingTodayBalance": "240",
            "sellingLimit": "1277014",
            "payment": "0",
            "remark": ""
          }
        ]
      },
      {
        "date": "20190426",
        "list": [
          {
            "code": "1101",
            "name": "台泥",
            "financingBuy": "155",
            "financingSell": "376",
            "financingCashRepayment": "27",
            "financingYesterdayBalance": "12294",
            "financingTodayBalance": "12046",
            "financingLimit": "1277014",
            "sellingBuy": "18",
            "sellingSell": "6",
            "sellingCashRepayment": "0",
            "sellingYesterdayBalance": "256",
            "sellingTodayBalance": "244",
            "sellingLimit": "1277014",
            "payment": "0",
            "remark": ""
          }
        ]
      },
      {
        "date": "20190425",
        "list": [
          {
            "code": "1101",
            "name": "台泥",
            "financingBuy": "243",
            "financingSell": "553",
            "financingCashRepayment": "0",
            "financingYesterdayBalance": "12604",
            "financingTodayBalance": "12294",
            "financingLimit": "1277014",
            "sellingBuy": "9",
            "sellingSell": "17",
            "sellingCashRepayment": "0",
            "sellingYesterdayBalance": "248",
            "sellingTodayBalance": "256",
            "sellingLimit": "1277014",
            "payment": "0",
            "remark": ""
          }
        ]
      },
      {
        "date": "20190424",
        "list": [
          {
            "code": "1101",
            "name": "台泥",
            "financingBuy": "202",
            "financingSell": "115",
            "financingCashRepayment": "2",
            "financingYesterdayBalance": "12519",
            "financingTodayBalance": "12604",
            "financingLimit": "1277014",
            "sellingBuy": "10",
            "sellingSell": "7",
            "sellingCashRepayment": "0",
            "sellingYesterdayBalance": "251",
            "sellingTodayBalance": "248",
            "sellingLimit": "1277014",
            "payment": "0",
            "remark": ""
          }
        ]
      }
    ]
  }
}
```