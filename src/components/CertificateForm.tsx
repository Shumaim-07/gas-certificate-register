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

const STEPS = ["Site Details", "Landlord", "Safety", "Appliances", "Inspection", "Defects", "Review"];

const SAFETY_FIELDS = [
  { key: "gasPipeworkVisual", label: "Gas installation pipework visual inspection" },
  { key: "gasSupplyPipeworkVisual", label: "Gas supply pipework visual inspection" },
  { key: "ecvAccess", label: "Emergency Control Valve access satisfactory?" },
  { key: "tightnessTest", label: "Gas tightness test outcome" },
  { key: "equipotentialBonding", label: "Protective Equipotential bonding satisfactory?" },
];

export function CertificateForm({ data, onChange, onPrint, saving }: CertificateFormProps) {
  const [step, setStep] = useState(1);

  const updateField = (key: keyof CertificateData, value: any) => {
    const updated: CertificateData = { ...data, [key]: value };
    const issueDate = key === "issueDate" ? value : updated.issueDate;
    const siteAddress = key === "siteHouseAddress" ? value : updated.siteHouseAddress;
    const sitePostCode = key === "sitePostCode" ? value : updated.sitePostCode;

    if (issueDate) {
      const next = new Date(issueDate);
      next.setFullYear(next.getFullYear() + 1);
      updated.expiryDate = next.toISOString().split("T")[0];
    }
    if (siteAddress && sitePostCode && issueDate) {
      updated.certificateRef = generateCertificateRef(siteAddress, sitePostCode, issueDate);
    }
    onChange(updated);
  };

 const updateAppliance = (index: number, field: keyof Appliance, value: any) => {
  const updatedAppliances = [...data.appliances];
  const appliance = { ...updatedAppliances[index], [field]: value };

  if (field === "type") {
    // Set flue type based on selection
    if (value === "HOB") {
      appliance.flueType = "FL";
      // Force NA for these fields
      appliance.visualFlueCondition = "NA";
      appliance.flueOperationChecks = "NA";
      appliance.combustionReading = "NA";
    } else {
      // For other types, set appropriate flue type
      appliance.flueType = flueMap[value] || "";
      // Only reset if they were NA (clear them so user can select)
      if (appliance.visualFlueCondition === "NA") appliance.visualFlueCondition = undefined;
      if (appliance.flueOperationChecks === "NA") appliance.flueOperationChecks = undefined;
      if (appliance.combustionReading === "NA") appliance.combustionReading = "";
    }
  }
  
  updatedAppliances[index] = appliance;
  onChange({ ...data, appliances: updatedAppliances });
};

  return (
    <div className="cf-wrap">
      {/* ── Step indicator ── */}
      <div className="cf-step-bar">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const state = n < step ? "done" : n === step ? "active" : "future";
          return (
            <div key={n} className={`cf-step cf-step--${state}`}>
              <div className="cf-step-dot">{state === "done" ? "✓" : n}</div>
              <span className="cf-step-label">{label}</span>
            </div>
          );
        })}
      </div>

      <div className="form-panel">

        {/* ── STEP 1: Site / Tenant ── */}
        {step === 1 && (
          <>
            <h2>Site / Tenant Details</h2>

            <div className="cf-field">
              <label>Tenant Name</label>
              <input
                placeholder="Full name of tenant"
                value={data.siteName}
                onChange={(e) => updateField("siteName", e.target.value)}
              />
            </div>

            <div className="cf-field">
              <label>House / Street Address</label>
              <input
                placeholder="Street address of the property"
                value={data.siteHouseAddress}
                onChange={(e) => updateField("siteHouseAddress", e.target.value)}
              />
            </div>

            <div className="cf-2col">
              <div className="cf-field">
                <label>Area / City</label>
                <input
                  placeholder="Town or city"
                  value={data.siteArea}
                  onChange={(e) => updateField("siteArea", e.target.value)}
                />
              </div>
              <div className="cf-field">
                <label>Post Code</label>
                <input
                  placeholder="e.g. SW1A 1AA"
                  value={data.sitePostCode}
                  onChange={(e) => updateField("sitePostCode", e.target.value)}
                />
              </div>
            </div>

            <div className="cf-field">
              <label>Contact Number</label>
              <input
                placeholder="Tenant's phone number"
                value={data.siteContactNumber}
                onChange={(e) => updateField("siteContactNumber", e.target.value)}
              />
            </div>

            <div className="cf-2col">
              <div className="cf-field">
                <label>Issue Date</label>
                <input
                  type="date"
                  value={data.issueDate}
                  onChange={(e) => updateField("issueDate", e.target.value)}
                />
              </div>
              <div className="cf-field">
                <label>Expiry Date (auto)</label>
                <input type="date" value={data.expiryDate} readOnly className="cf-readonly" />
              </div>
            </div>

            <div className="cf-nav">
              <button className="eng-btn-primary" onClick={() => setStep(2)}>Next →</button>
            </div>
          </>
        )}

        {/* ── STEP 2: Landlord ── */}
        {step === 2 && (
          <>
            <h2>Landlord Details</h2>

            <div className="cf-field">
              <label>Landlord Name</label>
              <input
                placeholder="Full name of landlord or homeowner"
                value={data.landlordName}
                onChange={(e) => updateField("landlordName", e.target.value)}
              />
            </div>

            <div className="cf-field">
              <label>House / Street Address</label>
              <input
                placeholder="Landlord's address"
                value={data.landlordHouseAddress}
                onChange={(e) => updateField("landlordHouseAddress", e.target.value)}
              />
            </div>

            <div className="cf-2col">
              <div className="cf-field">
                <label>Area / City</label>
                <input
                  placeholder="Town or city"
                  value={data.landlordArea}
                  onChange={(e) => updateField("landlordArea", e.target.value)}
                />
              </div>
              <div className="cf-field">
                <label>Post Code</label>
                <input
                  placeholder="e.g. SW1A 1AA"
                  value={data.landlordPostCode}
                  onChange={(e) => updateField("landlordPostCode", e.target.value)}
                />
              </div>
            </div>

            <div className="cf-field">
              <label>Contact Number</label>
              <input
                placeholder="Landlord's phone number"
                value={data.landlordContactNumber}
                onChange={(e) => updateField("landlordContactNumber", e.target.value)}
              />
            </div>

            <div className="cf-nav">
              <button className="eng-btn-ghost" onClick={() => setStep(1)}>← Back</button>
              <button className="eng-btn-primary" onClick={() => setStep(3)}>Next →</button>
            </div>
          </>
        )}

        {/* ── STEP 3: Safety checks + appliance count ── */}
        {step === 3 && (
          <>
            <h2>Safety Checks</h2>

            <div className="cf-field">
              <label>Number of Appliances</label>
              <select
                value={data.applianceCount}
                onChange={(e) => {
                  const count = Number(e.target.value);
                  const newAppliances = Array.from({ length: count }, (_, i) =>
                    data.appliances?.[i] || {
                      location: "", type: "HOB" as const, manufacturer: "", model: "",
                      serialNumber: "", ownedBy: "YES" as const, inspected: "YES" as const,
                      flueType: "FL",
                      operatingPressure: "",
                      safetyDevice: "PASS" as const,
                      ventilation: "YES" as const,
                      visualFlueCondition: "NA" as const,
                      flueOperationChecks: "NA" as const,
                      combustionReading: "NA",
                      applianceServiced: "YES" as const,
                      coAlarmFitted: "YES" as const,
                      coAlarmTested: "PASS" as const,
                      safeToUse: "YES" as const,
                      safetyDefect: "",
                      giuspClassification: "",
                      warningRecordSerial: "",
                      remedialAction: "",
                      workDetails: "",
                    }
                  );
                  onChange({ ...data, applianceCount: count, appliances: newAppliances });
                }}
              >
                <option value={1}>1 Appliance</option>
                <option value={2}>2 Appliances</option>
                <option value={3}>3 Appliances</option>
                <option value={4}>4 Appliances</option>
              </select>
            </div>

            <div className="appliance-card">
              <p className="appliance-card-title">Installation Safety Checks</p>
              {SAFETY_FIELDS.map((item) => (
                <div className="cf-field" key={item.key}>
                  <label>{item.label}</label>
                  <div className="tick-group">
                    {["PASS", "FAIL", "NA"].map((opt) => (
                      <label key={opt} className="tick-option">
                        <input
                          type="radio"
                          name={item.key}
                          value={opt}
                          checked={data[item.key as keyof CertificateData] === opt}
                          onChange={() => onChange({ ...data, [item.key]: opt })}
                        />
                        <span className={`tick-mark${data[item.key as keyof typeof data] === opt ? " tick-mark--active" : ""}`}>
                          {data[item.key as keyof typeof data] === opt ? "✔" : ""}
                        </span>
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="cf-nav">
              <button className="eng-btn-ghost" onClick={() => setStep(2)}>← Back</button>
              <button className="eng-btn-primary" onClick={() => setStep(4)}>Next →</button>
            </div>
          </>
        )}

        {/* ── STEP 4: Appliance details ── */}
        {step === 4 && (
          <>
            <h2>Appliance Details</h2>

            {(data.appliances || []).map((appliance, index) => (
              <div key={index} className="appliance-card">
                <p className="appliance-card-title">Appliance {index + 1}</p>

                <div className="cf-2col">
                  <div className="cf-field">
                    <label>Location</label>
                    <input
                      placeholder="e.g. Kitchen"
                      value={appliance.location}
                      onChange={(e) => updateAppliance(index, "location", e.target.value)}
                    />
                  </div>
                  <div className="cf-field">
                    <label>Type</label>
                    <select
                      value={appliance.type}
                      onChange={(e) => updateAppliance(index, "type", e.target.value)}
                    >
                      <option value="">Select Type</option>
                      <option value="HOB">HOB</option>
                      <option value="COOKER">COOKER</option>
                      <option value="BOILER">BOILER</option>
                      <option value="FIRE">FIRE</option>
                    </select>
                  </div>
                </div>

                <div className="cf-2col">
                  <div className="cf-field">
                    <label>Manufacturer</label>
                    <input
                      value={appliance.manufacturer}
                      onChange={(e) => updateAppliance(index, "manufacturer", e.target.value)}
                    />
                  </div>
                  <div className="cf-field">
                    <label>Model</label>
                    <input
                      value={appliance.model}
                      onChange={(e) => updateAppliance(index, "model", e.target.value)}
                    />
                  </div>
                </div>

                <div className="cf-2col">
                  <div className="cf-field">
                    <label>Serial Number</label>
                    <input
                      value={appliance.serialNumber}
                      onChange={(e) => updateAppliance(index, "serialNumber", e.target.value)}
                    />
                  </div>
                  <div className="cf-field">
                    <label>Flue Type (auto)</label>
                    <input value={appliance.flueType} readOnly className="cf-readonly" />
                  </div>
                </div>

                <div className="cf-2col">
                  <div className="cf-field">
                    <label>Owned by Landlord / Homeowner</label>
                    <select
                      value={appliance.ownedBy}
                      onChange={(e) => updateAppliance(index, "ownedBy", e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="YES">Yes</option>
                      <option value="NO">No</option>
                    </select>
                  </div>
                  <div className="cf-field">
                    <label>Inspected</label>
                    <select
                      value={appliance.inspected}
                      onChange={(e) => updateAppliance(index, "inspected", e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="YES">Yes</option>
                      <option value="NO">No</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <div className="cf-nav">
              <button className="eng-btn-ghost" onClick={() => setStep(3)}>← Back</button>
              <button className="eng-btn-primary" onClick={() => setStep(5)}>Next →</button>
            </div>
          </>
        )}

        {/* ── STEP 5: Inspection details ── */}
        {step === 5 && (
          <>
            <h2>Inspection Details</h2>

            {(data.appliances || []).map((appliance, index) => (
              <div key={index} className="appliance-card">
                <p className="appliance-card-title">Appliance {index + 1}</p>

                <div className="cf-field">
                  <label>Operating pressure (mbar / kW / Btu)</label>
                  <input
                    placeholder="e.g. 20 mbar"
                    value={appliance.operatingPressure || ""}
                    onChange={(e) => updateAppliance(index, "operatingPressure", e.target.value)}
                  />
                </div>

                <div className="cf-2col">
                  <div className="cf-field">
                    <label>Operation of safety device(s)</label>
                    <select
                      value={appliance.safetyDevice || ""}
                      onChange={(e) => updateAppliance(index, "safetyDevice", e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="PASS">PASS</option>
                      <option value="FAIL">FAIL</option>
                      <option value="NA">NA</option>
                    </select>
                  </div>
                  <div className="cf-field">
                    <label>Ventilation satisfactory</label>
                    <select
                      value={appliance.ventilation || ""}
                      onChange={(e) => updateAppliance(index, "ventilation", e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="YES">YES</option>
                      <option value="NO">NO</option>
                    </select>
                  </div>
                </div>

                <div className="cf-2col">
                  <div className="cf-field">
                    <label>Visual condition of flue &amp; termination</label>
                    <select
                      value={appliance.type === "HOB" ? "NA" : appliance.visualFlueCondition || ""}
                      disabled={appliance.type === "HOB"}
                      onChange={(e) => updateAppliance(index, "visualFlueCondition", e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="PASS">PASS</option>
                      <option value="FAIL">FAIL</option>
                      <option value="NA">NA</option>
                    </select>
                  </div>
                  <div className="cf-field">
                    <label>Flue operation checks</label>
                    <select
                      value={appliance.type === "HOB" ? "NA" : appliance.flueOperationChecks || ""}
                      disabled={appliance.type === "HOB"}
                      onChange={(e) => updateAppliance(index, "flueOperationChecks", e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="PASS">PASS</option>
                      <option value="FAIL">FAIL</option>
                      <option value="NA">NA</option>
                    </select>
                  </div>
                </div>

                <div className="cf-2col">
                  <div className="cf-field">
    <label>Combustion analyser reading</label>
    <input
      type="text"
      placeholder="Enter reading or select NA"
      value={appliance.type === "HOB" ? "NA" : appliance.combustionReading || ""}
      disabled={appliance.type === "HOB"}
      onChange={(e) => updateAppliance(index, "combustionReading", e.target.value)}
      list="combustion-readings"
    />
    <datalist id="combustion-readings">
      <option value="NA" />
      <option value="PASS" />
      <option value="FAIL" />
    </datalist>
  </div>
                  <div className="cf-field">
                    <label>Appliance Serviced</label>
                    <select
                      value={appliance.applianceServiced || ""}
                      onChange={(e) => updateAppliance(index, "applianceServiced", e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="YES">YES</option>
                      <option value="NO">NO</option>
                      <option value="NEW">NEW</option>
                    </select>
                  </div>
                </div>

                <div className="cf-2col">
                  <div className="cf-field">
                    <label>CO Alarm Fitted</label>
                    <select
                      value={appliance.coAlarmFitted || ""}
                      onChange={(e) => updateAppliance(index, "coAlarmFitted", e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="YES">YES</option>
                      <option value="NO">NO</option>
                    </select>
                  </div>
                  <div className="cf-field">
                    <label>CO Alarm Tested (if fitted)</label>
                    <select
                      value={appliance.coAlarmTested || ""}
                      onChange={(e) => updateAppliance(index, "coAlarmTested", e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="PASS">PASS</option>
                      <option value="FAIL">FAIL</option>
                      <option value="NA">NA</option>
                    </select>
                  </div>
                </div>

                <div className="cf-field">
                  <label>Safe to Use</label>
                  <select
                    value={appliance.safeToUse || ""}
                    onChange={(e) => updateAppliance(index, "safeToUse", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </div>
              </div>
            ))}

            <div className="cf-nav">
              <button className="eng-btn-ghost" onClick={() => setStep(4)}>← Back</button>
              <button className="eng-btn-primary" onClick={() => setStep(6)}>Next →</button>
            </div>
          </>
        )}

        {/* ── STEP 6: Defects & Remedial Actions ── */}
        {step === 6 && (
          <>
            <h2>Defects &amp; Remedial Actions</h2>

            {(data.appliances || []).map((appliance, index) => (
              <div key={index} className="appliance-card">
                <p className="appliance-card-title">Appliance {index + 1}</p>

                <div className="cf-field">
                  <label>Safety Related Defect(s) Identified</label>
                  <input
                    value={appliance.safetyDefect || ""}
                    onChange={(e) => updateAppliance(index, "safetyDefect", e.target.value)}
                  />
                </div>

                <div className="cf-2col">
                  <div className="cf-field">
                    <label>GIUSP Classification (Ar / ID / etc)</label>
                    <input
                      value={appliance.giuspClassification || ""}
                      onChange={(e) => updateAppliance(index, "giuspClassification", e.target.value)}
                    />
                  </div>
                  <div className="cf-field">
                    <label>Warning / Advisory Record (Serial No)</label>
                    <input
                      value={appliance.warningRecordSerial || ""}
                      onChange={(e) => updateAppliance(index, "warningRecordSerial", e.target.value)}
                    />
                  </div>
                </div>

                <div className="cf-field">
                  <label>Remedial Action Taken</label>
                  <input
                    value={appliance.remedialAction || ""}
                    onChange={(e) => updateAppliance(index, "remedialAction", e.target.value)}
                  />
                </div>

                <div className="cf-field">
                  <label>Details of Work Carried Out</label>
                  <textarea
                    rows={3}
                    value={appliance.workDetails || ""}
                    onChange={(e) => updateAppliance(index, "workDetails", e.target.value)}
                  />
                </div>
              </div>
            ))}

            <div className="cf-nav">
              <button className="eng-btn-ghost" onClick={() => setStep(5)}>← Back</button>
              <button className="eng-btn-primary" onClick={() => setStep(7)}>Review →</button>
            </div>
          </>
        )}

        {/* ── STEP 7: Review ── */}
        {step === 7 && (
          <div className="review-container">
            <h2>Review Certificate</h2>

            <div className="review-summary">
              <div><span>Reference</span><strong>{data.certificateRef || "—"}</strong></div>
              <div><span>Tenant</span><strong>{data.siteName || "—"}</strong></div>
              <div><span>Landlord</span><strong>{data.landlordName || "—"}</strong></div>
              <div><span>Appliances</span><strong>{data.applianceCount}</strong></div>
              <div><span>Issue Date</span><strong>{data.issueDate || "—"}</strong></div>
              <div><span>Expiry Date</span><strong>{data.expiryDate || "—"}</strong></div>
            </div>

            <h3 className="review-section-title">Appliance Details</h3>

            {(data.appliances || []).map((appliance, index) => (
              <div key={index} className="review-appliance">
                <p className="appliance-card-title">Appliance {index + 1} — {appliance.type}</p>

                <div className="review-grid">
                  <div><span>Location</span><strong>{appliance.location}</strong></div>
                  <div><span>Flue Type</span><strong>{appliance.flueType}</strong></div>
                  <div><span>Manufacturer</span><strong>{appliance.manufacturer}</strong></div>
                  <div><span>Model</span><strong>{appliance.model}</strong></div>
                  <div><span>Serial No.</span><strong>{appliance.serialNumber}</strong></div>
                  <div><span>Owned By Landlord</span><strong>{appliance.ownedBy}</strong></div>
                  <div><span>Inspected</span><strong>{appliance.inspected}</strong></div>
                  <div><span>Operating Pressure</span><strong>{appliance.operatingPressure}</strong></div>
                  <div><span>Safety Device</span><strong>{appliance.safetyDevice}</strong></div>
                  <div><span>Ventilation</span><strong>{appliance.ventilation}</strong></div>
                  <div><span>Flue Condition</span><strong>{appliance.visualFlueCondition}</strong></div>
                  <div><span>Flue Operation</span><strong>{appliance.flueOperationChecks}</strong></div>
                  <div><span>Combustion Reading</span><strong>{appliance.combustionReading}</strong></div>
                  <div><span>Serviced</span><strong>{appliance.applianceServiced}</strong></div>
                  <div><span>CO Alarm Fitted</span><strong>{appliance.coAlarmFitted}</strong></div>
                  <div><span>CO Alarm Tested</span><strong>{appliance.coAlarmTested}</strong></div>
                  <div><span>Safe to Use</span><strong>{appliance.safeToUse}</strong></div>
                  <div><span>Safety Defect</span><strong>{appliance.safetyDefect || "—"}</strong></div>
                  <div><span>GIUSP Classification</span><strong>{appliance.giuspClassification || "—"}</strong></div>
                  <div><span>Warning Record Serial</span><strong>{appliance.warningRecordSerial || "—"}</strong></div>
                  <div><span>Remedial Action</span><strong>{appliance.remedialAction || "—"}</strong></div>
                  <div><span>Work Details</span><strong>{appliance.workDetails || "—"}</strong></div>
                </div>
              </div>
            ))}

            <div className="cf-nav cf-nav--review">
              <button className="eng-btn-ghost" onClick={() => setStep(6)}>← Edit</button>
              <button className="eng-submit-btn" onClick={onPrint} disabled={saving}>
                {saving ? "Preparing…" : "Save & Issue Certificate"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
