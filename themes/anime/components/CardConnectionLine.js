import { useEffect, useRef } from 'react'

/**
 * 铁路网格火车系统
 * 4辆火车各自在固定的线路上行驶，不能拐弯
 * 上/下火车：水平线路（左右移动）
 * 左/右火车：垂直线路（上下移动）
 */
const CardConnectionLine = ({ containerRef }) => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  // 当前目标卡片
  const targetCardRef = useRef(null)

  // 4辆火车 - 每辆只能在自己的线路上移动
  const trainsRef = useRef({
    top: {
      x: 0, y: 0, // 当前位置
      targetX: 0, // 只能改变x（左右移动）
      color: '255, 113, 206', // 粉色
      speed: 8,
      length: 50,
      direction: 'right',
      emoji: '🚂' // 火车头emoji
    },
    bottom: {
      x: 0, y: 0,
      targetX: 0,
      color: '167, 139, 250', // 紫色
      speed: 8,
      length: 50,
      direction: 'right',
      emoji: '🚃' // 车厢emoji
    },
    left: {
      x: 0, y: 0,
      targetY: 0, // 只能改变y（上下移动）
      color: '134, 204, 202', // 青色
      speed: 8,
      length: 50,
      direction: 'down',
      emoji: '🚄' // 高铁emoji
    },
    right: {
      x: 0, y: 0,
      targetY: 0,
      color: '255, 206, 92', // 黄色
      speed: 8,
      length: 50,
      direction: 'down',
      emoji: '🚅' // 动车emoji
    }
  })

  useEffect(() => {
    const container = containerRef?.current
    if (!container) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // 设置 canvas 尺寸
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // 获取所有卡片
    const getCards = () => Array.from(container.querySelectorAll('[data-card]'))

    // 计算卡片之间的间隙（用于确定线路位置）
    const getCardGaps = () => {
      const cards = getCards()
      const containerRect = container.getBoundingClientRect()

      // 收集所有卡片的边界
      const tops = new Set()
      const bottoms = new Set()
      const lefts = new Set()
      const rights = new Set()

      cards.forEach(card => {
        const rect = card.getBoundingClientRect()
        tops.add(rect.top - containerRect.top)
        bottoms.add(rect.bottom - containerRect.top)
        lefts.add(rect.left - containerRect.left)
        rights.add(rect.right - containerRect.left)
      })

      const sortedTops = Array.from(tops).sort((a, b) => a - b)
      const sortedBottoms = Array.from(bottoms).sort((a, b) => a - b)
      const sortedLefts = Array.from(lefts).sort((a, b) => a - b)
      const sortedRights = Array.from(rights).sort((a, b) => a - b)

      // 计算行间隙和列间隙
      const rowGaps = []
      for (let i = 0; i < sortedBottoms.length - 1; i++) {
        const gapCenter = (sortedBottoms[i] + sortedTops[i + 1]) / 2
        rowGaps.push(gapCenter)
      }

      const colGaps = []
      for (let i = 0; i < sortedRights.length - 1; i++) {
        const gapCenter = (sortedRights[i] + sortedLefts[i + 1]) / 2
        colGaps.push(gapCenter)
      }

      return { rowGaps, colGaps }
    }

    // 获取卡片站点位置（线路位于卡片间隙中央）
    const getStationPos = (card, stationType) => {
      const { rowGaps, colGaps } = getCardGaps()

      switch (stationType) {
        case 'top':
          // 上线路位于卡片上方间隙中央
          const topGap = rowGaps.find(gap => gap < card.top) || card.top - 15
          return { x: card.left + card.width / 2, y: topGap }
        case 'bottom':
          // 下线路位于卡片下方间隙中央
          const bottomGap = rowGaps.find(gap => gap > card.bottom) || card.bottom + 15
          return { x: card.left + card.width / 2, y: bottomGap }
        case 'left':
          // 左线路位于卡片左方间隙中央
          const leftGap = colGaps.find(gap => gap < card.left) || card.left - 15
          return { x: leftGap, y: card.top + card.height / 2 }
        case 'right':
          // 右线路位于卡片右方间隙中央
          const rightGap = colGaps.find(gap => gap > card.right) || card.right + 15
          return { x: rightGap, y: card.top + card.height / 2 }
        default:
          return { x: card.left, y: card.top }
      }
    }

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const cards = getCards()
      if (cards.length === 0) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      const targetCard = targetCardRef.current
      if (targetCard) {
        // 更新和绘制上火车（水平线路，只能左右移动）
        const topTrain = trainsRef.current.top
        const topStation = getStationPos(targetCard, 'top')
        topTrain.y = topStation.y // y固定，只能水平移动
        topTrain.targetX = topStation.x

        // 左右移动
        const dx = topTrain.targetX - topTrain.x
        if (Math.abs(dx) > topTrain.speed) {
          topTrain.x += Math.sign(dx) * topTrain.speed
          topTrain.direction = dx > 0 ? 'right' : 'left'
        } else {
          topTrain.x = topTrain.targetX
        }

        // 绘制上火车
        drawTrain(ctx, topTrain, 'horizontal')

        // 更新和绘制下火车（水平线路，只能左右移动）
        const bottomTrain = trainsRef.current.bottom
        const bottomStation = getStationPos(targetCard, 'bottom')
        bottomTrain.y = bottomStation.y
        bottomTrain.targetX = bottomStation.x

        const dx2 = bottomTrain.targetX - bottomTrain.x
        if (Math.abs(dx2) > bottomTrain.speed) {
          bottomTrain.x += Math.sign(dx2) * bottomTrain.speed
          bottomTrain.direction = dx2 > 0 ? 'right' : 'left'
        } else {
          bottomTrain.x = bottomTrain.targetX
        }

        drawTrain(ctx, bottomTrain, 'horizontal')

        // 更新和绘制左火车（垂直线路，只能上下移动）
        const leftTrain = trainsRef.current.left
        const leftStation = getStationPos(targetCard, 'left')
        leftTrain.x = leftStation.x // x固定，只能垂直移动
        leftTrain.targetY = leftStation.y

        const dy = leftTrain.targetY - leftTrain.y
        if (Math.abs(dy) > leftTrain.speed) {
          leftTrain.y += Math.sign(dy) * leftTrain.speed
          leftTrain.direction = dy > 0 ? 'down' : 'up'
        } else {
          leftTrain.y = leftTrain.targetY
        }

        drawTrain(ctx, leftTrain, 'vertical')

        // 更新和绘制右火车（垂直线路，只能上下移动）
        const rightTrain = trainsRef.current.right
        const rightStation = getStationPos(targetCard, 'right')
        rightTrain.x = rightStation.x
        rightTrain.targetY = rightStation.y

        const dy2 = rightTrain.targetY - rightTrain.y
        if (Math.abs(dy2) > rightTrain.speed) {
          rightTrain.y += Math.sign(dy2) * rightTrain.speed
          rightTrain.direction = dy2 > 0 ? 'down' : 'up'
        } else {
          rightTrain.y = rightTrain.targetY
        }

        drawTrain(ctx, rightTrain, 'vertical')
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    // 绘制火车
    const drawTrain = (ctx, train, orientation) => {
      let tailX = train.x
      let tailY = train.y

      if (orientation === 'horizontal') {
        // 水平火车，尾巴在左或右
        if (train.direction === 'right') {
          tailX = train.x - train.length
        } else {
          tailX = train.x + train.length
        }
      } else {
        // 垂直火车，尾巴在上或下
        if (train.direction === 'down') {
          tailY = train.y - train.length
        } else {
          tailY = train.y + train.length
        }
      }

      // 外层发光
      ctx.beginPath()
      ctx.moveTo(tailX, tailY)
      ctx.lineTo(train.x, train.y)
      ctx.strokeStyle = `rgba(${train.color}, 0.3)`
      ctx.lineWidth = 12
      ctx.lineCap = 'round'
      ctx.shadowColor = `rgba(${train.color}, 0.8)`
      ctx.shadowBlur = 25
      ctx.stroke()

      // 主体线条
      ctx.beginPath()
      ctx.moveTo(tailX, tailY)
      ctx.lineTo(train.x, train.y)
      ctx.strokeStyle = `rgba(${train.color}, 0.9)`
      ctx.lineWidth = 7
      ctx.shadowColor = `rgba(${train.color}, 1)`
      ctx.shadowBlur = 12
      ctx.stroke()

      // 中心高光线
      ctx.beginPath()
      ctx.moveTo(tailX, tailY)
      ctx.lineTo(train.x, train.y)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.lineWidth = 3
      ctx.shadowBlur = 0
      ctx.stroke()

      // 火车头（滑稽emoji）
      ctx.font = '18px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('🤪', train.x, train.y)
    }

    // 鼠标移动事件
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      const cards = getCards()
      const containerRect = container.getBoundingClientRect()

      // 找到鼠标所在的卡片
      let hoveredCard = null
      for (const card of cards) {
        const cardRect = card.getBoundingClientRect()
        const left = cardRect.left - containerRect.left
        const right = cardRect.right - containerRect.left
        const top = cardRect.top - containerRect.top
        const bottom = cardRect.bottom - containerRect.top

        if (mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom) {
          hoveredCard = {
            element: card,
            left, right, top, bottom,
            width: right - left,
            height: bottom - top
          }
          break
        }
      }

      if (hoveredCard && hoveredCard.element !== targetCardRef.current?.element) {
        const previousCard = targetCardRef.current
        targetCardRef.current = hoveredCard

        if (!previousCard) {
          // 第一次进入，初始化火车位置到站点
          Object.keys(trainsRef.current).forEach(trainType => {
            const train = trainsRef.current[trainType]
            const station = getStationPos(hoveredCard, trainType)
            train.x = station.x
            train.y = station.y
          })
        }
        // 如果之前有卡片，火车会自动驶向新目标（在自己的线路上）
      }
    }

    container.addEventListener('mousemove', handleMouseMove)

    // 使用 IntersectionObserver 只在可见时运行动画
    let isVisible = true
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting
        if (isVisible && !animationRef.current) {
          animationRef.current = requestAnimationFrame(animate)
        }
      },
      { threshold: 0 }
    )
    observer.observe(canvas)

    // 页面不可见时暂停动画
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisible = false
      } else if (canvas.getBoundingClientRect().top < window.innerHeight) {
        isVisible = true
        if (!animationRef.current) {
          animationRef.current = requestAnimationFrame(animate)
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      container.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      observer.disconnect()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [containerRef])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        width: '100%',
        height: '100%',
        zIndex: 5
      }}
    />
  )
}

export default CardConnectionLine
