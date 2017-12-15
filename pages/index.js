import React from 'react'
import fetch from 'isomorphic-fetch'

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
      btcPrice: props.btcPrice
    }
  }

  flash (prevPrice, newPrice, ref) {
    if (newPrice > prevPrice) {
      ref.classList.add('green')
    } else if (newPrice < prevPrice) {
      ref.classList.add('red')
    }

    setTimeout(() => {
      ref.classList.remove('red')
      ref.classList.remove('green')
    }, 100)
  }

  componentDidMount () {
    this.intervalId = setInterval(() => {
      getEthPrice().then(newPrice => {
        const prevPrice = this.state.ethPrice

        this.setState({
          ethPrice: newPrice
        })

        this.flash(prevPrice, newPrice, this.ethValue)
      })

      getLtcPrice().then(newPrice => {
        const prevPrice = this.state.ltcPrice

        this.setState({
          ltcPrice: newPrice
        })

        this.flash(prevPrice, newPrice, this.ltcValue)
      })

      getBtcPrice().then(newPrice => {
        const prevPrice = this.state.btcPrice

        this.setState({
          btcPrice: newPrice
        })

        this.flash(prevPrice, newPrice, this.btcValue)
      })
    }, 4000)
  }

  componentWillUnmount () {
    clearInterval(this.intervalId)
  }

  render () {
    let { ethPrice, ltcPrice, btcPrice } = this.state

    return (
      <div className='root'>
        <h1 ref={(btcValue) => { this.btcValue = btcValue }}>
          <span>BTC</span>
          <span className='flash'>{btcPrice} <span>€</span></span>
        </h1>
        <h1 ref={(ethValue) => { this.ethValue = ethValue }}>
          <span>ETH</span>
          <span className='flash'>{ethPrice} <span>€</span></span>
        </h1>
        <h1 ref={(ltcValue) => { this.ltcValue = ltcValue }}>
          <span>LTC</span>
          <span className='flash'>{ltcPrice} <span>€</span></span>
        </h1>
        <style global jsx>{`
          html, body {
            width: 100%;
            height: 100%;
            padding: 0;
            margin: 0;
            background-color: black;
            color: white;
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
            font-family: 'Helvetica';
            margin: 0.2em 1em;
            color: white;
            justify-content: space-between;
          }
          
          h1 .flash {
            display: inline-block;
            transition: color 1.5s ease-out, transform 1.5s ease-out;
          }

          .green .flash {
            color: #2ecc71;
            transition: color 0.1s, transform 0.5s;
            transform: scale(1.1);
          }

          .red .flash {
            color: #e74c3c;
            transition: color 0.1s, transform 0.5s;
            transform: scale(0.9);                       
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
