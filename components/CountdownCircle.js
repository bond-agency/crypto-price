import { Component } from 'react'

export default class CountdownCircle extends Component {
  constructor (props) {
    super(props)

    let stroke = 10
    let radius = 50 - stroke
    let dashLength = (radius * Math.PI * 2)

    this.state = {
      stroke: stroke,
      radius: radius,
      dashLength: dashLength
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.startToDraw) {
      this.animate([
        {
          node: this.c,
          time: 4,
          start: this.state.dashLength,
          end: 0,
          run: function (rate) {
            let val = rate * (this.end - this.start) + this.start
            this.node.setAttribute('stroke-dashoffset', `${val}%`)
          }
        }
      ])
    }
  }

  animate (list) {
    let item
    let duration
    let end = 0

    const step = () => {
      let current = +new Date()
      let remaining = end - current

      if (remaining < 50) {
        if (item) {
          item.run(1)
        }

        item = list.shift()

        if (item) {
          duration = item.time * 1000
          end = current + duration
          item.run(0)
        } else {
          return
        }
      } else {
        var rate = remaining / duration
        rate = item.easing ? (1 - item.easing(rate)) : (1 - rate)
        item.run(rate)
      }

      window.requestAnimationFrame(step)
    }

    step()
  }

  render () {
    let { stroke, radius, dashLength } = this.state

    return (
      <div>
        <svg width='100%' height='100%'>
          <circle
            ref={(c) => { this.c = c }}
            r={radius + '%'}
            cx='50%'
            cy='50%'
            strokeWidth={stroke + '%'}
            strokeDashoffset={dashLength + '%'}
            strokeDasharray={dashLength + '%'} />
        </svg>
        <style jsx>{`
          div {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
          }

          svg {
            transform: rotateZ(270deg) rotateX(180deg);
            transform-origin: center;
          }

          svg circle {
            fill: none;
            stroke: #999999;
          }
          `}</style>
      </div>
    )
  }
}
