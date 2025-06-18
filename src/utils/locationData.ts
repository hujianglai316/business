export interface LocationOption {
  value: string;
  label: string;
  children?: LocationOption[];
}

export const guangzhouLocations: LocationOption[] = [
  {
    value: 'tianhe',
    label: '天河区',
    children: [
      { value: 'zhujiangxincheng', label: '珠江新城' },
      { value: 'gangding', label: '岗顶' },
      { value: 'tiyu', label: '体育中心' },
            ]
          },
          {
    value: 'yuexiu',
            label: '越秀区',
            children: [
      { value: 'beijinglu', label: '北京路' },
      { value: 'xiaobei', label: '小北' },
      { value: 'dongshan', label: '东山' },
            ]
          },
          {
    value: 'haizhu',
            label: '海珠区',
            children: [
      { value: 'pazhou', label: '琶洲' },
      { value: 'changshou', label: '长寿路' },
      { value: 'jiangnanxi', label: '江南西' },
    ]
  }
]; 