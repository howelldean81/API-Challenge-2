/*
-------------------------------------------------------------------------------------
* Endpoints                                                                         *
-------------------------------------------------------------------------------------
* List                                  |   Live                                    *
https://api.coinlayer.com/api/list      |   http://api.coinlayer.com/api/live       *           
                                                                                    *
* Historical                            |   Convert - Not supported on free...      *
http://api.coinlayer.com/api/YYYY-MM-DD |   http://api.coinlayer.com/api/convert    *
                                                                                    *
* Timeframe - Not supported on free...  |   Change - Not supported on free...       *
http://api.coinlayer.com/api/timeframe  |   http://api.coinlayer.com/api/change     *
-------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------
* Endpoint Example                                                                  *
-------------------------------------------------------------------------------------
? Live      |   http://api.coinlayer.com/api/live?access_key=key                    ?
-------------------------------------------------------------------------------------
? My Key    |   a1f4a05d8a5c89bee72e0f45aa1082d4                                    ?
-------------------------------------------------------------------------------------
*/

// Testing
var topTenTest = []

// API stuff
const apiKeyAppend = "?access_key=a1f4a05d8a5c89bee72e0f45aa1082d4"
const apiExpand = "&expand=1"
const liveTickerAll = "https://api.coinlayer.com/api/live"
const listTickerAll = "https://api.coinlayer.com/api/list"

// Historical - Chain this with key and getLastMonth()
const hisTickerAll = "https://api.coinlayer.com/api/"

// Nav buttons
const popularButton = document.getElementById('popular')
const allCoinsButton = document.getElementById('all-coins')
const top3Button = document.getElementById('top-3')
const searchBox = document.getElementById('search-box')

// Div
const fluidDiv = document.getElementById('data-container')

// Dollar formatter
const usMoney = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
})

/*
-------------------------------------------------------------------------------------
* For use later...                                                                  *
-------------------------------------------------------------------------------------
async function toTheMoon() {
    try {
        const res = await fetch(liveTickerAll + apiKeyAppend)
        const data = await res.json()
        console.log(data.rates.DOGE);
    } catch (err) {
        console.log(err);
    }
}

async function listRates() {
    try {
        const res = await fetch(listTickerAll + apiKeyAppend)
        const data = await res.json()
        console.log(data);
    } catch (err) {
        console.log(err);
    }
}

async function list30Rates() {
    let lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30)
    console.log(lastMonth.toISOString().substring(0, 10))
    try {
        const res = await fetch(hisTickerAll + lastMonth + apiKeyAppend)
        const data = await res.json()
        console.log(data);
    } catch (err) {
        console.log(err);
    }
}
function getLastMonth() {
    var lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30)
    console.log(lastMonth.toISOString().substring(0, 10))
}
*/

homePage()

