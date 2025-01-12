document.getElementById("calculateBtn").addEventListener("click", function () {
    // Input values
    const currentAge = parseInt(document.getElementById("currentAge").value);
    const retirementAge = parseInt(document.getElementById("retirementAge").value);
    const lifeExpectancy = parseInt(document.getElementById("lifeExpectancy").value);
    const annualReturn = parseFloat(document.getElementById("annualReturn").value) / 100;
    const inflationRate = parseFloat(document.getElementById("inflationRate").value) / 100;
    const monthlyExpenditure = parseFloat(document.getElementById("monthlyExpenditure").value);
    const currentSavings = parseFloat(document.getElementById("currentSavings").value);
  
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
  
    // Calculate how much needs to be saved
    const requiredSavings = corpus - currentSavings;
    const annualSavingsRequired = requiredSavings / yearsToRetirement;
  
    // Create a year-by-year breakdown (Current Age to Retirement Age)
    let currentCorpus = currentSavings;
    let accumulationRows = '';
    let currentYear = currentAge;
    for (let i = 0; i < yearsToRetirement; i++) {
      const yearReturn = currentCorpus * annualReturn;
      const yearlySaving = annualSavingsRequired + yearReturn;
      currentCorpus += yearlySaving;
  
      accumulationRows += `
        <tr>
          <td>${currentYear}</td>
          <td>₹${yearlySaving.toFixed(2)}</td>
          <td>₹${currentCorpus.toFixed(2)}</td>
        </tr>
      `;
  
      currentYear++;
    }
  
    // Create a year-by-year breakdown (Retirement Age to Life Expectancy)
    let retirementCorpus = corpus;
    let withdrawalRows = '';
    let retirementYear = retirementAge;
    for (let i = 0; i < retirementYears; i++) {
      const yearExpense = futureYearlyExpenditure * Math.pow(1 + inflationRate, i);
      const yearReturn = retirementCorpus * annualReturn;
      const yearlySaving = yearReturn - yearExpense;
      retirementCorpus = retirementCorpus - yearExpense + yearReturn;
  
      withdrawalRows += `
        <tr>
          <td>${retirementYear}</td>
          <td>₹${yearExpense.toFixed(2)}</td>
          <td>₹${yearReturn.toFixed(2)}</td>
          <td>₹${yearlySaving.toFixed(2)}</td>
          <td>₹${retirementCorpus.toFixed(2)}</td>
        </tr>
      `;
  
      retirementYear++;
    }
  
    // Create a year-by-year breakdown (Post Life Expectancy until Corpus Depletes)
    let postLifeCorpus = retirementCorpus;
    let postLifeRows = '';
    let postLifeYear = lifeExpectancy;
    let yearsAfterLifeExpectancy = 0;
  
    // Continue until the corpus is depleted
    while (postLifeCorpus > 0) {
      const yearExpense = futureYearlyExpenditure * Math.pow(1 + inflationRate, retirementYears + yearsAfterLifeExpectancy);
      const yearReturn = postLifeCorpus * annualReturn;
      const yearlySaving = yearReturn - yearExpense;
      postLifeCorpus = postLifeCorpus - yearExpense + yearReturn;
  
      postLifeRows += `
        <tr>
          <td>${postLifeYear}</td>
          <td>₹${yearExpense.toFixed(2)}</td>
          <td>₹${yearReturn.toFixed(2)}</td>
          <td>₹${yearlySaving.toFixed(2)}</td>
          <td>₹${postLifeCorpus.toFixed(2)}</td>
        </tr>
      `;
      
      postLifeYear++;
      yearsAfterLifeExpectancy++;
    }
  
    // Display results
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
      <p><strong>Future Monthly Expenditure at Retirement:</strong> ₹${futureMonthlyExpenditure.toFixed(2)}</p>
      <p><strong>Future Yearly Expenditure at Retirement:</strong> ₹${futureYearlyExpenditure.toFixed(2)}</p>
      <p><strong>Total Retirement Corpus Needed:</strong> ₹${corpus.toFixed(2)}</p>
      <p><strong>Current Total Savings:</strong> ₹${currentSavings.toFixed(2)}</p>
      <p><strong>Estimated Annual Savings Required:</strong> ₹${annualSavingsRequired.toFixed(2)}</p>
      <h2>Year-by-Year Breakdown (Current Age to Retirement Age)</h2>
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Annual Savings (₹)</th>
            <th>Corpus (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${accumulationRows}
        </tbody>
      </table>
  
      <h2>Year-by-Year Breakdown (Retirement Age to Life Expectancy)</h2>
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Yearly Expenditure (₹)</th>
            <th>Annual Return (₹)</th>
            <th>Yearly Saving (₹)</th>
            <th>Remaining Corpus (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${withdrawalRows}
        </tbody>
      </table>
  
      <h2>Year-by-Year Breakdown (Post Life Expectancy until Corpus Depletes)</h2>
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Yearly Expenditure (₹)</th>
            <th>Annual Return (₹)</th>
            <th>Yearly Saving (₹)</th>
            <th>Remaining Corpus (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${postLifeRows}
        </tbody>
      </table>
    `;
  });
  