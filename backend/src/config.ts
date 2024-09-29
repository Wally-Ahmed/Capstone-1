export const secretKey = process.env.SECRET_KEY || 'secretKey';
export const dbStr = process.env.DB_CONNECTION_STRING || 'postgresql://test:pass@localhost/restaurant_manager';
export const port = 3000

export const adminURL = process.env.adminURL || 'http://localhost:3001/';
export const employeeURL = process.env.employeeURL || 'http://localhost:3002/';
export const interfaceURL = process.env.interfaceURL || 'http://localhost:3003/';

export const oauth2SumUpClientId = process.env.interfaceSumUpClientId || 'cc_classic_uA3vhvwHPk8NtG2ls9TRIVnzle1FQ';
export const oauth2SumUpClientSecret = process.env.interfaceSumUpClientSecret || 'cc_sk_classic_L7cRgvBPx0x5MHxPDLX5fjP9wFk5Iv4uTbjbvX3uH14kPAmCdJ';