allCoinsButton.onclick = function () {
    // Empty contents of data container
    fluidDiv.innerHTML = ""

    // Create the table skeleton
    const createTable = document.createElement('table')
    const createTHead = document.createElement('thead')
    const createRow = document.createElement('tr')
    const createHeadingSym = document.createElement('th')
    const createHeadingName = document.createElement('th')
    const createHeadingCost = document.createElement('th')
    const createHeadingLast = document.createElement('th')
    const createHeadingCap = document.createElement('th')
    const createTBody = document.createElement('tbody')

    // Create table in data container
    fluidDiv.appendChild(createTable)

    createTable.className = 'annoyingLookingTable'
    createTable.id = 'loudTable'

    // Create the table header
    let loudTable = document.getElementById('loudTable')

    loudTable.appendChild(createTHead)
    loudTable.appendChild(createTBody)
    createTBody.id = 'coinChart'
    createTBody.className = 'annoyingLookingTable'
    createTHead.appendChild(createRow)
    createRow.appendChild(createHeadingSym)
    createHeadingSym.id = 'head-sym'
    createHeadingSym.scope = 'col'
    createHeadingSym.innerHTML = '<button id="head-sym-button" class="tableButton">Symbol</button>'
    createRow.appendChild(createHeadingCost)
    createHeadingCost.id = 'head-cost'
    createHeadingCost.scope = 'col'
    createHeadingCost.innerHTML = '<button id="head-cost-button" class="tableButton">Price</button>'
    createRow.appendChild(createHeadingName)
    createHeadingName.id = 'head-high'
    createHeadingName.scope = 'col'
    createHeadingName.innerHTML = '<button id="head-high-button" class="tableButton">24 Hour High</button>'
    createRow.appendChild(createHeadingLast)
    createHeadingLast.id = 'head-low'
    createHeadingLast.scope = 'col'
    createHeadingLast.innerHTML = '<button id="head-low-button" class="tableButton">24 Hour Low</button>'
    createRow.appendChild(createHeadingCap)
    createHeadingCap.id = 'head-cap'
    createHeadingCap.scope = 'col'
    createHeadingCap.innerHTML = '<button id="head-cap-button" class="tableButton">Market Cap</button>'

    // Define table buttons
    const sortSymButton = document.getElementById('head-sym-button')
    const sortCostButton = document.getElementById('head-cost-button')
    const sortHighButton = document.getElementById('head-high-button')
    const sortLowButton = document.getElementById('head-low-button')
    const sortCapButton = document.getElementById('head-cap-button')

    // Get and manipulate JSON from LIVE endpoint
    async function getChart() {
        try {
            const res = await fetch('https://api.coinlayer.com/api/live?access_key=a1f4a05d8a5c89bee72e0f45aa1082d4&expand=1')
            const data = await res.json()
            let newArr = []
            let finalArr = []
            for (names in data.rates) {
                Object.entries(data.rates).forEach(i => {
                    let obj = i[1]
                    if (i[0] === names) {
                        Object.assign(obj, {
                            names: names
                        })
                        newArr.push(obj)
                        finalArr = newArr.map((i) => (
                            {
                                Name: i.names,
                                Rate: i.rate,
                                High: i.high,
                                Low: i.low,
                                Cap: i.cap,
                                Volume: Math.round(parseInt(i.vol)),
                            }
                        ))
                    }
                })
            }
            displayResults(finalArr)

            sortCostButton.onclick = function () {
                finalArr.sort((cur, prev) => prev.Rate - cur.Rate)
                displayResults(finalArr)
            }

            sortHighButton.onclick = function () {
                finalArr.sort((cur, prev) => prev.High - cur.High)
                displayResults(finalArr)
            }

            sortLowButton.onclick = function () {
                finalArr.sort((cur, prev) => prev.Low - cur.Low)
                displayResults(finalArr)
            }

            sortCapButton.onclick = function () {
                finalArr.sort((cur, prev) => prev.Cap - cur.Cap)
                displayResults(finalArr)
            }
        } catch (err) {
            console.log(err);
        }
    }

    getChart()

    function displayResults(coins) {
        let coinChart = document.getElementById('coinChart')
        coinChart.innerHTML = ""

        coins.map(coins => {
            let coinRow = document.createElement('tr')
            let cell1 = coinRow.insertCell()
            let cell2 = coinRow.insertCell()
            let cell3 = coinRow.insertCell()
            let cell4 = coinRow.insertCell()
            let cell5 = coinRow.insertCell()

            cell1.innerText = `${coins.Name}`
            cell2.innerText = `${usMoney.format(coins.Rate)}`
            cell3.innerText = `${usMoney.format(coins.High)}`
            cell4.innerText = `${usMoney.format(coins.Low)}`
            cell5.innerHTML = `${usMoney.format(coins.Cap)}`

            coinChart.appendChild(coinRow)
        })
    }
}

