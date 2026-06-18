import type { CertificateData, FieldPosition} from './types'

export const formFields: { key: keyof CertificateData; label: string; type?: string; multiline?: boolean }[] = [
  { key: 'certificateRef', label: 'Certificate Reference' },
  { key: 'issueDate', label: 'Issue Date', type: 'date' },

  { key: 'landlordName', label: 'Landlord / Agent Name' },
  { key: 'propertyAddress', label: 'Property Address', multiline: true },
  { key: 'tenantName', label: 'Tenant / Occupier' },

  { key: 'engineerName', label: 'Engineer Name' },
  { key: 'engineerId', label: 'Engineer ID / Registration' },

  { key: 'businessName', label: 'Business Name' },
  { key: 'houseAddress', label: 'House / Street Address', multiline: true },
  { key: 'area', label: 'Area / City', multiline: true },
  { key: 'postCode', label: 'Post Code' },

  { key: 'gasSafeRegisterNumber', label: 'Gas Safe Register Number' },
  { key: 'gasSafeLicenceNumber', label: 'Gas Safe Licence Number' },
  { key: 'contactNumber', label: 'Contact Number' },

  { key: 'certificateRef', label: 'Certificate Reference' },
  { key: 'issueDate', label: 'Issue Date', type: 'date' },

  { key: 'siteName', label: 'Site Name' },
  { key: 'siteHouseAddress', label: 'Site Address', multiline: true },
  { key: 'siteArea', label: 'Area / City' },
  { key: 'sitePostCode', label: 'Post Code' },
  { key: 'siteContactNumber', label: 'Contact Number' },

  { key: 'landlordName', label: 'Landlord Name' },
  { key: 'landlordHouseAddress', label: 'Landlord Address', multiline: true },
  { key: 'landlordArea', label: 'Area / City' },
  { key: 'landlordPostCode', label: 'Post Code' },
  { key: 'landlordContactNumber', label: 'Contact Number' },

  { key: 'applianceCount', label: 'Appliance Count' },
]

