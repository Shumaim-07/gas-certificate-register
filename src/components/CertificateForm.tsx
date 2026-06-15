import { useState } from "react";
import type { CertificateData, Appliance } from "../types";
import { generateCertificateRef } from "../utils/generateCertificateRef";

interface CertificateFormProps {
  data: CertificateData;
  onChange: (data: CertificateData) => void;
  onPrint: () => void;
  saving: boolean;
}

const flueMap: Record<string, string> = {
  HOB: "FL",
  BOILER: "RS",
  COOKER: "RS",
  FIRE: "OF",
};

export function CertificateForm({
  data,
  onChange,
  onPrint,
  saving,
}: CertificateFormProps) {
  const [step, setStep] = useState(1);

 const updateField = (key: keyof CertificateData, value: any) => {
  const updated: CertificateData = {
    ...data,
    [key]: value,
  };

  const issueDate = key === "issueDate" ? value : updated.issueDate;

  const siteAddress = key === "siteHouseAddress" ? value : updated.siteHouseAddress;

  const sitePostCode = key === "sitePostCode" ? value : updated.sitePostCode;

  // expiry (+1 year)
  if (issueDate) {
    const next = new Date(issueDate);
    next.setFullYear(next.getFullYear() + 1);
    updated.expiryDate = next.toISOString().split("T")[0];
  }

  // reference generation
  if (siteAddress && sitePostCode && issueDate) {
    updated.certificateRef = generateCertificateRef(
      siteAddress,
      sitePostCode,
      issueDate,
    );
  }

  

  onChange(updated);
};

 const updateAppliance = (
  index: number,
  field: keyof Appliance,
  value: any,
) => {
  const updatedAppliances = [...data.appliances];

  const appliance = {
    ...updatedAppliances[index],
    [field]: value,
  };

  // AUTO FLUE TYPE + HOB RULES
  if (field === "type") {
    appliance.flueType = flueMap[value] || "";

    // HOB appliances do not require these checks
    if (value === "HOB") {
      appliance.visualFlueCondition = "NA";
      appliance.flueOperationChecks = "NA";
      appliance.combustionReading = "NA";
    } else {
      // Clear auto values when changing away from HOB
      if (appliance.visualFlueCondition === "NA") {
        appliance.visualFlueCondition = undefined;
      }

      if (appliance.flueOperationChecks === "NA") {
        appliance.flueOperationChecks = undefined;
      }

      if (appliance.combustionReading === "NA") {
        appliance.combustionReading = undefined;
      }
    }
  }

  updatedAppliances[index] = appliance;

  onChange({
    ...data,
    appliances: updatedAppliances,
  });
};

  return (
    <div className="form-panel">
      {/* STEP 1 */}
      {step === 1 && (
        <>
          <h2>Site / Tenant Details</h2>

          <input
            placeholder="Tenant Name"
            value={data.siteName}
            onChange={(e) => updateField("siteName", e.target.value)}
          />

          <input
            placeholder="House Address"
            value={data.siteHouseAddress}
            onChange={(e) => updateField("siteHouseAddress", e.target.value)}
          />

          <input
            placeholder="Area / City"
            value={data.siteArea}
            onChange={(e) => updateField("siteArea", e.target.value)}
          />

          <input
            placeholder="Post Code"
            value={data.sitePostCode}
            onChange={(e) => updateField("sitePostCode", e.target.value)}
          />

          <input
            placeholder="Contact Number"
            value={data.siteContactNumber}
            onChange={(e) => updateField("siteContactNumber", e.target.value)}
          />

          <input
            type="date"
            value={data.issueDate}
            onChange={(e) => updateField("issueDate", e.target.value)}
          />

          <input type="date" value={data.expiryDate} readOnly />

          <button className="primary-btn" onClick={() => setStep(2)}>
            Next
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <h2>Landlord Details</h2>

          <input
            placeholder="Landlord Name"
            value={data.landlordName}
            onChange={(e) => updateField("landlordName", e.target.value)}
          />

          <input
            placeholder="House Address"
            value={data.landlordHouseAddress}
            onChange={(e) =>
              updateField("landlordHouseAddress", e.target.value)
            }
          />

          <input
            placeholder="Area / City"
            value={data.landlordArea}
            onChange={(e) => updateField("landlordArea", e.target.value)}
          />

          <input
            placeholder="Post Code"
            value={data.landlordPostCode}
            onChange={(e) => updateField("landlordPostCode", e.target.value)}
          />

          <input
            placeholder="Contact Number"
            value={data.landlordContactNumber}
            onChange={(e) =>
              updateField("landlordContactNumber", e.target.value)
            }
          />

          <button className="primary-btn" onClick={() => setStep(1)}>
            Back
          </button>
          <button className="primary-btn" onClick={() => setStep(3)}>
            Next
          </button>
        </>
      )}

      {/* STEP 3 */}
      {/* STEP 3 */}
{step === 3 && (
  <>
    <h2>Number Of Appliances</h2>

    <select
      value={data.applianceCount}
      onChange={(e) => {
        const count = Number(e.target.value);

        const newAppliances = Array.from(
          { length: count },
          (_, i) =>
            data.appliances?.[i] || {
  location: "",
  type: "HOB",
  manufacturer: "",
  model: "",
  serialNumber: "",
  ownedBy: "YES",
  inspected: "NO",
  flueType: "",

  gasPipeworkVisual: "PASS",
  gasSupplyPipeworkVisual: "PASS",
  ecvAccess: "PASS",
  tightnessTest: "PASS",
  equipotentialBonding: "PASS",
},
        );

        onChange({
          ...data,
          applianceCount: count,
          appliances: newAppliances,
        });
      }}
    >
      <option value={1}>1 Appliance</option>
      <option value={2}>2 Appliances</option>
      <option value={3}>3 Appliances</option>
      <option value={4}>4 Appliances</option>
    </select>

    {/* ✅ NEW CERTIFICATE SAFETY RADIO FIELDS */}
    <div className="appliance-card">

  {[
    {
      key: "gasPipeworkVisual",
      label: "Outcome of gas installation pipework visual inspection?",
    },
    {
      key: "gasSupplyPipeworkVisual",
      label: "Outcome of gas supply pipework visual inspection?",
    },
    {
      key: "ecvAccess",
      label: "Is the Emergency Control Valve access satisfactory?",
    },
    {
      key: "tightnessTest",
      label: "Outcome of gas tightness test?",
    },
    {
      key: "equipotentialBonding",
      label: "Is the Protective Equipotential bonding satisfactory?",
    },
  ].map((item) => (
    <div className="form-field" key={item.key}>
      <label>{item.label}</label>

      <div className="tick-group">
        {["PASS", "FAIL", "NA"].map((opt) => (
          <label key={opt} className="tick-option">
            <input
              type="radio"
              name={item.key}
              value={opt}
             checked={data[item.key as keyof CertificateData] === opt}
              onChange={() =>
                onChange({ ...data, [item.key]: opt })
              }
            />

            {/* ✔ tick mark */}
            <span className="tick-mark">
              {data[item.key as keyof typeof data] === opt ? "✔" : ""}
            </span>

            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  ))}
</div>

    <button className="primary-btn" onClick={() => setStep(2)}>
      Back
    </button>

    <button className="primary-btn" onClick={() => setStep(4)}>
      Next
    </button>
  </>
)}
      {/* STEP 4 */}
{step === 4 && (
  <>
    <h2>Appliance Details</h2>

    {(data.appliances || []).map((appliance, index) => (
      <div key={index} className="appliance-card">
        <h3>Appliance {index + 1}</h3>

        <div className="form-field">
          <label>Location</label>
          <input
            value={appliance.location}
            onChange={(e) =>
              updateAppliance(index, "location", e.target.value)
            }
          />
        </div>

        <div className="form-field">
          <label>Type</label>
          <select
            value={appliance.type}
            onChange={(e) =>
              updateAppliance(index, "type", e.target.value)
            }
          >
            <option value="">Select Type</option>
            <option value="HOB">HOB</option>
            <option value="COOKER">COOKER</option>
            <option value="BOILER">BOILER</option>
            <option value="FIRE">FIRE</option>
          </select>
        </div>

        <div className="form-field">
          <label>Manufacturer</label>
          <input
            value={appliance.manufacturer}
            onChange={(e) =>
              updateAppliance(index, "manufacturer", e.target.value)
            }
          />
        </div>

        <div className="form-field">
          <label>Model</label>
          <input
            value={appliance.model}
            onChange={(e) =>
              updateAppliance(index, "model", e.target.value)
            }
          />
        </div>

        <div className="form-field">
          <label>Serial Number</label>
          <input
            value={appliance.serialNumber}
            onChange={(e) =>
              updateAppliance(index, "serialNumber", e.target.value)
            }
          />
        </div>

        <div className="form-field">
          <label>Owned by Landlord/Homowner</label>
          <select
            value={appliance.ownedBy}
            onChange={(e) =>
              updateAppliance(index, "ownedBy", e.target.value)
            }
          >
            <option value="">Select</option>
            <option value="YES">Yes</option>
            <option value="NO">No</option>
          </select>
        </div>

        <div className="form-field">
          <label>Inspected</label>
          <select
            value={appliance.inspected}
            onChange={(e) =>
              updateAppliance(index, "inspected", e.target.value)
            }
          >
            <option value="">Select</option>
            <option value="YES">Yes</option>
            <option value="NO">No</option>
          </select>
        </div>

        <div className="form-field">
          <label>Flue Type</label>
          <input value={appliance.flueType} readOnly />
        </div>
      </div>
    ))}

    <button className="primary-btn" onClick={() => setStep(3)}>
      Back
    </button>

    <button className="primary-btn" onClick={() => setStep(5)}>
      Next
    </button>
  </>
)}

      {/* STEP 5 - INSPECTION DETAILS */}
      {step === 5 && (
        <>
          <h2>Inspection Details</h2>

          {(data.appliances || []).map((appliance, index) => (
            <div key={index} className="appliance-card">
              <h3>Appliance {index + 1}</h3>

              <div className="form-field">
                <label>
                  Operating pressure in mbar and/ or heat input kW/h or Btu/h
                  (mbar / kW / Btu)
                </label>
                <input
                  value={appliance.operatingPressure || ""}
                  onChange={(e) =>
                    updateAppliance(index, "operatingPressure", e.target.value)
                  }
                />
              </div>

              <div className="form-field">
                <label>Operation
of safety
device(s) (Pass / Fail / NA)</label>
                <select
                  value={appliance.safetyDevice || ""}
                  onChange={(e) =>
                    updateAppliance(index, "safetyDevice", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="PASS">PASS</option>
                  <option value="FAIL">FAIL</option>
                  <option value="NA">NA</option>
                </select>
              </div>

              <div className="form-field">
                <label>Ventilation
satisfactory
Yes/No</label>
                <select
                  value={appliance.ventilation || ""}
                  onChange={(e) =>
                    updateAppliance(index, "ventilation", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="YES">YES</option>
                  <option value="NO">NO</option>
                </select>
              </div>

              <div className="form-field">
                <label>Visual Condition
of flue and
termination
(Pass/Fail/NA)</label>
                <select
 value={appliance.type === "HOB" ? "NA" : appliance.visualFlueCondition || ""}
  disabled={appliance.type === "HOB"}
  onChange={(e) =>
    updateAppliance(
      index,
      "visualFlueCondition",
      e.target.value,
    )
  }
>
  <option value="">Select</option>
  <option value="PASS">PASS</option>
  <option value="FAIL">FAIL</option>
  <option value="NA">NA</option>
</select>
              </div>

              <div className="form-field">
                <label>Flue operation
checks (PASS / FAIL / NA)</label>
                <select
  value={appliance.type === "HOB" ? "NA" : appliance.flueOperationChecks || ""}
  disabled={appliance.type === "HOB"}
  onChange={(e) =>
    updateAppliance(
      index,
      "flueOperationChecks",
      e.target.value,
    )
  }
>
  <option value="">Select</option>
  <option value="PASS">PASS</option>
  <option value="FAIL">FAIL</option>
  <option value="NA">NA</option>
</select>
              </div>

              <div className="form-field">
                <label>Combustion
analyser Reading (if applicable)</label>
                <select
  value={appliance.type === "HOB" ? "NA" : appliance.combustionReading || ""}
  disabled={appliance.type === "HOB"}
  onChange={(e) =>
    updateAppliance(
      index,
      "combustionReading",
      e.target.value,
    )
  }
>
  <option value="">Select</option>
  <option value="PASS">PASS</option>
  <option value="FAIL">FAIL</option>
  <option value="NA">NA</option>
</select>
              </div>

              <div className="form-field">
                <label>Appliance Serviced</label>
                <select
                  value={appliance.applianceServiced || ""}
                  onChange={(e) =>
                    updateAppliance(index, "applianceServiced", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="YES">YES</option>
                  <option value="NO">NO</option>
                  <option value="NEW">NEW</option>
                </select>
              </div>

              <div className="form-field">
                <label>CO Alarm Fitted</label>
                <select
                  value={appliance.coAlarmFitted || ""}
                  onChange={(e) =>
                    updateAppliance(index, "coAlarmFitted", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="YES">YES</option>
                  <option value="NO">NO</option>
                </select>
              </div>

              <div className="form-field">
                <label>CO Alarm Tested (if fitted)</label>
                <select
                  value={appliance.coAlarmTested || ""}
                  onChange={(e) =>
                    updateAppliance(index, "coAlarmTested", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="PASS">PASS</option>
                  <option value="FAIL">FAIL</option>
                  <option value="NA">NA</option>
                </select>
              </div>

              <div className="form-field">
                <label>SAFE TO USE</label>
                <select
                  value={appliance.safeToUse || ""}
                  onChange={(e) =>
                    updateAppliance(index, "safeToUse", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="YES">YES</option>
                  <option value="NO">NO</option>
                </select>
              </div>
            </div>
          ))}

          <button className="primary-btn" onClick={() => setStep(4)}>
            Back
          </button>

          <button className="primary-btn" onClick={() => setStep(6)}>
            Next
          </button>
        </>
      )}
      {step === 6 && (
  <>
    <h2>Safety / Defects & Remedial Actions</h2>

    {(data.appliances || []).map((appliance, index) => (
      <div key={index} className="appliance-card">
        <h3>Appliance {index + 1}</h3>

        {/* Safety Defect */}
        <div className="form-field">
          <label>Safety Related Defect(s) Identified</label>
          <input
            value={appliance.safetyDefect || ""}
            onChange={(e) =>
              updateAppliance(index, "safetyDefect", e.target.value)
            }
          />
        </div>

        {/* GIUSP */}
        <div className="form-field">
          <label>GIUSP Classification (Ar / ID / etc)</label>
          <input
            value={appliance.giuspClassification || ""}
            onChange={(e) =>
              updateAppliance(index, "giuspClassification", e.target.value)
            }
          />
        </div>

        {/* Warning Record */}
        <div className="form-field">
          <label>Warning / Advisory Record (Serial No)</label>
          <input
            value={appliance.warningRecordSerial || ""}
            onChange={(e) =>
              updateAppliance(index, "warningRecordSerial", e.target.value)
            }
          />
        </div>

        {/* Remedial Action */}
        <div className="form-field">
          <label>Remedial Action Taken</label>
          <input
            value={appliance.remedialAction || ""}
            onChange={(e) =>
              updateAppliance(index, "remedialAction", e.target.value)
            }
          />
        </div>

        {/* Work Details */}
        <div className="form-field">
          <label>Details of Work Carried Out</label>
          <textarea
            value={appliance.workDetails || ""}
            onChange={(e) =>
              updateAppliance(index, "workDetails", e.target.value)
            }
          />
        </div>
      </div>
    ))}

    <button className="primary-btn" onClick={() => setStep(5)}>
      Back
    </button>

    <button className="primary-btn" onClick={() => setStep(7)}>
      Review
    </button>
  </>
)}
    {step === 7 && (
  <div className="review-container">

    <h2>Review Certificate</h2>

    {/* SUMMARY */}
    <div className="review-summary">
      <p><strong>Reference:</strong> {data.certificateRef}</p>
      <p><strong>Tenant:</strong> {data.siteName}</p>
      <p><strong>Landlord:</strong> {data.landlordName}</p>
      <p><strong>Total Appliances:</strong> {data.applianceCount}</p>
    </div>

    {/* APPLIANCES */}
    <h3>Appliance Details</h3>

    {(data.appliances || []).map((appliance, index) => (
      <div key={index} className="review-appliance">

        <h4>Appliance {index + 1}</h4>

        {/* BASIC INFO */}
        <div className="review-section">
          <p><strong>Location:</strong> {appliance.location}</p>
          <p><strong>Type:</strong> {appliance.type}</p>
          <p><strong>Flue Type:</strong> {appliance.flueType}</p>
        </div>

        <div className="review-section">
          <p><strong>Manufacturer:</strong> {appliance.manufacturer}</p>
          <p><strong>Model:</strong> {appliance.model}</p>
          <p><strong>Serial Number:</strong> {appliance.serialNumber}</p>
        </div>

        <div className="review-section">
          <p><strong>Owned By:</strong> {appliance.ownedBy}</p>
          <p><strong>Inspected:</strong> {appliance.inspected}</p>
        </div>

        {/* INSPECTION */}
        <div className="review-section">
          <p><strong>Operating Pressure:</strong> {appliance.operatingPressure}</p>
          <p><strong>Safety Device:</strong> {appliance.safetyDevice}</p>
          <p><strong>Ventilation:</strong> {appliance.ventilation}</p>
        </div>

        <div className="review-section">
          <p><strong>Flue Condition:</strong> {appliance.visualFlueCondition}</p>
          <p><strong>Flue Operation:</strong> {appliance.flueOperationChecks}</p>
          <p><strong>Combustion Reading:</strong> {appliance.combustionReading}</p>
        </div>

        <div className="review-section">
          <p><strong>Serviced:</strong> {appliance.applianceServiced}</p>
          <p><strong>CO Alarm Fitted:</strong> {appliance.coAlarmFitted}</p>
          <p><strong>CO Alarm Tested:</strong> {appliance.coAlarmTested}</p>
        </div>

        <div className="review-section">
          <p><strong>Safe To Use:</strong> {appliance.safeToUse}</p>
        </div>

        {/* SAFETY */}
        <div className="review-section">
          <p><strong>Safety Defect:</strong> {appliance.safetyDefect}</p>
          <p><strong>GIUSP Classification:</strong> {appliance.giuspClassification}</p>
          <p><strong>Warning Serial:</strong> {appliance.warningRecordSerial}</p>
        </div>

        <div className="review-section">
          <p><strong>Remedial Action:</strong> {appliance.remedialAction}</p>
          <p><strong>Work Details:</strong> {appliance.workDetails}</p>
        </div>

      </div>
    ))}

    {/* BUTTONS (UNCHANGED) */}
    <button className="primary-btn" onClick={() => setStep(6)}>
      Back
    </button>

    <button className="save-btn" onClick={onPrint} disabled={saving}>
      {saving ? "Preparing..." : "Save & Print"}
    </button>

  </div>
)}
    </div>
  );
}
