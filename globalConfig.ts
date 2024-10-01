export const secretKey = process.env.SECRET_KEY || 'secretKey';
export const dbStr = process.env.DB_CONNECTION_STRING || 'postgresql://test:pass@localhost/restaurant_manager';


export const backendURL = process.env.backendURL || process.env.NEXT_PUBLIC_backendURL || 'http://localhost:3000/';
export const adminURL = process.env.adminURL || process.env.NEXT_PUBLIC_adminURL || 'http://localhost:3001/';
export const employeeURL = process.env.employeeURL || process.env.NEXT_PUBLIC_employeeURL || 'http://localhost:3002/';
export const interfaceURL = process.env.interfaceURL || process.env.NEXT_PUBLIC_interfaceURL || 'http://localhost:3003/';

export const oauth2SumUpClientId = process.env.interfaceSumUpClientId || process.env.NEXT_PUBLIC_interfaceSumUpClientId || 'cc_classic_uA3vhvwHPk8NtG2ls9TRIVnzle1FQ';
export const oauth2SumUpClientSecret = process.env.interfaceSumUpClientSecret || process.env.NEXT_PUBLIC_interfaceSumUpClientSecret || 'cc_sk_classic_L7cRgvBPx0x5MHxPDLX5fjP9wFk5Iv4uTbjbvX3uH14kPAmCdJ';

export const backendPort = 3000;