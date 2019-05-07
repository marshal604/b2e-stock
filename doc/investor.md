## investorTradeList
### query
```
query($req: GetInvestorTradeListInput) {
  investorTradeList(req: $req) {
    date
    list {
      code
      name
      foreignInvestorBuy
      foreignInvestorSell
      foreignInvestorBuyAndSell
      securtiesInvestorBuy
      securtiesInvestorSell
      securtiesInvestorBuyAndSell
      dealerBuy
      dealerSell
      dealerBuyAndSell
      allInvestorBuyAndSell
    }
  }
}
```
### variable
```
{
  "req": {
    "dayCount": 1
  }
}
```
### response
```
"data": {
    "investorTradeList": [
      {
        "date": "20190507",
        "list": [
          {
            "code": "2317",
            "name": "鴻海",
            "foreignInvestorBuy": 20447361,
            "foreignInvestorSell": 9249407,
            "foreignInvestorBuyAndSell": 11197954,
            "securtiesInvestorBuy": 20000,
            "securtiesInvestorSell": 0,
            "securtiesInvestorBuyAndSell": 20000,
            "dealerBuy": 110000,
            "dealerSell": 931000,
            "dealerBuyAndSell": -821000,
            "allInvestorBuyAndSell": 11368954
          },
          ...
          ...
      }
    ]
}
```
## investorTradeListWithCode
### query 
```
query($req: GetInvestorTradeItemInput) {
  investorTradeListWithCode(req: $req) {
    date
    list {
      code
      name
      foreignInvestorBuy
      foreignInvestorSell
      foreignInvestorBuyAndSell
      securtiesInvestorBuy
      securtiesInvestorSell
      securtiesInvestorBuyAndSell
      dealerBuy
      dealerSell
      dealerBuyAndSell
      allInvestorBuyAndSell
    }
  }
}
```
### variable
```
{
  "req": {
    "code": "1101",
    "dayCount": 1
  }
}
```
### response
```
{
  "data": {
    "investorTradeListWithCode": [
      {
        "date": "20190507",
        "list": [
          {
            "code": "1101",
            "name": "台泥",
            "foreignInvestorBuy": 4789000,
            "foreignInvestorSell": 5280059,
            "foreignInvestorBuyAndSell": -491059,
            "securtiesInvestorBuy": 540000,
            "securtiesInvestorSell": 375051,
            "securtiesInvestorBuyAndSell": 164949,
            "dealerBuy": 180000,
            "dealerSell": 420000,
            "dealerBuyAndSell": -240000,
            "allInvestorBuyAndSell": -569110
          }
        ]
      }
    ]
  }
}
```

## investorStockList
### query 
```
query ($req: GetInvestorStockListInput){
  investorStockList(req: $req) {
    date
    list {
      code
      name
      commonStockCount
      investorStockCount
      investorStockPercent
    }
  }
}
```
### variable
```
{
  "req": {
    "dayCount": 1
  }
}
```
### response
```
{
    "data": {
        "investorStockList": [
        {
            "date": "20190507",
            "list": [
            {
                "code": "1101",
                "name": "台泥",
                "commonStockCount": 5108059911,
                "investorStockCount": 1463445930,
                "investorStockPercent": 28.64
            }
            ]
        }
        ]
    }
}
```

## investorStockListWithCode
### query 
```
query ($req: GetInvestorStockItemInput){
  investorStockListWithCode(req: $req) {
    date
    list {
      code
      name
      commonStockCount
      investorStockCount
      investorStockPercent
    }
  }
}
```
### variable
```
{
  "req": {
    "code": "1101",
    "dayCount": 1
  }
}
```
### response
```
{
  "data": {
    "investorStockListWithCode": [
      {
        "date": "20190507",
        "list": [
          {
            "code": "1101",
            "name": "台泥",
            "commonStockCount": 5108059911,
            "investorStockCount": 1463445930,
            "investorStockPercent": 28.64
          }
        ]
      }
    ]
  }
}
```

## investorIntegrateList
### query 
```
query($req: GetInvestorIntegrateListInput) {
  investorIntegrateList(req: $req) {
    date
    list {
      code
      name
      commonStockCount
      investorStockCount
      investorStockPercent
      foreignInvestorBuy
      foreignInvestorSell
      foreignInvestorBuyAndSell
      securtiesInvestorBuy
      securtiesInvestorSell
      securtiesInvestorBuyAndSell
      dealerBuy
      dealerSell
      dealerBuyAndSell
      allInvestorBuyAndSell
    }
  }
}
```
### variable
```
{
  "req": {
    "code": "1101",
    "dayCount": 1
  }
}
```
### response
```
{
  "data": {
    "investorIntegrateList": [
      {
        "date": "20190507",
        "list": [
          {
            "code": "1101",
            "name": "台泥",
            "commonStockCount": 5108059911,
            "investorStockCount": 1463445930,
            "investorStockPercent": 28.64,
            "foreignInvestorBuy": 4789000,
            "foreignInvestorSell": 5280059,
            "foreignInvestorBuyAndSell": -491059,
            "securtiesInvestorBuy": 540000,
            "securtiesInvestorSell": 375051,
            "securtiesInvestorBuyAndSell": 164949,
            "dealerBuy": 180000,
            "dealerSell": 420000,
            "dealerBuyAndSell": -240000,
            "allInvestorBuyAndSell": -569110
          }
        ]
      }
    ]
  }
}
```