export const secretKey = process.env.SECRET_KEY || 'secretKey';
export const dbStr = process.env.DB_CONNECTION_STRING || 'postgresql://test:pass@localhost/restaurant_manager';


export const backendURL = process.env.backendURL || process.env.NEXT_PUBLIC_backendURL || 'http://localhost:3000/';
export const adminURL = process.env.adminURL || process.env.NEXT_PUBLIC_adminURL || 'http://localhost:3001/';
export const employeeURL = process.env.employeeURL || process.env.NEXT_PUBLIC_employeeURL || 'http://localhost:3002/';
export const interfaceURL = process.env.interfaceURL || process.env.NEXT_PUBLIC_interfaceURL || 'http://localhost:3003/';

export const oauth2SumUpClientId = process.env.interfaceSumUpClientId || process.env.NEXT_PUBLIC_interfaceSumUpClientId;
export const oauth2SumUpClientSecret = process.env.interfaceSumUpClientSecret;

export const backendPort = 3000;