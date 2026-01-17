// 动画配置
// 1. 默认值
// 2. GUI表单
// 3. 切换解析结果
// 4. 复制到本地
export const options: any = {
  _section1_animation_speed: {
    type: 'number',
    label: '(牌阵)默认轮播速度',
    value: 0.4
  },
  _section1_scroll_speed: {
    type: 'number',
    label: '(牌阵)加快速度',
    value: 5
  },
  _section1_scroll_duration: {
    type: 'number',
    label: '(牌阵)逐渐停止持续时间',
    value: 2.3
  },
  // _section1_card_width: {
  //   type: 'number',
  //   label: '(牌阵)默认牌宽',
  //   value: 256
  // },
  // _section1_card_height: {
  //   type: 'number',
  //   label: '(牌阵)默认牌高',
  //   value: 480
  // },
  // _section1_scale: {
  //   type: 'number',
  //   label: '(牌阵)默认缩放',
  //   value: 1.15
  // },
  _section2_rotate_speed: {
    type: 'number',
    label: '(选中)翻转动画速度',
    value: 2
  },
  _section2_rotate_delay: {
    type: 'number',
    label: '(选中)翻转动画延迟',
    value: 0
  },
  _section2_card_1_top: {
    type: 'string',
    label: '(选中)第一张牌相对位置TOP',
    value: "12.3%"
  },
  _section2_card_1_left: {
    type: 'string',
    label: '(选中)第一张牌相对位置TOP',
    value: "17.857%"
  },
  _section2_card_1_scale: {
    type: 'string',
    label: '(选中)第一张牌缩放',
    value: "1.15"
  },
  _section2_card_1_rotate: {
    type: 'string',
    label: '(选中)第一张牌旋转角度',
    value: "-8deg"
  },
  _section2_card_2_top: {
    type: 'string',
    label: '(选中)第二张牌相对位置TOP',
    value: "68.83%"
  },
  _section2_card_2_left: {
    type: 'string',
    label: '(选中)第二张牌相对位置TOP',
    value: "14.04%"
  },
  _section2_card_2_rotate: {
    type: 'string',
    label: '(选中)第二张牌旋转角度',
    value: "10deg"
  },
  _section2_card_2_scale: {
    type: 'string',
    label: '(选中)第二张牌旋转角度',
    value: "0.95"
  },
  _section2_card_2_delay: {
    type: 'number',
    label: '(选中)第二张牌延迟多久出现',
    value: 2
  }
};