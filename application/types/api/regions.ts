export type RegionItem = {
    code: string;
    displayName: string;
    sub: { code: string; displayName: string }[];
};

export type GetRegionsResponse = {
    success: boolean;
    data?: { items: RegionItem[] };
    error?: { code: string; message: string };
};
