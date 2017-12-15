import React from 'react'
import fetch from 'isomorphic-fetch'
import CountdownCircle from '../components/CountdownCircle'
import Head from 'next/head'

async function getEthPrice () {
  const response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=EUR')
  const json = await response.json()
  return json.EUR
}

async function getLtcPrice () {
  const response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=LTC&tsyms=EUR')
  const json = await response.json()
  return json.EUR
}

async function getBtcPrice () {
  const response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=EUR')
  const json = await response.json()
  return json.EUR
}

export default class extends React.Component {
  static async getInitialProps () {
    const ethPrice = await getEthPrice()
    const ltcPrice = await getLtcPrice()
    const btcPrice = await getBtcPrice()
    return { ethPrice, ltcPrice, btcPrice }
  }

  constructor (props) {
    super(props)
    this.state = {
      ethPrice: props.ethPrice,
      ltcPrice: props.ltcPrice,
      btcPrice: props.btcPrice,
      drawCircle: false
    }
  }

  flash (prevPrice, newPrice, ref) {
    if (newPrice > prevPrice) {
      ref.classList.add('green')
    } else if (newPrice < prevPrice) {
      ref.classList.add('red')
    } else {
      ref.classList.add('gray')
    }

    setTimeout(() => {
      ref.classList.remove('gray')
      ref.classList.remove('red')
      ref.classList.remove('green')
    }, 100)
  }

  componentDidMount () {
    this.intervalId = setInterval(() => {
      this.setState({ drawCircle: true })

      getEthPrice().then(newPrice => {
        const prevPrice = this.state.ethPrice

        this.setState({
          ethPrice: newPrice,
          drawCircle: false
        })

        this.flash(prevPrice, newPrice, this.ethValue)
      })

      getLtcPrice().then(newPrice => {
        const prevPrice = this.state.ltcPrice

        this.setState({
          ltcPrice: newPrice,
          drawCircle: false
        })

        this.flash(prevPrice, newPrice, this.ltcValue)
      })

      getBtcPrice().then(newPrice => {
        const prevPrice = this.state.btcPrice

        this.setState({
          btcPrice: newPrice,
          drawCircle: false
        })

        this.flash(prevPrice, newPrice, this.btcValue)
      })
    }, 4000)
  }

  componentWillUnmount () {
    clearInterval(this.intervalId)
  }

  fixToTwoDecimals (num) {
    return parseFloat(Math.round(num * 100) / 100).toFixed(2)
  }

  render () {
    let { ethPrice, ltcPrice, btcPrice, drawCircle } = this.state

    ethPrice = this.fixToTwoDecimals(ethPrice)
    ltcPrice = this.fixToTwoDecimals(ltcPrice)
    btcPrice = this.fixToTwoDecimals(btcPrice)

    return (
      <div className='root'>
        <Head>
          <meta charSet='utf-8' />
          <meta httpEquiv='x-ua-compatible' content='ie=edge' />
          <title>Crypto Price</title>
          <meta name='viewport' content='width=device-width, initial-scale=1' key='viewport' />
        </Head>
        <h1 ref={(btcValue) => { this.btcValue = btcValue }}>
          <span>BTC</span>
          <span>
            <span className='flash'>{btcPrice}</span> €
          </span>
        </h1>
        <h1 ref={(ethValue) => { this.ethValue = ethValue }}>
          <span>ETH</span>
          <span>
            <span className='flash'>{ethPrice}</span> €
          </span>
        </h1>
        <h1 ref={(ltcValue) => { this.ltcValue = ltcValue }}>
          <span>LTC</span>
          <span>
            <span className='flash'>{ltcPrice}</span> €
          </span>
        </h1>
        <CountdownCircle startToDraw={drawCircle} />
        <style global jsx>{`
          html, body {
            width: 100%;
            height: 100%;
            padding: 0;
            margin: 0;
            background-color: black;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
          }
        `}</style>

        <style jsx>{`
          .root {
            display: flex;
            flex-wrap: wrap;
            align-content: center;
            height: 100vh;
          }

          h1 {
            display: flex;
            width: 100%;
            font-size: 10vw;
            margin: 0.2em 1em;
            color: white;
            justify-content: space-between;
          }
          
          h1 .flash {
            font-weight: normal;
            display: inline-block;
            transition: color 2.2s ease-out, transform 1.5s ease-out;
          }

          .green .flash {
            color: #50e3c2;
            transition: color 0.1s, transform 0.5s;
            transform: scale(1.1);
          }

          .red .flash {
            color: #e74c3c;
            transition: color 0.1s, transform 0.5s;
            transform: scale(0.9);
          }

          .gray .flash {
            color: #c7c7c7;
            transition: color 0.1s;
          }

          @media (min-width: 700px) {
            h1 {
              font-size: 10vw;
            }
          }
        `}</style>
      </div>
    )
  }
}