popularButton.onclick = function () {
    // Empty contents of data container
    fluidDiv.innerHTML = ""

    // Create the table skeleton
    const createTable = document.createElement('table')
    const createTHead = document.createElement('thead')
    const createRow = document.createElement('tr')
    const createHeadingSym = document.createElement('th')
    const createHeadingCost = document.createElement('th')
    const createHeadingCap = document.createElement('th')
    const createHeadingVol = document.createElement('th')
    const createTBody = document.createElement('tbody')

    // Create table in data container
    fluidDiv.appendChild(createTable)

    createTable.className = 'annoyingLookingTable'
    createTable.id = 'loudTable'

    // Create the table header
    let loudTable = document.getElementById('loudTable')

    loudTable.appendChild(createTHead)
    loudTable.appendChild(createTBody)
    createTBody.id = 'coinChart'
    createTBody.className = 'annoyingLookingTable'
    createTHead.appendChild(createRow)
    createRow.appendChild(createHeadingSym)
    createHeadingSym.id = 'head-sym'
    createHeadingSym.scope = 'col'
    createHeadingSym.innerHTML = '<button id="head-sym-button" class="tableButton">Symbol</button>'
    createRow.appendChild(createHeadingVol)
    createHeadingVol.id = 'head-vol'
    createHeadingVol.scope = 'col'
    createHeadingVol.innerHTML = '<button id="head-vol-button" class="tableButton">Volume</button>'
    createRow.appendChild(createHeadingCost)
    createHeadingCost.id = 'head-cost'
    createHeadingCost.scope = 'col'
    createHeadingCost.innerHTML = '<button id="head-cost-button" class="tableButton">Price</button>'
    createRow.appendChild(createHeadingCap)
    createHeadingCap.id = 'head-cap'
    createHeadingCap.scope = 'col'
    createHeadingCap.innerHTML = '<button id="head-cap-button" class="tableButton">Market Cap</button>'

    // Define table buttons
    const sortSymButton = document.getElementById('head-sym-button')
    const sortCostButton = document.getElementById('head-cost-button')
    const sortVolButton = document.getElementById('head-vol-button')
    const sortCapButton = document.getElementById('head-cap-button')

    // Get and manipulate JSON from LIVE endpoint
    async function getChart() {
        try {
            const res = await fetch('https://api.coinlayer.com/api/live?access_key=a1f4a05d8a5c89bee72e0f45aa1082d4&expand=1')
            const data = await res.json()
            let newArr = []
            let finalArr = []
            for (names in data.rates) {
                Object.entries(data.rates).forEach(i => {
                    let obj = i[1]
                    if (i[0] === names) {
                        Object.assign(obj, {
                            names: names
                        })
                        newArr.push(obj)
                        finalArr = newArr.map((i) => (
                            {
                                Name: i.names,
                                Rate: i.rate,
                                Cap: i.cap,
                                Volume: Math.round(parseInt(i.vol)),
                            }
                        ))
                    }
                })
            }

            // finalArr.sort((cur, prev) => prev.Volume - cur.Volume).slice([0], [10])
            // console.log(topTen)
            // console.log(finalArr)
            topTenArr = finalArr.sort((cur, prev) => prev.Cap - cur.Cap).slice([0], [10])

            displayResults(topTenArr)
            sortVolButton.onclick = function () {
                topTenArr.sort((cur, prev) => prev.Volume - cur.Volume)
                displayResults(topTenArr)
            }

            sortCostButton.onclick = function () {
                topTenArr.sort((cur, prev) => prev.Rate - cur.Rate)
                displayResults(topTenArr)
            }

            sortCapButton.onclick = function () {
                topTenArr.sort((cur, prev) => prev.Cap - cur.Cap)
                displayResults(topTenArr)
            }
        } catch (err) {
            console.log(err);
        }
    }

    getChart()

    function displayResults(coins) {
        let coinChart = document.getElementById('coinChart')
        coinChart.innerHTML = ""

        coins.map(coins => {
            let coinRow = document.createElement('tr')
            let cell1 = coinRow.insertCell()
            let cell2 = coinRow.insertCell()
            let cell3 = coinRow.insertCell()
            let cell4 = coinRow.insertCell()

            cell1.innerHTML = `${coins.Name}`
            cell2.innerHTML = `${usMoney.format(coins.Volume)}`
            cell3.innerHTML = `${usMoney.format(coins.Rate)}`
            cell4.innerHTML = `${usMoney.format(coins.Cap)}`

            coinChart.appendChild(coinRow)
        })
    }
}

