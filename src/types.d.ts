declare module '*.tsx' {
  import React from 'react';
  const Component: React.ComponentType<any>;
  export default Component;
}

declare module '*.ts' {
  const content: any;
  export default content;
}

// 修复 NodeJS.Timeout 类型问题
declare global {
  namespace NodeJS {
    interface Timeout extends ReturnType<typeof setTimeout> {}
  }
}

// 声明特定模块
declare module './pages/PromotionCenter' {
  import React from 'react';
  const PromotionCenter: React.ComponentType<any>;
  export default PromotionCenter;
}

declare module './pages/PromotionCenter/CampaignCreator' {
  import React from 'react';
  const CampaignCreator: React.ComponentType<any>;
  export default CampaignCreator;
}

declare module './pages/PromotionCenter/CampaignDetail' {
  import React from 'react';
  const CampaignDetail: React.ComponentType<any>;
  export default CampaignDetail;
}

declare module './pages/PromotionCenter/CampaignAnalytics' {
  import React from 'react';
  const CampaignAnalytics: React.ComponentType<any>;
  export default CampaignAnalytics;
} 