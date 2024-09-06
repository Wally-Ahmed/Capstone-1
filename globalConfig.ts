export const secretKey = process.env.SECRET_KEY || 'secretKey';
export const dbStr = process.env.DB_CONNECTION_STRING || 'postgresql://test:pass@localhost/restaurant_manager';


export const backendURL = process.env.backendURL || 'http://localhost:3000/';
export const adminURL = process.env.adminURL || 'http://localhost:3001/';
export const employeeURL = process.env.employeeURL || 'http://localhost:3002/';
export const interfaceURL = process.env.interfaceURL || 'http://localhost:3003/';

export const backendPort = 3000;