top3Button.onclick = function () {
    // Empty contents of 'data-container'
    fluidDiv.innerHTML = ""

    const cardBanner        = document.createElement('div')
    const cardContainer     = document.createElement('div')

    fluidDiv.appendChild(cardBanner)
    cardBanner.id           = 'card-banner'
    cardBanner.className    = 'cardBanner'
    cardBanner.innerHTML    = 'Top 3 Coins by Market Cap'

    fluidDiv.appendChild(cardContainer)
    cardContainer.id           = 'card-container'
    cardContainer.className    = 'cardContainer'

    // Get and manipulate JSON from LIVE endpoint
    async function getChart() {
        try {
            const res = await fetch('https://api.coinlayer.com/api/live?access_key=a1f4a05d8a5c89bee72e0f45aa1082d4&expand=1')
            const data = await res.json()
            let newArr = []
            let finalArr = []
            for (names in data.rates) {
                Object.entries(data.rates).forEach(i => {
                    let obj = i[1]
                    if (i[0] === names) {
                        Object.assign(obj, {
                            names: names
                        })
                        newArr.push(obj)
                        finalArr = newArr.map((i) => (
                            {
                                Name: i.names,
                                Rate: i.rate,
                                Cap: i.cap,
                                Volume: Math.round(parseInt(i.vol)),
                            }
                        ))
                    }
                })
            }
            topThreeArr = finalArr.sort((cur, prev) => prev.Cap - cur.Cap).slice([0], [3])
            displayResults(topThreeArr)
        } catch (err) {
            console.log(err);
        }
    }

    getChart()

    function displayResults(coins) {
        coins.forEach((coin) => {
          const coinCard        = document.createElement('div')
          const coinHeader      = document.createElement('h1')
          const coinText        = document.createElement('p')

          coinCard.className    = 'coinCardDiv'
      
          coinHeader.innerHTML = `${coin.Name}`
          coinText.innerHTML = `${usMoney.format(coin.Cap)}`
          
          cardContainer.appendChild(coinCard)
          coinCard.appendChild(coinHeader)
          coinCard.appendChild(coinText)
        })

}}

function homePage() {
    // Empty contents of 'data-container'
    fluidDiv.innerHTML = ""

    const cardBanner        = document.createElement('div')
    const cardContainer     = document.createElement('div')

    fluidDiv.appendChild(cardBanner)
    cardBanner.id           = 'card-banner'
    cardBanner.className    = 'cardBanner'
    cardBanner.innerHTML    = 'Top 3 Coins by Market Cap'

    fluidDiv.appendChild(cardContainer)
    cardContainer.id           = 'card-container'
    cardContainer.className    = 'cardContainer'

    // Get and manipulate JSON from LIVE endpoint
    async function getChart() {
        try {
            const res = await fetch('https://api.coinlayer.com/api/live?access_key=a1f4a05d8a5c89bee72e0f45aa1082d4&expand=1')
            const data = await res.json()
            let newArr = []
            let finalArr = []
            for (names in data.rates) {
                Object.entries(data.rates).forEach(i => {
                    let obj = i[1]
                    if (i[0] === names) {
                        Object.assign(obj, {
                            names: names
                        })
                        newArr.push(obj)
                        finalArr = newArr.map((i) => (
                            {
                                Name: i.names,
                                Rate: i.rate,
                                Cap: i.cap,
                                Volume: Math.round(parseInt(i.vol)),
                            }
                        ))
                    }
                })
            }
            allCoins = finalArr.sort((cur, prev) => prev.Rate - cur.Rate)
            displayResults(allCoins)
        } catch (err) {
            console.log(err);
        }
    }

    getChart()

    function displayResults(coins) {
        coins.forEach((coin) => {
          const coinCard        = document.createElement('div')
          const coinHeader      = document.createElement('h1')
          const coinText        = document.createElement('p')

          coinCard.className    = 'coinCardDiv'
      
          coinHeader.innerHTML = `${coin.Name}`
          coinText.innerHTML = `${usMoney.format(coin.Rate)}`
          
          cardContainer.appendChild(coinCard)
          coinCard.appendChild(coinHeader)
          coinCard.appendChild(coinText)
        })

}}