export const fieldPositions: FieldPosition[] = [
  {
    key: 'certificateRef',
    label: 'Certificate Ref',
    x: 1.1,
    y: 6,
    width: 10,
  },

  {
    key: 'issueDate',
    label: 'Issue Date',
    x: 70,
    y: 94,
    width: 20,
  },
{
    key: 'expiryDate', 
    label: 'Expiry Date',
    x: 90,            
    y: 93,              
    width: 20,
    fontSize: 9,
  },
  {
    key: 'engineerName',
    label: 'Engineer Name',
    x: 18,
    y: 19.8,
    width: 30,
  },
  {
    key: 'engineerName',
    label: 'Engineer Name',
    x: 60,
    y: 88.7,
    width: 30,
  },

  {
    key: 'gasSafeRegisterNumber',
    label: 'Gas Safe Register',
    x: 16,
    y: 17,
    width: 30,
  },

  {
    key: 'gasSafeLicenceNumber',
    label: 'Licence Number',
    x: 22,
    y: 22.4,
    width: 30,
  },

  {
    key: 'contactNumber',
    label: 'Contact',
    x: 12,
    y: 35.4,
    width: 30,
  },
 {
  key: 'businessName',
  label: 'Business Name',
  x: 10,
  y: 25,
  width: 40,
},
{
    key: 'engineerSignature',    // ← Must match the key in certificatePdf.ts
    label: 'Signature',
    x: 66,              // ← X position (percentage from left)
    y: 86,            // ← Y position (percentage from top)
    width: 12,          // ← Width (percentage of page)
    fontSize: 9,        // ← Not used for image, but required
  },

{
  key: 'houseAddress',
  label: 'House / Street Address',
  x: 10,
  y: 27.5,
  width: 40,
},

{
  key: 'area',
  label: 'Area / City',
  x: 10,
  y: 30,
  width: 40,
},

{
  key: 'postCode',
  label: 'Post Code',
  x: 10,
  y: 32.5,
  width: 15,
},
//site details
{
  key: 'siteName',
  label: 'Site Name',
  x: 15.5,
  y: 42,
  width: 40,
},
{
  key: 'siteHouseAddress',
  label: 'Site Address',
  x: 10,
  y: 44.5,
  width: 40,
},
{
  key: 'siteArea',
  label: 'Area / City',
  x: 10,
  y: 46.8,
  width: 40,
},
{
  key: 'sitePostCode',
  label: 'Post Code',
  x: 10,
  y: 53.6,
  width: 20,
},
{
  key: 'siteContactNumber',
  label: 'Contact Number',
  x: 10,
  y: 56,
  width: 30,
},
{
  key: 'landlordName',
  label: 'Landlord Name',
  x: 15.5,
  y: 63,
  width: 40,
},
{
  key: 'landlordHouseAddress',
  label: 'Landlord Address',
  x: 10,
  y: 65.5,
  width: 40,
},
{
  key: 'landlordArea',
  label: 'Area / City',
  x: 10,
  y: 67.7,
  width: 40,
},
{
  key: 'landlordPostCode',
  label: 'Post Code',
  x: 10,
  y: 72.3,
  width: 20,
},
{
  key: 'landlordContactNumber',
  label: 'Contact Number',
  x: 10,
  y: 74.5,
  width: 30,
},
{
    key: 'applianceCount',  
    label: 'Appliance Count',
    x: 20,                 
    y: 79.5,               
    width: 10,
    fontSize: 9,
  },
]
export const inspectionTickPositions = {
  gasPipeworkVisual: {
    PASS: { x: 32, y: 86 },
    FAIL: { x: 35, y: 86 },
    NA: { x: 38, y: 86  },
  },

  gasSupplyPipeworkVisual: {
    PASS: { x: 32, y: 88.5 },
    FAIL: { x: 35, y: 88.5 },
    NA: { x: 38, y: 88.5 },
  },

  ecvAccess: {
    PASS: { x: 34, y: 90.5 },
    FAIL: { x: 35, y: 90.5 },
    NA: { x: 38, y: 90.5 },
  },

  tightnessTest: {
    PASS: { x: 32, y:92.5  },
    FAIL: { x: 35, y: 92.5 },
    NA: { x: 38, y: 92.5 },
  },

  equipotentialBonding: {
    PASS: { x: 34, y: 94.5 },
    FAIL: { x: 35, y: 94.5 },
    NA: { x: 38, y: 94.5 },
  },
}
export const appliancePositions = [
  {
    location: { x: 36.8, y: 21, width: 30, fontSize: 9},
    type: { x: 46.3, y: 21, width: 30, fontSize: 9 },
    manufacturer: { x: 54, y: 21, width: 30, fontSize: 9 },
    model: { x: 63.7, y: 21, width: 30, fontSize: 9 },
    serialNumber: { x: 73.5, y: 21, width: 30, fontSize: 9 },
    ownedBy: { x: 85, y: 21, width: 30, fontSize: 9 },
    inspected: { x: 90, y: 21, width: 30, fontSize: 9 },
    flueType: { x: 95, y: 21, width: 30, fontSize: 9 },
    operatingPressure: { x: 36.8, y: 41, width: 30, fontSize: 9 },
    safetyDevice: { x: 44, y: 41, width: 30, fontSize: 9 },
    ventilation: { x: 50, y: 41, width: 30, fontSize: 9 },
    visualFlueCondition: { x: 56, y: 41, width: 30, fontSize: 9 },
    flueOperationChecks: { x: 63, y: 41, width: 30, fontSize: 9 },
    combustionReading: { x: 70, y: 41, width: 30, fontSize: 9 },
    applianceServiced: { x: 77, y: 41, width: 30, fontSize: 9 },
    coAlarmFitted: { x: 82, y: 41, width: 30, fontSize: 9 },
    coAlarmTested: { x: 87.3, y: 41, width: 30, fontSize: 9 },
    safeToUse: { x: 94, y: 41, width: 30, fontSize: 9 },

    safetyDefect: { x: 36.8, y: 54.3, width: 30, fontSize: 9 },
    giuspClassification: { x: 78, y: 54.3, width: 30, fontSize: 9 },
    warningRecordSerial: { x: 87.5, y: 54.3, width: 30, fontSize: 9 },
    remedialAction: { x: 36.8, y: 64.5, width: 40, fontSize: 9 },
    workDetails: { x: 36.8, y: 74.6, width: 30, fontSize: 9 },
  },
  {
    location: { x: 36.8, y: 23, width: 30, fontSize: 9},
    type: { x: 46.3, y: 23, width: 30, fontSize: 9 },
    manufacturer: { x: 54, y: 23, width: 30, fontSize: 9 },
    model: { x: 63.7, y: 23, width: 30, fontSize: 9 },
    serialNumber: { x: 73.5, y: 23, width: 30, fontSize: 9 },
    ownedBy: { x: 85, y: 23, width: 30, fontSize: 9 },
    inspected: { x: 90, y: 23, width: 30, fontSize: 9 },
    flueType: { x: 95, y: 23, width: 30, fontSize: 9 },
    operatingPressure: { x: 36.8, y: 43.5, width: 30, fontSize: 9 },
    safetyDevice: { x: 44, y: 43.5, width: 30, fontSize: 9 },
    ventilation: { x: 50, y: 43.5, width: 30, fontSize: 9 },
    visualFlueCondition: { x: 56, y: 43.5, width: 30, fontSize: 9 },
    flueOperationChecks: { x: 63, y: 43.5, width: 30, fontSize: 9 },
    combustionReading: { x: 70, y: 43.5, width: 30, fontSize: 9 },
    applianceServiced: { x: 77, y: 43.5, width: 30, fontSize: 9 },
    coAlarmFitted: { x: 82, y: 43.5, width: 30, fontSize: 9 },
    coAlarmTested: { x: 87.3, y: 43.5, width: 30, fontSize: 9 },
    safeToUse: { x: 94, y: 43.5, width: 30, fontSize: 9 },

    safetyDefect: { x: 36.8, y: 56.3, width: 30, fontSize: 9 },
    giuspClassification: { x: 78, y: 56.3, width: 30, fontSize: 9 },
    warningRecordSerial: { x: 87.5, y: 56.3, width: 30, fontSize: 9 },
    remedialAction: { x: 36.8, y: 66.5, width: 40, fontSize: 9 },
    workDetails: { x: 36.8, y: 76.6, width: 30, fontSize: 9, },
  },
  {
    location: { x: 36.8, y: 25, width: 30, fontSize: 9},
    type: { x: 46.3, y: 25, width: 30, fontSize: 9 },
    manufacturer: { x: 54, y: 25, width: 30, fontSize: 9 },
    model: { x: 63.7, y: 25, width: 30, fontSize: 9 },
    serialNumber: { x: 73.5, y: 25, width: 30, fontSize: 9 },
    ownedBy: { x: 85, y: 25, width: 30, fontSize: 9 },
    inspected: { x: 90, y: 25, width: 30, fontSize: 9 },
    flueType: { x: 95, y: 25, width: 30, fontSize: 9 },
    operatingPressure: { x: 36.8, y: 45.5, width: 30, fontSize: 9 },
    safetyDevice: { x: 44, y: 45.5, width: 30, fontSize: 9 },
    ventilation: { x: 50, y: 45.5, width: 30, fontSize: 9 },
    visualFlueCondition: { x: 56, y: 45.5, width: 30, fontSize: 9 },
    flueOperationChecks: { x: 63, y: 45.5, width: 30, fontSize: 9 },
    combustionReading: { x: 70, y: 45.5, width: 30, fontSize: 9 },
    applianceServiced: { x: 77, y: 45.5, width: 30, fontSize: 9 },
    coAlarmFitted: { x: 82, y: 45.5, width: 30, fontSize: 9 },
    coAlarmTested: { x: 87.3, y: 45.5, width: 30, fontSize: 9 },
    safeToUse: { x: 94, y: 45.5, width: 30, fontSize: 9 },

    safetyDefect: { x: 36.8, y: 58.4, width: 30, fontSize: 9 },
    giuspClassification: { x: 78, y: 58.4, width: 30, fontSize: 9 },
    warningRecordSerial: { x: 87.5, y: 58.4, width: 30, fontSize: 9 },
    remedialAction: { x: 36.8, y: 68.5, width: 30, fontSize: 9 },
    workDetails: { x: 36.8, y: 78.6, width: 30, fontSize: 9 },
  },
  {
    location: { x: 36.8, y: 27, width: 30, fontSize: 9},
    type: { x: 46.3, y: 27, width: 30, fontSize: 9 },
    manufacturer: { x: 54, y: 27, width: 30, fontSize: 9 },
    model: { x: 63.7, y: 27, width: 30, fontSize: 9 },
    serialNumber: { x: 73.5, y: 27, width: 30, fontSize: 9 },
    ownedBy: { x: 85, y: 27, width: 30, fontSize: 9 },
    inspected: { x: 90, y: 27, width: 30, fontSize: 9 },
    flueType: { x: 95, y: 27, width: 30, fontSize: 9 },
    operatingPressure: { x: 36.8, y: 47.8, width: 30, fontSize: 9 },
    safetyDevice: { x: 44, y: 47.8, width: 30, fontSize: 9 },
    ventilation: { x: 50, y: 47.8, width: 30, fontSize: 9 },
    visualFlueCondition: { x: 56, y: 47.8, width: 30, fontSize: 9 },
    flueOperationChecks: { x: 63, y: 47.8, width: 30, fontSize: 9 },
    combustionReading: { x: 70, y: 47.8, width: 30, fontSize: 9 },
    applianceServiced: { x: 77, y: 47.8, width: 30, fontSize: 9 },
    coAlarmFitted: { x: 82, y: 47.8, width: 30, fontSize: 9 },
    coAlarmTested: { x: 87.3, y: 47.8, width: 30, fontSize: 9 },
    safeToUse: { x: 94, y: 47.8, width: 30, fontSize: 9 },

    safetyDefect: { x: 36.8, y: 60.3, width: 30, fontSize: 9 },
    giuspClassification: { x: 78, y: 60.3, width: 30, fontSize: 9 },
    warningRecordSerial: { x: 87.5, y: 60.3, width: 30, fontSize: 9 },
    remedialAction: { x: 36.8, y: 70.5, width: 30, fontSize: 9 },
    workDetails: { x: 36.8, y: 80.6, width: 30, fontSize: 9},
  },
]
