import { GetRegionsResponse } from '@/application/types/api/regions';

import { FETCH } from '@/hbw/api/fetch';

export const GetRegions = () => FETCH<GetRegionsResponse>('/api/regions');
