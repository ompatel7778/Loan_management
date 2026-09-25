import metadata from '../data/modelMetadata.json';

export function runClientInference(inputData) {
  const { features, intercept, coefficients, metrics } = metadata;
  
  const row = {};
  features.forEach(f => { row[f] = 0.0; });

  row['Age'] = parseFloat(inputData.Age ?? 35);
  row['Income'] = parseFloat(inputData.Income ?? 65000);
  row['LoanAmount'] = parseFloat(inputData.LoanAmount ?? 50000);
  row['CreditScore'] = parseFloat(inputData.CreditScore ?? 680);
  row['MonthsEmployed'] = parseFloat(inputData.MonthsEmployed ?? 36);
  row['NumCreditLines'] = parseFloat(inputData.NumCreditLines ?? 2);
  row['InterestRate'] = parseFloat(inputData.InterestRate ?? 8.5);
  row['LoanTerm'] = parseFloat(inputData.LoanTerm ?? 36);
  row['DTIRatio'] = parseFloat(inputData.DTIRatio ?? 0.35);

  ['HasMortgage', 'HasDependents', 'HasCoSigner'].forEach(b => {
    const val = inputData[b];
    row[b] = (val === 1 || String(val).toLowerCase() === 'yes' || String(val) === '1' || val === true) ? 1.0 : 0.0;
  });

  const edu = inputData.Education || "Bachelor's";
  if (row[`Education_${edu}`] !== undefined) row[`Education_${edu}`] = 1.0;

  const emp = inputData.EmploymentType || 'Full-time';
  if (row[`EmploymentType_${emp}`] !== undefined) row[`EmploymentType_${emp}`] = 1.0;

  const mar = inputData.MaritalStatus || 'Single';
  if (row[`MaritalStatus_${mar}`] !== undefined) row[`MaritalStatus_${mar}`] = 1.0;

  const purp = inputData.LoanPurpose || 'Auto';
  if (row[`LoanPurpose_${purp}`] !== undefined) row[`LoanPurpose_${purp}`] = 1.0;

  let z = intercept;
  const contributions = [];

  coefficients.forEach(c => {
    const rawVal = row[c.feature] ?? 0.0;
    const scaledVal = c.scale !== 0 ? (rawVal - c.mean) / c.scale : 0.0;
    const impact = c.coefficient * scaledVal;
    z += impact;

    contributions.push({
      feature: c.feature,
      raw_value: rawVal,
      scaled_value: scaledVal,
      coefficient: c.coefficient,
      impact: impact,
      direction: impact > 0 ? 'increases_risk' : 'decreases_risk'
    });
  });

  const probDefault = 1.0 / (1.0 + Math.exp(-z));
  const prediction = probDefault >= 0.5 ? 1 : 0;

  contributions.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

  let riskTier = 'Low Risk (Prime)';
  let decision = 'Recommended for Immediate Approval';
  let badgeColor = 'emerald';

  if (probDefault >= 0.50) {
    riskTier = 'High Risk (Subprime)';
    decision = 'High Default Risk - Decline or Require Additional Collateral';
    badgeColor = 'rose';
  } else if (probDefault >= 0.20) {
    riskTier = 'Moderate Risk';
    decision = 'Conditional Approval / Manual Underwriting Review';
    badgeColor = 'amber';
  }

  const loanAmount = parseFloat(inputData.LoanAmount ?? 50000);
  const rateAnnual = parseFloat(inputData.InterestRate ?? 8.5);
  const termMonths = parseInt(inputData.LoanTerm ?? 36);

  const r = (rateAnnual / 100.0) / 12.0;
  let emi = 0;
  if (r > 0 && termMonths > 0) {
    emi = (loanAmount * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1);
  } else {
    emi = loanAmount / Math.max(1, termMonths);
  }

  const monthlyIncome = parseFloat(inputData.Income ?? 65000) / 12.0;
  const emiToIncomeRatio = monthlyIncome > 0 ? (emi / monthlyIncome) : 1.0;

  return {
    success: true,
    default_probability: parseFloat((probDefault * 100).toFixed(2)),
    prediction: prediction,
    prediction_label: prediction === 1 ? 'Default' : 'Non-Default',
    risk_tier: riskTier,
    decision: decision,
    badge_color: badgeColor,
    estimated_monthly_payment: parseFloat(emi.toFixed(2)),
    emi_to_income_ratio: parseFloat((emiToIncomeRatio * 100).toFixed(2)),
    top_risk_factors: contributions.slice(0, 8),
    factor_contributions: contributions,
    model_accuracy: metrics?.accuracy ?? 0.885,
    is_client_side: true
  };
}

export const predictInBrowser = runClientInference;

export function predictBatchInBrowser(count = 15) {
  const educations = ['High School', "Bachelor's", "Master's", 'PhD'];
  const employments = ['Full-time', 'Part-time', 'Self-employed', 'Unemployed'];
  const maritals = ['Single', 'Married', 'Divorced'];
  const purposes = ['Auto', 'Business', 'Education', 'Home', 'Other'];
  const binaries = ['Yes', 'No'];

  const batch = [];
  for (let i = 0; i < count; i++) {
    const age = Math.floor(Math.random() * 45) + 21;
    const income = Math.floor(Math.random() * 110000) + 25000;
    const loanAmount = Math.floor(Math.random() * 180000) + 10000;
    const creditScore = Math.floor(Math.random() * 450) + 380;
    const monthsEmployed = Math.floor(Math.random() * 96) + 6;
    const numCreditLines = Math.floor(Math.random() * 4) + 1;
    const interestRate = parseFloat((Math.random() * 18 + 4).toFixed(1));
    const loanTerm = [12, 24, 36, 48, 60][Math.floor(Math.random() * 5)];
    const dti = parseFloat((Math.random() * 0.7 + 0.1).toFixed(2));
    const edu = educations[Math.floor(Math.random() * educations.length)];
    const emp = employments[Math.floor(Math.random() * employments.length)];
    const mar = maritals[Math.floor(Math.random() * maritals.length)];
    const purp = purposes[Math.floor(Math.random() * purposes.length)];
    const mortgage = binaries[Math.floor(Math.random() * 2)];
    const dependents = binaries[Math.floor(Math.random() * 2)];
    const cosigner = binaries[Math.floor(Math.random() * 2)];

    const applicant = {
      id: `APP-${1000 + i}`,
      Age: age,
      Income: income,
      LoanAmount: loanAmount,
      CreditScore: creditScore,
      MonthsEmployed: monthsEmployed,
      NumCreditLines: numCreditLines,
      InterestRate: interestRate,
      LoanTerm: loanTerm,
      DTIRatio: dti,
      Education: edu,
      EmploymentType: emp,
      MaritalStatus: mar,
      HasMortgage: mortgage,
      HasDependents: dependents,
      LoanPurpose: purp,
      HasCoSigner: cosigner
    };

    const inference = runClientInference(applicant);
    batch.push({
      ...applicant,
      ...inference
    });
  }

  return batch;
}
