export { kpiIndicators } from './indicators';
export { healthData } from './health';
export { educationData } from './education';
export { employmentData } from './employment';
export { infrastructureData } from './infrastructure';
export { technologyData } from './technology';
export { corruptionData } from './corruption';
export { institucionalData } from './institucional';

import { KPIDataPoint } from '@/types/corruption';
import { healthData } from './health';
import { educationData } from './education';
import { employmentData } from './employment';
import { infrastructureData } from './infrastructure';
import { technologyData } from './technology';
import { corruptionData } from './corruption';
import { institucionalData } from './institucional';

export const allKPIData: KPIDataPoint[] = [
  ...healthData,
  ...educationData,
  ...employmentData,
  ...infrastructureData,
  ...technologyData,
  ...corruptionData,
  ...institucionalData,
];
