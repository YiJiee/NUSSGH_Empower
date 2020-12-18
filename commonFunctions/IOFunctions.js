// some functions to convert to csv string and header for report exporting.

function toCsv(reportType, data) {
    let result = [];
    if (reportType === 'Blood Glucose') {
        for (const d of data) {
            const csv = [d.record_date, d.bg_reading].join(',');
            result.push(csv);
        }
    } else if (reportType === 'Food Intake') {
        for (const d of data) {
            const csv = [d.date, // different key from the rest
                d.nutrients.energy.amount,
                d.nutrients.carbohydrate.amount,
                d.nutrients.protein.amount,
                d.nutrients['total-fat'].amount,
                d.nutrients['saturated-fat'].amount,
                d.nutrients['dietary-fibre'].amount,
            ].join(',');
            result.push(csv);
        }
    } else if (reportType === 'Medication') {
        for (const d of data) {
            const csv = [d.record_date, d.medication, d.dosage, d.unit].join(',');
            result.push(csv);
        }
    } else if (reportType === 'Weight') {
        for (const d of data) {
            const csv = [d.record_date, d.weight].join(',');
            result.push(csv);
        }
    } else if (reportType === 'Activity') {
        for (const d of data) {
            const csv = [d.date, d.distance, d.calories, d.steps, d.duration].join(',');
            result.push(csv);
        }
    }
    return result.join('\n');
}

function getCsvHeader(reportType, data) {
    if (reportType === 'Blood Glucose') {
        return 'date,reading';
    } else if (reportType === 'Food Intake') {
        return 'date,calorie(kcal),carbohydrate(g),protein(g),total-fat(g),saturated-fat(g),dietary-fibre(g)';
    } else if (reportType === 'Medication') {
        return 'date,drug-name,dosage,unit';
    } else if (reportType === 'Weight') {
        return 'date,weight(kg)';
    } else if (reportType === 'Activity') {
        return 'date,distance,calories-burnt,steps,duration(min)';
    }
}

export {toCsv, getCsvHeader};
