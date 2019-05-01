
# Write your query or mutation here
## EverydayStockInfoList
### query
```
# Write your query or mutation here
query ($req: EverydayStockInfoItemInput){
  everydayStockInfoList(req: $req){
    date
    stockInfo {
      code
      name
      volumn
      openPrice
      highPrice
      lowPrice
      closePrice
      raisePoint
      raisePercent
      PE
    }
  }
}
```
### variable
```
{
  "req": {
    "code": "2330",
    "dayCount": 1
  }
}
```
### response
```
{
  "data": {
    "EverydayStockInfoList": [
      {
        "date": "20190426",
        "stockInfo": [
          {
            "code": "2330",
            "name": "台積電",
            "volumn": "16674",
            "openPrice": "262.00",
            "highPrice": "263.00",
            "lowPrice": "257.50",
            "closePrice": "260.00",
            "raisePoint": "2.00",
            "raisePercent": "0.76",
            "PE": "19.20"
          }
        ]
      }
    ]
  }
}
```