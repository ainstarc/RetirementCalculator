document.getElementById("calculateBtn").addEventListener("click", function () {
    // Input values
    const currentAge = parseInt(document.getElementById("currentAge").value);
    const retirementAge = parseInt(document.getElementById("retirementAge").value);
    const lifeExpectancy = parseInt(document.getElementById("lifeExpectancy").value);
    const annualReturn = parseFloat(document.getElementById("annualReturn").value) / 100;
    const inflationRate = parseFloat(document.getElementById("inflationRate").value) / 100;
    const monthlyExpenditure = parseFloat(document.getElementById("monthlyExpenditure").value);
  
    if (currentAge >= retirementAge) {
      alert("Retirement age must be greater than current age.");
      return;
    }
    if (retirementAge >= lifeExpectancy) {
      alert("Life expectancy must be greater than retirement age.");
      return;
    }
  
    // Years until retirement
    const yearsToRetirement = retirementAge - currentAge;
  
    // Future monthly expenditure at retirement
    const futureMonthlyExpenditure = monthlyExpenditure * Math.pow(1 + inflationRate, yearsToRetirement);
  
    // Yearly expenditure at retirement
    const futureYearlyExpenditure = futureMonthlyExpenditure * 12;
  
    // Years of retirement
    const retirementYears = lifeExpectancy - retirementAge;
  
    // Effective rate (adjusting for inflation)
    const effectiveRate = annualReturn - inflationRate;
  
    // Retirement corpus using Present Value of Annuity formula
    const corpus = futureYearlyExpenditure * ((1 - Math.pow(1 + effectiveRate, -retirementYears)) / effectiveRate);
  
    // Create a year-by-year breakdown
    let currentCorpus = corpus;
    let tableRows = '';
    let currentYear = retirementAge;
    for (let i = 0; i < retirementYears; i++) {
      const yearExpense = futureYearlyExpenditure * Math.pow(1 + inflationRate, i);
      const monthExpense = yearExpense / 12;
      const yearReturn = currentCorpus * annualReturn;
      const yearlySaving = yearReturn - yearExpense;
      currentCorpus = currentCorpus - yearExpense + yearReturn;
  
      tableRows += `
        <tr>
          <td>${currentYear}</td>
          <td>₹${monthExpense.toFixed(2)}</td>
          <td>₹${yearExpense.toFixed(2)}</td>
          <td>₹${yearReturn.toFixed(2)}</td>
          <td>₹${yearlySaving.toFixed(2)}</td>
          <td>₹${currentCorpus.toFixed(2)}</td>
        </tr>
      `;
  
      currentYear++;
    }
  
    // Display results
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
      <p><strong>Future Monthly Expenditure at Retirement:</strong> ₹${futureMonthlyExpenditure.toFixed(2)}</p>
      <p><strong>Future Yearly Expenditure at Retirement:</strong> ₹${futureYearlyExpenditure.toFixed(2)}</p>
      <p><strong>Total Retirement Corpus Needed:</strong> ₹${corpus.toFixed(2)}</p>
      <h2>Year-by-Year Breakdown</h2>
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Monthly Expense (₹)</th>
            <th>Yearly Expense (₹)</th>
            <th>Annual Return (₹)</th>
            <th>Yearly Saving (₹)</th>
            <th>Remaining Corpus (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;
  });
  