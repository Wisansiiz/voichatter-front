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
