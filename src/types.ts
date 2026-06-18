export type UserRole = 'admin' | 'engineer'

/* ---------------- ENGINEER PROFILE ---------------- */

export interface EngineerProfile {
  id: string
  userId: string
  pinSet: boolean

  gasSafeRegisterNumber: string
  engineerName: string
  gasSafeLicenceNumber: string

  businessName: string
  houseAddress: string
  area: string
  postCode: string
  contactNumber: string

  profileComplete: boolean
  createdAt?: string
  updatedAt?: string
}

/* ---------------- APPLIANCE ---------------- */

export type ApplianceType = 'HOB' | 'COOKER' | 'BOILER' | 'FIRE'

export interface Appliance {
  location: string
  type: ApplianceType
  flueType: string

  manufacturer: string
  model: string
  serialNumber: string

  ownedBy: 'YES' | 'NO'
  inspected: 'YES' | 'NO'

  /* Inspection section */
  operatingPressure?: string
  safetyDevice?: 'PASS' | 'FAIL' | 'NA'
  ventilation?: 'YES' | 'NO'
  visualFlueCondition?: 'PASS' | 'FAIL' | 'NA'
  flueOperationChecks?: 'PASS' | 'FAIL' | 'NA'
  combustionReading?: string
  applianceServiced?: 'YES' | 'NO' | 'NEW'

  coAlarmFitted?: 'YES' | 'NO' 
  coAlarmTested?: 'PASS' | 'FAIL' | 'NA'
  safeToUse?: 'YES' | 'NO'


  /* ---------------- STEP 6 ADDITIONS (NEW) ---------------- */

  // Safety / defects section (your Step 6 form)
  safetyDefect?: string
  giuspClassification?: string

  // Warning record (you called it serial-based)
  warningRecordSerial?: string

  // Remedial + work details
  remedialAction?: string
  workDetails?: string

  /* existing optional fields (keep as fallback compatibility) */
  defects?: string
  warningRecord?: string
  serialNoRef?: string
}

/* ---------------- CERTIFICATE ---------------- */

export interface CertificateData {
  certificateRef: string
  issueDate: string
  expiryDate: string

  siteName: string
  siteHouseAddress: string
  siteArea: string
  sitePostCode: string
  siteContactNumber: string

  landlordName: string
  landlordHouseAddress: string
  landlordArea: string
  landlordPostCode: string
  landlordContactNumber: string

  applianceCount: number
  appliances: Appliance[]

  /* Engineer snapshot */
  engineerName: string
  gasSafeRegisterNumber: string
  gasSafeLicenceNumber: string
  businessName: string
  houseAddress: string
  area: string
  postCode: string
  contactNumber: string

  /* Certificate extras */
  propertyAddress: string
  tenantName: string
  engineerId: string

  inspectionResult: string
  defectsFound: string
  remedialAction: string
  nextInspectionDate: string
  comments: string
  gasPipeworkVisual?: "PASS" | "FAIL" | "NA";
gasSupplyPipeworkVisual?: "PASS" | "FAIL" | "NA";
ecvAccess?: "PASS" | "FAIL" ;
tightnessTest?: "PASS" | "FAIL" | "NA";
equipotentialBonding?: "PASS" | "FAIL";
}

/* ---------------- EMPTY STATE ---------------- */

export const emptyCertificateData = (): CertificateData => {
  const issueDate = new Date().toISOString().split('T')[0]
  const expiryDateObj = new Date()
  expiryDateObj.setFullYear(expiryDateObj.getFullYear() + 1)
  const expiryDate = expiryDateObj.toISOString().split('T')[0]
  
  return {
    certificateRef: '',
    issueDate: issueDate,
    expiryDate: expiryDate,

    siteName: '',
    siteHouseAddress: '',
    siteArea: '',
    sitePostCode: '',
    siteContactNumber: '',

    landlordName: '',
    landlordHouseAddress: '',
    landlordArea: '',
    landlordPostCode: '',
    landlordContactNumber: '',

    applianceCount: 1,
    appliances: [
      {
        location: '',
        type: 'HOB',
        flueType: 'FL',

        manufacturer: '',
        model: '',
        serialNumber: '',

        ownedBy: 'YES',
        inspected: 'YES',

        operatingPressure: '',
        safetyDevice: 'PASS',
        ventilation: 'YES',
        visualFlueCondition: 'NA',
        flueOperationChecks: 'NA',
        combustionReading: 'NA',
        applianceServiced: 'YES',
        coAlarmFitted: 'YES',
        coAlarmTested: 'PASS',
        safeToUse: 'YES',
        safetyDefect: '',
        giuspClassification: '',
        warningRecordSerial: '',
        remedialAction: '',
        workDetails: '',
      },
    ],

    engineerName: '',
    gasSafeRegisterNumber: '',
    gasSafeLicenceNumber: '',
    businessName: '',
    houseAddress: '',
    area: '',
    postCode: '',
    contactNumber: '',

    propertyAddress: '',
    tenantName: '',
    engineerId: '',

    inspectionResult: 'Pass',
    defectsFound: '',
    remedialAction: '',
    nextInspectionDate: '',
    comments: '',
    gasPipeworkVisual: "PASS",
    gasSupplyPipeworkVisual: "PASS",
    ecvAccess: "PASS",
    tightnessTest: "PASS",
    equipotentialBonding: "PASS",
  }
}

/* ---------------- ENGINEER DEFAULT ---------------- */

export type EngineerFormData = Omit<
  EngineerProfile,
  'id' | 'userId' | 'pinSet' | 'profileComplete' | 'createdAt' | 'updatedAt'
>

export const emptyEngineerData = (): EngineerFormData => ({
  gasSafeRegisterNumber: '',
  engineerName: '',
  gasSafeLicenceNumber: '',
  businessName: '',
  houseAddress: '',
  area: '',
  postCode: '',
  contactNumber: '',
})

/* ---------------- ADMIN ---------------- */

export interface AdminEngineerFormData extends EngineerFormData {
  userId: string
}

export const emptyAdminEngineerData = (): AdminEngineerFormData => ({
  userId: '',
  ...emptyEngineerData(),
})

/* ---------------- AUTH ---------------- */

export interface AuthState {
  token: string
  role: UserRole
  username?: string
  engineer?: EngineerProfile
  needsProfile?: boolean
}

/* ---------------- SAVED CERT ---------------- */

export interface SavedCertificate {
  id: string
  engineerId: string
  certificateRef: string
  data: CertificateData
  createdAt: string
  updatedAt: string
}

/* ---------------- ENGINEER COPY ---------------- */

export function certificateFromEngineer(
  engineer: EngineerFormData,
  base: CertificateData = emptyCertificateData(),
): CertificateData {
  return {
    ...base,

    engineerName: engineer.engineerName,
    gasSafeRegisterNumber: engineer.gasSafeRegisterNumber,
    gasSafeLicenceNumber: engineer.gasSafeLicenceNumber,

    businessName: engineer.businessName,
    houseAddress: engineer.houseAddress,
    area: engineer.area,
    postCode: engineer.postCode,
    contactNumber: engineer.contactNumber,
  }
}

/* ---------------- FIELD POSITIONS ---------------- */

export interface FieldPosition {
  key: keyof CertificateData
  label: string
  x: number
  y: number
  width: number
  fontSize?: number
}