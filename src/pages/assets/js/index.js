let json = {
    income_streams: [],
    bills: [],
    savings_profiles: [],

    total_savings: [],
}

function parseAmount(amountString) {
    if(typeof amountString === "number") return amountString;
    else {
        return Number(amountString.replaceAll(",", "").replaceAll("$", ""));
    }
}

function parseCurrency(amountNumber) {
    if(typeof amountNumber !== "number") return amountNumber;
    else {
        let fin = [];
        let strs = String(amountNumber).split("");

        let index = 1;
        strs.reverse().forEach(str => {
            if(index % 3 === 0 && index < strs.length) {
                fin.push(str, ",");
            } else fin.push(str);

            index += 1;
        });

        fin.push("$");

        return fin.reverse().join("");
    }
}

function updateIncomeStreams() {
    let string = [];
    let total = 0;
    json.income_streams.forEach(stream => {
        string.push(`${stream.name} = ${parseCurrency(stream.amount)}`);
        total += stream.amount;
    });

    total = parseCurrency(total);

    document.getElementById("para_inputStreams").innerHTML = string.join("<br>");
    document.getElementById("para_totalInputStreams").innerHTML = `Total Income: ${total}`;

    updateOutput();
}

function updateBills() {
    let string = [];
    let total = 0;
    json.bills.forEach(bill => {
        string.push(`${bill.name} = -${parseCurrency(bill.amount)}`);
        total += bill.amount;
    });

    total = parseCurrency(total);

    document.getElementById("para_bills").innerHTML = string.join("<br>");
    document.getElementById("para_totalBills").innerHTML = `Total Bill Cost: ${total}`;

    updateOutput();
}

function updateSavingsProfiles() {
    let string = [];
    let total = 0;
    json.savings_profiles.forEach(profile => {
        string.push(`${profile.name} = -${parseCurrency(profile.amount)}`);
        total += profile.amount;
    });

    total = parseCurrency(total);

    document.getElementById("para_savingsProfiles").innerHTML = string.join("<br>");
    document.getElementById("para_totalSavings").innerHTML = `Total Savings (this pay period): ${total}`;

    updateOutput();
}

function updateOutput() {
    const element = document.getElementById("para_output");
    let html = "";

    let totalIncome = 0;
    json.income_streams.forEach(stream => {
        totalIncome += stream.amount;
    });

    let afterBills = totalIncome;

    html += `Income: <strong>${parseCurrency(totalIncome)}</strong><br>`;

    json.bills.forEach(bill => {
        html += `&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; -${parseCurrency(bill.amount)} (${bill.name})<br>`;
        afterBills -= bill.amount;
    });

    html += `<br>`;

    let afterSavings = afterBills;
    json.savings_profiles.forEach(profile => {
        html += `&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; -${parseCurrency(profile.amount)} (${profile.name} (SAVINGS))<br>`;
        afterSavings -= profile.amount;
    });

    html += `<br><br>`;

    
    html += `Total Output: <strong>${parseCurrency(afterSavings)}</strong><br><br>`;
    html += `Savings Profiles (after input):<br>`;

    json.savings_profiles.forEach(profile => {
        html += `&nbsp; &nbsp; &nbsp; ${profile.name}: <strong>${parseCurrency(profile.current + profile.amount)}<strong><br>`;
    });

    element.innerHTML = html;
}

document.getElementById("submit_incomeStream").onclick = function() {
    const streamName = document.getElementById("incomeStreamName").value;
    const streamIncome = parseAmount(document.getElementById("incomeStreamAmount").value);

    document.getElementById("incomeStreamName").value = "";
    document.getElementById("incomeStreamAmount").value = "";

    let used = false;
    json.income_streams.forEach(stream => {
        if(stream.name === streamName) used = json.income_streams.indexOf(stream);
    });

    if(used === false) {
        json.income_streams.push({
            name: streamName,
            amount: streamIncome,
        });
    } else {
        json.income_streams[used] = {
            name: streamName,
            amount: streamIncome,
        };
    }

    updateIncomeStreams();
}

document.getElementById("submit_bill").onclick = function() {
    const billName = document.getElementById("billName").value;
    const billCost = parseAmount(document.getElementById("billCost").value);

    document.getElementById("billName").value = "";
    document.getElementById("billCost").value = "";

    let used = false;
    json.bills.forEach(bill => {
        if(bill.name === billName) used = json.bills.indexOf(bill);
    });

    if(used === false) {
        json.bills.push({
            name: billName,
            amount: billCost,
        });
    } else {
        json.bills[used] = {
            name: billName,
            amount: billCost,
        };
    }

    updateBills();
}

document.getElementById("submit_savingsProfile").onclick = function() {
    const profileName = document.getElementById("savingsProfileName").value;
    const profileAmount = parseAmount(document.getElementById("savingsProfileAmount").value);
    const profileCurrent = parseAmount(document.getElementById("savingsProfileCurrent").value);

    document.getElementById("savingsProfileName").value = "";
    document.getElementById("savingsProfileAmount").value = "";
    
    let used = false;
    json.savings_profiles.forEach(profile => {
        if(profile.name === profileName) used = json.saving_profiles.indexOf(profile);
    });

    if(used === false) {
        json.savings_profiles.push({
            name: profileName,
            amount: profileAmount,
            current: profileCurrent,
        });
    } else {
        json.savings_profiles[used] = {
            name: profileName,
            amount: profileAmount,
            current: profileCurrent,
        };
    }

    updateSavingsProfiles();
}

document.getElementById("json_copy").onclick = function() {
    navigator.clipboard.writeText(JSON.stringify(json));
}

document.getElementById("json_submit").onclick = function() {
    json = JSON.parse(document.getElementById("json_input").value);

    updateIncomeStreams();
    updateBills();
    updateSavingsProfiles();
}