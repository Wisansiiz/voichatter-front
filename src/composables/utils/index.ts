import { h } from 'vue'
import { NIcon } from 'naive-ui'

export function createImageVNode(url: string, name: string) {
  if (url !== '') {
    return h(
      // NAvatar,
      'img',
      {
        src: url,
        // round: true,
        // size: 'medium',
        style: {
          'width': '35px',
          'border-radius': '50%',
        },
      },
    )
  }
  else {
    return h(
      'div',
      {
        style: {
          'width': '35px',
          'border-radius': '50%',
          'font-style': 'normal',
        },
      },
      // NAvatar,
      // {
      //   round: true,
      // },
      name.substring(0, 1),
    )
  }
}
export function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
function addLight(color: string, amount: number) {
  const cc = Number.parseInt(color, 16) + amount
  const c = cc > 255 ? 255 : cc
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`
}

export function lighten(color: string, amount: number) {
  color = color.includes('#') ? color.substring(1, color.length) : color
  amount = Math.trunc((255 * amount) / 100)
  return `#${addLight(color.substring(0, 2), amount)}${addLight(
    color.substring(2, 4),
    amount,
  )}${addLight(color.substring(4, 6), amount)}`
}
